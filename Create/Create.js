const express = require('express')
const fs = require('fs');
const mysql = require('mysql')
const router = express.Router()
require('dotenv').config()

// Connecting to Database
const db = mysql.createPool({
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_database,
    port: process.env.db_port,
    ssl:{ca: fs.readFileSync("./DigiCertGlobalRootCA.crt.pem")}
})

const multer = require('multer')
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {fileSize: 5 * 1024 * 1024},
})

const {Storage} = require('@google-cloud/storage');
const { verify } = require('jsonwebtoken')
const storage = new Storage({
  projectId: 'queup-358912',
  keyFilename: './serviceKey.json'
})
const bucket = storage.bucket('queup-images') // should be your bucket name

// ---------------------------------- code begins here -------------------------------- //


// Route takes in Form Data from Create Queue Form
router.post('/', upload.single('img'), (req, res) => {
  if (!req.signedCookies._ss) {res.status(401).send({messageAuth: 'Not Authorized'}); return}
  else {
    const {name, address, address2, city, zipcode ,state, country, small, rate, category, raffle, promo, host} = req.body
    
    //verify if cookie is legitiment or else break code
    try {var user = verify(req.signedCookies._ss, process.env.cookie_secret)} catch (error) {res.send({message: 'Technical Error'}); console.log(error); return}

    // Fuction to inset NEW Business data into MySQL Database Azure
    const sqlInsert = "INSERT INTO businesses (user_id, line_id, bus_name, address_1, address_2, city, zip_code, state, country, small, rate, category, raffle, promo, host, last_update, created) VALUES (?, (replace(uuid(),'-','')), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());"
    db.query(sqlInsert,[user.ssuid, name, address, address2, city, zipcode ,state, country, small, rate, category, raffle, promo, host],
        (error, response) => {
        if (error) { console.log(error)}
        else {
          // Function to Upload 
          const file = req.file
          try {
              let d = new Date(2010, 7, 5);
              let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
              let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d)
              let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)
              let date = mo+da+ye

              const userid = user.ssuid
              var newFileName =  userid + '-' + date +'.'+ file.mimetype.split('/').reverse()[0]
              
              const blob = bucket.file(newFileName)
              const blobStream = blob.createWriteStream({
                metadata: { contentType: file.mimetype},
                resumable: false
              })
              // This is the Main File upload to cloud function. Once Fininished and no errors send promise back to client
              blobStream
                .on('finish', () => {
                  res.send({messageSuccess: 'success'})
                })
                .on('error', (error) => {
                  console.log(error)
                })
                .end(file.buffer)
          }
          catch (error) {console.log(error)}
      }
    })
  }
})


module.exports = router