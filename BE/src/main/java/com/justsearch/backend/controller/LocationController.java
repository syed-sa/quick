package com.justsearch.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import lombok.RequiredArgsConstructor;
import java.util.*;

@RestController
@RequestMapping("/api/location")
@RequiredArgsConstructor
public class LocationController {

    private final RestTemplate restTemplate;

    @GetMapping("/search")
    public ResponseEntity<List<Map<String, Object>>> search(@RequestParam String q) {

        if (q == null || q.trim().length() < 3) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        String url = UriComponentsBuilder
                .fromHttpUrl("https://nominatim.openstreetmap.org/search")
                .queryParam("q", q)
                .queryParam("countrycodes", "in")
                .queryParam("format", "json")
                .queryParam("limit", 5)
                .queryParam("addressdetails", 1)
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "justsearch-app");

        HttpEntity<?> entity = new HttpEntity<>(headers);

        ResponseEntity<List> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                List.class);

        List<Map<String, Object>> formatted = new ArrayList<>();

        if (response.getBody() != null) {
            for (Object obj : response.getBody()) {
                Map<String, Object> place = (Map<String, Object>) obj;
                Map<String, Object> address = (Map<String, Object>) place.get("address");

                Map<String, Object> result = new HashMap<>();
                result.put("displayName", place.get("display_name"));
                result.put("postalCode",
                        address != null ? address.getOrDefault("postcode", "") : "");

                formatted.add(result);
            }
        }

        return ResponseEntity.ok(formatted);
    }

}
