package com.avdhoothadke.citadel.bank.backend.service;

import com.avdhoothadke.citadel.bank.backend.dto.ExchangeRateResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CurrencyService {

    private final WebClient webClient;

    @Value("${app.currency.api-key}")
    private String apiKey;

    private final Map<String, ExchangeRateResponse> cache = new ConcurrentHashMap<>();
    private final Map<String, LocalDateTime> lastFetchTime = new ConcurrentHashMap<>();

    public CurrencyService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://v6.exchangerate-api.com/v6").build();
    }

    public Map<String, Double> getExchangeRates(String baseCurrency) {
        if (cache.containsKey(baseCurrency) &&
                lastFetchTime.containsKey(baseCurrency) &&
                lastFetchTime.get(baseCurrency).isAfter(LocalDateTime.now().minusHours(1))) {

            System.out.println("Fetching rates from CACHE");
            return cache.get(baseCurrency).getConversion_rates();
        }

        try {
            ExchangeRateResponse response = webClient.get()
                    .uri("/" + apiKey + "/latest/" + baseCurrency)
                    .retrieve()
                    .bodyToMono(ExchangeRateResponse.class)
                    .block();

            cache.put(baseCurrency, response);
            lastFetchTime.put(baseCurrency, LocalDateTime.now());

            System.out.println("Fetching rates from API");
            return response.getConversion_rates();

        } catch (Exception e) {
            if (cache.containsKey(baseCurrency)) {
                System.err.println("API Down. Returning stale data.");
                return cache.get(baseCurrency).getConversion_rates();
            }
            throw new RuntimeException("Currency Service Unavailable");
        }
    }
}

