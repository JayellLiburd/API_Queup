const router = require('../auth/login');
const path = require('path');


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'../public/home.html'))
})

module.exports = router