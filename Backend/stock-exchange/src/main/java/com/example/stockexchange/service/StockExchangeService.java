package com.example.stockexchange.service;

import com.example.stockexchange.dto.StockExchangeDTO;

import java.util.List;

public interface StockExchangeService {
    StockExchangeDTO createExchange(StockExchangeDTO exchangeDTO);
    StockExchangeDTO getExchangeById(Long id);
    List<StockExchangeDTO> getAllExchanges();
    StockExchangeDTO updateExchange(Long id, StockExchangeDTO exchangeDTO);
    void deleteExchange(Long id);
    StockExchangeDTO addStockToExchange(Long exchangeId, Long stockId);
    StockExchangeDTO removeStockFromExchange(Long exchangeId, Long stockId);
}
