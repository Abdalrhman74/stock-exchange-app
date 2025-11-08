package com.example.stockexchange.service.impl;

import com.example.stockexchange.dto.StockExchangeDTO;
import com.example.stockexchange.entity.Stock;
import com.example.stockexchange.entity.StockExchange;
import com.example.stockexchange.exception.ResourceNotFoundException;
import com.example.stockexchange.repository.StockExchangeRepository;
import com.example.stockexchange.repository.StockRepository;
import com.example.stockexchange.service.StockExchangeService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StockExchangeServiceImpl implements StockExchangeService {

    private final StockExchangeRepository exchangeRepository;

    private final StockRepository stockRepository;

    public StockExchangeServiceImpl(StockExchangeRepository exchangeRepository, StockRepository stockRepository) {
        this.exchangeRepository = exchangeRepository;
        this.stockRepository = stockRepository;
    }

    @Override
    public StockExchangeDTO createExchange(StockExchangeDTO dto) {
        StockExchange exchange = new StockExchange();
        exchange.setName(dto.getName());
        exchange.setDescription(dto.getDescription());
        exchange.setLiveInMarket(false); // default false until ≥10 stocks
        return mapToDTO(exchangeRepository.save(exchange));
    }

    @Override
    public StockExchangeDTO getExchangeById(Long id) {
        StockExchange exchange = exchangeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exchange not found with ID: " + id));
        return mapToDTO(exchange);
    }

    @Override
    public List<StockExchangeDTO> getAllExchanges() {
        return exchangeRepository.findAll()
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public StockExchangeDTO updateExchange(Long id, StockExchangeDTO dto) {
        StockExchange exchange = exchangeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exchange not found with ID: " + id));
        exchange.setName(dto.getName());
        exchange.setDescription(dto.getDescription());
        exchange.setLiveInMarket(dto.isLiveInMarket());
        return mapToDTO(exchangeRepository.save(exchange));
    }

    @Override
    public void deleteExchange(Long id) {
        StockExchange exchange = exchangeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exchange not found with ID: " + id));
        exchangeRepository.delete(exchange);
    }

    @Override
    public StockExchangeDTO addStockToExchange(Long exchangeId, Long stockId) {
        StockExchange exchange = exchangeRepository.findById(exchangeId)
                .orElseThrow(() -> new ResourceNotFoundException("Exchange not found"));
        Stock stock = stockRepository.findById(stockId)
                .orElseThrow(() -> new ResourceNotFoundException("Stock not found"));
        exchange.getStocks().add(stock);

        // Rule: Only live if ≥10 stocks
        if (exchange.getStocks().size() >= 10) {
            exchange.setLiveInMarket(true);
        }
        return mapToDTO(exchangeRepository.save(exchange));
    }

    @Override
    public StockExchangeDTO removeStockFromExchange(Long exchangeId, Long stockId) {
        StockExchange exchange = exchangeRepository.findById(exchangeId)
                .orElseThrow(() -> new ResourceNotFoundException("Exchange not found"));
        Stock stock = stockRepository.findById(stockId)
                .orElseThrow(() -> new ResourceNotFoundException("Stock not found"));
        exchange.getStocks().remove(stock);

        if (exchange.getStocks().size() < 10) {
            exchange.setLiveInMarket(false);
        }
        return mapToDTO(exchangeRepository.save(exchange));
    }

    private StockExchangeDTO mapToDTO(StockExchange exchange) {
        return new StockExchangeDTO(
                exchange.getId(),
                exchange.getName(),
                exchange.getDescription(),
                exchange.isLiveInMarket(),
                exchange.getStocks().stream().map(Stock::getId).collect(Collectors.toSet())
        );
    }
}
