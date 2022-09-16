const express = require('express')
const fs = require('fs');
const mysql = require('mysql')
const router = express.Router();
require('dotenv').config()

const bcrypt = require('bcrypt');
const saltRounds = 10;

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


//Register User
router.post('/', (req, res) => {
    const first_name  = req.body.first_name
    const last_name = req.body.last_name
    const email = req.body.email
    const username = req.body.username
    const password = req.body.password

    bcrypt.hash(password, saltRounds, (err, hash) => {
        const sqlInsert2 = "INSERT INTO users (user_id, username, first_name, last_name, email, last_update, created) VALUES ((replace(uuid(),'-','')), ?, ?, ?, ?, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());"
        try { db.query(sqlInsert2, [username, hash, first_name, last_name, email], (err, response) => { 
            if (err) { res.send({err: err})} 
            else res.send({message: 'Account Created'}) 
        })}
        catch (err) { console.log(err) }
    })
    
})


module.exports = router