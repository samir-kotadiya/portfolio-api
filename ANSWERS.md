## 1. Architecture Decisions

The backend is implemented using **Node.js, TypeScript, Express, sqlite, and TypeORM**, following **Clean Architecture and Domain-Driven Design principles** to maintain clear separation of concerns.

The application is organized into the following layers:

**Controller Layer**

* Responsible for handling HTTP requests and responses.
* Performs request validation using DTOs.
* Delegates business logic to the service layer.
* Send Response

**Service Layer**

* Contains core business logic for order splitting.
* Handles portfolio validation rules and order calculations.
* Coordinates repository operations.

**Repository Layer**

* Responsible for database interaction using TypeORM.
* A `BaseRepository` abstraction was created to provide reusable functionality such as pagination.
* Domain-specific repositories extend this base repository.

**Entity Layer**

* Defines database models using TypeORM entities.

**Shared / Core Layer**

* Contains reusable utilities, error handling, base services, configuration, and logging.

This layered approach ensures the system remains **maintainable, testable, and scalable**.

---

## 2. Order Splitter Logic

The order splitter receives:

* A **model portfolio**
* A **total investment amount**

It returns the **amount and quantity of shares to buy for each stock**.

### Algorithm

1. Validate the portfolio:

   * Ensure portfolio weights sum to **100%**
   * Ensure **no duplicate symbols**
   * Ensure **price > 0** if provided

2. For each stock in the portfolio:

```
amount = totalInvestment × (weight / 100)
shares = amount / price
shares = roundShares(shares, configuredPrecision)
```

3. Store generated orders in the sqlite in memory.

4. Return:

* execution time
* generated orders

---

## 3. Fractional Shares Handling

The system supports **fractional shares**, which is common in modern trading platforms.

The number of decimal places allowed for share quantities is **configurable via environment configuration**.

Example:

```
SHARE_PRECISION=3
```

Example output:

```
3.125 shares
```

If trading rules change in the future, this precision can be increased without modifying business logic.

---

## 4. Execution Time Logic

Orders are scheduled based on market execution rules.

If an order arrives **during market hours**, it executes immediately.

If it arrives **outside market hours**, it executes at the next market open.

This logic is implemented in:

```
shared/utils/market-time.util.ts
```

This keeps trading logic **isolated and reusable**.

---

## 5. Validation Strategy

Validation is implemented using **DTOs and class-validator**.

Validation occurs at the **controller layer** before the request reaches the business logic.

Examples of validations:

* portfolio must exist
* portfolio weights must sum to **100**
* stock price must be **> 0**
* duplicate stock symbols are not allowed

This ensures invalid requests **never reach the service layer**.

---

## 6. Pagination Implementation

A reusable pagination method was implemented in the `BaseRepository`.

Example usage:

```
GET /api/v1/orders?page=1&limit=10
```

Response structure:

```
{
  data: [],
  meta: {
    page: 1,
    limit: 10,
    total: 50,
    totalPages: 5
  }
}
```

This avoids duplicating pagination logic across repositories.

---

## 7. API Versioning

The API uses **URL-based versioning**.

Example:

```
/api/v1/orders
```

This allows future API changes without breaking existing clients.

---

## 8. Error Handling

A centralized error handling strategy was implemented.

Custom errors include:

* `BadRequestError`
* `NotFoundError`

All errors are handled through a **global error middleware**, ensuring consistent error responses.

Example response:

```
{
  "success": false,
  "message": "Portfolio weights must sum to 100"
}
```

---

## 9. Logging

Production-grade logging is implemented using **pino**.

Logs include:

* request logs
* error logs

Logging helps with **debugging, monitoring, and observability in production environments**.

---

## 10. Test Coverage

Unit tests focus on **core business logic**, particularly the order splitting service.

Tests cover:

* Integration Test for split and get order api
* Order Service
* share rounding
* edge cases

Testing ensures correctness of financial calculations.

---

## 11. Docker Setup

Docker is used to create a reproducible development environment.

Containers include:

* Node.js backend

This ensures the application can be started with:

```
docker up
```

without requiring manual dependency setup.

---

## 12. Assumptions Made

Some assumptions were made due to missing details in the specification:

1. Fractional shares are allowed.
2. Portfolio weights must sum exactly to **100**.
3. If a stock price is not provided, a **default stock price** is used.
4. Orders are stored immediately after being generated.

---

## 13. Edge Cases Considered

The system handles the following edge cases:

* Duplicate stock (by symbols)
* Invalid portfolio weights
* Price <= 0
* Very small investment amounts resulting in zero shares
* Configurable share precision

---

## 14. Use of LLMs

LLMs (ChatGPT) were used as a **development assistant** during the challenge.

Specifically used for:

* Brainstorming architecture ideas (review multiple architecture and designs)
* Reviewing TypeScript patterns
* Suggesting improvements to repository abstractions
* Identifying potential edge cases
* Assisting with documentation drafting

All generated suggestions were reviewed and manually integrated into the implementation.

The final code and architecture decisions were implemented independently.

## Production Improvements
Authentication / Authorisation
Swagger documentaion
Add unit test cases for all use cases and files (due to time constrains only added important / critical test cases)
Redis caching
Market price API integration
Rate limiting
Observability (Prometheus + Grafana)
CI/CD pipelines
