import { auth as authorization } from "./auth/authorization";
import { squery as queryBuilder } from "./config/database";
import { database as db} from "./config/config";

declare module 'index' {
  export const database: typeof db;
  export const auth: typeof authorization;
  export const squery: typeof queryBuilder;
}