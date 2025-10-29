const User = require('../models/userModel.js')
const bcrypt = require('bcrypt')

const signup = async (req,res)=>{

    const {name,email,password,phone} = req.body||{}

    console.log(name,email,password,phone)

}
const login = async (req,res)=>{

}
module.exports={signup,login}