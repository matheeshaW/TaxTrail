require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')

const testRoutes = require('./routes/testroutes')
const authRoutes = require('./routes/authRoutes')
const regionRoutes = require('./routes/regionRoutes')
const taxContributionRoutes = require('./routes/taxContributionRoutes')

const protect = require('./middleware/authMiddleware')
const authorize = require('./middleware/roleMiddleware')
const errorHandler = require('./middleware/errorMiddleware')

const app = express()

//middleware
app.use(express.json())
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

//routes
app.use('/api/testroutes', protect, authorize('Admin'), testRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/v1/regions', regionRoutes)
app.use('/api/v1/tax-contributions', taxContributionRoutes)


app.use(errorHandler) //keep at bottom


// connect to db and start server
if(process.env.NODE_ENV !== 'test') {
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        //listen for requests
        app.listen(process.env.PORT, () => {
            console.log('connected to db and listening on port ' + process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })
}



module.exports = app
