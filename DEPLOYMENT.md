# TaxTrail Deployment Report

## 1. Introduction

TaxTrail is a web-based public budget transparency system developed under **SDG 10 – Reduced Inequalities**.

The system enables users to explore government revenue and expenditure data, analyze inequality patterns, and improve transparency through data-driven insights.

This report outlines the deployment architecture, tools used, configuration steps, and challenges faced during deployment.

---

## 2. Deployment Architecture

The application follows a **client-server architecture**:

- **Frontend**: React (Vite) application deployed on Vercel
- **Backend**: Node.js + Express API deployed on Railway
- **Database**: MongoDB Atlas (cloud database)

### Architecture Flow:

User (Browser)
→ Frontend (Vercel)
→ Backend API (Railway)
→ MongoDB Atlas

---

## 3. Technologies Used

### Frontend

- React (Vite)
- Tailwind CSS
- Axios
- Vercel (Deployment)

### Backend

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Railway (Deployment)

### Database

- MongoDB Atlas (Cloud-hosted NoSQL database)

---

## 4. Backend Deployment (Railway)

### Platform

Railway was used to deploy the backend service due to its ease of integration with Node.js applications and free-tier availability.

### Steps

1. Connected GitHub repository to Railway
2. Selected backend directory as root
3. Configured environment variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
FRONTEND_URL=https://tax-trail.vercel.app
```

4. Ensured server uses dynamic port:

```js
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => { ... });
```

5. Generated public domain with port `8080`

### Backend URL

```
https://taxtrail-production.up.railway.app
```

---

## 5. Frontend Deployment (Vercel)

### Platform

Vercel was used to deploy the frontend due to its seamless support for React (Vite) applications.

### Steps

1. Imported GitHub repository into Vercel
2. Selected `frontend` folder as root directory
3. Configured environment variable:

```env
VITE_API_BASE_URL=https://taxtrail-production.up.railway.app/api
```

4. Deployed application

### Frontend URL

```
https://tax-trail.vercel.app
```

---

## 6. API Integration

The frontend communicates with the backend using Axios.

```js
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
```

All requests are routed through the deployed backend API.

---

## 7. CORS Configuration

To allow secure communication between frontend and backend:

```js
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL,
];
```

This ensures:

- Local development works
- Production frontend can access backend

---

## 8. Features Verified After Deployment

The following features were successfully tested in production:

- User Registration and Login (JWT Authentication)
- Role-Based Access Control (Admin/Public)
- Tax Contribution CRUD operations
- Filtering (Region, Year, Income Bracket)
- Currency Conversion (Exchange Rate API)
- Pagination
- Revenue Summary Chart (Recharts)
- Error Handling and Validation
- Responsive UI with Dashboard Layout

---

## 9. Challenges Faced

### 1. Backend Not Responding (502 Error)

- Cause: Incorrect port mapping in Railway
- Solution: Set correct service port (`8080`)

### 2. MongoDB Connection Failure

- Cause: Incorrect connection string
- Solution: Updated MongoDB Atlas URI and enabled IP access

### 3. API Calls Failing in Production

- Cause: Frontend using localhost instead of deployed backend
- Solution: Configured environment variables in Vercel

### 4. CORS Errors

- Cause: Frontend domain not allowed
- Solution: Added `FRONTEND_URL` to backend CORS configuration

---

## 10. Security Considerations

- JWT authentication for protected routes
- Role-based access control
- Environment variables used for sensitive data
- No hardcoded credentials in codebase

---

## 11. Conclusion

The TaxTrail system was successfully deployed as a fully functional cloud-based application.

The deployment demonstrates:

- Full-stack integration
- Cloud deployment knowledge
- Secure API communication
- Real-world system architecture

This implementation aligns with SDG 10 by providing transparent and accessible financial data to support reduced inequalities.

---

## 12. Live System Links

- Frontend: https://tax-trail.vercel.app
- Backend: https://taxtrail-production.up.railway.app

---
