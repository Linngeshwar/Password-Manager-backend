const express = require('express');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const Middleware = require('../util/auth');
const LoginRouter = express.Router();

LoginRouter.use(cookieParser());
LoginRouter.post('/',Middleware,async (req,res)=>{
    const username = req.body.username;
    const token = jwt.sign({username:username},process.env.JWT_SECRET_KEY,{expiresIn:'1h'});
    const refreshToken = jwt.sign({username:username},process.env.JWT_SECRET_KEY,{expiresIn:'7d'});
    // res.send(token);
    res.cookie('token',token,{
        httpOnly:true,
        sameSite:'lax',
        secure:false, 
        path:'/',
    }).cookie('refreshToken',refreshToken,{
        httpOnly:true,
        sameSite:'lax',
        secure:false,
        path:'/',
    }).json({
        error:false,
        auth:true,
        message:'User authenticated'
    });
})

module.exports = LoginRouter;