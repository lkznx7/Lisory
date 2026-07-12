package com.lisory.backend.webhooks.controller;

import com.lisory.backend.pagamentos.infinitepay.dto.InfinitePayWebhookEvent;
import com.lisory.backend.pagamentos.infinitepay.webhook.InfinitePayWebhookService;
import com.lisory.backend.pagamentos.infinitepay.webhook.InfinitePayWebhookSignatureValidator;
import com.lisory.backend.shared.log.StructuredLogger;
import com.lisory.backend.shared.util.JsonUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/webhooks")
public class InfinitePayWebhookController {

    private final InfinitePayWebhookService webhookService;
    private final InfinitePayWebhookSignatureValidator signatureValidator;
    private final StructuredLogger logger;

    public InfinitePayWebhookController(
            InfinitePayWebhookService webhookService,
            InfinitePayWebhookSignatureValidator signatureValidator
    ) {
        this.webhookService = webhookService;
        this.signatureValidator = signatureValidator;
        this.logger = StructuredLogger.forClass(InfinitePayWebhookController.class);
    }

    @PostMapping("/infinitepay")
    public ResponseEntity<Map<String, Object>> handleInfinitePayWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "X-Webhook-Signature", required = false) String signature) {
        logger.info("webhook_received", Map.of("gateway", "infinitepay"));

        if (!signatureValidator.isValid(payload, signature)) {
            logger.warn("webhook_invalid_signature", Map.of("gateway", "infinitepay"));
            return ResponseEntity.status(401).body(Map.of("success", false, "message", "Invalid signature"));
        }

        try {
            InfinitePayWebhookEvent event = JsonUtils.fromJson(payload, InfinitePayWebhookEvent.class);
            webhookService.processEvent(event);
            logger.info("webhook_processed", Map.of(
                    "gateway", "infinitepay",
                    "orderNsu", event.orderNsu() != null ? event.orderNsu() : "unknown"
            ));
            return ResponseEntity.ok(Map.of("success", true, "message", (Object) null));
        } catch (Exception e) {
            logger.error("webhook_processing_error", Map.of("gateway", "infinitepay"), e);
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage() != null ? e.getMessage() : "Unknown error"));
        }
    }
}
