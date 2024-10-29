const express = require('express');
const cors = require('cors');
const app = express();
const LoginRouter = require('./routes/login');

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));
app.use(express.json());
app.use('/api/login', LoginRouter);
app.listen(3001, () => {
  console.log('Server is running on port 3001');
});