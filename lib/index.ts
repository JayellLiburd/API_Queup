import { auth as authorization } from "./auth/authorization";
import { squery as queryBuilder } from "./config/database";
import { database as db} from "./config/config";

export const database = db;
export const auth = authorization;
export const squery = queryBuilder;

const index = {
  database,
  auth,
  squery
};

module.exports = index;