package com.lisory.backend.pagamentos.infinitepay.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record InfinitePayWebhookEvent(
    @JsonProperty("invoice_slug") String invoiceSlug,
    @JsonProperty("amount") long amount,
    @JsonProperty("paid_amount") long paidAmount,
    @JsonProperty("installments") int installments,
    @JsonProperty("capture_method") String captureMethod,
    @JsonProperty("transaction_nsu") String transactionNsu,
    @JsonProperty("order_nsu") String orderNsu,
    @JsonProperty("receipt_url") String receiptUrl,
    @JsonProperty("items") List<WebhookItem> items
) {
    public record WebhookItem(
        @JsonProperty("quantity") int quantity,
        @JsonProperty("price") long price,
        @JsonProperty("description") String description
    ) {}
}
