package com.lisory.backend.pagamentos.infinitepay.webhook;

import com.lisory.backend.config.properties.InfinitePayProperties;
import com.lisory.backend.shared.log.StructuredLogger;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.HexFormat;
import java.util.Map;

@Component
public class InfinitePayWebhookSignatureValidator {

    private static final StructuredLogger log = StructuredLogger.forClass(InfinitePayWebhookSignatureValidator.class);
    private static final String HMAC_SHA256 = "HmacSHA256";

    private final String webhookSecret;

    public InfinitePayWebhookSignatureValidator(InfinitePayProperties properties) {
        this.webhookSecret = properties.webhookSecret();
    }

    public boolean isValid(String payload, String signature) {
        if (webhookSecret == null || webhookSecret.isBlank()) {
            log.warn("infinitepay_webhook_no_secret_configured", Map.of());
            return true;
        }

        if (signature == null || signature.isBlank()) {
            log.warn("infinitepay_webhook_missing_signature", Map.of());
            return false;
        }

        try {
            Mac mac = Mac.getInstance(HMAC_SHA256);
            SecretKeySpec secretKey = new SecretKeySpec(
                    webhookSecret.getBytes(StandardCharsets.UTF_8), HMAC_SHA256
            );
            mac.init(secretKey);
            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            String expectedSignature = HexFormat.of().formatHex(hash);

            boolean valid = expectedSignature.equalsIgnoreCase(signature);
            if (!valid) {
                log.warn("infinitepay_webhook_invalid_signature", Map.of());
            }
            return valid;
        } catch (Exception e) {
            log.error("infinitepay_webhook_signature_validation_error", Map.of(), e);
            return false;
        }
    }
}
