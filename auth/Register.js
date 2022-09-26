const express = require('express')
const fs = require('fs');
const mysql = require('mysql')
const router = express.Router();
require('dotenv').config()

const bcrypt = require('bcrypt');
const saltRounds = 10;
const { verify } = require('jsonwebtoken')

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
        const sqlInsert2 = "INSERT INTO users (user_id, username, password, first_name, last_name, email, last_update, created) VALUES ((replace(uuid(),'-','')), ?, ?, ?, ?, ?, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());"
        try { db.query(sqlInsert2, [username, hash, first_name, last_name, email], (err, response) => { 
            if (err) { res.send({err: err})} 
            else res.send({message: 'Account Created'}) 
        })}
        catch (err) { console.log(err) }
    })
    
})

router.post('/profile', (req, res) => {

    if (!req.signedCookies._ss) {res.send({ message: 'No Auth' }); return}

    try {var user = verify(req.signedCookies._ss, process.env.cookie_secret)} catch (error) {
        res
        .clearCookie('_ss', {domain: process.env.cookie_domains, path: '/'})
        .clearCookie('_Secure1PSSUD', {domain: process.env.cookie_domains, path: '/'})
        .send({message: 'Technical Error'}); console.log(error); return
    }

    const {first_name, last_name, email, address, phone} = req.body
    updates = "UPDATE users SET first_name = ?, last_name = ?, email = ?, address_1 = ?, phone = ?, last_update = CURRENT_TIMESTAMP() WHERE (user_id = ?);"
    db.query(updates, [first_name, last_name, email, address, phone, user.ssuid], (err, results) => {
        if (err) {res.send({message: 'Technical Error'}); console.log(err); return}
        else {res.send('updated')}
    })
})


module.exports = router