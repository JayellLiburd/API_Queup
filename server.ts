import express from 'express';
import session from 'express-session';
import cors from 'cors';
const app = express();
require('dotenv').config()
import { v4 as uuidv4 } from 'uuid';

// require('@google-cloud/debug-agent').start({serviceContext: {enableCanary: true}});

//middleware
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

app.use(cors({
  origin: ['https://queueupnext.com', 'http://localhost:3000', 'http://' + process.env.cookie_domains + ':3000'],
  credentials: true,
  exposedHeaders: ["set-cookie", 'cookie'],
}));
app.use(cookieParser(process.env.cookie_secret));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
  genid: function (req: express.Request) {
    return uuidv4() // use UUIDs for session IDs
  },
  resave: false,
  saveUninitialized: true,
  secret: process.env.session_key || 'Please set a session key',
}));

import { initializeApp } from 'firebase/app';
const config = {
  apiKey: "AIzaSyDAICINYSy_X7b0CMDNJkRkJxeWE08x58w",
  authDomain: "queup-358912.firebaseapp.com",
  databaseURL: "https://queup-358912-default-rtdb.firebaseio.com/",
  projectId: "queup-358912",
  storageBucket: "queup-358912.appspot.com",
  messagingSenderId: "606581966610",
  appId: "1:606581966610:web:6c532778a4dc45703d95cb",
  measurementId: "G-NTK8LEJN8N"
}
initializeApp(config);

// Routes
const homepage = require('./Pages/Home')
const login = require('./auth/AuthSession');
const verifyuser = require('./auth/verify');
const createUser = require('./auth/Register');
const createBus = require('./Create/Create');
const addemployee = require('./auth/Roster');
const MyQueues = require('./queue/MyQue');
const Content = require('./content/Filter');
const Queup = require('./queue/queup');

// Home page
app.use('/', homepage);

//verifying login
app.use('/auth', login);

// Create or Regulate Users
app.use('/reg', createUser);

// verify simple and get profile
app.use('/verify', verifyuser);

// verify simple and get profile
app.use('/createque', createBus);

// Adding Employee into they're specific Queue
app.use('/addemployee', addemployee);

// List Of Created Queues
app.use('/management', MyQueues);

// Content for the Queues
app.use('/api/gallery', Content);

// Queup Next!
app.use('/queup', Queup);

const port = process.env.PORT || 4000;
app.listen(port, () => { console.log('Running on port' + port) });