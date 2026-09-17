$ curl -L "https://start.spring.io/starter.zip?type=maven-project&language=java&bootVersion=3.5.6&baseDir=backend&groupId=com.tiffin&artifactId=backend&name=backend&packageName=com.tiffin.backend&packaging=jar&javaVersion=21&dependencies=web,data-jpa,h2,validation,security" -o backend.zip
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   189    0   189    0     0    556      0 --:--:-- --:--:-- --:--:--   557
@IshikaSharma-2006 ➜ /workspaces/tiffin_subscription/backend (main) $ unzip backend.zip
Archive:  backend.zip
  End-of-central-directory signature not found.  Either this file is not
  a zipfile, or it constitutes one disk of a multi-part archive.  In the
  latter case the central directory and zipfile comment will be found on
  the last disk(s) of this archive.
unzip:  cannot find zipfile directory in one of backend.zip or
        backend.zip.zip, and cannot find backend.zip.ZIP, period.
@IshikaSharma-2006 ➜ /workspaces/tiffin_subscription/backend (main) $ 

Haan, issue samajh aa gaya. curl ne ZIP download nahi kiya — sirf 189-byte error response download hua hai. Isliye unzip fail hua.

Aur meri previous command mein bootVersion=3.5.6 dena unnecessary tha. Abhi us command ko repeat mat karo.

1. Pehle failed ZIP delete karo

Tum abhi /workspaces/tiffin_subscription/backend mein ho. Run:

rm backend.zip
2. Spring Initializr ko browser se open karo

Codespace ke terminal mein nahi — normal browser tab mein:

Spring Initializr

Ye settings select karo:

Project: Maven
Language: Java
Spring Boot: jo current stable 3.x version automatically selected ho

Group:
com.tiffin

Artifact:
backend

Name:
backend

Package name:
com.tiffin.backend

Packaging:
Jar

Java:
21

Dependencies add karo:

Spring Web
Spring Data JPA
H2 Database
Validation
Spring Security

Then Generate karo aur ZIP download karo.

3. ZIP ko Codespace mein upload karo

Codespace ke Explorer (left side files panel) mein:

backend/

par right-click → Upload...

Downloaded backend.zip select karo.

Phir terminal mein:

ls

Agar backend.zip dikh raha hai:

unzip backend.zip

Then:

ls

Expected:

pom.xml
src
backend.zip
⚠️ Lekin ek aur important correction

Humne pehle:

mkdir backend
cd backend

kiya tha.

Spring Initializr ka generated ZIP agar backend/ folder ke andar upload karogi, toh humein final structure:

tiffin_subscription/
└── backend/
    ├── pom.xml
    └── src/

chahiye.

backend/backend/src nahi hona chahiye.

Isliye ZIP extract karne ke baad ls ka output mujhe bhejna. Main next command wahi dekhkar bataunga.

Abhi Java version change karne ki bhi zarurat nahi hai. Pehle project properly generate/extract kar lete hain.

Bilkul. Main tumhare abhi tak actually implemented project ke according dono files de raha hoon:

README.md — setup, architecture, features, database, every API, request/response examples, testing, frontend routes.
REASONING.md — problem ko kaise break kiya, design decisions, billing logic, pause/resume logic, T1 notification/outbox logic, testing/fixes, limitations and future work.

Important: maine T6 transfer subscription ko implemented nahi likha hai, kyunki woh abhi kiya nahi hai. T1 ko implemented detail mein include kiya hai.

1. README.md
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

Then:

Bill =
Monthly Plan Price
×
Served Weekdays
÷
Total Weekdays

The final amount is rounded to two decimal places using HALF_UP.

Search by Phone

Customers can be searched using their phone number.

Example:

GET /api/customers/phone/9876543210

This is useful because the business requirement specifically requires customers to be looked up by phone.

Pagination and Sorting

The customer list supports:

Page number
Page size
Sort field
Sort direction

Example:

GET /api/customers?page=0&size=10&sortBy=name&direction=asc

This avoids loading every customer record at once.

Owner Registration and Login

The application includes owner registration and login.

Owner passwords are stored using BCrypt hashing instead of storing plain-text passwords.

The current implementation uses stateless authentication infrastructure and the login endpoint verifies credentials.

Daily Delivery Notification

The application includes the T1 delivery notification requirement.

The /clock endpoint simulates the start-of-day processing.

For the current date, the system checks:

Is today a weekday?
Has the customer's subscription started?
Is the customer active?
Is the customer currently paused?

Only customers who are actually due for delivery receive a notification.

Notifications are stored in the outbox table.

They can be inspected using:

GET /outbox
3. Technology Stack
Backend
Java
Spring Boot
Spring Web
Spring Data JPA
Spring Security
Hibernate
Maven
H2 Database
BCrypt
Frontend
Angular
TypeScript
HTML
CSS
Angular Router
Angular HttpClient
Database

H2 file-based database.

Database URL:

jdbc:h2:file:./data/tiffindb
4. Project Structure
tiffin_subscription/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   └── java/
│   │   │       └── com/
│   │   │           └── tiffin/
│   │   │               └── backend/
│   │   │                   │
│   │   │                   ├── config/
│   │   │                   │   └── SecurityConfig.java
│   │   │                   │
│   │   │                   ├── controller/
│   │   │                   │   ├── AuthController.java
│   │   │                   │   ├── CustomerController.java
│   │   │                   │   └── ClockController.java
│   │   │                   │
│   │   │                   ├── entity/
│   │   │                   │   ├── User.java
│   │   │                   │   ├── Customer.java
│   │   │                   │   ├── PausePeriod.java
│   │   │                   │   └── Outbox.java
│   │   │                   │
│   │   │                   ├── repository/
│   │   │                   │   ├── UserRepository.java
│   │   │                   │   ├── CustomerRepository.java
│   │   │                   │   ├── PausePeriodRepository.java
│   │   │                   │   └── OutboxRepository.java
│   │   │                   │
│   │   │                   └── service/
│   │   │                       ├── AuthService.java
│   │   │                       ├── CustomerService.java
│   │   │                       └── NotificationService.java
│   │   │
│   │   └── resources/
│   │
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── components/
│   │       │   ├── landing/
│   │       │   ├── owner/
│   │       │   │   ├── owner-login/
│   │       │   │   ├── owner-register/
│   │       │   │   └── owner-dashboard/
│   │       │   │
│   │       │   └── customer/
│   │       │       ├── customer-list/
│   │       │       ├── customer-form/
│   │       │       ├── pause-resume/
│   │       │       └── customer-bill/
│   │       │
│   │       ├── services/
│   │       │   ├── auth.ts
│   │       │   └── customer.service.ts
│   │       │
│   │       ├── app.ts
│   │       ├── app.html
│   │       ├── app.css
│   │       ├── app.config.ts
│   │       └── app.routes.ts
│   │
│   └── package.json
│
├── README.md
├── REASONING.md
└── AI_LOGS.md
5. Backend Architecture

The backend follows a simple layered architecture:

Controller
    ↓
Service
    ↓
Repository
    ↓
Database
Controller

Handles HTTP requests and responses.

Service

Contains business logic.

Examples:

Duplicate phone validation
Pause/resume rules
Billing calculation
Notification eligibility
Repository

Provides database access using Spring Data JPA.

Entity

Represents database tables.

6. Database Design
users

Stores owner accounts.

Fields:

id
name
email
password

Email is unique.

Password is stored as a BCrypt hash.

customers

Stores tiffin subscribers.

Fields:

id
name
phone
monthly_plan_price
subscription_start_date
status

Possible status values:

ACTIVE
PAUSED

Phone number is unique.

pause_periods

Stores customer pause history.

Fields:

id
customer_id
start_date
end_date

Relationship:

Customer 1 -------- * PausePeriod

A customer can have multiple pause periods over time.

An open pause has:

end_date = null
outbox

Stores notifications generated by the daily clock process.

Fields:

id
customer_id
phone
message
created_at

This provides a simple persistent record of notifications that would be sent by an external notification service.

7. REST API Documentation

Base URL:

http://localhost:8080

In GitHub Codespaces, the backend can also be accessed through the forwarded port URL.

8. Authentication APIs
8.1 Register Owner
Endpoint
POST /api/auth/register
Request Body
{
  "name": "Tiffin Owner",
  "email": "owner@example.com",
  "password": "password123"
}
Logic
Check whether the email already exists.
If it exists, reject the registration.
Hash the password using BCrypt.
Save the owner.
Return the saved user.
Example Response
{
  "id": 1,
  "name": "Tiffin Owner",
  "email": "owner@example.com",
  "password": "$2a$..."
}

The password is stored as a BCrypt hash in the database.

8.2 Login Owner
Endpoint
POST /api/auth/login
Request Body
{
  "email": "owner@example.com",
  "password": "password123"
}
Logic
Find the user by email.
If the email does not exist, reject the login.
Compare the supplied password with the BCrypt hash.
If the password does not match, reject the login.
Return the owner.
9. Customer APIs
9.1 Create Customer
Endpoint
POST /api/customers
Request Body
{
  "name": "Rahul Sharma",
  "phone": "9876543210",
  "monthlyPlanPrice": 3000,
  "subscriptionStartDate": "2026-09-01"
}
Logic

