import express from 'express';
const router = express.Router();
import { BusinessTypes, management } from '../lib/config/@Types';
import { auth, database, squery } from '../lib';
import { MysqlError } from 'mysql';
import crypto from 'crypto';


//TODO: add back verification
//  ------------------------- Get all Managed Queues
interface resMyQue extends express.Response {
  send: (data: Array<BusinessTypes> | string) => any
}
router.get('/', (req: express.Request, res: resMyQue) => {
  // auth.isVerified(req, res).then((token: string | boolean) => {
  //   if (typeof token === 'boolean') return;
    const string = squery.allFilter('businesses', ['user_id'], {user_id: 'c1848c71109411ed924c0a33a65a227b'});
    database.query(string, (err: any, result: Array<BusinessTypes>) => {
      if (err) {console.log(err); return res.status(500).send('Internal Server Error')};
      if (result.length === 0) return res.status(404).send('No Queues Found');
      res.status(200).send(result);
    });
  // });
});

// ------------------------- Get all staff in a specific queue relitive to the line_id
interface reqRoster extends express.Request {
  body: { line_id: string }
};
interface resRoster extends express.Response {
  send: (data: Array<management> | string ) => any
};
router.post('/staff', (req: reqRoster, res: resRoster) => {
  const { line_id } = req.body;
  if (!line_id) return res.status(400).send('Bad Request');
  auth.isVerified(req, res).then((token: string | boolean) => {
    if (typeof token === 'boolean') return;
    const Qstring = `SELECT full_name, role, database_id, ID_NO FROM management WHERE line_id = '${line_id}'`;
    database.query(Qstring, (err: any, result: Array<management>) => {
      if (err) {console.log(err); return res.status(500).send('Internal Server Error')};
      res.status(200).send(result);
    });
  });
});

// ------------------------- manage the management roster of a Que
interface reqEditStaff extends express.Request {
  body: Array<management & BusinessTypes>
};
router.post('/change', (req: reqEditStaff, res: express.Response) => {
  let
    managementTypes = [`database_id`, `ID_NO`, `full_name`, `role`, `permissions`, `pin`],
    management: Array<management> = [],
    businessInfo: Array<BusinessTypes> = [];

  for (let data of req.body) {
    delete data.index;
    // this If statement checks if the data is a management type or a business type
    if (Object.keys(data).every((key) => managementTypes.includes(key)) && req.body[0].line_id) {
      data.line_id = req.body[0].line_id;
      management.push(data);
    }
    // also checks if the line_id is provided cause if it is not then it is a business type or a single update
    else if (!req.body[0].line_id) {
      database.query(squery.update('businesses', data, data[0].line_id), (err: MysqlError, result: any) => {
        if (err) {
          console.log({ code: err.code, message: err.sqlMessage, query: err.sql}); 
          res.status(500).send('Internal Server Error');
        } else {
          res.send();
        }
    });
    } else {
      businessInfo.push(data);
    }
  };

  if (management.length > 0) {
    insertManagement(management)
      .then(() => {
        res.send()
      })
      .catch((err: any) => {
        console.log(err);
        res.status(500).send('Internal Server Error');
      });
  }
  else {
    const ObjbusinessInfo = Object.assign({}, ...businessInfo);
    if (ObjbusinessInfo.line_id === undefined) return res.status(400).send('Bad Request');
    else {
        database.query(squery.update('businesses', ObjbusinessInfo, ObjbusinessInfo.line_id), (err: MysqlError, result: any) => {
          if (err) {
            console.log({ code: err.code, message: err.sqlMessage, query: err.sql}); 
            res.status(500).send('Internal Server Error');
          } else {
            res.send();
          }
        });
    };
    }
});

module.exports = router;

function insertManagement(management: Array<management>) {
  return new Promise<void>((resolve, reject) => { 
    if (management.length > 0) {
      let changeStaff = 'Insert into management Values ';
      for (let data of management) {
        const luckynum = new Uint32Array(2);
        changeStaff += `('${crypto.randomFillSync(luckynum).join('')}', '${data.ID_NO}', '${data.line_id}', '${data.full_name}', '${data.role}', '${data.permissions}', '${data.pin}'),`;
      }
      changeStaff = changeStaff.slice(0, -1) + ';';
      database.query(changeStaff, (err: MysqlError, result: any) => {
        if (err) {
          console.log({ code: err.code, message: err.sqlMessage, query: err.sql}); 
          reject(err)
        } else {
          resolve();
        }
      });
    };
  });
};

function editManagement(user: management) {
  return new Promise<void>((resolve, reject) => {
    if (!user.line_id) return reject('No line_id provided');
    database.query(squery.update('management', user, user.line_id), (err: MysqlError, result: any) => {
      if (err) {
        console.log({ code: err.code, message: err.sqlMessage, query: err.sql}); 
        reject(err)
      } else {
        resolve();
      }
    });
  });
}