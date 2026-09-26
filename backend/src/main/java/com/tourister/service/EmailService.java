package com.tourister.service;

import com.tourister.entity.TripRequest;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@tripmax.com}")
    private String fromEmail;

    public EmailService(@Autowired(required = false) JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendTripConfirmationEmail(TripRequest trip) {
        String recipientEmail = trip.getUserEmail();
        String subject = "Trip Booking Request Confirmation - TRIP MAX [#" + trip.getRequestId() + "]";

        String htmlContent = buildConfirmationHtml(trip);

        log.info("==========================================================");
        log.info("SENDING TRIP CONFIRMATION EMAIL TO: {}", recipientEmail);
        log.info("Subject: {}", subject);
        log.info("Request ID: {}", trip.getRequestId());
        log.info("Destination: {}", trip.getDestination());
        log.info("==========================================================");

        if (mailSender != null) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                helper.setFrom(fromEmail, "TRIP MAX Travel");
                helper.setTo(recipientEmail);
                helper.setSubject(subject);
                helper.setText(htmlContent, true);

                mailSender.send(message);
                log.info("Confirmation email successfully sent via SMTP to: {}", recipientEmail);
            } catch (Exception e) {
                log.warn("Could not send email via SMTP (SMTP server may be offline or unconfigured). Email body logged below. Error: {}", e.getMessage());
            }
        } else {
            log.info("JavaMailSender not initialized. Email content generated successfully.");
        }
    }

    private String buildConfirmationHtml(TripRequest trip) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: 'Plus Jakarta Sans', Arial, sans-serif; line-height: 1.6; color: #0f172a; background-color: #f8fafc; margin: 0; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
                .header { background: linear-gradient(135deg, #0f172a, #1e3a8a); padding: 30px 20px; text-align: center; color: #ffffff; }
                .header h1 { margin: 0; font-size: 26px; font-family: 'Outfit', sans-serif; letter-spacing: 1px; }
                .header p { margin: 5px 0 0 0; color: #f59e0b; font-weight: 600; font-size: 14px; text-transform: uppercase; }
                .content { padding: 30px 25px; }
                .badge { display: inline-block; background: #d1fae5; color: #047857; font-weight: 700; padding: 4px 12px; border-radius: 9999px; font-size: 12px; }
                .details-box { background: #f8fafc; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid #e2e8f0; }
                .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #cbd5e1; }
                .detail-row:last-child { border-bottom: none; }
                .label { color: #64748b; font-size: 13px; font-weight: 600; }
                .value { color: #0f172a; font-size: 14px; font-weight: 700; text-align: right; }
                .footer { background: #0f172a; color: #94a3b8; text-align: center; padding: 20px; font-size: 13px; }
                .footer a { color: #0ea5e9; text-decoration: none; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>TRIP MAX</h1>
                  <p>Travel Beyond Limits</p>
                </div>
                <div class="content">
                  <h2>Booking Request Received! 🎉</h2>
                  <p>Dear <strong>%s</strong>,</p>
                  <p>Thank you for submitting your custom trip request with <strong>TRIP MAX</strong>! Our travel experts are currently reviewing your preferences and preparing a personalized itinerary for you.</p>
                  
                  <div style="margin-bottom: 15px;">
                    <span class="badge">STATUS: PENDING REVIEW</span>
                  </div>

                  <div class="details-box">
                    <div class="detail-row">
                      <span class="label">Request Reference ID</span>
                      <span class="value">#%s</span>
                    </div>
                    <div class="detail-row">
                      <span class="label">Destination</span>
                      <span class="value">%s</span>
                    </div>
                    <div class="detail-row">
                      <span class="label">Starting Location</span>
                      <span class="value">%s</span>
                    </div>
                    <div class="detail-row">
                      <span class="label">Travelers / Rooms</span>
                      <span class="value">%d Person(s) / %d Room(s)</span>
                    </div>
                    <div class="detail-row">
                      <span class="label">Estimated Budget</span>
                      <span class="value">₹%s</span>
                    </div>
                    <div class="detail-row">
                      <span class="label">Accommodation</span>
                      <span class="value">%s</span>
                    </div>
                    <div class="detail-row">
                      <span class="label">Transportation</span>
                      <span class="value">%s</span>
                    </div>
                  </div>

                  <p>If you have any questions or additional requirements, feel free to contact our team anytime.</p>
                  <p style="margin-top: 25px;">Warm regards,<br><strong>TRIP MAX Customer Support Team</strong></p>
                </div>
                <div class="footer">
                  <p>© 2026 TRIP MAX. All rights reserved.</p>
                  <p>Need help? Email us at <a href="mailto:support@tripmax.com">support@tripmax.com</a></p>
                </div>
              </div>
            </body>
            </html>
            """.formatted(
                escapeHtml(trip.getUserFullName()),
                escapeHtml(trip.getRequestId()),
                escapeHtml(trip.getDestination()),
                escapeHtml(trip.getStartingLocation() != null ? trip.getStartingLocation() : "Not specified"),
                trip.getNumberOfTravelers() != null ? trip.getNumberOfTravelers() : 1,
                trip.getNumberOfRooms() != null ? trip.getNumberOfRooms() : 1,
                trip.getEstimatedBudget() != null ? trip.getEstimatedBudget().toString() : "Custom",
                escapeHtml(trip.getAccommodation() != null ? trip.getAccommodation() : "Standard"),
                escapeHtml(trip.getTransportation() != null ? trip.getTransportation() : "Standard")
            );
    }

    private String escapeHtml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;")
                   .replace("<", "&lt;")
                   .replace(">", "&gt;")
                   .replace("\"", "&quot;")
                   .replace("'", "&#39;");
    }
}
