package com.example.stockexchange.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "stocks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private BigDecimal currentPrice;
    private LocalDateTime lastUpdate;

    @ManyToMany(mappedBy = "stocks", fetch = FetchType.LAZY)
    private Set<StockExchange> exchanges = new HashSet<>();
}
