const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors');
const router = express.Router();
var fs = require('fs'); 

const bcrypt = require('bcrypt');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

//connecting to db
const db = mysql.createPool({
    host: 'queup.mysql.database.azure.com',
    user: 'jayellliburd',
    password: 'Ishmael01',
    database: 'queup',
    port:3306,
    ssl: {
        ca: fs.readFileSync("./DigiCertGlobalRootCA.crt.pem")
    }
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

//Login with form
router.post('/', (req, res) => {
    console.log('1')
    
    const username = req.body.username
    const password = req.body.password

    finduser = "select * from users where username = ?;"

    db.query(finduser, username,
        (err, result) => {
            if (err) { res.send({err: err}); console.log(err)}
            else {

                if (result[0] == undefined) { res.send({message: 'User not found'})}
                else {

                    //If no Username match then...
                    if (!result[0] ) { res.send({message: 'User not found'})}

                    //If found Username then match password and redirect to...
                    if (result[0]) {bcrypt.compare(password, result[0].password, (error, response) => {
                        if (response) {res.send([result[0].first_name, result[0].user_id])}
                        else {res.send({message: 'Wrong Username or Password'})
                        
                    }})}

                }
            }
        })
    } 
);

module.exports = router