The service first checks:

Does this phone number already exist?

If yes:

Customer with this phone already exists

If not:

status = ACTIVE

and the customer is saved.

9.2 Get Customer by ID
Endpoint
GET /api/customers/{id}

Example:

GET /api/customers/1
Purpose

Fetch one customer using their database ID.

9.3 Get Customer by Phone
Endpoint
GET /api/customers/phone/{phone}

Example:

GET /api/customers/phone/9876543210
Purpose

The owner can search for a customer using the phone number.

This directly supports the business requirement that customers should be looked up by phone.

9.4 List Customers
Endpoint
GET /api/customers

Default request:

GET /api/customers?page=0&size=10&sortBy=name&direction=asc
Parameters
Parameter	Default	Description
page	0	Page number
size	10	Number of records
sortBy	name	Field to sort by
direction	asc	asc or desc
Example
GET /api/customers?page=0&size=5&sortBy=name&direction=desc
Purpose

Provides pagination and sorting for customer records.

10. Pause / Resume APIs
10.1 Pause Customer
Endpoint
POST /api/customers/{id}/pause

Example:

POST /api/customers/1/pause?startDate=2026-09-10
Logic
Find the customer.
Check whether the customer is already paused.
Create a new PausePeriod.
Store the pause start date.
Leave end date as null.
Change customer status to PAUSED.

State transition:

ACTIVE
   ↓
PAUSED
10.2 Resume Customer
Endpoint
POST /api/customers/{id}/resume

Example:

POST /api/customers/1/resume?endDate=2026-09-15
Logic
Find the customer.
Ensure the customer is currently paused.
Find the pause period whose end date is null.
Validate that the resume date is not before the pause start date.
Set the pause end date.
Change customer status back to ACTIVE.

State transition:

PAUSED
   ↓
ACTIVE
11. Billing API
Calculate Monthly Bill
Endpoint
GET /api/customers/{id}/bill
Parameter
month=YYYY-MM

Example:

GET /api/customers/1/bill?month=2026-09
Billing Algorithm

Suppose:

Monthly plan = ₹3000
September weekdays = 22
Paused weekdays = 4

Then:

Served weekdays
= 22 - 4
= 18

Bill:

3000 × 18 / 22
= 2454.545...

Rounded:

₹2454.55
Billing Steps

The service performs the following:

Step 1

Find the customer.

Step 2

Determine:

monthStart
monthEnd
Step 3

Count weekdays in the requested month.

Saturday and Sunday are ignored.

Step 4

Determine the effective service start date.

If the subscription started after the beginning of the requested month, the subscription start date is used.

Step 5

Load all pause periods for that customer.

Step 6

Clip each pause period to the relevant billing range.

For example:

Month:
01 Sep - 30 Sep

Pause:
10 Aug - 05 Sep

Only:

01 Sep - 05 Sep

is relevant for September billing.

Step 7

Count paused weekdays.

Step 8

Calculate:

servedDays = totalWeekdays - pausedWeekdays
Step 9

Prevent negative served days.

if servedDays < 0:
    servedDays = 0
Step 10

Calculate the final amount using:

monthlyPlanPrice × servedDays / totalWeekdays

The result is rounded using:

RoundingMode.HALF_UP

and returned with two decimal places.

12. Clock / Notification APIs
12.1 Process Today's Deliveries
Endpoint
POST /clock
Purpose

Simulates the daily morning delivery notification process.

The backend takes the current server date:

LocalDate.now()

and processes all customers.

Notification Eligibility

A customer receives a notification only if all conditions are satisfied.

Condition 1: Weekday

Saturday and Sunday are ignored.

Monday - Friday → eligible
Saturday/Sunday → not eligible
Condition 2: Subscription Started

If:

subscriptionStartDate > today

the customer is skipped.

Condition 3: Customer Status

Only:

ACTIVE

customers are considered.

Paused customers are skipped.

Condition 4: Pause Period

The system also checks the actual pause periods.

A customer is considered paused when:

date >= pause.startDate
AND
(
    pause.endDate == null
    OR
    date <= pause.endDate
)
Notification Creation

For an eligible customer, an Outbox record is created.

Example:

{
  "customerId": 1,
  "phone": "9876543210",
  "message": "Your tiffin delivery is due today.",
  "createdAt": "2026-09-17T08:30:00"
}
12.2 View Notification Outbox
Endpoint
GET /outbox
Purpose

Returns notifications generated by /clock.

This acts as a simple notification-service outbox for the coding challenge.

13. T1 Implementation

The T1 requirement is:

Each morning, notify customers due a delivery today.

The implementation follows:

POST /clock
      ↓
Get today's date
      ↓
Find all customers
      ↓
Check weekday
      ↓
Check subscription start date
      ↓
Check ACTIVE status
      ↓
Check pause periods
      ↓
Create Outbox notification
      ↓
GET /outbox

Example:

Customer A
ACTIVE
Subscription started
Not paused
Weekday
       ↓
Notification created

While:

Customer B
PAUSED
       ↓
Skipped

This was tested with a paused customer, and /outbox returned an empty list because that customer was not due for delivery.

14. Frontend Routes
Landing Page
/

The landing page explains:

What the application does
Key features
Target audience
Owner workspace
Coming next features

It contains:

Get Started
Owner Login
Open Owner Dashboard
Create Owner Account
Customer management links
Owner Registration
/owner/register

Allows the tiffin owner to create an account.

Owner Login
/owner/login

Allows an existing owner to log in.

Owner Dashboard
/owner/dashboard

Main management area for the tiffin owner.

Customer List
/owner/customers

Supports:

Customer listing
Phone search
Pagination
Sorting
Active/paused status visibility
Add Customer
/owner/customers/add

Allows the owner to create a subscription.

Pause / Resume
/owner/customers/pause

Used for subscription pause/resume operations.

Monthly Bill
/owner/customers/bill

Allows the owner to search a customer by phone and calculate their monthly bill.

15. Frontend Services
Auth Service

File:

frontend/src/app/services/auth.ts

Responsible for:

Register API call
Login API call
Saving owner information in localStorage
Reading logged-in owner
Logout
Checking login state
Customer Service

File:

frontend/src/app/services/customer.service.ts

Responsible for:

Create customer
Get customers
Search by phone
Get by ID
Pause customer
Resume customer
Calculate bill

The service communicates with the Spring Boot REST API using Angular HttpClient.

16. Running the Backend

Navigate to:

cd backend

Run:

mvn spring-boot:run

Backend starts on:

http://localhost:8080
17. Running the Frontend

Open another terminal.

Navigate to:

cd frontend

Install dependencies:

npm install

Run Angular:

npm start

Angular starts on:

http://localhost:4200

In GitHub Codespaces, use the forwarded port URL shown by Codespaces rather than trying to access localhost from the external browser.

18. H2 Database

The application uses a file-based H2 database.

Configuration:

jdbc:h2:file:./data/tiffindb

H2 console:

/h2-console

The database is persistent across application restarts because it is file based.

19. Example End-to-End Flow

A normal business flow is:

1. Register owner
POST /api/auth/register
2. Login
POST /api/auth/login
3. Add customer
POST /api/customers
4. Customer is active
ACTIVE
5. Customer goes on vacation
POST /api/customers/1/pause?startDate=2026-09-10

Status:

PAUSED
6. Customer returns
POST /api/customers/1/resume?endDate=2026-09-15

Status:

ACTIVE
7. Calculate September bill
GET /api/customers/1/bill?month=2026-09
8. Morning delivery notification
POST /clock
9. Verify generated notifications
GET /outbox
20. Validation and Business Rules

The implementation contains the following validations:

Duplicate customer phone

A customer cannot be created if the phone number already exists.

Duplicate owner email

An owner cannot register using an existing email.

Already paused

An active pause cannot be created if the customer is already paused.

Already active

A resume operation cannot be performed on an already active customer.

Invalid resume date

Resume date cannot be before the pause start date.

Subscription not started

Customers whose subscription starts after the requested date are not considered for delivery notifications.

Weekend

Saturday and Sunday are not counted as delivery days.

Negative served days

The billing logic ensures served days cannot become negative.

21. Current Scope

Implemented:

Owner registration
Owner login
Customer creation
Customer lookup by ID
Customer lookup by phone
Customer listing
Pagination
Sorting
Subscription status
Pause subscription
Resume subscription
Pause history
Pro-rated billing
Weekday-based billing
Daily delivery notification processing
Notification outbox
Angular landing page
Owner dashboard
Customer management screens
Bill calculation screen
Pause/resume screen
22. Future Improvements

The current implementation is intentionally focused on the core challenge requirements.

Potential future improvements include:

Subscription transfer between customers
More robust subscription lifecycle history
Notification delivery through an external provider
Notification idempotency
Authentication tokens/JWT-based authorization
Owner-specific customer isolation
Payment integration
Customer self-service portal
Automated scheduled daily notification processing
Better dashboard statistics
Production database such as PostgreSQL/MySQL
Docker deployment
Automated CI/CD
Automated integration tests
23. Known Limitations
Notification duplication

