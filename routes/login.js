const express = require('express');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const Middleware = require('../util/auth');
const LoginRouter = express.Router();

LoginRouter.use(cookieParser());
LoginRouter.post('/',Middleware,async (req,res)=>{
    const username = req.body.username;
    const token = jwt.sign({username:username},process.env.SECRET_KEY);
    res.cookie('token',token,{httpOnly:true});
})

module.exports = LoginRouter;