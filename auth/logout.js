const express = require('express')
const router = express.Router();
require('dotenv').config()

// ---------------------------------- code begins here -------------------------------- //


router.get('/', (req, res) => {
    req.signedCookies
    res
        .clearCookie('_ss', {domain: process.env.cookie_domains, path: '/'})
        .clearCookie('_Secure1PSSUD', {domain: process.env.cookie_domains, path: '/'})
        .send({message: 'No Auth'})
})


module.exports = router