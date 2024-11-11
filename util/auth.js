const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../util/connectdb');

const Middleware = express.Router();

Middleware.use(async (req, res, next) => {
    const username = req.body.username; 
    const password = req.body.password;
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    console.log(req);
    const user = result.rows[0];
    if (!user) {
        return res.json({
            error: true,
            message: 'Invalid username'
        });
    }
    const passwordFromDb = user.password;
    bcrypt.compare(password, passwordFromDb, (err, result) => {
        if (result) {
            return next();
        } else {
            res.json({
                error: true,
                message: 'Invalid password'
            });
        }
    });
})

module.exports = Middleware;