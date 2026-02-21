require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const authRoutes = require('./routes/authRoutes')
const socialProgramRoutes = require('./routes/socialProgramRoutes')
const inequalityRoutes = require('./routes/inequalityRoutes')



const protect = require('./middleware/authMiddleware')

// Register models for populate
require('./models/regionModel')

const app = express()

//middleware
app.use(express.json())
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

//routes

app.use('/api/auth', authRoutes)
app.use('/api/socialprograms', socialProgramRoutes)
app.use('/api/inequality', inequalityRoutes)



// connect to db and start server
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





