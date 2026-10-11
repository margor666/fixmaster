//server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.js');

//connect DB
connectDB();
const app = express();

//Middleware

app.use(cors());
app.use(express.static('public'));
app.use(express.json()); //To understand json form POST
app.use(express.urlencoded({ extended: false}));

//Base test route

app.get('/api/health', (req, res) => {
    res.status(200).json({status: 'API works fine'});
});
// routes

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);
const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
})