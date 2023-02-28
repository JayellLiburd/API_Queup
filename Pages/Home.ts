import express from 'express';
const router = express.Router();
const path = require('path');


router.get('/', function (req: express.Request, res: express.Response) {
    res.sendFile(path.join(__dirname,'../public/home.html'))
})

module.exports = router