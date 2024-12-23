const express = require('express');
const cors = require('cors');
const app = express();
const LoginRouter = require('./routes/login');
const VerifyRouter = require('./routes/verify');
const RegisterRouter = require('./routes/register');
const credentialRouter = require('./routes/credential');
const cookieParser = require('cookie-parser');

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/login', LoginRouter);
app.use('/api/verify', VerifyRouter);
app.use('/api/register', RegisterRouter);
app.use('/api/credential', credentialRouter);
app.listen(3001, () => {
  console.log('Server is running on port 3001');
});