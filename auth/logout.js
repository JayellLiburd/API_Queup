const express = require('express')
const router = express.Router();


// ---------------------------------- code begins here -------------------------------- //


router.get('/', (req, res) => {
    
    req.cookies
    res
        .clearCookie('ss', {domain: 'queueupnext.com', path: '/'})
        .clearCookie('rs', {domain: 'queueupnext.com', path: '/'})
        .send({message: 'No Auth'})
})


module.exports = router