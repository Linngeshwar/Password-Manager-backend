const express = require('express');
require('dotenv').config();
const {encrypt,decrypt} = require('../util/encryption');
const passwordGen = require('../util/passwordGen');
const pool = require('../util/connectdb');
const jwt = require('jsonwebtoken');
const VerifyRouter = require('./verify');
const credentialRouter = express.Router();

credentialRouter.post('/fetchall',VerifyRouter,async (req,res) => {
    try{
        const token = req.cookies.token;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const username = decodedToken.username;
        
        const query = {
            text: 'SELECT * FROM credentials WHERE username = $1',
            values: [username],
        }
        const result = await pool.query(query);
        res.json(result.rows);
    }catch(err){
        console.log(err);
    }
})

credentialRouter.post('/fetchone',VerifyRouter,async (req,res) => {
    try{
        const token = req.cookies.token;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const username = decodedToken.username;

        const query = {
            text: 'SELECT * FROM credentials WHERE username = $1 AND website = $2',
            values: [username,req.body.website],
        }
        const result = await pool.query(query);
        res.json(result.rows);
    }catch(err){
        console.log(err);
    }
});

credentialRouter.post('/add',VerifyRouter,async (req,res) => {
    try{
        const token = req.cookies.token;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const username = decodedToken.username;

        const website = req.body.website;
        const credentialUsername = req.body.credentialUsername;
        const password = req.body.password;
        const encryptedPassword = encrypt(password);

        const query = {
            text: 'INSERT INTO credentials (username,credentialUsername,encryptedPassword,website) VALUES($1,$2,$3,$4)',
            values: [username,credentialUsername,encryptedPassword,website],
        }
        await pool.query(query);
        res.json({
            error:false,
            message:'Credential added'
        });
    }catch(err){
        console.log(err);
    }
});

credentialRouter.post('/delete',VerifyRouter,async (req,res) => {
    try{
        const token = req.cookies.token;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const username = decodedToken.username;

        const uniqueID = req.body.uniqueID;

        const query = {
            text: 'DELETE FROM credentials WHERE username = $1 AND uniqueID = $2',
            values: [username,uniqueID],
        }
        
        await pool.query(query);
        res.json({
            error:false,
            message:'Credential deleted'
        });
    }catch(err){
        console.log(err);
    }
});

credentialRouter.post('/updatepassword',VerifyRouter,async (req,res) => {
    try{
        const token = req.cookies.token;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const username = decodedToken.username;

        const uniqueID = req.body.uniqueID;
        const password = req.body.password;
        const encryptedPassword = encrypt(password);

        const query = {
            text: 'UPDATE credentials SET encryptedPassword = $1 WHERE username = $2 AND uniqueID = $3',
            values: [encryptedPassword,username,uniqueID],
        }
        await pool.query(query);
        res.json({
            error:false,
            message:'Credential updated'
        });
    }catch(err){
        console.log(err);
    }
});

credentialRouter.post('/updateusername',VerifyRouter,async (req,res) => {
    try{
        const token = req.cookies.token;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const username = decodedToken.username;

        const uniqueID = req.body.uniqueID;
        const credentialUsername = req.body.credentialUsername;

        const query = {
            text: 'UPDATE credentials SET credentialUsername = $1 WHERE username = $2 AND uniqueID = $3',
            values: [credentialUsername,username,uniqueID],
        }
        await pool.query(query);
        res.json({
            error:false,
            message:'Credential updated'
        });
    }catch(err){
        console.log(err);
    }
});

credentialRouter.post('/encrypt',VerifyRouter, (req, res) => {
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

credentialRouter.post('/decrypt',VerifyRouter,async (req, res) => {
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

credentialRouter.get('/generate', (req, res) => {
    const password = passwordGen(req.query.length);
    res.json({
        "Generated":password,
    });
});

module.exports = credentialRouter;