import express, { NextFunction, Request, Response } from "express";
import { auth, squery } from "../lib/index";
import bcrypt from 'bcrypt'
import { decode } from 'jsonwebtoken'
import { Login, ABCLogin } from "../lib/config/@Types";
import { database } from "../lib/index";
const router = express.Router();
require('dotenv').config()

// ---------------------------------- code begins here -------------------------------- //
//TODO: add a check for the user agent to see if it is a bot
//TODO: add basic security to the login page to prevent brute force attacks such as a captcha and a lockout after 5 failed attempts

//Login with form
router.post('/login', 
  function (req: Login, res: Response, next: NextFunction) {
    const {username, password, credentials} = req.body

    // LOOK FOR GGOGLE CREDENTIALS OTHERWISE SKIP TO NEXT FUNCTION
    if (username && password && !credentials ) { next() }
    else {
      const user: ABCLogin = decode(req.body.credentials) as ABCLogin
      if (!user.sub) { res.send({err: 'Invalid Credentials'}); return }
      // See if google account is alreaddy created
      
      // selects user_id, username, dark, weather, favorites where users.user_id = googleid;
      database.query(squery.login(user.sub), (err: any, response: Array<{username: string, user_id: string, first_name: string, dark: string, weather: string, favorites: string}>) => {
        if (err) { console.log(err); return}
        const userID: string = response[0].user_id || ''
        const username: string = response[0].username || ''

        if (response.length > 0) { 
          const tokenpref = {dark: response[0].dark, weather: response[0].weather, favorites: response[0].favorites}

          //grabs user items and prefrences then sends cookies
          if (err) { console.log(err); return }
          auth.dispatchCookies(res, {AuthToken: userID, VToken: username}, [response[0].first_name, tokenpref])
        }

        // Otherwise Create User Account
        else { 
          const sqlInsert1 = "INSERT INTO users (user_id, username, first_name, last_name, email, last_update, created) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());"
          database.query(sqlInsert1, [user.sub, user.sub, user.given_name, user.family_name, user.email], (err: any, response: any) => { 
            if (err || !user.sub) { res.send({err: err}); console.log(err); return} 
            
            // Once Account created pull account and send cookies
            database.query(squery.login(user.sub),(err: any, result: any) => {
              if (err) { res.send({err: err}); console.log(err); return}

              const tokenpref = {dark: result[0].dark, weather: result[0].weather, favorites: result[0].favorites}
              auth.dispatchCookies(res, {AuthToken: userID, VToken: username}, [response[0].first_name, tokenpref])
            })
          })
        }
      })
    }
  },

  // Standard Login via Queup Username & Password
  function (req: Request, res: Response) {
    const {username, password} = req.body
    
    database.query(squery.login(username), (err: any, result: any) => {
      if (err) { res.send({err: err}); console.log(err); return}
      
      //If found Username then match password and redirect to...
      if (result[0]) {bcrypt.compare(password, result[0].password, (error, isCorrect) => {
        if (isCorrect) {
          //If Username match then...
          if (result[0]) {
            const AuthToken = result[0].user_id
            const VToken = result[0].username

            const tokenpref = {dark: result[0].dark, weather: result[0].weather, favorites: result[0].favorites}
            auth.dispatchCookies(res, {AuthToken: AuthToken, VToken: VToken}, [result[0].first_name, tokenpref])
          }
          else { auth.logout(res, 'Wrong Username or Password combination')}
        }
        else { auth.logout(res, 'Wrong Username or Password combination ')}
      })}
      else { auth.logout(res, 'Wrong Username or Password combination')}
    }
  )
});

router.get('/logout', function (req: Request, res: Response) {
  auth.logout(res, 'Logged Out Successfully')
});

module.exports = router