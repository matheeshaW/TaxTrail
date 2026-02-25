# TaxTrail (Backend)

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

---

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
8. All routes must be protected via JWT authentication.
9. All requests must be validated before processing.
10. All errors must be handled via centralized error middleware.

---

## Endpoints

### Create Tax Contribution (Admin only)

- **POST** `/api/tax-contributions`

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

- **GET** `/api/tax-contributions`

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
/api/tax-contributions?currency=USD&page=1&limit=5
```

---

### Get Single Tax Contribution

- **GET** `/api/tax-contributions/:id`

---

### Update Tax Contribution (Admin only)

- **PUT** `/api/tax-contributions/:id`

---

### Delete Tax Contribution (Admin only)

- **DELETE** `/api/tax-contributions/:id`

---

### Revenue Summary by Region

- **GET** `/api/tax-contributions/summary/by-region`

Returns total tax revenue grouped by region.

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

## Third-Party API

Exchange rate conversion is implemented using:

```
https://open.er-api.com/v6/latest/LKR
```

Optimization strategy:
- Exchange rates cached in memory for 1 hour
- Single API call per cache cycle
- Local multiplication for conversion
- No API key required

---

## Role Access Rules

| Endpoint | Public | Admin |
|----------|--------|--------|
| GET all | ✅ | ✅ |
| GET single | ✅ | ✅ |
| POST | ❌ | ✅ |
| PUT | ❌ | ✅ |
| DELETE | ❌ | ✅ |
| Summary | ✅ | ✅ |

---

## Validation Rules

Validation implemented using `express-validator`.

Rules include:

- payerType must be either Individual or Corporate
- incomeBracket must be Low, Middle, or High
- taxType must be Income, VAT, or Corporate
- amount must be a positive number
- year must be ≥ 2000
- region must be a valid MongoDB ObjectId
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

# Member 2 — BudgetAllocations Component

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

## Testing and QA

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
