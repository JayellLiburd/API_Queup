const express = require('express')
const mysql = require('mysql')
const fs = require('fs');
const router = express.Router();
const parser = require('ua-parser-js');
require('dotenv').config()

const { sign } = require('jsonwebtoken')

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



// After verifying Login this sends cookie with get usin url form react form //
router.get('/:id/login', (req, res) => {

    var ua = parser(req.headers['user-agent']);
    user_id = req.params.id

    //Quaries!!!! //
    finduser = "select * from users where user_id = ?;"
    findpref = "select * from prefrences where user_id = ?;"
    constpref = "INSERT INTO prefrences (user_id) values (?);"

    db.query(finduser, user_id,
        (err, result) => {

            //If Error
            if (err) { res.send({err: err}); }
            else {

            //If Username match then...
            if (result[0]) {  

                const AuthToken = sign({ ssuid: result[0].user_id }, 'password')
                const VToken = sign({ ssu: result[0].username }, 'password')

                //grabs prefrences
                db.query(findpref, user_id, (err, response) => {
                    
                    //Create if dont have
                    if (response.length <= 0) {db.query(constpref, user_id, (err, results) => {

                        //Now regrab with newly created prefrences and send cookies like normal
                        db.query(findpref, user_id, (err, response) => {

                            const tokenpref = sign({dark: response[0].dark, weather: response[0].weather, favorites: response[0].favorites}, 'password')

                            if(ua.device.model == 'iPhone'){
                                res
                                    .cookie('ss', AuthToken, {sameSite: "none", secure: true, domain: 'queueupnext.com',})
                                    .cookie('rs', VToken, {sameSite: "none", secure: true, domain: 'queueupnext.com',})
                                    .send([result[0].first_name, tokenpref])
                            }
                            else {
                                res
                                    .cookie('ss', AuthToken, {sameSite: "none", secure: true, httpOnly: true, domain: 'queueupnext.com',})
                                    .cookie('rs', VToken, {sameSite: "none", secure: true, domain: 'queueupnext.com',})
                                    .send([result[0].first_name, tokenpref])
                            }           
                    })})}

                    //Grab prefrences if already created
                    else {
                        const tokenpref = sign({dark: response[0].dark, weather: response[0].weather, favorites: response[0].favorites}, 'password')

                        if(ua.device.model == 'iPhone'){
                            res
                                .cookie('ss', AuthToken, {sameSite: "none", secure: true, domain: 'queueupnext.com',})
                                .cookie('rs', VToken, {sameSite: "none", secure: true, domain: 'queueupnext.com',})
                                .send([result[0].first_name, tokenpref])
                        }
                        else {
                            res
                                .cookie('ss', AuthToken, {sameSite: "none", secure: true, httpOnly: true, domain: 'queueupnext.com',})
                                .cookie('rs', VToken, {sameSite: "none", secure: true, domain: 'queueupnext.com',})
                                .send([result[0].first_name, tokenpref])
                        }
                    }
            })}
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