Calling:

POST /clock

multiple times on the same day can currently create multiple outbox notifications.

A production implementation should add idempotency, for example using:

customerId + deliveryDate

as a unique notification key.

Overlapping pause periods

The current billing implementation sums paused weekdays from pause records. Overlapping pause periods could potentially count the same weekday more than once.

A production implementation should merge overlapping date ranges before counting paused weekdays.

Mid-cycle subscription billing

The current billing logic handles subscription start dates, but the denominator remains the total weekdays of the requested month.

A more complete billing implementation would calculate the applicable subscription cycle period and prorate based on that cycle.

Subscription transfer

Mid-cycle transfer of a subscription to another customer has not been implemented in the current version.

24. Design Philosophy

The application intentionally uses a simple architecture.

The goal was to first make the core business flow reliable:

Subscribe
   ↓
Pause
   ↓
Resume
   ↓
Calculate Bill
   ↓
Lookup
   ↓
Daily Notification

Instead of introducing unnecessary infrastructure, the implementation uses:

Spring Boot
JPA
H2
Angular
REST APIs

This keeps the system easy to run and understand while still providing a real persistent database and full-stack interaction.

25. API Quick Reference
Method	Endpoint	Purpose
POST	/api/auth/register	Register owner
POST	/api/auth/login	Login owner
POST	/api/customers	Create customer
GET	/api/customers/{id}	Get customer by ID
GET	/api/customers/phone/{phone}	Search by phone
GET	/api/customers	List customers with pagination/sorting
POST	/api/customers/{id}/pause	Pause subscription
POST	/api/customers/{id}/resume	Resume subscription
GET	/api/customers/{id}/bill?month=YYYY-MM	Calculate monthly bill
POST	/clock	Process today's delivery notifications
GET	/outbox	View generated notifications
26. Challenge Completion Summary

The application provides a complete full-stack workflow for the primary tiffin subscription problem:

Owner
  ↓
Register / Login
  ↓
Create Customer Subscription
  ↓
Customer becomes ACTIVE
  ↓
Pause when customer is away
  ↓
Resume when customer returns
  ↓
Calculate bill from served weekdays
  ↓
Search customer by phone
  ↓
View active / paused customers
  ↓
Run daily clock
  ↓
Notify customers due today
  ↓
Verify notifications through Outbox

The core business rule is:

Customers should be billed only for the weekdays on which they were actually served.


---

# 2. `REASONING.md`

```markdown id="92846"
# Reasoning and Design Decisions

## 1. Understanding the Problem

The application is designed for a home-style tiffin/lunch delivery service.

The central business problem is not simply storing customers. The important requirement is:

```text
A customer subscribes monthly
        ↓
Receives lunch every weekday
        ↓
May pause for some days
        ↓
Should not be charged for paused delivery days

Therefore, the main business operation is:

Subscription
+
Pause/Resume
+
Weekday calculation
=
Pro-rated bill

The implementation was designed around this flow.

2. Breaking the Problem into Features

The problem was divided into smaller features instead of trying to build everything at once.

The implementation order was:

1. Owner registration/login
2. Customer subscription
3. Customer lookup
4. Customer list
5. Pause
6. Resume
7. Billing
8. Pagination/sorting
9. Daily notification
10. Frontend UI

This order keeps the most important business logic in the backend first.

3. Why Customer Is a Separate Entity

A customer represents a person receiving the tiffin service.

The customer contains:

name
phone
monthlyPlanPrice
subscriptionStartDate
status

The phone number is unique because the problem specifically says customers are looked up by phone.

Therefore:

@Column(nullable = false, unique = true)
private String phone;

was used.

This prevents duplicate customer records with the same phone number.

4. Why Status Is Stored on Customer

The customer has:

ACTIVE
PAUSED

status.

This makes current-state lookup simple.

For example:

Customer
Rahul
ACTIVE

means the customer is currently active.

If the owner pauses the customer:

Rahul
PAUSED

The pause history is stored separately in PausePeriod.

This gives two pieces of information:

Customer.status
    =
current state

PausePeriod
    =
historical pause information
5. Why PausePeriod Is a Separate Entity

A customer can pause multiple times.

For example:

September:
10 Sep - 15 Sep

October:
05 Oct - 08 Oct

Therefore, storing only one pause date directly on Customer would not be enough.

Instead:

Customer
   |
   +---- PausePeriod
   |
   +---- PausePeriod
   |
   +---- PausePeriod

was used.

This preserves the customer's pause history.

6. Open Pause Design

When a customer is currently paused:

startDate = 2026-09-10
endDate = null

null means the pause is still open.

When the customer resumes:

startDate = 2026-09-10
endDate = 2026-09-15

This makes it possible to identify the current pause using:

p.getEndDate() == null
7. Pause Logic

The pause operation performs several checks.

First:

Find customer

Then:

Is customer already paused?

If yes, another pause is rejected.

Otherwise:

Create PausePeriod
startDate = requested date
endDate = null

Then:

Customer status = PAUSED

The state transition is:

ACTIVE
   |
   | pause
   ↓
PAUSED
8. Resume Logic

The resume operation first finds the customer.

Then it checks:

Is customer already ACTIVE?

If yes, resume is invalid.

Then it searches the customer's pause periods for:

endDate == null

This represents the current open pause.

The supplied resume date is validated:

resumeDate >= pauseStartDate

Then:

pause.endDate = resumeDate
customer.status = ACTIVE

State transition:

PAUSED
   |
   | resume
   ↓
ACTIVE
9. Billing Problem

The most important part of the application is billing.

The monthly plan price alone cannot be used because a customer may have paused for some days.

For example:

Monthly price = ₹3000
Total weekdays = 22
Paused weekdays = 5

The customer was served:

22 - 5 = 17 days

Therefore:

Bill = ₹3000 × 17 / 22

This gives a fair pro-rated amount.

10. Why Weekdays Are Used

The problem says customers receive lunch every weekday.

Therefore:

Monday
Tuesday
Wednesday
Thursday
Friday

are delivery days.

Saturday and Sunday are ignored.

The helper function:

countWeekdays()

iterates from the start date to the end date and counts only days where:

day != SATURDAY
&&
day != SUNDAY
11. Billing Calculation Steps

The billing method follows this process:

Get customer
     ↓
Find month start/end
     ↓
Count total weekdays
     ↓
Determine subscription service start
     ↓
Load pause periods
     ↓
Calculate paused weekdays
     ↓
Calculate served weekdays
     ↓
Apply pro-rata formula
     ↓
Round to 2 decimals
12. Handling Pause Dates Outside the Month

A pause can cross month boundaries.

For example:

Pause:
25 August → 05 September

If the owner asks for September billing, August should not affect the September bill.

Therefore, the pause is clipped to:

01 September → 05 September

Similarly, if a pause starts in September and ends in October, only the September portion is considered for September billing.

13. BigDecimal for Money

Money should not be calculated using floating-point arithmetic when precision matters.

Therefore:

BigDecimal

is used for the monthly plan price and bill.

The final calculation uses:

RoundingMode.HALF_UP

with:

2 decimal places

This produces normal currency-style rounding.

14. Pagination and Sorting

The customer list can grow over time.

Returning every customer in one API response is unnecessary.

Therefore Spring Data's:

Page
PageRequest
Sort

are used.

Example:

page = 0
size = 10
sortBy = name
direction = asc

The API returns a page containing:

content
totalElements
totalPages
size
number

The frontend can use this information to implement pagination.

15. Why Search by Phone Exists

The problem specifically requires customers to be looked up by phone.

Therefore a repository method was created:

Optional<Customer> findByPhone(String phone);

and exposed through:

GET /api/customers/phone/{phone}

This allows the owner to quickly find a customer without knowing their database ID.

16. Owner Authentication

The application has an owner entity because the product is meant for a tiffin owner.

Registration:

Name
Email
Password

Login:

Email
Password

Passwords are not stored as plain text.

During registration:

passwordEncoder.encode(user.getPassword())

is used.

During login:

passwordEncoder.matches(
    suppliedPassword,
    storedHash
)

is used.

BCrypt was selected because it is a standard password hashing mechanism supported by Spring Security.

17. Why Customer Does Not Have a Separate Login

The challenge is primarily asking for:

A tool for the tiffin owner

The owner manages customers.

Customers are identified using their phone number and subscription information.

Therefore, the current MVP does not create a separate customer account/dashboard.

This keeps the implementation focused on the required business workflow.

A customer self-service portal can be added later.

18. Daily Notification Requirement

The T1 requirement introduces a daily operation:

Each morning:
notify customers who are due a delivery today

Instead of integrating an external SMS/WhatsApp/email provider during the timed challenge, an outbox mechanism was used.

The process is:

POST /clock
       ↓
Get today's date
       ↓
Find customers
       ↓
Check eligibility
       ↓
Create Outbox record

The outbox represents the notification that should be sent by a notification service.

19. Notification Eligibility

A customer must satisfy all conditions.

