const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors');
const router = express.Router();
var fs = require('fs'); 
const util = require('util')

const bcrypt = require('bcrypt');
const saltRounds = 10;

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


app.use(cors({
    origin: true,
    credentials: true,
    exposedHeaders: ["*"]
}))
app.use(cookieParser())

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));


// ---------------------------------- code begins here -------------------------------- //


//Register User
router.post('/', (req, res) => {

    const first_name  = req.body.first_name
    const last_name = req.body.last_name
    const email = req.body.email
    const username = req.body.username
    const password = req.body.password

    const sqlInsert = "INSERT INTO users (user_id, username, password, first_name, last_name, email, last_update, created) VALUES ((replace(uuid(),'-','')), ?, ?, ?, ?, ?, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());"
    
    bcrypt.hash(password, saltRounds, (err, hash) => {
        
        db.query(sqlInsert, [username, hash, first_name, last_name, email], (err, result) => {
            res.send({message: 'User Created'})
        } )
    })
})

module.exports = router