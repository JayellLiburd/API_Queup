const express = require('express')
const fs = require('fs');
require('dotenv').config()
const mysql = require('mysql')
const router = express.Router(); 
const { verify, decode } = require('jsonwebtoken')


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

// verify with cookies
router.get('/', (req, res) => {
    if (!req.cookies.rs) {
        res.send({ message: 'No Auth' })}

    else {
           try {
            const Token = verify(req.cookies.ss, 'password')

            finduser = "select * from users where user_id = ?;"
            db.query(finduser, Token.ssuid,
                (err, results) => {
                    if (err) { 
                        res.send({ message: 'No Auth' })
                    }
                    else {res.send([{username: results[0].username, name: results[0].first_name}])}
                }
            )}
            catch (error) {res.send({ message: 'No Auth' })}
        }
})

router.post('/', (req, res) => {
    const user_cred = req.body.user

    if (!user_cred) { res.send({ message: 'No Auth' }) }
    else {
        try {
            const user = decode(user_cred)
            const id = (user.sub)
            console.log(id)


            finduser = "select * from users where user_id = ?;"
            db.query(finduser, id,
                (err, results) => {
                    console.log(results)
                    if (results.length > 0) { res.send([{user: results[0].username, name: results[0].first_name}]) }   
                    else { res.send({ message: 'Redirecting to Sign up'}) }
                }
            )
        }
        catch (err) {res.send({ message: 'No Auth' })}
    }
})

router.get('/pro', (req, res) => {
    if (!req.cookies.ss) {
        res.send({ message: 'No Auth' })}

    else {
       if (req.cookies.ss) {

           try {
            const Token = verify(req.cookies.ss, 'password')
            
            finduser = "select * from users where user_id = ?;"
            db.query(finduser, Token.ssuid,
                
                (err, results) => {
                
                    if (err) { 
                        res.send({ message: 'No Auth' })
                    }
                    else {res.send(results)}
                }
            )}
            catch (error) {res.send({ message: 'No Auth' })}
        }
    }
})

module.exports = router