Condition 1

Today must be a weekday.

Saturday → skip
Sunday → skip
Condition 2

Subscription must have started.

subscriptionStartDate <= today
Condition 3

Customer must be active.

status == ACTIVE
Condition 4

Customer must not be inside an active pause period.

The pause check uses:

date >= startDate
AND
(
    endDate == null
    OR
    date <= endDate
)

Only after all checks pass is an outbox notification created.

20. Why Outbox Was Used

The requirement refers to a Notification Service.

For the coding challenge, actually sending an SMS or WhatsApp message would add an external dependency and credentials.

Instead, the application records:

customerId
phone
message
createdAt

in the outbox table.

This makes the notification process observable and testable.

The grader can call:

POST /clock

and then:

GET /outbox

to verify whether the correct customer was notified.

21. Example T1 Scenario

Suppose today is:

Thursday

Customer A:

ACTIVE
Subscription started
Not paused

Result:

Notification created

Customer B:

PAUSED

Result:

Skipped

Customer C:

ACTIVE
Subscription starts tomorrow

Result:

Skipped

Customer D:

ACTIVE
Not paused
Saturday

Result:

Skipped

This ensures that notifications are generated only for customers actually due for delivery.

22. Frontend Design

The frontend is built using Angular.

The UI is divided into:

Landing
Owner Authentication
Owner Dashboard
Customer Management
Pause/Resume
Billing

This keeps each business operation separate.

23. Landing Page Design

The landing page explains:

What the application does
Key features
Target users
Owner workspace
Future features

The hero section provides:

Get Started
Owner Login

The owner workspace additionally provides:

Open Owner Dashboard
Create Owner Account

This makes both authentication and direct dashboard navigation visible.

24. Customer List UI

The customer list consumes:

GET /api/customers

and supports:

Pagination
Sorting
Phone search

The backend remains responsible for actual database pagination and sorting.

This prevents the frontend from needing to load the complete customer table.

25. Billing UI

The billing screen allows the owner to:

Enter phone number
        ↓
Find customer
        ↓
Select month
        ↓
Call billing API
        ↓
Display calculated bill

The billing calculation itself is kept in the backend so that business logic is not duplicated in Angular.

26. Pause/Resume UI

The pause/resume page communicates with:

POST /api/customers/{id}/pause
POST /api/customers/{id}/resume

The frontend collects the relevant date and the backend validates the business rules.

This is important because validation should not rely only on frontend code.

27. Separation of Business Logic

An important design decision was to avoid putting billing logic inside controllers.

Instead:

CustomerController
        ↓
CustomerService
        ↓
calculateBill()

The controller only receives:

customer ID
month

and passes them to the service.

This keeps controllers thin and business logic reusable.

28. Repository Responsibilities

Repositories only deal with persistence.

Examples:

CustomerRepository

handles customer database operations.

PausePeriodRepository

handles pause records.

UserRepository

handles owner records.

OutboxRepository

handles notification records.

The repositories do not contain the business rules for billing or pause/resume.

29. Controller Responsibilities

Controllers are responsible for HTTP endpoints.

For example:

POST /api/customers

maps to:

customerService.create(customer)

Similarly:

GET /api/customers/{id}/bill

maps to:

customerService.calculateBill(...)

This keeps the API layer simple.

30. Security Configuration

Spring Security is configured with:

CSRF disabled
CORS enabled
Stateless session policy

The current challenge implementation permits the application APIs because the focus is the working product and business workflow.

Password hashing is still handled through Spring Security's BCrypt encoder.

A production system should additionally implement authenticated authorization around owner/customer resources.

31. H2 Database Decision

H2 was selected because the challenge is time-limited.

Advantages:

No external database server required
Easy setup
Works directly with Spring Boot
Supports JPA
Persistent file mode
Easy to inspect using H2 Console

The database uses:

jdbc:h2:file:./data/tiffindb

instead of an in-memory database so that data survives application restarts.

32. Why No Microservices

The original business problem does not require multiple deployable services for the core functionality.

The MVP therefore uses:

Angular
   ↓
Spring Boot
   ↓
H2

rather than creating separate services for:

Customer Service
Billing Service
Subscription Service
Notification Service

The notification requirement is represented using the outbox pattern inside the backend.

This reduces setup and debugging overhead during the timed coding challenge.

33. Testing Approach

The main testing approach was API-level verification followed by frontend integration.

Important flows to verify are:

Registration
POST /api/auth/register
Login
POST /api/auth/login
Customer creation
POST /api/customers
Customer lookup
GET /api/customers/phone/{phone}
Pause
POST /api/customers/{id}/pause
Resume
POST /api/customers/{id}/resume
Billing
GET /api/customers/{id}/bill?month=YYYY-MM
Notification processing
POST /clock
Notification verification
GET /outbox
34. T1 Testing

The T1 flow was specifically tested.

The clock endpoint was called:

POST /clock

The application returned a successful response.

Then:

GET /outbox

was checked.

The existing customer was paused on the current date, so the outbox was empty.

This was expected because paused customers must not receive a delivery notification.

Therefore the test confirmed the pause eligibility rule.

35. Codespaces Consideration

The application is designed to run in GitHub Codespaces.

The backend runs on:

8080

and Angular runs on:

4200

Codespaces exposes these through forwarded URLs.

Because the browser is outside the Codespace container, frontend API calls cannot rely on:

http://localhost:8080

from the user's browser.

The Angular services therefore need to use the forwarded backend URL when testing through the Codespaces browser.

CORS must also allow the forwarded frontend origin.

36. Important Debugging Issue: CORS

Initially, the Angular frontend was configured to call:

http://localhost:8080

The browser could not reach the backend from the Codespaces browser.

After changing the API URL to the forwarded backend URL, the request reached the backend but was blocked by CORS.

The backend controllers initially allowed only:

http://localhost:4200

Therefore the CORS configuration needs to allow the actual Codespaces frontend origin.

This demonstrates the difference between:

Connection refused

and:

CORS blocked

Connection refused means the browser cannot reach the server.

CORS means the server was reached, but the browser rejected the cross-origin response.

37. Current Known Limitations

The implementation is focused on the primary challenge flow.

Overlapping pauses

If two pause periods overlap, the current implementation can count overlapping weekdays more than once.

A robust solution would merge overlapping intervals first.

Mid-cycle subscription billing

If a subscription starts in the middle of a month, the current implementation adjusts the service start but still uses the month's total weekdays as the denominator.

A more complete subscription-cycle implementation would use the applicable cycle period.

Repeated /clock calls

Calling:

POST /clock

multiple times on the same date can create duplicate outbox records.

A production solution could enforce:

customerId + deliveryDate

uniqueness.

Authentication Authorization

The current implementation verifies owner credentials but does not yet implement complete JWT authorization around every business API.

For a production application, customer management endpoints should be protected so that only authenticated owners can access them.

38. Features Not Implemented Yet

The T6 lifecycle requirement:

Transfer a subscription to a new customer mid-cycle;
the plan and cycle carry over;
billing splits by who was served.

has not been implemented in the current version.

Implementing this correctly would require additional subscription lifecycle/history modeling.

A possible future model would store subscription ownership periods such as:

Subscription
    |
    +-- Customer A
    |   start → transfer date
    |
    +-- Customer B
        transfer date → cycle end

Billing could then calculate served days separately for each customer.

This was intentionally left outside the current implementation scope rather than adding incomplete lifecycle logic.

39. Future T6 Design

A proper subscription transfer implementation would likely require a subscription/cycle entity.

For example:

Subscription
--------------------------------
id
planPrice
cycleStart
cycleEnd
currentStatus

and an ownership history:

SubscriptionAssignment
--------------------------------
id
subscriptionId
customerId
startDate
endDate

Then a transfer would:

Customer A
01 Sep → 15 Sep

Customer B
16 Sep → 30 Sep

Billing could calculate:

Customer A:
served weekdays during 01-15 Sep

Customer B:
served weekdays during 16-30 Sep

The current application does not contain this model yet.

40. Final Architecture

The current system can be summarized as:

                    Angular Frontend
                          |
                          | REST/HTTP
                          ↓
                 Spring Boot Backend
                          |
          +---------------+---------------+
          |               |               |
          ↓               ↓               ↓
     Controllers      Services       Security
          |               |
          |               |
          ↓               ↓
      Repositories   Business Logic
          |
          ↓
       H2 Database

The main business flow is:

                  OWNER
                    |
                    ↓
             Register / Login
                    |
                    ↓
          Create Customer
                    |
                    ↓
                 ACTIVE
                    |
             +------+------+
             |             |
           Pause         Stay Active
             |
             ↓
           PAUSED
             |
             ↓
           Resume
             |
             ↓
           ACTIVE
             |
             ↓
       Monthly Billing
             |
             ↓
    Served Weekdays × Plan Price
    ----------------------------
       Total Month Weekdays
             |
             ↓
       Final Pro-rated Bill

