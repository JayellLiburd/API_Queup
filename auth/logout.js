const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors');
const router = express.Router();
var fs = require('fs'); 

const bcrypt = require('bcrypt');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

//connecting to db
const db = mysql.createPool({
    host: 'queup.mysql.database.azure.com',
    user: 'jayellliburd',
    password: 'Ishmael01',
    database: 'queup',
    port:3306,
 
});

app.use(cors({
    origin: true,
    credentials: true,
    exposedHeaders: ["*"]
}))
app.use(cookieParser())

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));


// ---------------------------------- code begins here -------------------------------- //


router.get('/', (req, res) => {
    
    req.cookies
    res
        .clearCookie('ss')
        .clearCookie('rs')
        .send('cookies cleared')
    
})


module.exports = router