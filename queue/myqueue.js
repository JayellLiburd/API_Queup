const express = require('express')
const router = express.Router();
require('dotenv').config()

const { verify } = require('jsonwebtoken')

//connecting to db
const {database, auth} = require('../lib/index');


const { Storage } = require('@google-cloud/storage');
const storage = new Storage({
  projectId: 'queup-358912',
  keyFilename: './Servicekey.json'
})
const bucketName = 'queup-images' // should be your bucketName name

// ---------------------------------- code begins here -------------------------------- //

router.get('/',(req, res) => {
  auth.isVerified(req, res).then((Token) => {
    if (!Token) return
    const getMyQueues = `select * from businesses where user_id = '${Token}'`
    database.query(getMyQueues, (err, results) => {
      if (err) { console.log(err); res.status(501).send({ messageError: 'Technical Error' }); return }
      else {
        res.status(200).send(results)
      }
    })
  })
});

// router.post('/line',
//   (req, res, next) => {
//     console.log('myqueue.js/line')
//     if (!req.signedCookies._ss) { res.status(401).send({ messageAuth: 'Not Authorized' }); return }

//     try { var Token = verify(req.signedCookies._ss, process.env.cookie_secret) } catch (error) {
//       res
//         .clearCookie('_ss', { domain: process.env.cookie_domains, path: '/' })
//         .clearCookie('_Secure1PSSUD', { domain: process.env.cookie_domains, path: '/' })
//         .send({ message: 'Technical Error' }); console.log(error);
//       return
//     }

//     const getMyQueue = 'select * from businesses where line_id = ?'
//     database.query(getMyQueue, req.body, (err, results) => {
//       if (err) { console.log(err); res.status(501).send({ messageError: 'Technical Error' }); return }
//       else {
//         const getEmployees = 'select name, idemployee, role from roster where line_id = ?;'
//         database.query(getEmployees, req.originalUrl.split('/')[2], (err, results2) => {
//           if (err) { console.log(err); res.status(501).send({ messageError: 'Technical Error' }); return }
//           else {
//             res.status(200).send({ results, results2 })
//           }
//         })
//       }
//     })
//   }
// );

// router.post('/favorite', (req, res) => {
//   if (req.body) {
//     try { var Token = verify(req.signedCookies._ss, process.env.cookie_secret) } catch (error) {
//       res
//         .clearCookie('_ss', { domain: process.env.cookie_domains, path: '/' })
//         .clearCookie('_Secure1PSSUD', { domain: process.env.cookie_domains, path: '/' })
//         .send({ message: 'Technical Error' }); console.log(error);
//       return
//     }

//     if (req.body.remove) {
//       const removeFavorite = 'update businesses set favorite = NULL where user_id = ? and favorite = ?'
//       database.query(removeFavorite, [Token.ssuid, req.body.remove], (err, results) => {
//         if (err) { console.log(err); res.status(501).send({ messageError: 'Technical Error' }); return }
//         else {
//           res.status(200).send()
//         }
//       })
//     } else {
//       const ObjKey = Object.keys(req.body)[0]
//       database.query('update businesses set favorite = ? where user_id = ? and line_id = ?', [ObjKey, Token.ssuid, req.body[ObjKey].line_id], (err, results) => {
//         if (err) { console.log(err); res.status(501).send({ messageError: 'Technical Error' }); return }
//         else {
//           res.status(200).send()
//         }
//       })
//     }
//   } else res.status(501).send({ messageError: 'Technical Error' }); return
// })

// router.post('/remove', (req, res) => {
//   try { var Token = verify(req.signedCookies._ss, process.env.cookie_secret) } catch (error) {
//     res
//       .clearCookie('_ss', { domain: process.env.cookie_domains, path: '/' })
//       .clearCookie('_Secure1PSSUD', { domain: process.env.cookie_domains, path: '/' })
//       .send({ message: 'Technical Error' }); console.log(error);
//     return
//   }

//   const { line_id, fileName } = req.body
//   async function deleteFile(fileName) {
//     await storage.bucket(bucketName).file(fileName).delete();
//     console.log(`gs://${bucketName}/${fileName} deleted`);
//   }
//   if (fileName) {
//     deleteFile(fileName).then(() => {
//       database.query('delete from businesses where user_id = ? and line_id = ?', [Token.ssuid, line_id], (err, results) => {
//         if (err) { res.status(501).send({ messageError: 'Technical Error' }); console.log(err); return }
//         else { res.status(200).send() }
//       })
//     })
//   }
//   else {
//     database.query('delete from businesses where user_id = ? and line_id = ?', [Token.ssuid, line_id], (err, results) => {
//       if (err) { res.status(501).send({ messageError: 'Technical Error' }); console.log(err); return }
//       else { res.status(200).send() }
//     })
//   }
// })

// router.post('/update', (req, res) => {
//   try { var Token = verify(req.signedCookies._ss, process.env.cookie_secret) } catch (error) {
//     res
//       .clearCookie('_ss', { domain: process.env.cookie_domains, path: '/' })
//       .clearCookie('_Secure1PSSUD', { domain: process.env.cookie_domains, path: '/' })
//       .send({ message: 'Technical Error' }); console.log(error);
//     return
//   }
  
//   async function editQueue(config) {
//     const promise = new Promise((resolve, reject) => {
//       let data = []
//       let configKeys = []
//       for (let key in config) {
//         if (config[key] !== 'null,null') {
//           if (key !== 'line_id') {
//             if (config[key]) {
//               data.push(`${config[key]}`)
//               configKeys.push(`${key} = ?,`)
//             }
//           }
//         }
//       }
//       if (configKeys.length > 0) configKeys[configKeys.length - 1] = configKeys[configKeys.length - 1].slice(0, -1)
//       data.push(Token.ssuid, config.line_id)

//       let string = `update businesses set ${configKeys.join(" ")} where user_id = ? and line_id = ?`
//       database.query(string, data,(err, result) => {
//         if (err) {console.log(err); reject(err); return} 
//         else {
//           resolve(result)
//         }
//       })
//     })
//     let result = await promise
//     return result
//   };

//   editQueue(req.body).then((result) => {
//     if (result.affectedRows === 1) {
//       res.status(200).send({ message: 'Updated' })
//     }
//   })
// })

// router.post('/que', (req, res) => {
//   try { var Token = verify(req.signedCookies._ss, process.env.cookie_secret) } catch (error) {
//     res
//       .clearCookie('_ss', { domain: process.env.cookie_domains, path: '/' })
//       .clearCookie('_Secure1PSSUD', { domain: process.env.cookie_domains, path: '/' })
//       .send({ message: 'Technical Error' }); console.log(error);
//     return
//   }

//   if (req.body.line) {
//     database.query('select * from line where line_id = ?', req.body.line, (err, results) => {
//       if (err) { res.status(501).send({ messageError: 'Technical Error' }); console.log(err); return }
//       else {
//         res.status(200).send(results)
//       }
//     })
//   } else {
//     res.status(501).send({ messageError: 'Technical Error' }); return
//   }
// })


module.exports = router