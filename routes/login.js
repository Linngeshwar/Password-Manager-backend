const express = require('express');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const Middleware = require('../util/auth');
const LoginRouter = express.Router();

LoginRouter.use(cookieParser());
LoginRouter.post('/',Middleware,async (req,res)=>{
    console.log(req.body);
    const username = req.body.username;
    const token = jwt.sign({username:username},process.env.SECRET_KEY);
    // res.send(token);
    res.cookie('token',token,{
        httpOnly:true,
        sameSite:'lax',
        secure:false, 
        path:'/',
    }).send("Logged in successfully");
    console.log("Set cookie:",res.get('Set-Cookie'));
})

module.exports = LoginRouter;