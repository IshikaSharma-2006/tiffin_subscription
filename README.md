# Tiffin Subscription Manager

A full-stack web application for home-style tiffin and lunch delivery businesses.

The application helps a tiffin owner manage monthly customer subscriptions, pause and resume deliveries, calculate pro-rated monthly bills, search customers by phone, view active/paused customers, and generate delivery notifications for customers due today.

---

## 1. Problem Statement

A home-style tiffin service usually works on a monthly subscription model.

Customers receive lunch every weekday, but sometimes they need to pause their subscription for a few days because of:

- Travel
- Festivals
- Personal reasons
- Temporary absence

A customer should not be charged for weekdays on which the tiffin was paused.

The application solves this by allowing the tiffin owner to:

1. Create customer subscriptions.
2. Store the customer's monthly plan price.
3. Pause a customer's delivery.
4. Resume a customer's delivery.
5. Calculate the customer's monthly bill based on actual served weekdays.
6. Search customers by phone number.
7. View customers using pagination.
8. Sort customer records.
9. Identify active and paused customers.
10. Notify customers who are due for delivery today.
11. Store notifications in an outbox for verification.
 Tech Stack - SpringBoot (java)
 frontend - angular
 database - h2
---

# 2. Main Features

## Customer Subscription

The owner can create a customer subscription with:

- Customer name
- Phone number
- Monthly plan price
- Subscription start date

Each phone number is unique.

A newly created customer is automatically marked as:

`ACTIVE`

---

## Pause Subscription

The owner can pause an active customer.

A pause period stores:

- Customer
- Pause start date
- Pause end date

When a pause is created, the customer status changes from:

`ACTIVE -> PAUSED`

An open pause has:

`endDate = null`

This represents a currently active pause.

---

## Resume Subscription

A paused customer can be resumed.

When resumed:

- The current open pause period is found.
- Its end date is stored.
- Customer status changes from `PAUSED` to `ACTIVE`.

The resume date cannot be before the pause start date.

---

## Pro-rated Billing

Monthly billing is based on weekdays.

Saturday and Sunday are not counted as delivery days.

The system calculates:

```text
Total weekdays in month
        -
Paused weekdays
        =
Served weekdays