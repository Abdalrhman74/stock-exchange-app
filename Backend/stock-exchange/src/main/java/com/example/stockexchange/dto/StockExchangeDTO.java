package com.example.stockexchange.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockExchangeDTO {
    private Long id;
    private String name;
    private String description;
    private boolean liveInMarket;
    private Set<Long> stockIds;
}
