const express = require('express')
const fs = require('fs');
const mysql = require('mysql')
const router = express.Router();
require('dotenv').config()

const bcrypt = require('bcrypt');

//connecting to db
const db = mysql.createPool({
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_database,
    port: process.env.db_port,
    ssl: {ca: fs.readFileSync("./DigiCertGlobalRootCA.crt.pem")}
});

// ---------------------------------- code begins here -------------------------------- //

//Login with form
router.post('/', (req, res) => {
    
    const username = req.body.username
    const password = req.body.password

    finduser = 'select * from users where username = ?'

    db.query(finduser, username,
        (err, result) => {
            if (err) { res.send({err: err}); console.log(err)}
            
            else {
                if (result[0] == undefined) { res.send({message: 'User not found'})}

                else {

                    //If no Username match then...
                    if (!result[0] ) { res.send({message: 'User not found'})}

                    //If found Username then match password and redirect to...
                    if (result[0]) {bcrypt.compare(password, result[0].password, (error, response) => {

                        if (response) {
                            res.send( [result[0].first_name, result[0].user_id] )}

                        else {
                            res.send({message: 'Wrong Username or Password'})
                        
                    }})}

                }
            }
        })
    } 
);

module.exports = router