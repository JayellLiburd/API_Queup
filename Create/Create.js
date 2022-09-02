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
    const form = req.body
    const sqlInsert = "INSERT INTO businesses (user_id, line_id, bus_name, address_2, address_1, city, zip_code, state, country, small, rate, category, raffle, promo, last_update, created) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());"
    console.log(form)
    db.query(sqlInsert, '', form[1], form[2], form[3], form[4], form[5], form[6], form[7], form[8], form[9], form[10], form[11], form[12], form[13], 
        (err, response) => {
        res.send(response)
    })
    
})


module.exports = router