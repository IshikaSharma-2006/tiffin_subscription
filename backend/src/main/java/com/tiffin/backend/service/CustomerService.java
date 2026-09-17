package com.tiffin.backend.service;

import com.tiffin.backend.entity.Customer;
import com.tiffin.backend.entity.PausePeriod;
import com.tiffin.backend.repository.CustomerRepository;
import com.tiffin.backend.repository.PausePeriodRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final PausePeriodRepository pausePeriodRepository;

    public CustomerService(CustomerRepository customerRepository,
                           PausePeriodRepository pausePeriodRepository) {
        this.customerRepository = customerRepository;
        this.pausePeriodRepository = pausePeriodRepository;
    }

    public Customer create(Customer customer) {
        if (customerRepository.findByPhone(customer.getPhone()).isPresent()) {
            throw new RuntimeException("Customer with this phone already exists");
        }

        customer.setStatus(Customer.Status.ACTIVE);
        return customerRepository.save(customer);
    }

    public Customer getById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    public Customer getByPhone(String phone) {
        return customerRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    public Page<Customer> getAll(int page, int size, String sortBy, String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        return customerRepository.findAll(PageRequest.of(page, size, sort));
    }

    public void pause(Long id, LocalDate startDate) {

        Customer customer = getById(id);

        if (customer.getStatus() == Customer.Status.PAUSED) {
            throw new RuntimeException("Customer is already paused");
        }

        PausePeriod pause = new PausePeriod();
        pause.setCustomer(customer);
        pause.setStartDate(startDate);

        pausePeriodRepository.save(pause);

        customer.setStatus(Customer.Status.PAUSED);
        customerRepository.save(customer);
    }

    public void resume(Long id, LocalDate endDate) {

        Customer customer = getById(id);

        if (customer.getStatus() == Customer.Status.ACTIVE) {
            throw new RuntimeException("Customer is already active");
        }

        List<PausePeriod> pauses = pausePeriodRepository.findByCustomer(customer);

        PausePeriod currentPause = pauses.stream()
                .filter(p -> p.getEndDate() == null)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No active pause found"));

        if (endDate.isBefore(currentPause.getStartDate())) {
            throw new RuntimeException("Resume date cannot be before pause date");
        }

        currentPause.setEndDate(endDate);
        pausePeriodRepository.save(currentPause);

        customer.setStatus(Customer.Status.ACTIVE);
        customerRepository.save(customer);
    }

    public BigDecimal calculateBill(Long id, YearMonth month) {

        Customer customer = getById(id);

        LocalDate monthStart = month.atDay(1);
        LocalDate monthEnd = month.atEndOfMonth();

        long totalWeekdays = countWeekdays(monthStart, monthEnd);

        LocalDate serviceStart = customer.getSubscriptionStartDate().isAfter(monthStart)
                ? customer.getSubscriptionStartDate()
                : monthStart;

        if (serviceStart.isAfter(monthEnd)) {
            return BigDecimal.ZERO.setScale(2);
        }

        List<PausePeriod> pauses = pausePeriodRepository.findByCustomer(customer);

        long pausedWeekdays = 0;

        for (PausePeriod pause : pauses) {

            LocalDate start = pause.getStartDate().isAfter(serviceStart)
                    ? pause.getStartDate()
                    : serviceStart;

            LocalDate end = pause.getEndDate() == null
                    ? monthEnd
                    : pause.getEndDate().isBefore(monthEnd)
                    ? pause.getEndDate()
                    : monthEnd;

            if (!start.isAfter(end)) {
                pausedWeekdays += countWeekdays(start, end);
            }
        }

        long servedDays = totalWeekdays - pausedWeekdays;

        if (servedDays < 0) {
            servedDays = 0;
        }

        return customer.getMonthlyPlanPrice()
                .multiply(BigDecimal.valueOf(servedDays))
                .divide(BigDecimal.valueOf(totalWeekdays), 2, RoundingMode.HALF_UP);
    }

    private long countWeekdays(LocalDate start, LocalDate end) {

        long count = 0;

        for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(1)) {

            DayOfWeek day = date.getDayOfWeek();

            if (day != DayOfWeek.SATURDAY && day != DayOfWeek.SUNDAY) {
                count++;
            }
        }

        return count;
    }
}