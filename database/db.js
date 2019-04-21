import { query } from './connection';
import general from './modules/general';
import auth from './modules/auth';
import admin from './modules/admin';
import employee from './modules/employee';
import manager from './modules/manager';
import staff from './modules/staff';
import visitor from './modules/visitor';

const db =  {
  query,
  general,
  auth,
  admin,
  employee,
  manager,
  staff,
  visitor,
  helpers: {
    dateify: (d) => (new Date(d)).toISOString().slice(0, 10).replace('T', ' ')
  },
}

export default db;
