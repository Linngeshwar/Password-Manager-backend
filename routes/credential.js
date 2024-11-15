const express = require('express');
require('dotenv').config();
const {encrypt,decrypt} = require('../util/encryption');
const pool = require('../util/connectdb');
const jwt = require('jsonwebtoken');
const credentialRouter = express.Router();

credentialRouter.post('/encrypt', (req, res) => {
    const password = req.body.password;
    const encryptedPassword = encrypt(password);

    try{
        const token = req.cookies.token;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const username = decodedToken.username;
        
        const website = req.body.website;
        const credentialUsername = req.body.credentialUsername;

        const query = {
        text: 'INSERT INTO credentials (username,credentialUsername,encryptedPassword,website) VALUES ($1,$2,$3,$4)',
        values: [username,credentialUsername,encryptedPassword,website],
        }
        
        pool.query(query);
    
    }catch(err){
        console.log(err);
    }
    res.json({
        "Encrypted":encryptedPassword,
    });
});

credentialRouter.post('/decrypt',async (req, res) => {
    const token = req.cookies.token;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const username = decodedToken.username;

    const website = req.body.website;
    const credentialUsername = req.body.credentialUsername;

    const query = {
        text: 'SELECT * FROM credentials WHERE username = $1 AND credentialUsername = $2 AND website = $3',
        values: [username,credentialUsername,website],
    }
    const result = await pool.query(query);
    const encryptedPassword = result.rows[0].encryptedpassword;
    const decryptedPassword = decrypt(encryptedPassword);
    res.json({
        "Decrypted":decryptedPassword
    });
});

module.exports = credentialRouter;