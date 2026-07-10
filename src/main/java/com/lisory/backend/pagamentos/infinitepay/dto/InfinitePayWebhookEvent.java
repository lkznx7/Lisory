package com.lisory.backend.pagamentos.infinitepay.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record InfinitePayWebhookEvent(
    @JsonProperty("invoice_slug") String invoiceSlug,
    @JsonProperty("amount") long amount,
    @JsonProperty("paid_amount") long paidAmount,
    @JsonProperty("installments") int installments,
    @JsonProperty("capture_method") String captureMethod,
    @JsonProperty("transaction_nsu") String transactionNsu,
    @JsonProperty("order_nsu") String orderNsu,
    @JsonProperty("receipt_url") String receiptUrl
) {}
