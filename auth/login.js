const express = require('express')
const fs = require('fs');
const mysql = require('mysql')
const router = express.Router();
require('dotenv').config()

const parser = require('ua-parser-js');
const bcrypt = require('bcrypt');
const { sign, decode } = require('jsonwebtoken');

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
router.post('/', 
    (req, res, next) => {

        var ua = parser(req.headers['user-agent'])
        if(ua.device.model == 'iPhone') {var httpOnly = true}

        // LOOK FOR GGOGLE CREDENTIALS OTHERWISE SKIP TO NEXT FUNCTION
        if (!req.body.user) { next() }
        else {
            const user = decode(req.body.user)

            // See if google account is alreaddy created
            const finduser = "select * from users where user_id = ?;"
            db.query(finduser, user.sub,
                (err, result) => {
                    if (err) { console.log(err)}
                    
                    // If already created then send results 
                    if (result.length > 0) { 
                        const AuthToken = sign({ ssuid: result[0].user_id }, process.env.cookie_secret)
                        const VToken = sign({ ssu: result[0].username }, process.env.cookie_secret)

                        //grabs prefrences
                        const findpref = "select * from prefrences where user_id = ?;"
                        db.query(findpref, result[0].user_id, (err, response) => {

                            //Create if dont have
                            const constpref = "INSERT INTO prefrences (user_id) values (?);"
                            if (response.length <= 0) {db.query(constpref, result[0].user_id, (err, results) => {

                                //Now regrab with newly created prefrences and send cookies like normal
                                db.query(findpref, result[0].user_id, (err, response) => {
                                    if (err) { console.log(err); return}
                                    const tokenpref = sign({dark: response[0].dark, weather: response[0].weather, favorites: response[0].favorites}, process.env.cookie_secret)
                                    res
                                        .cookie('ss', AuthToken, {sameSite: "none", secure: true, httpOnly: httpOnly, domain: process.env.cookie_domains,})
                                        .cookie('rs', VToken, {sameSite: "none", secure: true, httpOnly: httpOnly, domain: process.env.cookie_domains,})
                                        .send([result[0].first_name, tokenpref])
                            })})}

                            //Grab prefrences if already created
                            else {
                                if (err) { console.log(err); return}

                                const tokenpref = sign({dark: response[0].dark, weather: response[0].weather, favorites: response[0].favorites}, process.env.cookie_secret)
                                res
                                .cookie('ss', AuthToken, {sameSite: "none", secure: true, httpOnly: httpOnly, domain: process.env.cookie_domains,})
                                .cookie('rs', VToken, {sameSite: "none", secure: true, httpOnly: httpOnly, domain: process.env.cookie_domains,})
                                .send([result[0].first_name, tokenpref])
                            }
                        })
                    }

                    // Otherwise Create User Account
                    else { 
                        const sqlInsert1 = "INSERT INTO users (user_id, username, first_name, last_name, email, last_update, created) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());"
                        db.query(sqlInsert1, [user.sub, user.sub, user.given_name, user.family_name, user.email], (err, response) => { 

                            if (err) { res.send({err: err})} 
                            
                            // Once Account created pull account and send cookies
                            else {
                                db.query(finduser, user.sub,
                                    (err, result) => {
                                        if (err) { res.send({err: err}); console.log(err)}
                                        else {

                                            //grabs prefrences
                                            const findpref = "select * from prefrences where user_id = ?;"
                                            db.query(findpref, result[0].user_id, (err, response) => {

                                                const AuthToken = sign({ ssuid: result[0].user_id }, process.env.cookie_secret)
                                                const VToken = sign({ ssu: result[0].username }, process.env.cookie_secret)
                                                //Create if dont have
                                                const constpref = "INSERT INTO prefrences (user_id) values (?);"
                                                if (response.length <= 0) {db.query(constpref, result[0].user_id, (err, results) => {

                                                    //Now regrab with newly created prefrences and send cookies like normal
                                                    db.query(findpref, result[0].user_id, (err, response) => {
                                                        if (err) { console.log(err); return}

                                                        const tokenpref = sign({dark: response[0].dark, weather: response[0].weather, favorites: response[0].favorites}, process.env.cookie_secret)
                                                        res
                                                        .cookie('ss', AuthToken, {sameSite: "none", secure: true, httpOnly: httpOnly, domain: process.env.cookie_domains,})
                                                        .cookie('rs', VToken, {sameSite: "none", secure: true, httpOnly: httpOnly, domain: process.env.cookie_domains,})
                                                        .send([result[0].first_name, tokenpref])
                                                })})}

                                                //Grab prefrences if already created
                                                else {
                                                    if (err) { console.log(err); return}

                                                    const tokenpref = sign({dark: response[0].dark, weather: response[0].weather, favorites: response[0].favorites}, process.env.cookie_secret)
                                                    res
                                                    .cookie('ss', AuthToken, {sameSite: "none", secure: true, httpOnly: httpOnly, domain: process.env.cookie_domains,})
                                                    .cookie('rs', VToken, {sameSite: "none", secure: true, httpOnly: httpOnly, domain: process.env.cookie_domains,})
                                                    .send([result[0].first_name, tokenpref])
                                                }
                                            })
                                        
                                        }
                                    }
                                )
                            }
                        })
                    }
                }
            )
        }
    },
    // Standard Login via Queup Username & Password
    (req, res) => {

        var ua = parser(req.headers['user-agent'])

        const username = req.body.username
        const password = req.body.password
        
        const findpref = "select * from prefrences where user_id = ?;"
        const constpref = "INSERT INTO prefrences (user_id) values (?);"
        const finduser = 'select * from users where username = ?'

        db.query(finduser, username,
            (err, result) => {
                if (err) { res.send({err: err}); console.log(err)}
                
                else {
                    if (result[0] == undefined) { res.send({message: 'Wrong Username or Password combination'})}
                    else {
                        //If found Username then match password and redirect to...
                        if (result[0]) {bcrypt.compare(password, result[0].password, (error, response) => {
                            if (response) {
                                //If Username match then...
                                if (result[0]) {  
                                    const AuthToken = sign({ ssuid: result[0].user_id }, process.env.cookie_secret)
                                    const VToken = sign({ ssu: result[0].username }, process.env.cookie_secret)
                    
                                    //grabs prefrences
                                    db.query(findpref, result[0].user_id, (err, response) => {
                                        
                                        //Create if dont have
                                        if (response.length <= 0) {db.query(constpref, result[0].user_id, (err, results) => {
                    
                                            //Now regrab with newly created prefrences and send cookies like normal
                                            db.query(findpref, result[0].user_id, (err, response) => {
                    
                                                const tokenpref = sign({dark: response[0].dark, weather: response[0].weather, favorites: response[0].favorites}, process.env.cookie_secret)
                                                if(ua.device.model == 'iPhone'){
                                                    res
                                                        .cookie('ss', AuthToken, {sameSite: "none", secure: true, domain: process.env.cookie_domains,})
                                                        .cookie('rs', VToken, {sameSite: "none", secure: true, domain: process.env.cookie_domains,})
                                                        .send([result[0].first_name, tokenpref])
                                                }
                                                else {
                                                    res
                                                        .cookie('ss', AuthToken, {sameSite: "none", secure: true, httpOnly: true, domain: process.env.cookie_domains,})
                                                        .cookie('rs', VToken, {sameSite: "none", secure: true, domain: process.env.cookie_domains,})
                                                        .send([result[0].first_name, tokenpref])
                                                }           
                                        })})}
                    
                                        //Grab prefrences if already created
                                        else {
                                            const tokenpref = sign({dark: response[0].dark, weather: response[0].weather, favorites: response[0].favorites}, process.env.cookie_secret)
                    
                                            if(ua.device.model == 'iPhone'){
                                                res
                                                    .cookie('ss', AuthToken, {sameSite: "none", secure: true, domain: process.env.cookie_domains,})
                                                    .cookie('rs', VToken, {sameSite: "none", secure: true, domain: process.env.cookie_domains,})
                                                    .send([result[0].first_name, tokenpref])
                                            }
                                            else {
                                                res
                                                    .cookie('ss', AuthToken, {sameSite: "none", secure: true, httpOnly: true, domain: process.env.cookie_domains,})
                                                    .cookie('rs', VToken, {sameSite: "none", secure: true, domain: process.env.cookie_domains,})
                                                    .send([result[0].first_name, tokenpref])
                                            }
                                        }
                                    })
                                }
                                else { res.send({message: 'Wrong Username or Password combination'})}
                            }
                            else { res.send({message: 'Wrong Username or Password combination'})}
                        })}
                    }
                }
            }
        )
    } 
);

module.exports = router