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
    if (!req.signedCookies._ss) {res.status(401).send({message: 'Not Authorized'}); return}
    else {
        try {var Token = verify(req.signedCookies._ss, process.env.cookie_secret)} catch (error) {
            res
            .clearCookie('_ss', {domain: process.env.cookie_domains, path: '/'})
            .clearCookie('_Secure1PSSUD', {domain: process.env.cookie_domains, path: '/'})
            .send({message: 'Technical Error'}); console.log(error); return}

        try {
            finduser = "select * from users where user_id = ?;"
            db.query(finduser, Token.ssuid,
                (err, results) => {
                    if (err) { res.send({ message: 'No Auth' }); console.log(err)}
                    else {
                        if (results[0]) {res.send([{username: results[0].username, name: results[0].first_name}])}
                        else {
                            res
                            .clearCookie('_ss', {domain: process.env.cookie_domains, path: '/'})
                            .clearCookie('_Secure1PSSUD', {domain: process.env.cookie_domains, path: '/'})
                            .send({message: 'Technical Error'})
                            console.log(err);
                        }
                    }
                }
            )
        }
        catch (err) {
            console.log(err); 
            res
            .clearCookie('_ss', {domain: process.env.cookie_domains, path: '/'})
            .clearCookie('_Secure1PSSUD', {domain: process.env.cookie_domains, path: '/'})
            .send({ message: 'No Auth' }) }
    }
})

router.post('/', (req, res) => {
    const user_cred = req.body.user

    if (!user_cred) { res.send({ message: 'No Auth' }) }
    else {
        try {
            const user = decode(user_cred)
            const id = (user.sub)

            finduser = "select * from users where user_id = ?;"
            db.query(finduser, id,
                (err, results) => {
                    if (results.length > 0) { res.send([{user: results[0].username, name: results[0].first_name}]) }   
                    else { res.send({ message: 'Redirecting to Sign up'}) }
                }
            )
        }
        catch (err) {res.send({ message: 'No Auth' })}
    }
})

//Get Profile Info
router.get('/pro', (req, res) => {
    if (!req.signedCookies._Secure1PSSUD) {
        res
        .clearCookie('_ss', {domain: process.env.cookie_domains, path: '/'})
        .clearCookie('_Secure1PSSUD', {domain: process.env.cookie_domains, path: '/'})
        .send({ message: 'No Auth' })
    }

    else {
       if (req.signedCookies._Secure1PSSUD) {

        try {var Token = verify(req.signedCookies._ss, process.env.cookie_secret)} catch (error) {res.send({message: 'Technical Error'}); console.log(error); return}
        
        finduser = "select address_1, address_2, city, counrty, email, first_name, last_name, phone, sex, state, username, verified, zip_code from users where user_id = ?;"
        db.query(finduser, Token.ssuid,
            
            (err, results) => {
            
                if (err) { res.send({ message: 'No Auth' }) }
                else { res.send(results) }
            }
        )}
    }
})

module.exports = router