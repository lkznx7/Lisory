package com.lisory.backend.pagamentos.infinitepay.client;

import com.lisory.backend.config.properties.InfinitePayProperties;
import com.lisory.backend.pagamentos.infinitepay.dto.*;
import com.lisory.backend.pagamentos.infinitepay.exception.InfinitePayException;
import com.lisory.backend.shared.log.StructuredLogger;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
public class InfinitePayClient {

    private static final StructuredLogger log = StructuredLogger.forClass(InfinitePayClient.class);

    private final RestTemplate restTemplate;
    private final InfinitePayProperties properties;

    public InfinitePayClient(RestTemplate defaultRestTemplate, InfinitePayProperties properties) {
        this.restTemplate = defaultRestTemplate;
        this.properties = properties;
    }

    public InfinitePayCreateLinkResponse createPaymentLink(InfinitePayCreateLinkRequest request) {
        String url = properties.checkoutApiUrl() + "/links";
        log.info("infinitepay_create_link", Map.of(
                "orderNsu", request.orderNsu() != null ? request.orderNsu() : "null",
                "handle", request.handle() != null ? request.handle() : "null"
        ));

        try {
            HttpHeaders headers = createHeaders();
            HttpEntity<InfinitePayCreateLinkRequest> entity = new HttpEntity<>(request, headers);

            ResponseEntity<InfinitePayCreateLinkResponse> response = restTemplate.exchange(
                    url, HttpMethod.POST, entity, InfinitePayCreateLinkResponse.class
            );

            InfinitePayCreateLinkResponse body = response.getBody();
            if (body == null) {
                throw new InfinitePayException("Empty response from InfinitePay", "EMPTY_RESPONSE");
            }

            log.info("infinitepay_create_link_success", Map.of(
                    "url", body.url() != null ? "present" : "null"
            ));

            return body;
        } catch (InfinitePayException e) {
            throw e;
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            log.error("infinitepay_create_link_http_error", Map.of(
                    "status", e.getStatusCode().toString(),
                    "body", e.getResponseBodyAsString()
            ));
            throw new InfinitePayException(
                    "InfinitePay API error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString(),
                    "API_ERROR"
            );
        } catch (Exception e) {
            log.error("infinitepay_create_link_exception", Map.of(), e);
            throw new InfinitePayException("Failed to create payment link on InfinitePay", e);
        }
    }

    public InfinitePayPaymentCheckResponse checkPayment(String orderNsu) {
        String url = properties.checkoutApiUrl() + "/payment_check";
        log.info("infinitepay_check_payment", Map.of("orderNsu", orderNsu));

        try {
            HttpHeaders headers = createHeaders();
            InfinitePayPaymentCheckRequest checkRequest = new InfinitePayPaymentCheckRequest(
                    properties.handle(), orderNsu, null, null
            );
            HttpEntity<InfinitePayPaymentCheckRequest> entity = new HttpEntity<>(checkRequest, headers);

            ResponseEntity<InfinitePayPaymentCheckResponse> response = restTemplate.exchange(
                    url, HttpMethod.POST, entity, InfinitePayPaymentCheckResponse.class
            );

            InfinitePayPaymentCheckResponse body = response.getBody();
            if (body == null) {
                throw new InfinitePayException("Empty response from InfinitePay payment check", "EMPTY_RESPONSE");
            }

            log.info("infinitepay_check_payment_success", Map.of(
                    "paid", String.valueOf(body.paid()),
                    "orderNsu", orderNsu
            ));

            return body;
        } catch (InfinitePayException e) {
            throw e;
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            log.error("infinitepay_check_payment_http_error", Map.of(
                    "status", e.getStatusCode().toString(),
                    "body", e.getResponseBodyAsString()
            ));
            throw new InfinitePayException(
                    "InfinitePay payment check error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString(),
                    "API_ERROR"
            );
        } catch (Exception e) {
            log.error("infinitepay_check_payment_exception", Map.of("orderNsu", orderNsu), e);
            throw new InfinitePayException("Failed to check payment on InfinitePay", e);
        }
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));
        headers.set("x-client-id", properties.clientId());
        return headers;
    }
}
