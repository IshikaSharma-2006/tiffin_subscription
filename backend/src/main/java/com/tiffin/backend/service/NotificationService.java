package com.tiffin.backend.service;

import com.tiffin.backend.entity.Customer;
import com.tiffin.backend.entity.Outbox;
import com.tiffin.backend.entity.PausePeriod;
import com.tiffin.backend.repository.OutboxRepository;
import com.tiffin.backend.repository.PausePeriodRepository;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final OutboxRepository outboxRepository;
    private final PausePeriodRepository pausePeriodRepository;

    public NotificationService(
            OutboxRepository outboxRepository,
            PausePeriodRepository pausePeriodRepository) {

        this.outboxRepository = outboxRepository;
        this.pausePeriodRepository = pausePeriodRepository;
    }

    public void notifyCustomersDueToday(
            List<Customer> customers,
            LocalDate date) {

        // No deliveries on Saturday/Sunday
        DayOfWeek day = date.getDayOfWeek();

        if (day == DayOfWeek.SATURDAY ||
            day == DayOfWeek.SUNDAY) {
            return;
        }

        for (Customer customer : customers) {

            // Customer must be active
            if (customer.getStatus() != Customer.Status.ACTIVE) {
                continue;
            }

            // Subscription must have started
            if (customer.getSubscriptionStartDate().isAfter(date)) {
                continue;
            }

            // Customer must not be paused today
            if (isPaused(customer, date)) {
                continue;
            }

            Outbox notification = new Outbox();

            notification.setCustomerId(customer.getId());
            notification.setPhone(customer.getPhone());

            notification.setMessage(
                    "Your tiffin delivery is due today."
            );

            notification.setCreatedAt(LocalDateTime.now());

            outboxRepository.save(notification);
        }
    }

    private boolean isPaused(Customer customer, LocalDate date) {

        List<PausePeriod> pauses =
                pausePeriodRepository.findByCustomer(customer);

        return pauses.stream().anyMatch(pause -> {

            LocalDate start = pause.getStartDate();

            LocalDate end = pause.getEndDate();

            return !date.isBefore(start)
                    && (end == null || !date.isAfter(end));
        });
    }
}