package com.lisory.backend.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "infinitepay")
public record InfinitePayProperties(
    String handle,
    String checkoutApiUrl,
    String redirectUrl,
    String webhookUrl
) {}
