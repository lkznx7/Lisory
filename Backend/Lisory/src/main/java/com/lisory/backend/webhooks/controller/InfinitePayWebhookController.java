package com.lisory.backend.webhooks.controller;

import com.lisory.backend.pagamentos.infinitepay.dto.InfinitePayWebhookEvent;
import com.lisory.backend.pagamentos.infinitepay.webhook.InfinitePayWebhookService;
import com.lisory.backend.shared.log.StructuredLogger;
import com.lisory.backend.shared.util.JsonUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/webhooks")
public class InfinitePayWebhookController {

    private final InfinitePayWebhookService webhookService;
    private final StructuredLogger logger;

    public InfinitePayWebhookController(InfinitePayWebhookService webhookService) {
        this.webhookService = webhookService;
        this.logger = StructuredLogger.forClass(InfinitePayWebhookController.class);
    }

    @PostMapping("/infinitepay")
    public ResponseEntity<Map<String, String>> handleInfinitePayWebhook(@RequestBody String payload) {
        logger.info("webhook_received", Map.of("gateway", "infinitepay"));

        try {
            InfinitePayWebhookEvent event = JsonUtils.fromJson(payload, InfinitePayWebhookEvent.class);
            webhookService.processEvent(event);
            logger.info("webhook_processed", Map.of(
                    "gateway", "infinitepay",
                    "orderNsu", event.orderNsu() != null ? event.orderNsu() : "unknown"
            ));
            return ResponseEntity.ok(Map.of("status", "ok"));
        } catch (Exception e) {
            logger.error("webhook_processing_error", Map.of("gateway", "infinitepay"), e);
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", e.getMessage() != null ? e.getMessage() : "Unknown error"));
        }
    }
}
