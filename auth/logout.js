const express = require('express')
const app = express()
const cors = require('cors');
const router = express.Router();


const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(cors({
    origin: true,
    credentials: true,
    exposedHeaders: ["*"]
}))
app.use(cookieParser())

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));


// ---------------------------------- code begins here -------------------------------- //


router.get('/', (req, res) => {
    
    req.cookies
    res
        .clearCookie('ss', {sameSite: "none", secure: true, httpOnly: true, domain: 'queueupnext.com'})
        .clearCookie('rs', {sameSite: "none", secure: true, domain: 'queueupnext.com'})
        .send('cookies cleared')
})


module.exports = router