import { query } from './connection';
import general from './modules/general';
import auth from './modules/auth';
import admin from './modules/admin';
import employee from './modules/employee';
import manager from './modules/manager';
import staff from './modules/staff';

const db =  {
  query,
  general,
  auth,
  admin,
  employee,
  manager,
  staff,
  helpers: {
    dateify: (d) => (new Date(d)).toISOString().slice(0, 10).replace('T', ' ')
  }
}

export default db;
