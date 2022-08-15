const express = require('express')
const fs = require('fs');
const mysql = require('mysql')
const router = express.Router();
require('dotenv').config()

//connecting to db
const db = mysql.createPool({
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_database,
    port: process.env.db_port,
    ssl:{ca: fs.readFileSync("./DigiCertGlobalRootCA.crt.pem")}
});


// ---------------------------------- code begins here -------------------------------- //

router.post('/', (req, res) => {
    req.body
    res.send('hello')
})


module.exports = router