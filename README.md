# TaxTrail (Backend) - + 80% completed

TaxTrail is a web-based public budget transparency system aligned with **SDG 10 – Reduced Inequalities**.

---

## Quick start (local)

### Prerequisites

- Node.js + npm installed
- A MongoDB connection string (e.g., MongoDB Atlas)

### Install

From the repository root:

```bash
cd backend
npm install
```

### Environment variables

Create the `.env` file (Linux):

```bash
cd backend
npm run env:init
```

Ensure `backend/.env` contains:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
PORT=4000
```

### Run (dev)

```bash
cd backend
npm run dev
```

---

## Tech stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- express-validator
- Axios (Exchange API)
- Postman (API testing)

---

## Architecture

The backend follows a layered architecture:

```
Routes → Controllers → Services → Models
```

### Key features

- RESTful API design
- Role-based authentication (JWT)
- Protected routes
- Request validation middleware
- Centralized error handling
- Service layer separation
- MongoDB Atlas integration
- Third-party API integration
- Pagination
- In-memory caching for exchange rates

---

## Project breakdown (team components)

This project was done by 4 members, splitting the system into 4 major components:

| Member | Real Entity | Real CRUD | Real Third-Party API | Clear Topic Alignment |
|--------|------------|-----------|----------------------|-----------------------|
| 1 | TaxContributions | ✅ | Exchange Rate | Revenue inequality |
| 2 | BudgetAllocations | ✅ | Inflation API | Spending fairness |
| 3 | SocialPrograms | ✅ | World Bank API | Poverty reduction |
| 4 | RegionalDevelopmentData | ✅ | UN SDG API | Regional disparity |

---

## Core entities

The 2 core entities connecting all components:

1. JWT Authentication (Registration & Login)
2. Region Component

---

## API

### Base URL

```
http://localhost:4000/api
```

---

# Authentication & Roles

JWT-based authentication.

### Roles

- **Admin** → Full CRUD access
- **Public** → Read-only access

All routes are protected.

---

## Authentication API

### Register

- **POST** `/api/auth/register`

```json
{
  "name": "Admin User",
  "email": "admin@email.com",
  "password": "123456",
  "role": "Admin"
}
```

---

### Login

- **POST** `/api/auth/login`

```json
{
  "email": "admin@email.com",
  "password": "123456"
}
```

Response:

```json
{
  "success": true,
  "token": "JWT_TOKEN"
}
```

---

## How to Use JWT

After login, include the token in request headers:

```
Authorization: Bearer <your_token_here>
```

All protected routes require a valid JWT.

---

# Region Component (Core Entity)

Region acts as the central relational entity connecting all system components.

TaxContribution references Region via ObjectId.

### Endpoints

#### Create region (Admin only)

- **POST** `/api/regions`

Request body:

```json
{
  "regionName": "Southern Province"
}
```

#### Get all regions (Public & Admin)

- **GET** `/api/regions`

#### Get single region

- **GET** `/api/regions/:id`

#### Update region (Admin only)

- **PUT** `/api/regions/:id`

#### Delete region (Admin only)

- **DELETE** `/api/regions/:id`

# Member 1 — TaxContribution Component

---

## Purpose

The TaxContribution component manages government revenue data, enabling transparency in tax collection across different income groups and regions.

It supports analysis of wealth distribution and revenue patterns aligned with **SDG 10 – Reduced Inequalities**.

---

## Functional Requirements

1. Admin users must be able to create tax contribution records.
2. Admin users must be able to update and delete tax contribution records.
3. Public and Admin users must be able to view tax contribution records.
4. Users must be able to filter tax contributions by:
   - Region
   - Year
   - Income bracket
5. Users must be able to retrieve tax data with pagination.
6. Users must be able to convert tax amounts to a different currency.
7. The system must provide aggregated revenue summaries by region.
8. All routes must be protected via JWT authentication and role-based access control (RBAC).
9. All requests must be validated before processing.
10. All errors must be handled via centralized error middleware.
11. The component must be integration tested with authentication, validation, and RBAC enforcement.

---

## Endpoints

### Create Tax Contribution (Admin only)

- **POST** `/api/v1/tax-contributions`

```json
{
  "payerType": "Individual",
  "incomeBracket": "Low",
  "taxType": "Income",
  "amount": 50000,
  "year": 2024,
  "region": "regionId"
}
```

---

### Get All Tax Contributions

- **GET** `/api/v1/tax-contributions`

Query parameters:

| Parameter | Description |
|-----------|------------|
| region | Filter by region ID |
| year | Filter by year |
| incomeBracket | Filter by income group |
| currency | Convert amount (e.g., USD) |
| page | Pagination page |
| limit | Records per page |

Example:

```
/api/v1/tax-contributions?page=1&limit=10
```
or 

```
/api/v1/tax-contributions?page=1&limit=10&region=6995c2703622ab6c85af4f4e&year=2019&incomeBracket=Low&currency=USD
```

Response:

```json
{
    "success": true,
    "total": 1,
    "page": 1,
    "pages": 1,
    "data": [
        {
            "_id": "6997265f8bbd7d4657eef954",
            "payerType": "Individual",
            "incomeBracket": "Low",
            "taxType": "VAT",
            "amount": 8952,
            "year": 2019,
            "region": {
                "_id": "6995c2703622ab6c85af4f4e",
                "regionName": "Central Province"
            },
            "createdAt": "2026-02-19T15:03:59.436Z",
            "updatedAt": "2026-02-19T15:03:59.436Z",
            "__v": 0,
            "originalAmount": 8952,
            "convertedAmount": 28.96,
            "convertedCurrency": "USD"
        }
    ]
}
```
---

### Get Single Tax Contribution

- **GET** `/api/v1/tax-contributions/:id`

---

### Update Tax Contribution (Admin only)

- **PUT** `/api/v1/tax-contributions/:id`

---

### Delete Tax Contribution (Admin only)

- **DELETE** `/api/v1/tax-contributions/:id`

---

### Revenue Summary by Region

- **GET** `/api/v1/tax-contributions/summary/by-region`

Returns total tax revenue grouped by region.

Response:

```json
{
    "success": true,
    "data": [
        {
            "_id": "6995c2953622ab6c85af4f54",
            "totalTax": 1114429,
            "regionName": "Sabaragamuwa Province"
        },
        {
            "_id": "6995c2703622ab6c85af4f4e",
            "totalTax": 9174,
            "regionName": "Central Province"
        }
    ]
}
```

---

## Database Schema (TaxContribution)

```js
{
  payerType: {
    type: String,
    enum: ['Individual', 'Corporate'],
    required: true
  },
  incomeBracket: {
    type: String,
    enum: ['Low', 'Middle', 'High'],
    required: true
  },
  taxType: {
    type: String,
    enum: ['Income', 'VAT', 'Corporate'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  year: {
    type: Number,
    required: true,
    min: 2000
  },
  region: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Region',
    required: true
  }
}
```

Indexes:

- Compound index on `{ region, year }`
- Index on `incomeBracket`

---

## Validation & Business Rules

Validation is implemented using `express-validator`, ObjectId checks, and service-layer validation.

Rules include:

- `payerType` must be either `Individual` or `Corporate`
- `incomeBracket` must be `Low`, `Middle`, or `High`
- `taxType` must be `Income`, `VAT`, or `Corporate`
- `amount` must be a positive number
- `year` must be an integer ≥ 2000
- `region` must be a valid MongoDB ObjectId
- Referenced `region` must exist in the Region collection
- All required fields must be present

---

## Third-Party API

Exchange rate conversion is implemented using:

```
https://open.er-api.com/v6/latest/LKR
```

### Optimization Strategy

- Exchange rates are cached in memory for 1 hour
- Only one API call is made per cache cycle
- Currency conversion is performed locally via multiplication
- No API key is required

---

## Role Access Rules

| Endpoint | Public | Admin |
|----------|--------|--------|
| GET all | Yes | Yes |
| GET single | Yes | Yes |
| GET summary | Yes | Yes |
| POST | No | Yes |
| PUT | No | Yes |
| DELETE | No | Yes |

---

## Pagination

Example response:

```json
{
  "success": true,
  "total": 25,
  "page": 1,
  "pages": 5,
  "data": []
}
```

---

## Validation & Error Handling

Validation and error handling are implemented at multiple layers:

- Route-level validation via `express-validator`
- ObjectId validation for `:id` route parameters
- Service-layer validation for region existence and currency support
- Centralized error middleware for standardized responses

### Error Response Examples

Validation failure:

```json
{
  "success": false,
  "errors": [
    {
      "msg": "Invalid payer type",
      "path": "payerType"
    }
  ]
}
```

Resource not found:

```json
{
  "success": false,
  "message": "Tax contribution not found"
}
```

Status code mapping:

- `400` → Validation errors, invalid ObjectId, unsupported currency
- `401` → Missing or invalid authentication token
- `403` → Unauthorized role access
- `404` → Resource not found
- `500` → Unexpected server error

---

## Testing & Quality Assurance

Integration tests are implemented using:

- `Jest`
- `Supertest`
- `mongodb-memory-server`

Test file location:

```
backend/tests/taxContribution.test.js
```

### Covered Scenarios

- Admin and Public user registration
- JWT authentication enforcement (`401` for missing token)
- Role-based access control (`403` for unauthorized access)
- Successful tax creation (Admin)
- Validation failures (`400` for invalid payload)
- ObjectId format validation (`400`)
- Retrieval of all tax records
- Retrieval of single tax record by ID
- Update operation
- Delete operation
- Post-deletion `404` behavior
- Region dependency validation

Testing ensures:

- Correct HTTP status codes
- Proper RBAC enforcement
- Validation correctness
- Database isolation using in-memory MongoDB
- Full CRUD lifecycle integrity

---

# Member 2 — BudgetAllocations Component

---

## Purpose

The BudgetAllocation component manages government expenditure data across sectors and regions.

It enables transparency in public spending and supports fiscal analysis aligned with SDG 16 – Peace, Justice and Strong Institutions.

This module also integrates third-party inflation data to provide adjusted budget analytics.

---

## Functional Requirements

1. Admin users must be able to create budget allocation records.
2. Admin users must be able to update and delete allocation records.
3. Public and Admin users must be able to view allocation records.
4. Users must be able to filter allocations by
   - Sector
   - Year
   - Region
5. Users must be able to retrieve allocation data with pagination.
6. Users must be able to retrieve aggregated allocation summaries by sector.
7. Users must be able to retrieve inflation-adjusted allocation data.
8. All routes must be protected via JWT authentication.
9. Access must be restricted using role-based authorization.
10. All requests must be validated before processing.
11. All errors must be handled via centralized error middleware.

---

## Endpoints

### Create Budget Allocation (Admin only)

- **POST** `/api/v1/budget-allocations`

```json
{
  "sector": "Health",
  "allocatedAmount": 5000000,
  "targetIncomeGroup": "High",
  "year": 2024,
  "region": "regionId"
}
```

---

### Get All Budget Allocations

- **GET** `/api/v1/budget-allocations`

Query parameters

 Parameter | Description 
----------|-------------
 sector | Filter by sector name 
 year | Filter by year 
 region | Filter by region ID 
 page | Pagination page number 
 limit | Records per page 

Example

```
/api/v1/budget-allocations?year=2024&page=1&limit=5
```

---

### Get Single Budget Allocation

- **GET** `/api/v1/budget-allocations/:id`

---

### Update Budget Allocation (Admin only)

- **PUT** `/api/v1/budget-allocations/:id`

---

### Delete Budget Allocation (Admin only)

- **DELETE** `/api/v1/budget-allocations/:id`

---

### Budget Summary by Sector

- **GET** `/api/v1/budget-allocations/summary/by-sector`

Returns total allocated amount grouped by sector using MongoDB aggregation.

Example response
```json
{
  "success": true,
  "data": [
    { "_id": "Health", "totalAllocated": 8000000 },
    { "_id": "Education", "totalAllocated": 6000000 }
  ]
}
```

---

### Inflation Adjusted Allocations

- **GET** `/api/v1/budget-allocations/adjusted/:year`

Returns allocation values adjusted based on annual inflation rate retrieved from a third-party API.

---

## Database Schema (BudgetAllocation)

```js
  {
    sector: {
      type: String,
      enum: ["Health", "Education", "Welfare", "Infrastructure"],
      required: [true, "Sector is required"],
    },
    allocatedAmount: {
      type: Number,
      required: [true, "Allocated amount is required"],
      min: [0, "Amount can not be negative"],
    },
    targetIncomeGroup: {
      type: String,
      enum: ["Low", "Middle", "High"],
      required: [true, "Target income group is required"],
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
    },
    region: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Region",
      required: [true, "Region is required"],
    },
  }
