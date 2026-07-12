package com.lisory.backend.pagamentos.infinitepay.provider;

import com.lisory.backend.config.properties.InfinitePayProperties;
import com.lisory.backend.pagamentos.infinitepay.client.InfinitePayClient;
import com.lisory.backend.pagamentos.infinitepay.dto.InfinitePayCreateLinkRequest;
import com.lisory.backend.pagamentos.infinitepay.dto.InfinitePayCreateLinkResponse;
import com.lisory.backend.pagamentos.infinitepay.exception.InfinitePayException;
import com.lisory.backend.pagamentos.services.GatewayResponse;
import com.lisory.backend.pagamentos.services.PaymentProvider;
import com.lisory.backend.pagamentos.services.PaymentRequest;
import com.lisory.backend.shared.util.MoneyUtils;
import com.lisory.backend.shared.log.StructuredLogger;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class InfinitePayPaymentProvider implements PaymentProvider {

    private static final StructuredLogger log = StructuredLogger.forClass(InfinitePayPaymentProvider.class);

    private final InfinitePayClient client;
    private final InfinitePayProperties properties;

    public InfinitePayPaymentProvider(InfinitePayClient client, InfinitePayProperties properties) {
        this.client = client;
        this.properties = properties;
    }

    @Override
    public GatewayResponse processPayment(PaymentRequest request) {
        log.info("infinitepay_provider_process_payment", Map.of(
                "orderId", request.orderId() != null ? request.orderId().toString() : "null",
                "amount", request.amount() != null ? request.amount().toString() : "null",
                "paymentMethod", request.paymentMethod() != null ? request.paymentMethod() : "null"
        ));

        try {
            long amountInCents = MoneyUtils.toCents(request.amount());

            String description = "Payment for order " + request.orderId();

            List<InfinitePayCreateLinkRequest.LinkItem> items = new ArrayList<>();
            items.add(new InfinitePayCreateLinkRequest.LinkItem(1, amountInCents, description));

            InfinitePayCreateLinkRequest linkRequest = new InfinitePayCreateLinkRequest(
                    properties.handle(),
                    properties.redirectUrl(),
                    properties.webhookUrl(),
                    request.orderId() != null ? request.orderId().toString() : null,
                    items
            );

            InfinitePayCreateLinkResponse response = client.createPaymentLink(linkRequest);

            log.info("infinitepay_provider_link_created", Map.of(
                    "orderId", request.orderId() != null ? request.orderId().toString() : "null",
                    "urlPresent", response.url() != null ? "true" : "false"
            ));

            return new GatewayResponse(
                    request.orderId() != null ? request.orderId().toString() : null,
                    request.orderId() != null ? request.orderId().toString() : null,
                    "PENDING",
                    response.url()
            );
        } catch (InfinitePayException e) {
            log.error("infinitepay_provider_payment_error", Map.of(
                    "orderId", request.orderId() != null ? request.orderId().toString() : "null",
                    "errorCode", e.getErrorCode()
            ), e);
            throw e;
        } catch (Exception e) {
            log.error("infinitepay_provider_payment_unexpected_error", Map.of(
                    "orderId", request.orderId() != null ? request.orderId().toString() : "null"
            ), e);
            throw new InfinitePayException("Unexpected error processing payment via InfinitePay", e);
        }
    }
}
