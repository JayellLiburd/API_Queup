const express = require('express')
const router = express.Router();
require('dotenv').config()

const { verify } = require('jsonwebtoken');
const {database} = require('../lib/index');



// ---------------------------------- code begins here -------------------------------- //

router.post('/', 
    (req, res, next) => {


        if (!req.signedCookies._ss) {res.status(401).send({messageAuth: 'Not Authorized'}); return}
        const { employeeID, name, role, line_id } = req.body

        try {var Token = verify(req.signedCookies._ss, process.env.cookie_secret)} catch (error) {
            res
            .clearCookie('_ss', {domain: process.env.cookie_domains, path: '/'})
            .clearCookie('_Secure1PSSUD', {domain: process.env.cookie_domains, path: '/'})
            .send({message: 'Technical Error'}); console.log(error);
            return}

        const addEmployee = "Insert into roster (idemployee, line_id, name, role, database_id) Values (?, ?, ?, ?, (replace(uuid(),'-','')) )"
        database.query(addEmployee, [ employeeID, line_id, name, role ], (err, results) => {
            if (err) {console.log(err); res.status(501).send({ messageError: 'Technical Error'}); return}
            else {
                res.status(201).send([{name: name, employeeID: employeeID}])
            }
        })
    }   
);


module.exports = router