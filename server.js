const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors');
var fs = require('fs'); 

const port = process.env.PORT || 4000

const { verify } = require('jsonwebtoken')

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


//connecting to db
 const db = mysql.createPool({
    host: 'us-cdbr-east-06.cleardb.net',
    user: 'b3ab8c52a3d35f',
    password: 'a5705ad6',
    database: 'heroku_261f2f1bf2cd823',
    port:3306,
});

//middleware
app.use(cors({
    origin: true,
    credentials: true,
    exposedHeaders: ["*"]
}))
app.use(cookieParser())

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));



const homepage = require('./Pages/Home')
const login = require('./auth/login')
const logout = require('./auth/logout')
const cookies = require('./auth/logincookies');
const verifyuser = require('./auth/verify')
const createUser = require('./auth/Register')

//Home page
app.use('/', homepage)

//Create User
app.use('/reg', createUser)

//verifying login
app.use('/login', login)

//logout
app.use('/logout', logout)

//login cookies
app.use('/set', cookies)

//verify simple and get profile
app.use('/verify', verifyuser)


app.get('/auth/verify', (req, res) => {

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

app.post('/auth/:id/profile', (req, res) => {

    user_id = req.params.id
    const {first_name, last_name, email, address, phone} = req.body

    finduser = "select * from users where user_id = ?;"
    db.query(finduser, user_id,
    (err, result) => {
        if (err) { 
            res
                .send({err: err})
        }
        if (result.length > 0) {
            updates = "UPDATE users SET `first_name` = ?, `last_name` = ?, `email` = ?, `address_1` = ?, `phone` = ? WHERE (`user_id` = ?);"
            db.query(updates, [first_name, last_name, email, address, phone, user_id])
        }
    })
});


app.listen(port, () => {
    console.log('Running on port' + port )
});