```

Indexes
- Compound index on { region, year }
- Index on sector

---

## Third-Party API

Inflation rate data is retrieved from

```
https://api.worldbank.org/v2/country/LKA/indicator/FP.CPI.TOTL.ZG?format=json
```

Purpose

- Retrieve annual inflation rate for Sri Lanka.
- Adjust allocated amounts based on inflation percentage.

Adjustment formula

```
adjustedAmount = allocatedAmount * (1 + inflationRate / 100)
```

Optimization strategy

- API called per request for adjusted endpoint.
- No API key required.
- Lightweight JSON response parsing.

---

## Role Access Rules

 Endpoint | Public | Admin 
--------|--------|----------
 GET all | ✅ | ✅ 
 GET single | ✅ | ✅ 
 POST | ❌ | ✅ 
 PUT | ❌ | ✅ 
 DELETE | ❌ | ✅ 
 Summary | ✅ | ✅ 
 Adjusted | ✅ | ✅ 

---

## Validation Rules

Validation implemented using `express-validator`.

Rules include

- sector must not be empty
- allocatedAmount must be a positive number
- year must be ≥ 2000
- region must be a valid MongoDB ObjectId
- Optional fields validated during update operations
- All required fields must be present

---

## Pagination

Example response

```json
{
  "success": true,
  "total": 25,
  "page": 1,
  "pages": 5,
  "data": []
}
```

Benefits

- Improved performance
- Reduced response size
- Scalable data retrieval

---


# Member 3 — SocialPrograms Component

## Purpose

The SocialPrograms component manages government welfare initiatives across sectors and target groups.
It supports transparency on program reach and budget utilization, and adds inequality analysis aligned with **SDG 10 - Reduced Inequalities**.

---

## Functional Requirements

1. Admin users must be able to create social program records.
2. Admin users must be able to update and delete social program records.
3. Public and Admin users must be able to view social program records.
4. Users must be able to retrieve an inequality analysis report by country code.
5. All create, update, and delete routes must be protected via JWT authentication and RBAC.
6. Program payloads must be validated before processing.
7. Region references must be validated against existing Region records.
8. Domain rules must be enforced (year, budget-per-beneficiary, target-group logic).
9. Errors must return standardized HTTP status responses.
10. The component must be integration tested with authentication and role checks.

---

## Endpoints

### Create Social Program (Admin only)

- **POST** `/api/socialprograms`

```json
{
  "programName": "School Meals",
  "sector": "Education",
  "targetGroup": "Low Income",
  "beneficiariesCount": 100,
  "budgetUsed": 50000,
  "year": 2024,
  "region": "regionId"
}
```

---

### Get All Social Programs

- **GET** `/api/socialprograms`

Returns all social programs with populated `region` and `createdBy`.

---

### Get Single Social Program

- **GET** `/api/socialprograms/:id`

---

### Update Social Program (Admin only)

- **PUT** `/api/socialprograms/:id`

---

### Delete Social Program (Admin only)

- **DELETE** `/api/socialprograms/:id`

Returns `204 No Content` on successful deletion.

---

### Inequality Analysis

- **GET** `/api/socialprograms/inequality-analysis/:country`

Example:

```
/api/socialprograms/inequality-analysis/LKA
```

Returns:
- Latest Gini index and year from the World Bank indicator API
- Total program count
- Total budget used
- Total beneficiaries
- Interpreted inequality analysis message
- SDG alignment metadata

---

## Database Schema (SocialProgram)

```js
{
  programName: {
    type: String,
    required: true,
    trim: true
  },
  sector: {
    type: String,
    enum: ['Welfare', 'Education', 'Health', 'Housing', 'Food Assistance'],
    required: true
  },
  targetGroup: {
    type: String,
    enum: ['Low Income', 'Middle Income', 'Rural', 'Urban Poor', 'Disabled'],
    required: true
  },
  beneficiariesCount: {
    type: Number,
    required: true,
    min: 0
  },
  budgetUsed: {
    type: Number,
    required: true,
    min: 0,
    max: 1000000000
  },
  year: {
    type: Number,
    required: true
  },
  region: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Region',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}
```

Model options:
- `timestamps: true`

---

## Validation and Business Rules

Validation is enforced through `express-validator`, ObjectId checks, and service-layer rules.

Rules include:
- `programName` is required, non-empty, max 100 chars
- `sector` must be one of: Welfare, Education, Health, Housing, Food Assistance
- `targetGroup` must be one of: Low Income, Middle Income, Rural, Urban Poor, Disabled
- `beneficiariesCount` must be an integer >= 0
- `budgetUsed` must be a number >= 0
- `year` must be an integer from 1900 up to current year
- `region` must be a valid MongoDB ObjectId
- Referenced `region` must exist in Region collection
- If `targetGroup = Low Income`, `beneficiariesCount` must be > 0
- Budget per beneficiary must not exceed `1,000,000`

---

## Validation & Error Handling

Validation and error handling are implemented at multiple layers:

- Route-level validation via `express-validator` and validation middleware
- ObjectId format validation for `:id` route params
- Service-layer business rule validation (region existence, year, budget-per-beneficiary, target-group logic)
- Controller-level error mapping to HTTP status codes

Current error response shapes:

- Validation failures:

```json
{
  "success": false,
  "errors": [
    {
      "msg": "Program name is required",
      "path": "programName"
    }
  ]
}
```

- Service/controller errors:

```json
{
  "message": "Program not found"
}
```

Status code mapping:
- `400` for validation/business rule failures and invalid ObjectId format
- `404` for missing resources
- `500` for unexpected server errors

---

## Third-Party API

Inequality analytics uses the World Bank indicator endpoint:

```
https://api.worldbank.org/v2/country/{countryCode}/indicator/SI.POV.GINI?format=json
```

Service behavior:
- Fetches latest available non-null Gini value
- Maps response to `{ year, giniIndex }`
- Returns a normalized analysis payload with local SocialPrograms aggregates

---

## Role Access Rules

| Endpoint | Public | Admin |
|----------|--------|--------|
| GET all | Yes | Yes |
| GET single | Yes | Yes |
| GET inequality-analysis | Yes | Yes |
| POST | No | Yes |
| PUT | No | Yes |
| DELETE | No | Yes |

---

## Testing & Quality Assurance

Integration tests are implemented in:

- `backend/tests/socialPrograms.int.test.js`

Covered scenarios:
- Admin and Public registration
- Auth and RBAC enforcement (`401` and `403` cases)
- Create with valid and invalid payloads
- Read all and read by ID
- Invalid ID format handling (`400`)
- Update and delete flows
- Post-delete `404` behavior
- Inequality analysis endpoint response

---

---

# Member 4 — RegionalDevelopmentData Component

---

## Purpose

The RegionalDevelopmentData component manages regional economic and social metrics, enabling the tracking of development progress across different provinces.
It supports the analysis of wealth distribution, poverty, and unemployment to ensure equitable tax distribution aligned with **SDG 10 – Reduced Inequalities**.

---

## Functional Requirements

1. Admin users must be able to create regional development records.
2. Admin users must be able to update and delete regional development records.
3. Public and Admin users must be able to view regional development records.
4. Users must be able to access advanced analytics to calculate a regional Inequality Index.
5. Users must be able to retrieve specific SDG metrics for regions.
6. All routes must be protected via JWT authentication.
7. All admin routes must be protected via Role-Based Access Control (RBAC).
8. All requests must be validated before processing.
9. All errors must be handled via centralized error middleware.
10. The component must be fully unit, integration, and performance tested.

---

## Endpoints

### Create Regional Data (Admin only)

- **POST** `/api/v1/regional-development`

```json
{
  "region": "65fa1b2c1234567890abcdef",
  "year": 2026,
  "averageIncome": 45000,
  "unemploymentRate": 8.1,
  "povertyRate": 8.5
}
```

---

### Get All Regional Data

- **GET** `/api/v1/regional-development`

---

### Get Regional Inequality Index Analytics

- **GET** `/api/v1/regional-development/inequality-index`

Returns a calculated analysis of wealth and development disparities across regions using historical data.

---

### Get Region SDG Metrics

- **GET** `/api/v1/regional-development/sdg-metrics/:id`

---

### Update Regional Data (Admin only)

- **PUT** `/api/v1/regional-development/:id`

---

### Delete Regional Data (Admin only)

- **DELETE** `/api/v1/regional-development/:id`

---

## Database Schema (RegionalDevelopment)

```js
{
  region: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Region',
    required: true
  },
  year: {
    type: Number,
    required: true,
    min: 2000
  },
  averageIncome: {
    type: Number,
    required: true,
    min: 0
  },
  unemploymentRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  povertyRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  }
}
```

Indexes:
- Compound index on `{ region, year }` to prevent duplicate regional entries for the same year.

Optimization strategy:
- Advanced `/inequality-index` calculations are handled using MongoDB aggregation pipelines to minimize data transfer and memory usage on the Node.js server.

---

## Third-Party API

Inequality analytics uses the World Bank indicator endpoint:

```text
[https://api.worldbank.org/v2/country/LKA/indicator/SI.POV.GINI?format=json](https://api.worldbank.org/v2/country/LKA/indicator/SI.POV.GINI?format=json)
```

Service behavior:
- Fetches latest available non-null Gini value for Sri Lanka.
- Maps response to `globalBenchmark` for SDG 10 alignment.
- Implements a safety fallback to cached offline data (27.7) if the API times out, preventing server crashes.
- No API key required.

---

## Role Access Rules

| Endpoint | Public | Admin |
|----------|--------|--------|
| GET all | ✅ | ✅ |
| GET inequality-index | ✅ | ✅ |
| GET sdg-metrics | ✅ | ✅ |
| POST | ❌ | ✅ |
| PUT | ❌ | ✅ |
| DELETE | ❌ | ✅ |

---

## Validation Rules

Validation implemented using `express-validator`.

Rules include:

- `region` must be a valid MongoDB ObjectId
- `year` must be ≥ 2000
- `averageIncome` must be a positive number
- `unemploymentRate` must be between 0 and 100
- `povertyRate` must be between 0 and 100
- All required fields must be present

---

## Pagination

Example response:

```json
{
  "success": true,
  "total": 25,
  "page": 1,
  "pages": 5,
  "data": []
}
```

---

## Testing & Quality Assurance

- **Unit & Integration Testing:** Implemented using `Jest`, `Supertest`, and `mongodb-memory-server`. Achieved 100% pass rate across core controller operations.
- **Performance Testing:** Evaluated using `Artillery.io`. Successfully handled sustained loads of 1,000 requests via 50 concurrent users over 20 seconds, yielding a 0% failure rate and a median response time of 1ms.

---

## Validation & Error Handling

- Request validation middleware
- Centralized error middleware
- Standardized error responses

Example:

```json
{
  "success": false,
  "message": "Invalid region ID format"
}
```

---



## Postman Collection (How to Use)

This repository includes the Postman artifacts the team used to test all component APIs (including JWT-protected routes and role-based access).

### Files

- Collection: `postman/TaxTrail - AF MERN project.postman_collection.json`
- Environment: `postman/TaxTrail Local.postman_environment.json`

### Import into Postman

1. Open Postman.
2. Click **Import**.
3. Import both JSON files:
   - `postman/TaxTrail - AF MERN project.postman_collection.json`
   - `postman/TaxTrail Local.postman_environment.json`
4. In the top-right environment dropdown, select **TaxTrail Local**.

### Configure environment variables

Open **Environments → TaxTrail Local** and set:

- `base_url` = `http://localhost:4000/api`
- `token` = (leave empty; it will be set automatically after login)

Notes:

- Most requests in the collection use `{{base_url}}` (for example `{{base_url}}/v1/regions`).
- A small number of requests (e.g., some under **Regional Development.**) are hard-coded to `http://localhost:4000/...`. If you are not running on `localhost:4000`, update those request URLs in Postman to use `{{base_url}}`.

### How authentication works in the collection

- The collection uses **Bearer Token** auth with `{{token}}`.
- In the **auth component** folder, the **Login** request has a test script that stores the JWT into the environment variable `token`.
- If `token` is missing, some folders log a message in the Postman console (“Please login first.”).

### Suggested flow to run the APIs (recommended order)

Because routes are protected and RBAC is enforced, run requests in this order.

#### 1) Start the backend

```bash
cd backend
npm run dev
```

#### 2) Create users (once)

In Postman:

1. Go to **auth component → /auth/register**.
2. Register at least one **Admin** user and one **Public** user.

Tip: You can duplicate the register request and change the `role` field to create both roles.

#### 3) Login as Admin (to test write operations)

1. Go to **auth component → /auth/login**.
2. Send the request using the Admin credentials.
3. Confirm the environment variable `token` is now set.

At this point, Admin-only endpoints (POST/PUT/DELETE) should work.

#### 4) Create Region(s) first (core dependency)

Many entities reference a Region by MongoDB ObjectId.

1. Go to **regions component (core) → POST /v1/regions**.
2. Create a region.
3. Copy the returned region `_id` and use it in other components’ requests where `region` is required.

If the collection contains example IDs (e.g., `699...`) from another database, replace them with IDs created in your own database.

#### 5) Test each component

- **Tax Contributions**
  - Create (Admin), then GET / filters / summary.
  - Ensure you replace `:id` and `region` values with real IDs from your DB.

- **Budget Allocations**
  - Create allocations (Admin) using a valid `region` ID.
  - Test summary and inflation-adjusted endpoints after you have some data.

- **Social Programs**
  - Create programs (Admin) using a valid `region` ID.
  - Test public GET routes and the inequality-analysis endpoint.

- **Regional Development**
  - Follow the folder’s request sequence (create base region → create regional data → analytics).
  - Prefer using the **auth component** login so `token` is stored into the environment automatically.

#### 6) Login as Public (to verify RBAC)

1. Send **auth component → /auth/login** using the Public user credentials.
2. The environment `token` will be overwritten with the Public user token.
3. Re-run GET endpoints (should succeed) and try an Admin-only endpoint (should return `403 Forbidden`).


