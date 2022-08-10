const express = require('express')
const mysql = require('mysql')
const router = express.Router();

//connecting to db
const db = mysql.createPool({
    host: 'us-cdbr-east-06.cleardb.net',
    user: 'b3ab8c52a3d35f',
    password: 'a5705ad6',
    database: 'heroku_261f2f1bf2cd823',
    port:3306,
});

// ---------------------------------- code begins here -------------------------------- //

router.post('/', (req, res) => {
    req.body
    res.send('hello')
})


module.exports = router