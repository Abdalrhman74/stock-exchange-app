    package com.example.stockexchange.service.impl;

    import com.example.stockexchange.dto.StockDTO;
    import com.example.stockexchange.entity.Stock;
    import com.example.stockexchange.exception.ResourceNotFoundException;
    import com.example.stockexchange.repository.StockRepository;
    import com.example.stockexchange.service.StockService;
    import org.springframework.stereotype.Service;

    import java.time.LocalDateTime;
    import java.util.List;
    import java.util.stream.Collectors;

    @Service
    public class StockServiceImpl implements StockService {

        private final StockRepository stockRepository;

        public StockServiceImpl(StockRepository stockRepository) {
            this.stockRepository = stockRepository;
        }

        @Override
        public StockDTO addStock(StockDTO dto) {
            Stock stock = new Stock();
            stock.setName(dto.getName());
            stock.setDescription(dto.getDescription());
            stock.setCurrentPrice(dto.getCurrentPrice());
            stock.setLastUpdate(LocalDateTime.now());
            Stock saved = stockRepository.save(stock);
            return mapToDTO(saved);
        }

        @Override
        public StockDTO getStockById(Long id) {
            Stock stock = stockRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Stock not found with ID: " + id));
            return mapToDTO(stock);
        }

        @Override
        public List<StockDTO> getAllStocks() {
            return stockRepository.findAll().stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        }

        @Override
        public StockDTO updateStockPrice(Long id, StockDTO dto) {
            Stock stock = stockRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Stock not found with ID: " + id));
            stock.setCurrentPrice(dto.getCurrentPrice());
            stock.setLastUpdate(LocalDateTime.now());
            return mapToDTO(stockRepository.save(stock));
        }

        @Override
        public void deleteStock(Long id) {
            Stock stock = stockRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Stock not found with ID: " + id));
            stockRepository.delete(stock);
        }

        private StockDTO mapToDTO(Stock stock) {
            return new StockDTO(stock.getId(), stock.getName(), stock.getDescription(),
                    stock.getCurrentPrice(), stock.getLastUpdate());
        }
    }
