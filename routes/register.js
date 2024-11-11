require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../util/connectdb');
const RegisterRouter = express.Router();

RegisterRouter.post('/', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    const user = result.rows[0];
    if (user) {
        return res.json(
            {
                error: true,
                message: 'Username already exists'
            }
        );
    }
    await pool.query("INSERT INTO users (username,password,email) VALUES ($1,$2,$3)", [username, hashedPassword,email]);
    res.json({
        error: false,
        message: 'User created'
    });
})

module.exports = RegisterRouter;