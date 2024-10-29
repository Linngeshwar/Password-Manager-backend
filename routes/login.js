const express = require('express');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../util/connectdb');
const LoginRouter = express.Router();

LoginRouter.post('/',async (req,res)=>{
    const username = req.body.username; 
    const password = req.body.password;
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    const user = result.rows[0];
    const passwordFromDb = user.password;
    bcrypt.compare(password, passwordFromDb, (err, result) => {
        if (result) {
            res.send('Login successful');
        } else {
            res.send('Invalid username or password');
        }
    });
})

module.exports = LoginRouter;