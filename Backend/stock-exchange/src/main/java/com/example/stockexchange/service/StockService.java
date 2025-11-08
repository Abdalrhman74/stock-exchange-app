package com.example.stockexchange.service;

import com.example.stockexchange.dto.StockDTO;

import java.util.List;

public interface StockService {
    StockDTO addStock(StockDTO stockDTO);
    StockDTO getStockById(Long id);
    List<StockDTO> getAllStocks();
    StockDTO updateStockPrice(Long id, StockDTO stockDTO);
    void deleteStock(Long id);
}
