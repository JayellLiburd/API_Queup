import express from 'express'
const router = express.Router()
import { squery, database } from '../lib'
require('dotenv').config()

// Connecting to Database
// const {database} = require('../lib/index');

router.post('/', (req: express.Request, res: express.Response) => {

  const {
    all, location, category, rating, open
  } = req.body

  let filter = {
    location: location,
    category: category,
    rating: rating,
    open: open
  }
  if (all) {
    let string = `select * from businesses`
    database.query(string, (err: any, result: any) => {
      if (err) {console.log(err); res.status(500).send({message: 'Internal Server Error'}); return} 
      else {
        res.send(result)
      }
    })
  }
});

router.post('/media', (req, res, next) => {
  const {id} = req.body

  const QString = squery.all('businesses')
  database.query(QString, (err: any, result: any) => {
    if (err) {console.log(err); res.status(500).send({message: 'Internal Server Error'}); return} 
    else {
      res.send(result)
    }
  })
})


module.exports = router
