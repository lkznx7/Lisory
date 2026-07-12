package com.lisory.backend.pagamentos.infinitepay.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record InfinitePayCreateLinkResponse(
    @JsonProperty("url") String url,
    @JsonProperty("link") String link,
    @JsonProperty("slug") String slug,
    @JsonProperty("checkout_url") String checkoutUrl
) {
    public String getEffectiveUrl() {
        if (url != null && !url.isBlank()) return url;
        if (link != null && !link.isBlank()) return link;
        if (checkoutUrl != null && !checkoutUrl.isBlank()) return checkoutUrl;
        return null;
    }
}
