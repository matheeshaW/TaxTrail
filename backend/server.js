require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')

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
app.use('/api/inequality', inequalityRoutes)
app.use('/api/v1/budget-allocations', budgetAllocationRoutes)
app.use('/api/v1/regional-development', regionalDevelopmentRoutes)

app.use(errorHandler) // keep at bottom


// connect to db and start server
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      //listen for requests
      app.listen(process.env.PORT, () => {
        console.log(
          "connected to db and listening on port " + process.env.PORT,
        );
      });
    })
    .catch((error) => {
      console.log(error);
    });
}
module.exports = app


