const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const generateToken = (userId) => {
    return jwt.sign({id: userId},process.env.JWT_SECRET, {expiresIn: '1d'})
}

const sanitizeUser = (user) => {
    const safeUser = user.toObject()
    delete safeUser.password
    return safeUser
}

const registerUser = async (userData) => {
    const {name, email, password} = userData

    const userExists = await User.findOne({ email })
    if(userExists) {
        throw new Error("user already exists")
    }


    const hashedPassword = await bcrypt.hash(password, 10)


    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    const token = generateToken(user._id)

    return {user: sanitizeUser(user), token}

}


const loginUser = async (email, password) => {

    const user = await User.findOne({ email})
    if(!user){
        throw new Error("invalid credentials")
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error("invalid credentials")
    }

    const token = generateToken(user._id)

    return {user: sanitizeUser(user), token}
}

module.exports = {
    registerUser,
    loginUser
}

