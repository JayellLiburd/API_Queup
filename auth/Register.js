const express = require('express')
const fs = require('fs');
const mysql = require('mysql')
const router = express.Router();
require('dotenv').config()

const bcrypt = require('bcrypt');
const { decode } = require('jsonwebtoken');
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
    const user = decode(req.body.user)

    if (user.sub) {
        const sqlInsert1 = "INSERT INTO users (user_id, username, first_name, last_name, email, last_update, created) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());"
        db.query(sqlInsert1, [user.sub, user.sub, user.given_name, user.family_name, user.email], (err, response) => { 
            if (err) { res.send({err: err})} 
            else res.send({ssuid: user.sub})
        })

    } else {
        const first_name  = req.body.first_name
        const last_name = req.body.last_name
        const email = req.body.email
        const username = req.body.username
        const password = req.body.password

        bcrypt.hash(password, saltRounds, (err, hash) => {
            const sqlInsert2 = "INSERT INTO users (user_id, username, first_name, last_name, email, last_update, created) VALUES ((replace(uuid(),'-','')), ?, ?, ?, ?, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());"
            try { db.query(sqlInsert2, [username, hash, first_name, last_name, email], (err, response) => { 
                if (errfdrfv) { res.send({err: err})} 
                else res.send({message: 'User Created'}) 
            })}
            catch (err) { console.log(err) }
        })
    }
})


module.exports = router