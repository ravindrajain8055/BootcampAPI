const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error')
const fileupload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const path = require('path')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const cors =require('cors')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')

dotenv.config( { path:'./config/config.env'} );

connectDB();
const app = express();
// routes
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth')
const users = require('./routes/users')
const reviews = require('./routes/reviews')

// Body parser
app.use(express.json());

app.use(fileupload());
// !!!!!!!!! security
app.use(mongoSanitize());
// set security headers
app.use(helmet());

app.use(xss())
const limiter = rateLimit({
    windowMs:10*60*1000,
    max:1000
})

app.use(limiter);
// http parameter pollution attacks
app.use(hpp())
app.use(cors())
// !!!!!!!!!!!!!!!!!!!

app.use(cookieParser());
// Set static folder
app.use(express.static(path.join(__dirname,'public')));

app.use('/api/bootcamps', bootcamps)
app.use('/api/courses', courses)
app.use('/api/auth', auth)
app.use('/api/users',users)
app.use('/api/reviews',reviews)


app.use(errorHandler);

const PORT= process.env.PORT || 5000;

app.listen(PORT) 