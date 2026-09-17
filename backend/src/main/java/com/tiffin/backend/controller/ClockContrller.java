package com.tiffin.backend.controller;

import com.tiffin.backend.entity.Customer;
import com.tiffin.backend.entity.Outbox;
import com.tiffin.backend.repository.CustomerRepository;
import com.tiffin.backend.repository.OutboxRepository;
import com.tiffin.backend.service.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@CrossOrigin
public class ClockController {

    private final CustomerRepository customerRepository;
    private final OutboxRepository outboxRepository;
    private final NotificationService notificationService;

    public ClockController(
            CustomerRepository customerRepository,
            OutboxRepository outboxRepository,
            NotificationService notificationService) {

        this.customerRepository = customerRepository;
        this.outboxRepository = outboxRepository;
        this.notificationService = notificationService;
    }

    @PostMapping("/clock")
    public String clock() {

        LocalDate today = LocalDate.now();

        List<Customer> customers =
                customerRepository.findAll();

        notificationService.notifyCustomersDueToday(
                customers,
                today
        );

        return "Clock processed for " + today;
    }

    @GetMapping("/outbox")
    public List<Outbox> getOutbox() {
        return outboxRepository.findAll();
    }
}