package com.lisory.backend.pagamentos.services;

/**
 * @deprecated Replaced by {@link com.lisory.backend.pagamentos.infinitepay.provider.InfinitePayPaymentProvider}
 */
@Deprecated(since = "1.0", forRemoval = true)
public final class InfinitePaymentProvider implements PaymentProvider {

    @Override
    public GatewayResponse processPayment(PaymentRequest request) {
        throw new UnsupportedOperationException(
                "This stub has been replaced by InfinitePayPaymentProvider"
        );
    }
}
