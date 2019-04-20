import { query } from './connection';
import general from './modules/general';
import auth from './modules/auth';
import admin from './modules/admin';
import employee from './modules/employee';

const db =  {
  query,
  general,
  auth,
  admin,
  employee
}

export default db;
