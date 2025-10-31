const express = require('express')


const userRouter = express.Router()

const { signup, login, profile, checkUser ,checkAdmin,updateUser,updateUserById,deleteUser,deleteUserById, logout,getAllUsers} = require('../controllers/userController.js')
const validateUser = require('../middlewares/userMiddlewares.js')
const authUser = require('../middlewares/authUser.js')
const authAdmin = require('../middlewares/authAdmin.js')


// Common
//signup
userRouter.post('/signup', validateUser, signup)
//login
userRouter.post('/login', login)
//profile
userRouter.get('/profile', authUser, profile)
//check user
userRouter.get('/check-user', authUser, checkUser)
//update  - user
userRouter.put('/update', authUser, updateUser)
//delete account
userRouter.delete('/delete', authUser, deleteUser)
//logout
userRouter.get('/logout',authUser,logout)


//Admin
//check Admin
userRouter.get('/check-admin', authUser, checkAdmin)
//delete user by admin
userRouter.delete('/deleteById/:id', authAdmin, deleteUserById)
//update - admin
userRouter.put('/updateById/:id', authAdmin, updateUserById)
//get all users -admin
userRouter.get('/all', authAdmin, getAllUsers);


module.exports = userRouter