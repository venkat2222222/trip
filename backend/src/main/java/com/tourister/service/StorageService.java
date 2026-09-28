package com.tourister.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Duration;
import java.util.UUID;

@Service
public class StorageService {

    private static final Logger logger = LoggerFactory.getLogger(StorageService.class);

    @Value("${supabase.url:}")
    private String supabaseUrl;

    @Value("${supabase.key:}")
    private String supabaseKey;

    @Value("${supabase.bucket:uploads}")
    private String supabaseBucket;

    private final String localUploadDir = "uploads";
    private final HttpClient httpClient;

    public StorageService() {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    public String storeFile(MultipartFile file) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        } else {
            extension = ".jpg";
        }

        String newFilename = UUID.randomUUID().toString() + extension;

        // Try Supabase Storage if configured
        if (StringUtils.hasText(supabaseUrl) && StringUtils.hasText(supabaseKey)) {
            try {
                String publicUrl = uploadToSupabase(file, newFilename);
                if (publicUrl != null) {
                    logger.info("Successfully uploaded file to Supabase Storage: {}", publicUrl);
                    return publicUrl;
                }
            } catch (Exception e) {
                logger.warn("Failed to upload to Supabase Storage, falling back to local storage: {}", e.getMessage());
            }
        }

        // Fallback to local disk storage
        return storeLocally(file, newFilename);
    }

    private String uploadToSupabase(MultipartFile file, String filename) throws IOException, InterruptedException {
        String baseUrl = supabaseUrl.replaceAll("/+$", "");
        String uploadEndpoint = String.format("%s/storage/v1/object/%s/%s", baseUrl, supabaseBucket, filename);

        String contentType = file.getContentType();
        if (contentType == null || contentType.isEmpty()) {
            contentType = "application/octet-stream";
        }

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(uploadEndpoint))
                .header("Authorization", "Bearer " + supabaseKey)
                .header("apiKey", supabaseKey)
                .header("Content-Type", contentType)
                .header("x-upsert", "true")
                .POST(HttpRequest.BodyPublishers.ofByteArray(file.getBytes()))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() >= 200 && response.statusCode() < 300) {
            return String.format("%s/storage/v1/object/public/%s/%s", baseUrl, supabaseBucket, filename);
        } else {
            logger.error("Supabase upload HTTP status: {}, Response: {}", response.statusCode(), response.body());
            throw new IOException("Supabase storage error: " + response.body());
        }
    }

    private String storeLocally(MultipartFile file, String filename) throws IOException {
        File dir = new File(localUploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        Path filePath = Paths.get(localUploadDir, filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return "/uploads/" + filename;
    }
}
