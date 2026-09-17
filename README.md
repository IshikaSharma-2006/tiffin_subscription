# 🍱 Tiffin Subscription & Billing System

A full-stack web application for managing a home-style tiffin subscription service. Customers can subscribe to a monthly plan, pause their subscription when required, and receive a prorated bill based only on the weekdays on which tiffin was delivered.

## 📌 Problem Statement

A tiffin owner needs to manage customers, monthly subscriptions, pause periods, and billing.

The system allows the owner to:

* Add and manage customers.
* Search customers using their phone number.
* Track active and paused subscriptions.
* Pause subscriptions for selected days.
* Calculate the number of actual delivery days.
* Generate a prorated monthly bill.

## ✨ Key Features

* Customer registration and management
* Phone-number based customer lookup
* Monthly subscription management
* Pause and resume functionality
* Active/paused customer status
* Weekday-based delivery calculation
* Automatic prorated billing
* Angular frontend with reusable services and components
* RESTful Spring Boot backend
* Database persistence using JPA

## 🛠️ Tech Stack

### Backend

* Java
* Spring Boot
* Spring Data JPA
* REST APIs
* Maven

### Frontend

* Angular
* TypeScript
* HTML
* CSS

### Database

* MySQL

## 🏗️ Architecture

The project follows a layered full-stack architecture:

```text
Angular Frontend
       ↓
Angular Services
       ↓
REST API
       ↓
Spring Boot Controller
       ↓
Service Layer
       ↓
Repository Layer
       ↓
MySQL Database
```

### Backend Layers

**Controller**

* Exposes REST endpoints.
* Handles HTTP requests and responses.

**Service**

* Contains business logic.
* Handles subscriptions, pauses, delivery-day calculation, and billing.

**Repository**

* Uses Spring Data JPA.
* Handles database operations.

**Database**

* Stores customer, subscription, and pause information.

### Frontend Structure

**Components**

* Responsible for UI and user interaction.

**Services**

* Responsible for communicating with backend REST APIs.
* Keeps HTTP/API logic separate from UI components.

**Models / Interfaces**

* Define the structure of customer, subscription, pause, and billing data.

## 💰 Billing Logic

The monthly bill is calculated based on actual delivery days.

```text
Bill = Monthly Plan Price / Total Weekdays × Delivered Weekdays
```

Paused days are excluded from the delivered-day calculation, so customers are not charged for days when their subscription was paused.

## 🔄 Example Flow

When the owner searches for a customer:

```text
Customer Component
       ↓
Customer Service
       ↓
GET Customer API
       ↓
Spring Boot Controller
       ↓
Customer Service Layer
       ↓
Repository
       ↓
MySQL
       ↓
Customer Details
       ↓
Angular UI
```

For billing:

```text
Billing Component
       ↓
Billing Service
       ↓
Billing API
       ↓
Calculate Delivery Days
       ↓
Exclude Paused Days
       ↓
Calculate Prorated Bill
       ↓
Return Billing Response
```

## 🚀 Running the Project

### Backend

Navigate to the backend directory:

```bash
cd backend
```

Configure the MySQL database and application properties, then run:

```bash
mvn spring-boot:run
```

### Frontend

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start Angular:

```bash
ng serve
```

The frontend will be available at the Angular development URL.

## 📂 Project Structure

```text
tiffin_subscription/
│
├── backend/
│   └── src/
│       └── main/
│           ├── java/
│           └── resources/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── models/
│   │   └── assets/
│   │
│   └── package.json
│
└── README.md
```

## 🎯 Design Goal

The main goal of the project is to keep **UI, API communication, business logic, and database operations separated**. This makes the application easier to understand, maintain, test, and extend with future features such as online payments, notifications, delivery tracking, and reports.
