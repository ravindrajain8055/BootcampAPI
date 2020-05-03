const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error')

dotenv.config( { path:'./config/config.env'} );

connectDB();
const app = express();
// routes
const bootcamps = require('./routes/bootcamps');

app.use(express.json());

app.use('/api/bootcamps', bootcamps)
app.use(errorHandler);

const PORT= process.env.PORT || 5000;

app.listen(PORT) 