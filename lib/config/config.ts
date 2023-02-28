import mysql from "mysql";;
import fs from "fs";
import path from "path";

export const database  = mysql.createPool({
  host: process.env.db_host,
  user: process.env.db_user,
  password: process.env.db_password,
  database: process.env.db_database,
  ssl: {ca: fs.readFileSync(path.join(__dirname,'DigiCertGlobalRootCA.crt.pem'))},
});

export interface Database {
  type: 'Insert' | 'Update' | 'Delete' | 'Select'
  table: `businesses` | `line` | `prefrences` | `management` | `ui` | `users`| `tester`
}
