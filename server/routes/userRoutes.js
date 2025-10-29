const express = require('express')

const userRouter = express.Router()

const {signup,login,}=require('../controllers/userController.js')

//profile
//signup
userRouter.post('/signup',signup)
//login
//logout

module.exports = userRouter