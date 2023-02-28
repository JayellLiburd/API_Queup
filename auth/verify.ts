import express from 'express';
import {database, auth} from '../lib'
const router = express.Router(); 
require('dotenv').config()

// ---------------------------------- code begins here -------------------------------- //

// verify with cookies
router.get('/', (req: express.Request, res: express.Response) => {
  if (!req.signedCookies._ss) {res.status(200).send({messageAuth: 'Not Authorized'}); return}
  else {
    auth.isVerified(req, res).then((Token: any) => {
      if (!Token) {res.status(200).send({messageAuth: 'Not Authorized'}); return}
      const finduser = "select first_name, last_name from users where user_id = ?;"
      database.query(finduser, Token, (err: any, results: any) => {
        if (err) { res.send({ message: 'No Auth' }); console.log(err)}
        else {
          if (results.length > 0) { res.status(200).send(results[0]) }
        }
      })
    })
  }
})

//TODO: fix registration form
//Get Profile Info
router.get('/pro', (req, res) => {
  auth.isVerified(req, res).then((Token: any) => {
    if (!Token) {auth.logout(res, 'Not Authorized'); return}
    else {
      const finduser = "select address, city, counrty, email, first_name, last_name, phone, sex, city, username, verified, zip_code from users where user_id = ?;"
      database.query(finduser, Token.ssuid,
        (err: any, results: any) => {
          if (err) { res.send({ message: 'No Auth1' }), console.log(err) }
          else { 
            res.send(results)
          }
        })
      }
    })
})

module.exports = router