const express = require('express')
const session = require('express-session')
const fs = require('fs');
const app = express()
const mysql = require('mysql')
const cors = require('cors');
require('dotenv').config()
const { v4: uuidv4 } = require('uuid');

require('@google-cloud/debug-agent').start({serviceContext: {enableCanary: true}});

const port = process.env.PORT || 4000

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


//connecting to db
const db = mysql.createPool({
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_database,
    port: process.env.db_port,
    ssl: {ca: fs.readFileSync("./DigiCertGlobalRootCA.crt.pem")}
});

//middleware
app.set("trust proxy", 1);
app.use(cors({
    origin: ['https://queueupnext.com','http://localhost:3000', 'http://10.0.0.158:3000'],
    credentials: true,
    exposedHeaders: ["set-cookie", 'cookie'],
}))
app.use(cookieParser(process.env.cookie_secret))

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(session({
    genid: function(req) {
        return uuidv4() // use UUIDs for session IDs
      },
    resave: false,
    saveUninitialized: true,
    secret: process.env.session_key,
}))



//Routes
const homepage = require('./Pages/Home')
const login = require('./auth/login')
const logout = require('./auth/logout')
const verifyuser = require('./auth/verify')
const createUser = require('./auth/Register')
const createBus = require('./Create/Create')
const addemployee = require('./auth/Roster');
const MyQueues = require('./queue/myqueue');


//Home page
app.use('/', homepage)

//Create or Regulate Users
app.use('/reg', createUser)

//verifying login
app.use('/login', login)
 
//logout
app.use('/logout', logout)

//verify simple and get profile
app.use('/verify', verifyuser)

//verify simple and get profile
app.use('/createque', createBus)

//Adding Employee into they're specific Queue
app.use('/addemployee', addemployee)

//verify simple and get profile
app.use('/MyQueues', MyQueues)

app.listen( port, () => { console.log('Running on port' + port )});
