package com.lisory.backend.envios.services;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public final class MelhorEnvioProvider implements ShippingProvider {

    @Override
    public ShippingQuote calculate(ShippingRequest request) {
        // TODO: Implementar chamada HTTP da API Melhor Envio
        // Integração com API Melhor Envio:
        // 1. Autenticar na API
        // 2. Calcular frete com base no CEP e peso
        // 3. Retornar transportadora, serviço, custo e prazo

        return new ShippingQuote(
            "PAC",
            "PAC",
            new BigDecimal("20.00"),
            7
        );
    }
}
