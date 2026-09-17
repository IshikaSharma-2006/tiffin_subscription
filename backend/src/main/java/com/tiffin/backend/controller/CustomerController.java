package com.tiffin.backend.controller;

import com.tiffin.backend.entity.Customer;
import com.tiffin.backend.service.CustomerService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping
    public Customer create(@RequestBody Customer customer) {
        return customerService.create(customer);
    }

    @GetMapping("/{id}")
    public Customer getById(@PathVariable Long id) {
        return customerService.getById(id);
    }

    @GetMapping("/phone/{phone}")
    public Customer getByPhone(@PathVariable String phone) {
        return customerService.getByPhone(phone);
    }

    @GetMapping
    public Page<Customer> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        return customerService.getAll(page, size, sortBy, direction);
    }

    @PostMapping("/{id}/pause")
    public String pause(
            @PathVariable Long id,
            @RequestParam LocalDate startDate) {

        customerService.pause(id, startDate);
        return "Customer paused successfully";
    }

    @PostMapping("/{id}/resume")
    public String resume(
            @PathVariable Long id,
            @RequestParam LocalDate endDate) {

        customerService.resume(id, endDate);
        return "Customer resumed successfully";
    }

    @GetMapping("/{id}/bill")
    public BigDecimal bill(
            @PathVariable Long id,
            @RequestParam String month) {

        return customerService.calculateBill(id, YearMonth.parse(month));
    }
}