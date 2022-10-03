const express = require('express')
const fs = require('fs');
const mysql = require('mysql')
const router = express.Router();
require('dotenv').config()

const parser = require('ua-parser-js');
const { verify } = require('jsonwebtoken');

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

router.post('/', 
    (req, res, next) => {
        if (!req.signedCookies._ss) {res.status(401).send({message: 'Not Authorized'}); return}
        const { idemployee, name, role, line_id } = req.body

        try {var Token = verify(req.signedCookies._ss, process.env.cookie_secret)} catch (error) {
            res
            .clearCookie('_ss', {domain: process.env.cookie_domains, path: '/'})
            .clearCookie('_Secure1PSSUD', {domain: process.env.cookie_domains, path: '/'})
            .send({message: 'Technical Error'}); console.log(error);
            return}

        const addEmployee = 'Insert into roster (idemployee, line_id, name, role) Values (?, ?, ?, ?)'
        db.query(addEmployee, [ idemployee, line_id, name, role ], (err, results) => {
            if (err) {console.log(err); res.status(501).send({ messageError: 'Technical Error'}); return}
            else {
                res.status(201).send({created: {name, idemployee}})
            }
        })
    }   
);

router.post('/roster', 
    (req, res, next) => {

    }   
);

module.exports = router