# Tiffin Subscription System – Reasoning

## Architecture

The application follows a layered architecture:

**Angular Frontend → REST API → Spring Boot → Repository → Database**

---

## Backend Architecture

### Controller

* Exposes REST APIs for customer management, subscriptions, pauses, and billing.
* Receives HTTP requests and returns responses.
* Keeps business logic outside the controller.

### Service

* Contains the main business logic.
* Handles customer lookup using phone number.
* Manages active/paused subscription status.
* Calculates weekday delivery days.
* Generates the monthly prorated bill.

### Repository

* Uses Spring Data JPA to communicate with the database.
* Handles customer, subscription, and pause data.
* Keeps database operations separate from business logic.

### Database

Stores:

* Customer details
* Subscription/plan details
* Pause information
* Subscription status

### Billing Logic

Customers are charged only for weekdays on which tiffin was actually delivered.

**Bill = Monthly Plan Price / Total Weekdays × Delivered Weekdays**

Paused days are excluded from the delivered-day count.

### API Flow

`Client → Controller → Service → Repository → Database`

---

# Frontend Architecture – Angular

The frontend is divided into **Components, Services and Models**.

### Components

Components handle the UI and user interaction.

Main components include:

* Customer management
* Customer list
* Subscription/pause management
* Billing
* Dashboard/status view

Components collect user input and display API responses. Business and HTTP logic is kept inside services.

### Angular Services

Services are used to communicate with the Spring Boot REST APIs.

For example:

* `CustomerService` – add, search and fetch customers.
* `SubscriptionService` – manage subscriptions and pause/resume operations.
* `BillingService` – request and display monthly bills.

This keeps API calls reusable and prevents duplicate HTTP logic inside components.

### Models / Interfaces

TypeScript interfaces/models are used to define the structure of:

* Customer
* Subscription
* Pause period
* Billing response

This provides type safety and makes frontend data handling easier.

### Frontend Flow

`Component → Angular Service → HTTP Request → Spring Boot API → Database`

The API response is returned to the Angular service and then displayed by the component.

### Overall System Flow

`User → Angular Component → Angular Service → REST API → Controller → Service → Repository → Database`

This separation of responsibilities keeps the application organized, maintainable, and easy to extend.