Daily notification flow:

                 POST /clock
                      |
                      ↓
                Today's Date
                      |
                      ↓
               Is Weekday?
                  /       \
                No         Yes
                ↓           ↓
              Skip    Subscription Started?
                              |
                              ↓
                         Is ACTIVE?
                              |
                              ↓
                        Is Paused?
                         /       \
                       Yes        No
                        ↓          ↓
                      Skip    Create Outbox
41. Core Business Rule

The most important rule implemented by the system is:

A customer should be billed only for
the weekdays on which the customer
was actually served.

Everything in the subscription, pause/resume, billing, and notification workflow is designed around this rule.


### Ek important cheez

`README.md` mein maine **har currently implemented API** explicitly include ki hai:

```text
POST   /api/auth/register
POST   /api/auth/login

POST   /api/customers
GET    /api/customers/{id}
GET    /api/customers/phone/{phone}
GET    /api/customers
POST   /api/customers/{id}/pause
POST   /api/customers/{id}/resume
GET    /api/customers/{id}/bill

POST   /clock
GET    /outbox

Aur REASONING.md mein why we designed it this way + actual logic + T1 + testing + Codespaces/CORS issue + limitations + T6 not implemented sab explicitly documented hai. Yeh last part important hai—jo feature nahi kiya, usko README mein implemented claim nahi karna chahiye.

text file m do ye readme isme sab kuch rrkaho tech stack wagerah kya use kiya sab kuch or logical.md m file bhi text m rakho usme kya logic h api wagrrah ye likho text m

Data analysis isn't available right now. Do you want to continue without it? 

short m resoning.md file banake do
Analysis pausedBilkul. Main tumhare abhi tak actually implemented project ke according dono files de raha hoon:

README.md — setup, architecture, features, database, every API, request/response examples, testing, frontend routes.
REASONING.md — problem ko kaise break kiya, design decisions, billing logic, pause/resume logic, T1 notification/outbox logic, testing/fixes, limitations and future work.

Important: maine T6 transfer subscription ko implemented nahi likha hai, kyunki woh abhi kiya nahi hai. T1 ko implemented detail mein include kiya hai.

1. README.md
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

Then:

Bill =
Monthly Plan Price
×
Served Weekdays
÷
Total Weekdays

The final amount is rounded to two decimal places using HALF_UP.

Search by Phone

Customers can be searched using their phone number.

Example:

GET /api/customers/phone/9876543210

This is useful because the business requirement specifically requires customers to be looked up by phone.

Pagination and Sorting

The customer list supports:

Page number
Page size
Sort field
Sort direction

Example:

GET /api/customers?page=0&size=10&sortBy=name&direction=asc

This avoids loading every customer record at once.

Owner Registration and Login

The application includes owner registration and login.

Owner passwords are stored using BCrypt hashing instead of storing plain-text passwords.

The current implementation uses stateless authentication infrastructure and the login endpoint verifies credentials.

Daily Delivery Notification

The application includes the T1 delivery notification requirement.

The /clock endpoint simulates the start-of-day processing.

For the current date, the system checks:

Is today a weekday?
Has the customer's subscription started?
Is the customer active?
Is the customer currently paused?

Only customers who are actually due for delivery receive a notification.

Notifications are stored in the outbox table.

They can be inspected using:

GET /outbox
3. Technology Stack
Backend
Java
Spring Boot
Spring Web
Spring Data JPA
Spring Security
Hibernate
Maven
H2 Database
BCrypt
Frontend
Angular
TypeScript
HTML
CSS
Angular Router
Angular HttpClient
Database

H2 file-based database.

Database URL:

jdbc:h2:file:./data/tiffindb
4. Project Structure
tiffin_subscription/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   └── java/
│   │   │       └── com/
│   │   │           └── tiffin/
│   │   │               └── backend/
│   │   │                   │
│   │   │                   ├── config/
│   │   │                   │   └── SecurityConfig.java
│   │   │                   │
│   │   │                   ├── controller/
│   │   │                   │   ├── AuthController.java
│   │   │                   │   ├── CustomerController.java
│   │   │                   │   └── ClockController.java
│   │   │                   │
│   │   │                   ├── entity/
│   │   │                   │   ├── User.java
│   │   │                   │   ├── Customer.java
│   │   │                   │   ├── PausePeriod.java
│   │   │                   │   └── Outbox.java
│   │   │                   │
│   │   │                   ├── repository/
│   │   │                   │   ├── UserRepository.java
│   │   │                   │   ├── CustomerRepository.java
│   │   │                   │   ├── PausePeriodRepository.java
│   │   │                   │   └── OutboxRepository.java
│   │   │                   │
│   │   │                   └── service/
│   │   │                       ├── AuthService.java
│   │   │                       ├── CustomerService.java
│   │   │                       └── NotificationService.java
│   │   │
│   │   └── resources/
│   │
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── components/
│   │       │   ├── landing/
│   │       │   ├── owner/
│   │       │   │   ├── owner-login/
│   │       │   │   ├── owner-register/
│   │       │   │   └── owner-dashboard/
│   │       │   │
│   │       │   └── customer/
│   │       │       ├── customer-list/
│   │       │       ├── customer-form/
│   │       │       ├── pause-resume/
│   │       │       └── customer-bill/
│   │       │
│   │       ├── services/
│   │       │   ├── auth.ts
│   │       │   └── customer.service.ts
│   │       │
│   │       ├── app.ts
│   │       ├── app.html
│   │       ├── app.css
│   │       ├── app.config.ts
│   │       └── app.routes.ts
│   │
│   └── package.json
│
├── README.md
├── REASONING.md
└── AI_LOGS.md
5. Backend Architecture

The backend follows a simple layered architecture:

Controller
    ↓
Service
    ↓
Repository
    ↓
Database
Controller

Handles HTTP requests and responses.

Service

Contains business logic.

Examples:

Duplicate phone validation
Pause/resume rules
Billing calculation
Notification eligibility
Repository

Provides database access using Spring Data JPA.

Entity

Represents database tables.

6. Database Design
users

Stores owner accounts.

Fields:

id
name
email
password

Email is unique.

Password is stored as a BCrypt hash.

customers

Stores tiffin subscribers.

Fields:

id
name
phone
monthly_plan_price
subscription_start_date
status

Possible status values:

ACTIVE
PAUSED

Phone number is unique.

pause_periods

Stores customer pause history.

Fields:

id
customer_id
start_date
end_date

Relationship:

Customer 1 -------- * PausePeriod

A customer can have multiple pause periods over time.

An open pause has:

end_date = null
outbox

Stores notifications generated by the daily clock process.

Fields:

id
customer_id
phone
message
created_at

This provides a simple persistent record of notifications that would be sent by an external notification service.

7. REST API Documentation

Base URL:

http://localhost:8080

In GitHub Codespaces, the backend can also be accessed through the forwarded port URL.

8. Authentication APIs
8.1 Register Owner
Endpoint
POST /api/auth/register
Request Body
{
  "name": "Tiffin Owner",
  "email": "owner@example.com",
  "password": "password123"
}
Logic
Check whether the email already exists.
If it exists, reject the registration.
Hash the password using BCrypt.
Save the owner.
Return the saved user.
Example Response
{
  "id": 1,
  "name": "Tiffin Owner",
  "email": "owner@example.com",
  "password": "$2a$..."
}

The password is stored as a BCrypt hash in the database.

8.2 Login Owner
Endpoint
POST /api/auth/login
Request Body
{
  "email": "owner@example.com",
  "password": "password123"
}
Logic
Find the user by email.
If the email does not exist, reject the login.
Compare the supplied password with the BCrypt hash.
If the password does not match, reject the login.
Return the owner.
9. Customer APIs
9.1 Create Customer
Endpoint
POST /api/customers
Request Body
{
  "name": "Rahul Sharma",
  "phone": "9876543210",
  "monthlyPlanPrice": 3000,
  "subscriptionStartDate": "2026-09-01"
}
Logic

The service first checks:

Does this phone number already exist?

If yes:

Customer with this phone already exists

If not:

status = ACTIVE

and the customer is saved.

9.2 Get Customer by ID
Endpoint
GET /api/customers/{id}

Example:

GET /api/customers/1
Purpose

Fetch one customer using their database ID.

9.3 Get Customer by Phone
Endpoint
GET /api/customers/phone/{phone}

Example:

GET /api/customers/phone/9876543210
Purpose

The owner can search for a customer using the phone number.

This directly supports the business requirement that customers should be looked up by phone.

9.4 List Customers
Endpoint
GET /api/customers

Default request:

GET /api/customers?page=0&size=10&sortBy=name&direction=asc
Parameters
Parameter	Default	Description
page	0	Page number
size	10	Number of records
sortBy	name	Field to sort by
direction	asc	asc or desc
Example
GET /api/customers?page=0&size=5&sortBy=name&direction=desc
Purpose

Provides pagination and sorting for customer records.

10. Pause / Resume APIs
10.1 Pause Customer
Endpoint
POST /api/customers/{id}/pause

Example:

POST /api/customers/1/pause?startDate=2026-09-10
Logic
Find the customer.
Check whether the customer is already paused.
Create a new PausePeriod.
Store the pause start date.
Leave end date as null.
Change customer status to PAUSED.

State transition:

ACTIVE
   ↓
PAUSED
10.2 Resume Customer
Endpoint
POST /api/customers/{id}/resume

Example:

POST /api/customers/1/resume?endDate=2026-09-15
Logic
Find the customer.
Ensure the customer is currently paused.
Find the pause period whose end date is null.
Validate that the resume date is not before the pause start date.
Set the pause end date.
Change customer status back to ACTIVE.

State transition:

PAUSED
   ↓
ACTIVE
11. Billing API
Calculate Monthly Bill
Endpoint
GET /api/customers/{id}/bill
Parameter
month=YYYY-MM

Example:

GET /api/customers/1/bill?month=2026-09
Billing Algorithm

Suppose:

Monthly plan = ₹3000
September weekdays = 22
Paused weekdays = 4

Then:

Served weekdays
= 22 - 4
= 18

Bill:

3000 × 18 / 22
= 2454.545...

Rounded:

₹2454.55
Billing Steps

The service performs the following:

Step 1

Find the customer.

Step 2

Determine:

monthStart
monthEnd
Step 3

Count weekdays in the requested month.

Saturday and Sunday are ignored.

Step 4

Determine the effective service start date.

If the subscription started after the beginning of the requested month, the subscription start date is used.

Step 5

Load all pause periods for that customer.

Step 6

Clip each pause period to the relevant billing range.

For example:

Month:
01 Sep - 30 Sep

Pause:
10 Aug - 05 Sep

Only:

01 Sep - 05 Sep

is relevant for September billing.

Step 7

Count paused weekdays.

Step 8

Calculate:

servedDays = totalWeekdays - pausedWeekdays
Step 9

Prevent negative served days.

if servedDays < 0:
    servedDays = 0
Step 10

Calculate the final amount using:

monthlyPlanPrice × servedDays / totalWeekdays

The result is rounded using:

RoundingMode.HALF_UP

and returned with two decimal places.

12. Clock / Notification APIs
12.1 Process Today's Deliveries
Endpoint
POST /clock
Purpose

Simulates the daily morning delivery notification process.

The backend takes the current server date:

LocalDate.now()

and processes all customers.

Notification Eligibility

A customer receives a notification only if all conditions are satisfied.

Condition 1: Weekday

Saturday and Sunday are ignored.

Monday - Friday → eligible
Saturday/Sunday → not eligible
Condition 2: Subscription Started

If:

subscriptionStartDate > today

the customer is skipped.

Condition 3: Customer Status

Only:

ACTIVE

customers are considered.

Paused customers are skipped.

Condition 4: Pause Period

The system also checks the actual pause periods.

A customer is considered paused when:

date >= pause.startDate
AND
(
    pause.endDate == null
    OR
    date <= pause.endDate
)
Notification Creation

For an eligible customer, an Outbox record is created.

Example:

{
  "customerId": 1,
  "phone": "9876543210",
  "message": "Your tiffin delivery is due today.",
  "createdAt": "2026-09-17T08:30:00"
}
12.2 View Notification Outbox
Endpoint
GET /outbox
Purpose

Returns notifications generated by /clock.

This acts as a simple notification-service outbox for the coding challenge.

13. T1 Implementation

The T1 requirement is:

Each morning, notify customers due a delivery today.

The implementation follows:

POST /clock
      ↓
Get today's date
      ↓
Find all customers
      ↓
Check weekday
      ↓
Check subscription start date
      ↓
Check ACTIVE status
      ↓
Check pause periods
      ↓
Create Outbox notification
      ↓
GET /outbox

Example:

Customer A
ACTIVE
Subscription started
Not paused
Weekday
       ↓
Notification created

While:

Customer B
PAUSED
       ↓
Skipped

This was tested with a paused customer, and /outbox returned an empty list because that customer was not due for delivery.

14. Frontend Routes
Landing Page
/

The landing page explains:

What the application does
Key features
Target audience
Owner workspace
Coming next features

It contains:

Get Started
Owner Login
Open Owner Dashboard
Create Owner Account
Customer management links
Owner Registration
/owner/register

Allows the tiffin owner to create an account.

Owner Login
/owner/login

Allows an existing owner to log in.

Owner Dashboard
/owner/dashboard

Main management area for the tiffin owner.

Customer List
/owner/customers

Supports:

Customer listing
Phone search
Pagination
Sorting
Active/paused status visibility
Add Customer
/owner/customers/add

Allows the owner to create a subscription.

Pause / Resume
/owner/customers/pause

Used for subscription pause/resume operations.

Monthly Bill
/owner/customers/bill

Allows the owner to search a customer by phone and calculate their monthly bill.

15. Frontend Services
Auth Service

File:

frontend/src/app/services/auth.ts

Responsible for:

Register API call
Login API call
Saving owner information in localStorage
Reading logged-in owner
Logout
Checking login state
Customer Service

File:

frontend/src/app/services/customer.service.ts

Responsible for:

Create customer
Get customers
Search by phone
Get by ID
Pause customer
Resume customer
Calculate bill

The service communicates with the Spring Boot REST API using Angular HttpClient.

16. Running the Backend

Navigate to:

cd backend

Run:

mvn spring-boot:run

Backend starts on:

http://localhost:8080
17. Running the Frontend

Open another terminal.

Navigate to:

cd frontend

Install dependencies:

npm install

Run Angular:

npm start

Angular starts on:

http://localhost:4200

In GitHub Codespaces, use the forwarded port URL shown by Codespaces rather than trying to access localhost from the external browser.

18. H2 Database

The application uses a file-based H2 database.

Configuration:

jdbc:h2:file:./data/tiffindb

H2 console:

/h2-console

The database is persistent across application restarts because it is file based.

19. Example End-to-End Flow

A normal business flow is:

1. Register owner
POST /api/auth/register
2. Login
POST /api/auth/login
3. Add customer
POST /api/customers
4. Customer is active
ACTIVE
5. Customer goes on vacation
POST /api/customers/1/pause?startDate=2026-09-10

Status:

PAUSED
6. Customer returns
POST /api/customers/1/resume?endDate=2026-09-15

Status:

ACTIVE
7. Calculate September bill
GET /api/customers/1/bill?month=2026-09
8. Morning delivery notification
POST /clock
9. Verify generated notifications
GET /outbox
20. Validation and Business Rules

The implementation contains the following validations:

Duplicate customer phone

A customer cannot be created if the phone number already exists.

Duplicate owner email

An owner cannot register using an existing email.

Already paused

An active pause cannot be created if the customer is already paused.

Already active

A resume operation cannot be performed on an already active customer.

Invalid resume date

Resume date cannot be before the pause start date.

Subscription not started

Customers whose subscription starts after the requested date are not considered for delivery notifications.

Weekend

Saturday and Sunday are not counted as delivery days.

Negative served days

The billing logic ensures served days cannot become negative.

21. Current Scope

Implemented:

Owner registration
Owner login
Customer creation
Customer lookup by ID
Customer lookup by phone
Customer listing
Pagination
Sorting
Subscription status
Pause subscription
Resume subscription
Pause history
Pro-rated billing
Weekday-based billing
Daily delivery notification processing
Notification outbox
Angular landing page
Owner dashboard
Customer management screens
Bill calculation screen
Pause/resume screen
22. Future Improvements

The current implementation is intentionally focused on the core challenge requirements.

Potential future improvements include:

Subscription transfer between customers
More robust subscription lifecycle history
Notification delivery through an external provider
Notification idempotency
Authentication tokens/JWT-based authorization
Owner-specific customer isolation
Payment integration
Customer self-service portal
Automated scheduled daily notification processing
Better dashboard statistics
Production database such as PostgreSQL/MySQL
Docker deployment
Automated CI/CD
Automated integration tests
23. Known Limitations
Notification duplication

Calling:

POST /clock

multiple times on the same day can currently create multiple outbox notifications.

A production implementation should add idempotency, for example using:

customerId + deliveryDate

as a unique notification key.

Overlapping pause periods

The current billing implementation sums paused weekdays from pause records. Overlapping pause periods could potentially count the same weekday more than once.

A production implementation should merge overlapping date ranges before counting paused weekdays.

Mid-cycle subscription billing

The current billing logic handles subscription start dates, but the denominator remains the total weekdays of the requested month.

A more complete billing implementation would calculate the applicable subscription cycle period and prorate based on that cycle.

Subscription transfer

Mid-cycle transfer of a subscription to another customer has not been implemented in the current version.

24. Design Philosophy

The application intentionally uses a simple architecture.

The goal was to first make the core business flow reliable:

Subscribe
   ↓
Pause
   ↓
Resume
   ↓
Calculate Bill
   ↓
Lookup
   ↓
Daily Notification

Instead of introducing unnecessary infrastructure, the implementation uses:

Spring Boot
JPA
H2
Angular
REST APIs

This keeps the system easy to run and understand while still providing a real persistent database and full-stack interaction.

25. API Quick Reference
Method	Endpoint	Purpose
POST	/api/auth/register	Register owner
POST	/api/auth/login	Login owner
POST	/api/customers	Create customer
GET	/api/customers/{id}	Get customer by ID
GET	/api/customers/phone/{phone}	Search by phone
GET	/api/customers	List customers with pagination/sorting
POST	/api/customers/{id}/pause	Pause subscription
POST	/api/customers/{id}/resume	Resume subscription
GET	/api/customers/{id}/bill?month=YYYY-MM	Calculate monthly bill
POST	/clock	Process today's delivery notifications
GET	/outbox	View generated notifications
26. Challenge Completion Summary

The application provides a complete full-stack workflow for the primary tiffin subscription problem:

Owner
  ↓
Register / Login
  ↓
Create Customer Subscription
  ↓
Customer becomes ACTIVE
  ↓
Pause when customer is away
  ↓
Resume when customer returns
  ↓
Calculate bill from served weekdays
  ↓
Search customer by phone
  ↓
View active / paused customers
  ↓
Run daily clock
  ↓
Notify customers due today
  ↓
Verify notifications through Outbox

The core business rule is:

Customers should be billed only for the weekdays on which they were actually served.


---

# 2. `REASONING.md`

```markdown id="92846"
# Reasoning and Design Decisions

