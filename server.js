const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db')

dotenv.config( { path:'./config/config.env'} );

connectDB();
// routes
const bootcamps = require('./routes/bootcamps');

const app = express();
app.use(express.json());

app.use('/api/bootcamps', bootcamps)

const PORT= process.env.PORT || 5000;

app.listen(PORT)