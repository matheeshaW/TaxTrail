require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const authRoutes = require('./routes/authRoutes')
const regionRoutes = require('./routes/regionRoutes')
const taxContributionRoutes = require('./routes/taxContributionRoutes')
const socialProgramRoutes = require('./routes/socialProgramRoutes')
const inequalityRoutes = require('./routes/inequalityRoutes')
const budgetAllocationRoutes = require('./routes/budgetAllocationRoutes')
const regionalDevelopmentRoutes = require('./routes/regionDevRoutes')

const errorHandler = require('./middleware/errorMiddleware')

// Register models for populate
require('./models/regionModel')

const app = express()

// allow frontend dev origins
const allowedOrigins = [
  'http://localhost:5173',
   'http://127.0.0.1:5173',
   process.env.FRONTEND_URL
  ]

app.use(
  cors({
    origin(origin, callback) {
      // allow non-browser tools (Postman/curl) where origin may be undefined
      if (!origin || allowedOrigins.includes(origin)){

       return callback(null, true)
      }
      return callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
)

// middleware
app.use(express.json())
app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

// routes
app.use('/api/auth', authRoutes)
app.use('/api/v1/regions', regionRoutes)
app.use('/api/v1/tax-contributions', taxContributionRoutes)
app.use('/api/socialprograms', socialProgramRoutes)
app.use('/api/v1/inequality', inequalityRoutes)
app.use('/api/v1/budget-allocations', budgetAllocationRoutes)
app.use('/api/v1/regional-development', regionalDevelopmentRoutes)

app.use(errorHandler) // keep at bottom

const PORT = process.env.PORT || 4000;


// connect to db and start server
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      //listen for requests
      app.listen(PORT, "0.0.0.0", () => {
        console.log(
          "connected to db and listening on port " + PORT,
        );
      });
    })
    .catch((error) => {
      console.log(error);
    });
}
module.exports = app