## 1. Understanding the Problem

The application is designed for a home-style tiffin/lunch delivery service.

The central business problem is not simply storing customers. The important requirement is:

```text
A customer subscribes monthly
        ↓
Receives lunch every weekday
        ↓
May pause for some days
        ↓
Should not be charged for paused delivery days

Therefore, the main business operation is:

Subscription
+
Pause/Resume
+
Weekday calculation
=
Pro-rated bill

The implementation was designed around this flow.

2. Breaking the Problem into Features

The problem was divided into smaller features instead of trying to build everything at once.

The implementation order was:

1. Owner registration/login
2. Customer subscription
3. Customer lookup
4. Customer list
5. Pause
6. Resume
7. Billing
8. Pagination/sorting
9. Daily notification
10. Frontend UI

This order keeps the most important business logic in the backend first.

3. Why Customer Is a Separate Entity

A customer represents a person receiving the tiffin service.

The customer contains:

name
phone
monthlyPlanPrice
subscriptionStartDate
status

The phone number is unique because the problem specifically says customers are looked up by phone.

Therefore:

@Column(nullable = false, unique = true)
private String phone;

was used.

This prevents duplicate customer records with the same phone number.

4. Why Status Is Stored on Customer

The customer has:

ACTIVE
PAUSED

status.

This makes current-state lookup simple.

For example:

Customer
Rahul
ACTIVE

means the customer is currently active.

If the owner pauses the customer:

Rahul
PAUSED

The pause history is stored separately in PausePeriod.

This gives two pieces of information:

Customer.status
    =
current state

PausePeriod
    =
historical pause information
5. Why PausePeriod Is a Separate Entity

A customer can pause multiple times.

For example:

September:
10 Sep - 15 Sep

October:
05 Oct - 08 Oct

Therefore, storing only one pause date directly on Customer would not be enough.

Instead:

Customer
   |
   +---- PausePeriod
   |
   +---- PausePeriod
   |
   +---- PausePeriod

was used.

This preserves the customer's pause history.

6. Open Pause Design

When a customer is currently paused:

startDate = 2026-09-10
endDate = null

null means the pause is still open.

When the customer resumes:

startDate = 2026-09-10
endDate = 2026-09-15

This makes it possible to identify the current pause using:

p.getEndDate() == null
7. Pause Logic

The pause operation performs several checks.

First:

Find customer

Then:

Is customer already paused?

If yes, another pause is rejected.

Otherwise:

Create PausePeriod
startDate = requested date
endDate = null

Then:

Customer status = PAUSED

The state transition is:

ACTIVE
   |
   | pause
   ↓
PAUSED
8. Resume Logic

The resume operation first finds the customer.

Then it checks:

Is customer already ACTIVE?

If yes, resume is invalid.

Then it searches the customer's pause periods for:

endDate == null

This represents the current open pause.

The supplied resume date is validated:

resumeDate >= pauseStartDate

Then:

pause.endDate = resumeDate
customer.status = ACTIVE

State transition:

PAUSED
   |
   | resume
   ↓
ACTIVE
9. Billing Problem

The most important part of the application is billing.

The monthly plan price alone cannot be used because a customer may have paused for some days.

For example:

Monthly price = ₹3000
Total weekdays = 22
Paused weekdays = 5

The customer was served:

22 - 5 = 17 days

Therefore:

Bill = ₹3000 × 17 / 22

This gives a fair pro-rated amount.

10. Why Weekdays Are Used

The problem says customers receive lunch every weekday.

Therefore:

Monday
Tuesday
Wednesday
Thursday
Friday

are delivery days.

Saturday and Sunday are ignored.

The helper function:

countWeekdays()

iterates from the start date to the end date and counts only days where:

day != SATURDAY
&&
day != SUNDAY
11. Billing Calculation Steps

The billing method follows this process:

Get customer
     ↓
Find month start/end
     ↓
Count total weekdays
     ↓
Determine subscription service start
     ↓
Load pause periods
     ↓
Calculate paused weekdays
     ↓
Calculate served weekdays
     ↓
Apply pro-rata formula
     ↓
Round to 2 decimals
12. Handling Pause Dates Outside the Month

A pause can cross month boundaries.

For example:

Pause:
25 August → 05 September

If the owner asks for September billing, August should not affect the September bill.

Therefore, the pause is clipped to:

01 September → 05 September

Similarly, if a pause starts in September and ends in October, only the September portion is considered for September billing.

13. BigDecimal for Money

Money should not be calculated using floating-point arithmetic when precision matters.

Therefore:

BigDecimal

is used for the monthly plan price and bill.

The final calculation uses:

RoundingMode.HALF_UP

with:

2 decimal places

This produces normal currency-style rounding.

14. Pagination and Sorting

The customer list can grow over time.

Returning every customer in one API response is unnecessary.

Therefore Spring Data's:

Page
PageRequest
Sort

are used.

Example:

page = 0
size = 10
sortBy = name
direction = asc

The API returns a page containing:

content
totalElements
totalPages
size
number

The frontend can use this information to implement pagination.

15. Why Search by Phone Exists

The problem specifically requires customers to be looked up by phone.

Therefore a repository method was created:

Optional<Customer> findByPhone(String phone);

and exposed through:

GET /api/customers/phone/{phone}

This allows the owner to quickly find a customer without knowing their database ID.

16. Owner Authentication

The application has an owner entity because the product is meant for a tiffin owner.

Registration:

Name
Email
Password

Login:

Email
Password

Passwords are not stored as plain text.

During registration:

passwordEncoder.encode(user.getPassword())

is used.

During login:

passwordEncoder.matches(
    suppliedPassword,
    storedHash
)

is used.

BCrypt was selected because it is a standard password hashing mechanism supported by Spring Security.

17. Why Customer Does Not Have a Separate Login

The challenge is primarily asking for:

A tool for the tiffin owner

The owner manages customers.

Customers are identified using their phone number and subscription information.

Therefore, the current MVP does not create a separate customer account/dashboard.

This keeps the implementation focused on the required business workflow.

A customer self-service portal can be added later.

18. Daily Notification Requirement

The T1 requirement introduces a daily operation:

Each morning:
notify customers who are due a delivery today

Instead of integrating an external SMS/WhatsApp/email provider during the timed challenge, an outbox mechanism was used.

The process is:

POST /clock
       ↓
Get today's date
       ↓
Find customers
       ↓
Check eligibility
       ↓
Create Outbox record

The outbox represents the notification that should be sent by a notification service.

19. Notification Eligibility

A customer must satisfy all conditions.

Condition 1

Today must be a weekday.

Saturday → skip
Sunday → skip
Condition 2

Subscription must have started.

subscriptionStartDate <= today
Condition 3

Customer must be active.

status == ACTIVE
Condition 4

Customer must not be inside an active pause period.

The pause check uses:

date >= startDate
AND
(
    endDate == null
    OR
    date <= endDate
)

Only after all checks pass is an outbox notification created.

20. Why Outbox Was Used

The requirement refers to a Notification Service.

For the coding challenge, actually sending an SMS or WhatsApp message would add an external dependency and credentials.

Instead, the application records:

customerId
phone
message
createdAt

in the outbox table.

This makes the notification process observable and testable.

The grader can call:

POST /clock

and then:

GET /outbox

to verify whether the correct customer was notified.

21. Example T1 Scenario

Suppose today is:

Thursday

Customer A:

ACTIVE
Subscription started
Not paused

Result:

Notification created

Customer B:

PAUSED

Result:

Skipped

Customer C:

ACTIVE
Subscription starts tomorrow

Result:

Skipped

Customer D:

ACTIVE
Not paused
Saturday

Result:

Skipped

This ensures that notifications are generated only for customers actually due for delivery.

22. Frontend Design

The frontend is built using Angular.

The UI is divided into:

Landing
Owner Authentication
Owner Dashboard
Customer Management
Pause/Resume
Billing

This keeps each business operation separate.

23. Landing Page Design

The landing page explains:

What the application does
Key features
Target users
Owner workspace
Future features

The hero section provides:

Get Started
Owner Login

The owner workspace additionally provides:

Open Owner Dashboard
Create Owner Account

This makes both authentication and direct dashboard navigation visible.

24. Customer List UI

The customer list consumes:

GET /api/customers

and supports:

Pagination
Sorting
Phone search

The backend remains responsible for actual database pagination and sorting.

This prevents the frontend from needing to load the complete customer table.

25. Billing UI

The billing screen allows the owner to:

Enter phone number
        ↓
Find customer
        ↓
Select month
        ↓
Call billing API
        ↓
Display calculated bill

The billing calculation itself is kept in the backend so that business logic is not duplicated in Angular.

26. Pause/Resume UI

The pause/resume page communicates with:

POST /api/customers/{id}/pause
POST /api/customers/{id}/resume

The frontend collects the relevant date and the backend validates the business rules.

This is important because validation should not rely only on frontend code.

27. Separation of Business Logic

An important design decision was to avoid putting billing logic inside controllers.

Instead:

CustomerController
        ↓
CustomerService
        ↓
calculateBill()

The controller only receives:

customer ID
month

and passes them to the service.

This keeps controllers thin and business logic reusable.

28. Repository Responsibilities

Repositories only deal with persistence.

Examples:

CustomerRepository

handles customer database operations.

PausePeriodRepository

handles pause records.

UserRepository

handles owner records.

OutboxRepository

handles notification records.

The repositories do not contain the business rules for billing or pause/resume.

29. Controller Responsibilities

Controllers are responsible for HTTP endpoints.

For example:

POST /api/customers

maps to:

customerService.create(customer)

Similarly:

GET /api/customers/{id}/bill

maps to:

customerService.calculateBill(...)

This keeps the API layer simple.

30. Security Configuration

Spring Security is configured with:

CSRF disabled
CORS enabled
Stateless session policy

The current challenge implementation permits the application APIs because the focus is the working product and business workflow.

Password hashing is still handled through Spring Security's BCrypt encoder.

A production system should additionally implement authenticated authorization around owner/customer resources.

31. H2 Database Decision

H2 was selected because the challenge is time-limited.

Advantages:

No external database server required
Easy setup
Works directly with Spring Boot
Supports JPA
Persistent file mode
Easy to inspect using H2 Console

The database uses:

jdbc:h2:file:./data/tiffindb

instead of an in-memory database so that data survives application restarts.

32. Why No Microservices

The original business problem does not require multiple deployable services for the core functionality.

The MVP therefore uses:

Angular
   ↓
Spring Boot
   ↓
H2

rather than creating separate services for:

Customer Service
Billing Service
Subscription Service
Notification Service

The notification requirement is represented using the outbox pattern inside the backend.

This reduces setup and debugging overhead during the timed coding challenge.

33. Testing Approach

The main testing approach was API-level verification followed by frontend integration.

Important flows to verify are:

Registration
POST /api/auth/register
Login
POST /api/auth/login
Customer creation
POST /api/customers
Customer lookup
GET /api/customers/phone/{phone}
Pause
POST /api/customers/{id}/pause
Resume
POST /api/customers/{id}/resume
Billing
GET /api/customers/{id}/bill?month=YYYY-MM
Notification processing
POST /clock
Notification verification
GET /outbox
34. T1 Testing

The T1 flow was specifically tested.

The clock endpoint was called:

POST /clock

The application returned a successful response.

Then:

GET /outbox

was checked.

The existing customer was paused on the current date, so the outbox was empty.

This was expected because paused customers must not receive a delivery notification.

Therefore the test confirmed the pause eligibility rule.

35. Codespaces Consideration

The application is designed to run in GitHub Codespaces.

The backend runs on:

8080

and Angular runs on:

4200

Codespaces exposes these through forwarded URLs.

Because the browser is outside the Codespace container, frontend API calls cannot rely on:

http://localhost:8080

from the user's browser.

The Angular services therefore need to use the forwarded backend URL when testing through the Codespaces browser.

CORS must also allow the forwarded frontend origin.

36. Important Debugging Issue: CORS

Initially, the Angular frontend was configured to call:

http://localhost:8080

The browser could not reach the backend from the Codespaces browser.

After changing the API URL to the forwarded backend URL, the request reached the backend but was blocked by CORS.

The backend controllers initially allowed only:

http://localhost:4200

Therefore the CORS configuration needs to allow the actual Codespaces frontend origin.

This demonstrates the difference between:

Connection refused

and:

CORS blocked

Connection refused means the browser cannot reach the server.

CORS means the server was reached, but the browser rejected the cross-origin response.

37. Current Known Limitations

The implementation is focused on the primary challenge flow.

Overlapping pauses

If two pause periods overlap, the current implementation can count overlapping weekdays more than once.

A robust solution would merge overlapping intervals first.

Mid-cycle subscription billing

If a subscription starts in the middle of a month, the current implementation adjusts the service start but still uses the month's total weekdays as the denominator.

A more complete subscription-cycle implementation would use the applicable cycle period.

Repeated /clock calls

Calling:

POST /clock

multiple times on the same date can create duplicate outbox records.

A production solution could enforce:

customerId + deliveryDate

uniqueness.

Authentication Authorization

The current implementation verifies owner credentials but does not yet implement complete JWT authorization around every business API.

For a production application, customer management endpoints should be protected so that only authenticated owners can access them.

38. Features Not Implemented Yet

The T6 lifecycle requirement:

Transfer a subscription to a new customer mid-cycle;
the plan and cycle carry over;
billing splits by who was served.

has not been implemented in the current version.

Implementing this correctly would require additional subscription lifecycle/history modeling.

A possible future model would store subscription ownership periods such as:

Subscription
    |
    +-- Customer A
    |   start → transfer date
    |
    +-- Customer B
        transfer date → cycle end

Billing could then calculate served days separately for each customer.

This was intentionally left outside the current implementation scope rather than adding incomplete lifecycle logic.

39. Future T6 Design

A proper subscription transfer implementation would likely require a subscription/cycle entity.

For example:

Subscription
--------------------------------
id
planPrice
cycleStart
cycleEnd
currentStatus

and an ownership history:

SubscriptionAssignment
--------------------------------
id
subscriptionId
customerId
startDate
endDate

Then a transfer would:

Customer A
01 Sep → 15 Sep

Customer B
16 Sep → 30 Sep

Billing could calculate:

Customer A:
served weekdays during 01-15 Sep

Customer B:
served weekdays during 16-30 Sep

The current application does not contain this model yet.

40. Final Architecture

The current system can be summarized as:

                    Angular Frontend
                          |
                          | REST/HTTP
                          ↓
                 Spring Boot Backend
                          |
          +---------------+---------------+
          |               |               |
          ↓               ↓               ↓
     Controllers      Services       Security
          |               |
          |               |
          ↓               ↓
      Repositories   Business Logic
          |
          ↓
       H2 Database

The main business flow is:

                  OWNER
                    |
                    ↓
             Register / Login
                    |
                    ↓
          Create Customer
                    |
                    ↓
                 ACTIVE
                    |
             +------+------+
             |             |
           Pause         Stay Active
             |
             ↓
           PAUSED
             |
             ↓
           Resume
             |
             ↓
           ACTIVE
             |
             ↓
       Monthly Billing
             |
             ↓
    Served Weekdays × Plan Price
    ----------------------------
       Total Month Weekdays
             |
             ↓
       Final Pro-rated Bill

Daily notification flow:

                 POST /clock
                      |
                      ↓
                Today's Date
                      |
                      ↓
               Is Weekday?
                  /       \
                No         Yes
                ↓           ↓
              Skip    Subscription Started?
                              |
                              ↓
                         Is ACTIVE?
                              |
                              ↓
                        Is Paused?
                         /       \
                       Yes        No
                        ↓          ↓
                      Skip    Create Outbox
41. Core Business Rule

The most important rule implemented by the system is:

A customer should be billed only for
the weekdays on which the customer
was actually served.

Everything in the subscription, pause/resume, billing, and notification workflow is designed around this rule.


### Ek important cheez

`README.md` mein maine **har currently implemented API** explicitly include ki hai:

```text
POST   /api/auth/register
POST   /api/auth/login

POST   /api/customers
GET    /api/customers/{id}
GET    /api/customers/phone/{phone}
GET    /api/customers
POST   /api/customers/{id}/pause
POST   /api/customers/{id}/resume
GET    /api/customers/{id}/bill

POST   /clock
GET    /outbox

Aur REASONING.md mein why we designed it this way + actual logic + T1 + testing + Codespaces/CORS issue + limitations + T6 not implemented sab explicitly documented hai. Yeh last part important hai—jo feature nahi kiya, usko README mein implemented claim nahi karna chahiye.

text file m do ye readme isme sab kuch rrkaho tech stack wagerah kya use kiya sab kuch or logical.md m file bhi text m rakho usme kya logic h api wagrrah ye likho text m

Data analysis isn't available right now. Do you want to continue without it? 

short m resoning.md file banake do
Analysis paused
