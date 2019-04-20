import { query } from './connection';
import general from './modules/general';
import auth from './modules/auth';
import admin from './modules/admin';

const db =  {
  query,
  general,
  auth,
  admin
}

export default db;
