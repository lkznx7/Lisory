package com.lisory.backend.pagamentos.infinitepay.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record InfinitePayCreateLinkRequest(
    @JsonProperty("handle") String handle,
    @JsonProperty("redirect_url") String redirectUrl,
    @JsonProperty("webhook_url") String webhookUrl,
    @JsonProperty("order_nsu") String orderNsu,
    @JsonProperty("items") List<LinkItem> items
) {
    public record LinkItem(
        @JsonProperty("quantity") int quantity,
        @JsonProperty("price") long price,
        @JsonProperty("description") String description
    ) {}
}
