package com.tourister;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.boot.web.servlet.server.ConfigurableServletWebServerFactory;
import org.springframework.stereotype.Component;

@Component
public class ServerPortCustomizer implements WebServerFactoryCustomizer<ConfigurableServletWebServerFactory> {

    private static final Logger log = LoggerFactory.getLogger(ServerPortCustomizer.class);

    @Override
    public void customize(ConfigurableServletWebServerFactory factory) {
        String portStr = System.getenv("X_ZOHO_CATALYST_LISTEN_PORT");
        if (portStr == null || portStr.trim().isEmpty()) {
            portStr = System.getenv("PORT");
        }

        if (portStr != null && !portStr.trim().isEmpty()) {
            try {
                int listenPort = Integer.parseInt(portStr.trim());
                log.info("Setting server port to Catalyst/Environment port: {}", listenPort);
                factory.setPort(listenPort);
                return;
            } catch (NumberFormatException e) {
                log.error("Failed to parse port environment variable: {}", portStr, e);
            }
        }

        log.info("No environment port specified, defaulting server port to 8080");
        factory.setPort(8080);
    }
}
