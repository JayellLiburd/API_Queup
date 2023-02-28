const express = require('express')
const router = express.Router()
const { verify } = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
import { ControlBodyKeys } from './functions'
import { initializeApp } from 'firebase/app'
require('dotenv').config()
// Connecting to Database
const {database} = require('../lib/index');


const multer = require('multer')
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
})

import {Storage} from '@google-cloud/storage'
const storage = new Storage({
  projectId: 'queup-358912',
  keyFilename: './Servicekey.json'
})
const bucket = storage.bucket('queup-images') // should be your bucket name

import { setDoc, doc, getFirestore } from 'firebase/firestore'



// ---------------------------------- code begins here -------------------------------- //

router.post('/remove', upload.single('img'), function (req: any, res: any, next: any) {

})


// Route takes in Form Data from Create Queue Form
router.post('/', upload.single('img'), function (req: any, res: any) {
  if (!req.signedCookies._ss) { res.status(401).send({ messageAuth: 'Not Authorized' }); return }
  else {

    //verify if cookie is legitiment or else break code
    try { var user = verify(req.signedCookies._ss, process.env.cookie_secret) }
    catch (error) { res.send({ message: 'Technical Error' }); console.log(error); return }

    try {
      // Function to Upload 
      const file: Express.Multer.File[][0] = req.file

      let d = new Date();
      let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
      let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d)
      let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)
      let date = mo + da + ye

      const userid = user.ssuid
      var newFileName = userid + '-' + req.body?.street_number + '-' + date + '.' + file.mimetype.split('/').reverse()[0]

      const blob = bucket.file(newFileName)
      const blobStream = blob.createWriteStream({
        metadata: { contentType: file.mimetype },
        resumable: false
      })
      // This is the Main File upload to cloud function. Once Fininished and no errors send promise back to client
      blobStream
      .on('finish', () => {
        // Fuction to inset NEW Business data into MySQL Database Azure
        const imports = (arg1: any, arg2: object) => new ControlBodyKeys(arg1, arg2)
        let randomID: string = uuidv4().replace(/-/g, '')
        const sqlInsert = imports(req.body, {image: newFileName, user_id: userid, line_id: randomID, last_update: 'CURRENT_TIMESTAMP()', created: 'CURRENT_TIMESTAMP()'}).keyQuery('businesses')
        database.query(sqlInsert,
            (error: any, response: any) => {
              if (error) { console.log(error), res.send({ message: 'Technical Error' }) }
              else {
                // firebase database
                const config = {
                  apiKey: "AIzaSyDAICINYSy_X7b0CMDNJkRkJxeWE08x58w",
                  authDomain: "queup-358912.firebaseapp.com",
                  databaseURL: "https://queup-358912-default-rtdb.firebaseio.com/",
                  projectId: "queup-358912",
                  storageBucket: "queup-358912.appspot.com",
                  messagingSenderId: "606581966610",
                  appId: "1:606581966610:web:6c532778a4dc45703d95cb",
                  measurementId: "G-NTK8LEJN8N"
                }
                initializeApp(config)
                setDoc(doc(getFirestore(), "Queue", randomID), {name: req.body?.name, address: req.body?.street_number + ' ' + req.body?.street + ', ' + req.body?.city + ', ' + req.body?.zip, created: new Date()})
                  .then(() => {
                    res.send({ messageSuccess: 'success' })
                  })
                  .catch((error: any) => {
                    console.log(error)
                  })
              }
            })
        })
        .on('error', (error: any) => {
          console.log(error)
        })
        .end(file.buffer)
    } catch (error) { console.log(error) }
  }
})


module.exports = router