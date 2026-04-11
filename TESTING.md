# TaxTrail Testing Report & Instructions

Complete guide for running unit tests and understanding the testing environment for TaxTrail backend.

---

## How to Run Unit Tests

### 1) Run All Unit Tests

```bash
cd backend
npm test -- *.service.test.js
```

### 2) Run Specific Unit Test

```bash
npm test -- budgetAllocation.service.test.js
```

or

```bash
npm test -- taxContribution.service.test.js
npm test -- socialProgram.service.test.js
```

### 3) Watch Mode

```bash
npm run test:watch -- *.service.test.js
```

### 4) Generate Coverage Report

```bash
npm test -- *.service.test.js --coverage
```

---

## How to Run Integration Tests

### Run All Integration Tests

```bash
cd backend
npm test -- --testPathPattern="(budgetAllocation|taxContribution|socialPrograms.*|regionDev)\.test\.js$"
```

or simply:

```bash
npm test
```

### 2) Run Specific Integration Test

```bash
npm test -- budgetAllocation.test.js
npm test -- taxContribution.test.js
npm test -- socialPrograms.int.test.js
npm test -- regionDev.test.js
```

### 3) Watch Mode

```bash
npm run test:watch
```

### 4) Generate Coverage Report

```bash
npm test -- --coverage
```

---

## Performance Testing (Artillery)

The repository includes an Artillery config file at:

```
backend/load-test.yaml
```

This load test now covers mixed traffic for all major components:

- Tax Contributions (list + summary)
- Budget Allocations (list + summary + inflation-adjusted)
- Social Programs (list + inequality analysis)
- Regional Development (list + inequality index)
- Regions core endpoint

It runs in multiple phases (warm-up, moderate, sustained, stress spike) to evaluate performance under different loads.

### Prerequisites

1. Start backend server:

```bash
cd backend
npm run dev
```

2. Ensure an Admin user exists (default values used by the load test):

```json
{
  "email": "admin@email.com",
  "password": "123456"
}
```

If your credentials are different, override variables when running Artillery.

### Run the load test

From `backend` directory:

```bash
npx artillery run load-test.yaml
```

### Run with custom login variables

```bash
npx artillery run load-test.yaml --variables '{"adminEmail":"your_admin_email","adminPassword":"your_admin_password","testYear":"2024"}'
```

### Save JSON result + generate HTML report

```bash
npx artillery run load-test.yaml --output load-test-result.json
npx artillery report load-test-result.json
```

This generates an HTML report file you can open in a browser for latency/throughput/error metrics.

---

## Frontend Cypress Testing (E2E)

The frontend uses Cypress for end-to-end testing. This is a lightweight setup intended for component-by-component or module-by-module flows, so each team member can add a single spec file for their own area.

### Current TaxTrail flow test

The main example test lives at:

```
frontend/cypress/e2e/TaxContributionFlowTest.cy.js
```

It covers the Tax Contribution module flow:

1. Log in as Admin.
2. Navigate to Tax Contributions.
3. Open the create form.
4. Fill the form and create a record.
5. Wait for the table to refresh.
6. Delete the newly created record.

### Current Budget Allocation flow test

The Budget Allocation module test lives at:

```
frontend/cypress/e2e/BudgetAllocationFlowTest.cy.js
```

It covers the Budget Allocation module flow:

1. Log in as Admin.
2. Navigate to Budget Allocation.
3. Open the create form.
4. Fill the form with sector, income group, amount, year, and region.
5. Wait for the table to refresh.
6. Verify the newly created record appears in the table.
7. Delete the created record.
8. Verify the record is removed from the table.

### Prerequisites

1. Install frontend dependencies:

```bash
cd frontend
npm install
```

2. Make sure Cypress is installed as a dev dependency in the frontend package.

3. Provide Admin credentials for Cypress in `frontend/cypress.env.json`:

```json
{
  "adminEmail": "your-admin-email@example.com",
  "adminPassword": "your-admin-password"
}
```

### Run the Cypress test

Start the backend and frontend in separate terminals:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

Run the Cypress spec from the frontend folder:

```bash
npm run cy:run
```

Or open the Cypress runner interactively:

```bash
npm run cy:open
```

---

## Testing Environment Configuration

### Jest Configuration

File: `backend/jest.config.js`

```bash
module.exports = {
  testEnvironment: 'node',
  testTimeout: 20000
}
```

What This Does:

| Setting           | Value           | Purpose                                 |
| ----------------- | --------------- | --------------------------------------- |
| testEnvironment   | 'node'          | Tests run in Node.js (not browser)      |
| testTimeout       | 20000           | 20 seconds per test                     |
| testMatch         | Auto-detected   | Finds \*.test.js files in tests/ folder |
| detectOpenHandles | true (npm test) | Warns if resources not cleaned up       |

### npm Test Scripts

File: `package.json`

```bash
{
  "scripts": {
    "test": "jest --detectOpenHandles",
    "test:watch": "jest --watchAll --detectOpenHandles",
    "start": "node server.js",
    "dev": "nodemon server.js",
    "env:gen": "cp .env .env.example",
    "env:init": "cp .env.example .env",
    "test:perf:regiondev": "npx artillery run performance_test/load-test-regiondev.yaml"
  }
}
```

Script Details:

- **npm test** → Run all tests once with handle detection
- **npm test:watch** → Watch mode, auto-rerun on file changes
- **npm test:perf:regiondev** → Performance/load testing

### Backend .env Configuration

Create `.env`

```bash
# Database
MONGO_URI=your_mongodb_atlas_connection_string

# JWT
JWT_SECRET=your_secret_key

# Server
PORT=4000
NODE_ENV=development
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

---
