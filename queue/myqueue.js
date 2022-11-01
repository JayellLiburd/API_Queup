const express = require('express')
const fs = require('fs');
const mysql = require('mysql')
const router = express.Router();
require('dotenv').config()

const { verify, sign, decode } = require('jsonwebtoken')

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

        if (!req.signedCookies._ss) {res.status(200).send({messageAuth: 'Not Authorized'}); return}
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

router.get('/:id/Queue', 
    (req, res, next) => {

        if (!req.signedCookies._ss) {res.status(401).send({messageAuth: 'Not Authorized'}); return}

        try {var Token = verify(req.signedCookies._ss, process.env.cookie_secret)} catch (error) {
            res
            .clearCookie('_ss', {domain: process.env.cookie_domains, path: '/'})
            .clearCookie('_Secure1PSSUD', {domain: process.env.cookie_domains, path: '/'})
            .send({message: 'Technical Error'}); console.log(error);
            return}

        const getMyQueue = 'select * from businesses where line_id = ?'
        db.query(getMyQueue, req.originalUrl.split('/')[2], (err, results) => {
            if (err) {console.log(err); res.status(501).send({ messageError: 'Technical Error'}); return}
            else {
                const getEmployees = 'select name, idemployee, role from roster where line_id = ?;'
                db.query(getEmployees, req.originalUrl.split('/')[2], (err, results2) => {
                    if (err) {console.log(err); res.status(501).send({ messageError: 'Technical Error'}); return}
                    else {
                        res.status(200).send({results, results2})
                    }
                })
            }
        })

        
    }   
);

router.post('/favorite', (req, res) => {
    if(req.body) {
        try {var Token = verify(req.signedCookies._ss, process.env.cookie_secret)} catch (error) {
            res
            .clearCookie('_ss', {domain: process.env.cookie_domains, path: '/'})
            .clearCookie('_Secure1PSSUD', {domain: process.env.cookie_domains, path: '/'})
            .send({message: 'Technical Error'}); console.log(error);
            return}
        db.query('select bus_favorites from users where user_id = ?', Token.ssuid, (err, results) => {
            if (err) {console.log(err); res.status(501).send({ messageError: 'Technical Error'}); return}
            else {
                const item = Object.keys(req.body)[0]
                const favorites = decode(results[0].bus_favorites)
                favorites.favorites[item] = req.body[item]
                let updatedFavorites = sign(favorites, process.env.cookie_secret)
                db.query('update users set bus_favorites = ? where (user_id) = ?', [updatedFavorites, Token.ssuid], (err, results) => {
                    if (err) {console.log(err); res.status(501).send({ messageError: 'Technical Error'}); return}
                    else {
                        res.status(200).send({results})
                    }
                })
            }
        })
    } else res.status(501).send({ messageError: 'Technical Error'}); return
})


module.exports = router