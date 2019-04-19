import { query } from './connection';
import events from './modules/events';
import auth from './modules/auth';

const db =  {
  query,
  events,
  auth
};

export default db;
