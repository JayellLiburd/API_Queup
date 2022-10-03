const express = require('express')
const fs = require('fs');
const mysql = require('mysql')
const router = express.Router();
require('dotenv').config()

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

router.get('/', 
    (req, res, next) => {

        if (!req.signedCookies._ss) {res.status(401).send({message: 'Not Authorized'}); return}
        try {var Token = verify(req.signedCookies._ss, process.env.cookie_secret)} catch (error) {
            res
            .clearCookie('_ss', {domain: process.env.cookie_domains, path: '/'})
            .clearCookie('_Secure1PSSUD', {domain: process.env.cookie_domains, path: '/'})
            .status(401).send({message: 'Technical Error'}); console.log(error); return}

        const getMyQueues = 'select * from businesses where user_id = ?'
        db.query(getMyQueues, Token.ssuid, (err, results) => {
            if (err) {console.log(err); res.status(501).send({ messageError: 'Technical Error'}); return}
            else {
                res.status(200).send(results)
            }
        })
    }   
);

module.exports = router