package com.lisory.backend.pagamentos.infinitepay.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record InfinitePayCreateLinkResponse(
    @JsonProperty("url") String url
) {}
