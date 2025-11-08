package com.example.stockexchange.controller;

import com.example.stockexchange.dto.StockDTO;
import com.example.stockexchange.service.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/stocks")
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/createStock")
    public ResponseEntity<StockDTO> createStock(@RequestBody StockDTO dto) {
        return ResponseEntity.ok(stockService.addStock(dto));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/getStock/{id}")
    public ResponseEntity<StockDTO> getStockById(@PathVariable Long id) {
        return ResponseEntity.ok(stockService.getStockById(id));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/getAllStocks")
    public ResponseEntity<List<StockDTO>> getAllStocks() {
        return ResponseEntity.ok(stockService.getAllStocks());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/updateStock/{id}")
    public ResponseEntity<StockDTO> updateStock(@PathVariable Long id, @RequestBody StockDTO dto) {
        return ResponseEntity.ok(stockService.updateStockPrice(id, dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/deleteStock/{id}")
    public ResponseEntity<Void> deleteStock(@PathVariable Long id) {
        stockService.deleteStock(id);
        return ResponseEntity.noContent().build();
    }
}
