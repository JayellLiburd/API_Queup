const express = require('express')
const mysql = require('mysql')
const router = express.Router(); 
const { verify } = require('jsonwebtoken')
const parser = require('ua-parser-js');

//connecting to db
const db = mysql.createPool({
    host: 'us-cdbr-east-06.cleardb.net',
    user: 'b3ab8c52a3d35f',
    password: 'a5705ad6',
    database: 'heroku_261f2f1bf2cd823',
    port:3306,
});


// ---------------------------------- code begins here -------------------------------- //

// verify with cookies
router.get('/', (req, res) => {

    var ua = parser(req.headers['user-agent']);
    console.log(JSON.stringify(ua, null, ''))

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
                    else {res.send([{user: results[0].username}, {name: results[0].first_name}])}
                }
            )}
            catch (error) {res.send({ message: 'No Auth' })}
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