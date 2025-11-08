package com.example.stockexchange.controller;

import com.example.stockexchange.dto.StockExchangeDTO;
import com.example.stockexchange.service.StockExchangeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/exchanges")
public class StockExchangeController {

    private final StockExchangeService exchangeService;

    public StockExchangeController(StockExchangeService exchangeService) {
        this.exchangeService = exchangeService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/createExchange")
    public ResponseEntity<StockExchangeDTO> createExchange(@RequestBody StockExchangeDTO dto) {
        return ResponseEntity.ok(exchangeService.createExchange(dto));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/getExchange/{id}")
    public ResponseEntity<StockExchangeDTO> getExchangeById(@PathVariable Long id) {
        return ResponseEntity.ok(exchangeService.getExchangeById(id));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/getAllExchanges")
    public ResponseEntity<List<StockExchangeDTO>> getAllExchanges() {
        return ResponseEntity.ok(exchangeService.getAllExchanges());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/updateExchange/{id}")
    public ResponseEntity<StockExchangeDTO> updateExchange(@PathVariable Long id, @RequestBody StockExchangeDTO dto) {
        return ResponseEntity.ok(exchangeService.updateExchange(id, dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/deleteExchange/{id}")
    public ResponseEntity<Void> deleteExchange(@PathVariable Long id) {
        exchangeService.deleteExchange(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/addStockToExchange/{exchangeId}/add-stock/{stockId}")
    public ResponseEntity<StockExchangeDTO> addStock(@PathVariable Long exchangeId, @PathVariable Long stockId) {
        return ResponseEntity.ok(exchangeService.addStockToExchange(exchangeId, stockId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/removeStockFromExchange/{exchangeId}/remove-stock/{stockId}")
    public ResponseEntity<StockExchangeDTO> removeStock(@PathVariable Long exchangeId, @PathVariable Long stockId) {
        return ResponseEntity.ok(exchangeService.removeStockFromExchange(exchangeId, stockId));
    }
}
