const express = require('express');
const LoginRouter = express.Router();

LoginRouter.post('/',(req,res)=>{
    const username = req.body.username; 
    const password = req.body.password;
    const user = {
        username: username,
        password: password
    }
    res.json(user);
})

module.exports = LoginRouter;