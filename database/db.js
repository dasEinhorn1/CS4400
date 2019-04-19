import { query } from './connection';
import events from './modules/events';
import auth from './modules/auth';
import admin from './modules/admin';

const db =  {
  query,
  events,
  auth,
  admin
}

export default db;
