import { database } from "../lib/config/config";
import express from 'express';
const router = express.Router(); 
import { queup } from "./class";

import { verify } from 'jsonwebtoken';
import { auth } from '../lib/index';
import { Request, Response } from "express";
require('dotenv').config()

router.post('/', function (req: Request, res: Response) {
  auth.isVerified(req, res).then((Token: any) => {

    if (!Token) { return res.status(401).send({ Error: 'Not Authorized' } )}

    const { user, line, called } = req.body
    const Q = new queup(user, Token, line, called)
    if (Object.keys(req.body).length === 2) {
      Q.add()
        .then((data: object) => { res.status(200).send(data) })
        .catch((err: any) => { console.log(err); res.status(200).send({ Error: 'There was an error calling this user' }) })
    } else if (called === Number(called)) {
      if (called + 1 > 2) { res.status(200).send({ Error: 'There was an error calling this user' }); return }
      Q.update()
        .then((data: object) => { res.status(200).send(data) })
        .catch((err: any) => { console.log(err); res.status(200).send({ Error: 'Cannot Recall User' }) })
    } else {
      Q.remove()
        .then((data: object) => { res.status(200).send(data) })
        .catch((err: any) => { console.log(err); res.status(200).send({ Error: 'There was an error calling this user' }) })
    }

  })
})


module.exports = router