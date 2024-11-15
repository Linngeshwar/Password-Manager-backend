const express = require('express');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const VerifyRouter = express.Router();
VerifyRouter.get('/', (req, res) => {
    try{
        const headers = req.headers;
        const cookies = req.cookies;
        const token = cookies.token;
        if (!token) {
            return res.json({ 
                auth: false,
                message: 'No token provided'
            });
        }
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                res.json({ 
                    auth: false,
                    message: 'Failed to authenticate token'
                 });
            } else {
                res.json({ 
                    auth: true,
                    message: 'Token is valid'
                });
            }
        });
    }catch(err){
        console.error(err);
        res.json({auth:false});
    }
});

module.exports = VerifyRouter;
