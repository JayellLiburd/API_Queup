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
    origin: 'https://queueupnext.com',
    credentials: true,
    exposedHeaders: ["set-cookie"],
}))
app.use(cookieParser())

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(session({
    genid: function(req) {
        return uuidv4() // use UUIDs for session IDs
      },
    resave: false,
    saveUninitialized: true,
    secret: process.env.session_key 
}))



//Routes
const homepage = require('./Pages/Home')
const login = require('./auth/login')
const logout = require('./auth/logout')
const cookies = require('./auth/logincookies');
const verifyuser = require('./auth/verify')
const createUser = require('./auth/Register')
const createBus = require('./Create/Create')


//Home page
app.use('/', homepage)

//Create User
app.use('/reg', createUser)

//verifying login
app.use('/login', login)

//logout
app.use('/logout', logout)

//login cookies
app.use('/set', cookies)

//verify simple and get profile
app.use('/verify', verifyuser)

//verify simple and get profile
app.use('/Create', createBus)

app.post('/auth/:id/profile', (req, res) => {

    user_id = req.params.id
    const {first_name, last_name, email, address, phone} = req.body

    finduser = "select * from users where user_id = ?;"
    db.query(finduser, user_id,
        (err, result) => {

            if (err) { res.send({err: err}) }

            if (result.length > 0) {
                updates = "UPDATE users SET first_name = ?, last_name = ?, email = ?, address_1 = ?, phone = ?, last_update = CURRENT_TIMESTAMP() WHERE (user_id = ?);"
                db.query(updates, [first_name, last_name, email, address, phone, user_id])
                res.send('updated')
            }
    })
})


app.listen( port, () => { console.log('Running on port' + port )});
