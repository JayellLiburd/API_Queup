const express = require('express')
const mysql = require('mysql')
const router = express.Router();

const bcrypt = require('bcrypt');

//connecting to db
const db = mysql.createPool({
    host: 'us-cdbr-east-06.cleardb.net',
    user: 'b3ab8c52a3d35f',
    password: 'a5705ad6',
    database: 'heroku_261f2f1bf2cd823',
    port:3306,
});


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