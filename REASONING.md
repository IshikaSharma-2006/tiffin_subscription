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