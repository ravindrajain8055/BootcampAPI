const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error')
const fileupload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const path = require('path')

dotenv.config( { path:'./config/config.env'} );

connectDB();
const app = express();
// routes
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth')
const users = require('./routes/users')
// Body parser
app.use(express.json());

app.use(fileupload());
app.use(cookieParser());
// Set static folder
app.use(express.static(path.join(__dirname,'public')));

app.use('/api/bootcamps', bootcamps)
app.use('/api/courses', courses)
app.use('/api/auth', auth)
app.use('/api/users',users)

app.use(errorHandler);

const PORT= process.env.PORT || 5000;

app.listen(PORT) 