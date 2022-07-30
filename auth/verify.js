const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors');
const router = express.Router(); 
var fs = require('fs'); 

const { verify } = require('jsonwebtoken')

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

//connecting to db
const db = mysql.createPool({
    host: 'queup.mysql.database.azure.com',
    user: 'jayellliburd',
    password: 'Ishmael01',
    database: 'queup',
    port:3306,
 
});

app.use(cors({
    origin: true,
    credentials: true,
    exposedHeaders: ["*"]
}))
app.use(cookieParser())

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));


// ---------------------------------- code begins here -------------------------------- //

// verify with cookies
router.get('/', (req, res) => {

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
                    else {res.send([{user: results[0].username}, {name: results[0].first_name}])}
                }
            )}
            catch (error) {res.send({ message: 'No Auth' })}
        }
    }
})

router.get('/pro', (req, res) => {
    if (!req.cookies.ss) {
        res.send({ message: 'No Auth' })}

    else {
       if (req.cookies.ss) {

           try {
            const Token = verify(req.cookies.ss, 'password')
            
            finduser = "select * from queup.users where user_id = ?;"
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