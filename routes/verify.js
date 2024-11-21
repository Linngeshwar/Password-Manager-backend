const express = require('express');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const VerifyRouter = express.Router();
VerifyRouter.get('/', (req, res) => {
    try{
        const headers = req.headers;
        const cookies = req.cookies;
        const token = cookies.token;
        const refreshToken = cookies.refreshToken;
        if(!token && !refreshToken){
            return res.json({
                auth:false,
                error:true,
                message:'No token provided'
            });
        }
        jwt.verify(token,process.env.JWT_SECRET_KEY,(err,decoded)=>{
            if(err){
                jwt.verify(refreshToken,process.env.JWT_SECRET_KEY,(err,decoded)=>{
                    if(err){
                        return res.json({
                            auth:false,
                            error:true,
                            message:'Failed to authenticate token'
                        });
                    }
                    const username = decoded.username;
                    const newToken = jwt.sign({username:username},process.env.JWT_SECRET_KEY,{expiresIn:'10s'});
                    res.cookie('token',newToken,{
                        httpOnly:true,
                        sameSite:'lax',
                        secure:false,
                        path:'/',
                    }).json({
                        auth:false,
                        error:true,
                        message:'Token refreshed'
                    });
                }
            );
            }else{
                res.json({
                    auth:true,
                    error:false,
                    message:'Token is valid'
                });
            }
        });
    
        // if (!token) {
        //     return res.json({ 
        //         auth: false,
        //         message: 'No token provided'
        //     });
        // }
        // jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        //     if (err) {
        //         res.json({ 
        //             auth: false,
        //             message: 'Failed to authenticate token'
        //          });
        //     } else {
        //         res.json({ 
        //             auth: true,
        //             message: 'Token is valid'
        //         });
        //     }
        // });
    }catch(err){
        console.error(err);
        res.json({auth:false});
    }
});

module.exports = VerifyRouter;
