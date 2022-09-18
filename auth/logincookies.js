const express = require('express')
const mysql = require('mysql')
const fs = require('fs');
const router = express.Router();
const parser = require('ua-parser-js');
require('dotenv').config()

const { sign, verify } = require('jsonwebtoken');
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



// After verifying Login this sends cookie with get using url form react form //
router.get('/', (req, res) => {

    const url = req.baseUrl.split('/')[1]
    let user_id = verify(url, process.env.cookie_secret)

    //Quaries!!!! //
    finduser = "select * from users where user_id = ?;"
    findpref = "select * from prefrences where user_id = ?;"
    constpref = "INSERT INTO prefrences (user_id) values (?);"

    res
    .clearCookie('ss', {domain: process.env.cookie_domains, path: '/'})
    .clearCookie('rs', {domain: process.env.cookie_domains, path: '/'})

    var ua = parser(req.headers['user-agent'])
    var http = true
    if(ua.device.model == 'iPhone' || 'iPad') {var httpOnly = false}

    db.query(finduser, user_id.ssuid,
        (err, result) => {

            //If Error
            if (err) { res.send('Technical Error');{console.log(err)} return}
            else {

            //If Username match then...
            if (result[0]) {  

                //If found Username then match password and redirect to...
                if (result[0]) {bcrypt.compare(user_id.puid, result[0].password, (err, same) => {

                    if (err) { res.send('Technical Error');{console.log(err)} return}

                    const AuthToken = sign({ ssuid: result[0].user_id }, process.env.cookie_secret)
                    const VToken = sign({ ssu: result[0].username }, process.env.cookie_secret)

                    //grabs prefrences
                    db.query(findpref, user_id.ssuid, (err, response) => {
                        if (err) { res.send('Technical Error');{console.log(err)} return}
                        //Create if dont have
                        if (response.length <= 0) {db.query(constpref, user_id, (err, results) => {
                            if (err) { res.send('Technical Error');{console.log(err)} return}

                            //Now regrab with newly created prefrences and send cookies like normal
                            db.query(findpref, user_id.ssuid, (err, response) => {

                                if (err) { console.log(err); return}
                                const tokenpref = sign({dark: response[0].dark, weather: response[0].weather, favorites: response[0].favorites}, process.env.cookie_secret)
                                res
                                .cookie('ss', AuthToken, {sameSite: "none", secure: true, maxAge: 60*60*24*1,  domain: process.env.cookie_domains,})
                                .cookie('rs', VToken, {sameSite: "none", secure: true, maxAge: 60*60*24*1, domain: process.env.cookie_domains,})
                                .send([result[0].first_name, tokenpref] )
                        })})}

                        //Grab prefrences if already created
                        else {

                            if (err) { console.log(err); return}
                            const tokenpref = sign({dark: response[0].dark, weather: response[0].weather, favorites: response[0].favorites}, process.env.cookie_secret)
                            res
                            .cookie('ss', AuthToken, {sameSite: "none", secure: true, maxAge: 60*60*24*1, domain: process.env.cookie_domains,})
                            .cookie('rs', VToken, {sameSite: "none", secure: true, maxAge: 60*60*24*1, domain: process.env.cookie_domains,})
                            .send([result[0].first_name, tokenpref])   
                        }
                    })}
                )}}
                else {
                //No valid user found
                if (!result[0]) {
                    res.send({message: 'No Auth'})
                }  
            }
        };
    });
});

module.exports = router