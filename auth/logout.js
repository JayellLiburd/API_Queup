const express = require('express')
const router = express.Router();
require('dotenv').config()

// ---------------------------------- code begins here -------------------------------- //


router.get('/', (req, res) => {
    req.cookies
    res
        .clearCookie('ss', {domain: process.env.cookie_domains, path: '/'})
        .clearCookie('rs', {domain: process.env.cookie_domains, path: '/'})
        .send({message: 'No Auth'})
})


module.exports = router