# TaxTrail (Backend)

TaxTrail is a web-based public budget transparency system aligned with **SDG 10 – Reduced Inequalities**.

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

## API

### Base URL

```text
http://localhost:4000/api
```

## Architecture

The backend follows a layered architecture:

```text
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

## Tech stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- express-validator
- Axios (Exchange API)
- Postman (API testing)

## Authentication & roles

JWT-based authentication.

- **Admin** → Full CRUD access
- **Public** → Read-only access

All routes are protected.

## Project breakdown (team components)

This project was done by 4 members, splitting the system into 4 major components:

| Member | Real Entity | Real CRUD | Real Third-Party API | Clear Topic Alignment |
| ------ | ----------- | --------- | -------------------- | --------------------- |
| 1 | TaxContributions | ✅ | Exchange Rate | Revenue inequality |
| 2 | BudgetAllocations | ✅ | Inflation API | Spending fairness |
| 3 | SocialPrograms | ✅ | World Bank API | Poverty reduction |
| 4 | RegionalDevelopmentData | ✅ | UN SDG API | Regional disparity |

## Member 1 — TaxContribution component

This backend component manages:

- Tax contributions
- Region-based filtering
- Currency conversion
- Revenue aggregation
- Pagination & caching

### Endpoints

#### Create tax contribution (Admin only)

- **POST** `/api/tax-contributions`

Request body:

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

#### Get all tax contributions (Public & Admin)

- **GET** `/api/tax-contributions`

Query parameters:

| Parameter | Description |
| --------- | ----------- |
| `region` | Filter by region ID |
| `year` | Filter by year |
| `incomeBracket` | Filter by income group |
| `currency` | Convert amount (e.g., USD) |
| `page` | Pagination page number |
| `limit` | Records per page |

Example:

```text
/api/tax-contributions?currency=USD&page=1&limit=5
```

#### Get single tax contribution

- **GET** `/api/tax-contributions/:id`

#### Update tax contribution (Admin only)

- **PUT** `/api/tax-contributions/:id`

#### Delete tax contribution (Admin only)

- **DELETE** `/api/tax-contributions/:id`

#### Revenue summary by region

- **GET** `/api/tax-contributions/summary/by-region`

Returns aggregated total tax per region.

## Third-party API integration

Currency conversion is implemented using:

```text
https://open.er-api.com/v6/latest/LKR
```

Optimization:

- Exchange rates are cached in memory for 1 hour
- Only one API call per cache cycle
- Conversion is calculated locally

## Validation & error handling

- Request validation via `express-validator`
- Centralized error middleware
- Standardized error response format

Example error response:

```json
{
  "success": false,
  "message": "Invalid region ID format"
}
```

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