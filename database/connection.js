import mysql from 'promise-mysql';
import dotenv from 'dotenv';
dotenv.config();
// const conn = mysql.createPool({
//   host: process.env.HOST || 'localhost',
//   user: process.env.USER || 'root',
//   password: process.env.PASSWORD || 'password',
//   database: process.env.DATABASE || 'beltline'
// });

const CONNECTION_INFO = {
  host: process.env.HOST || 'localhost',
  port: 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DATABASE || 'beltline'
};

const connect = (info=CONNECTION_INFO) => {
  let conn = null;
  return mysql.createConnection(info)
  .then(cn => {
    conn = cn;
    return cn;
  })
}

export const query = (q) => {
  return connect().then((conn) => {
    const result = conn.query(q);
    // console.log(result);
    conn.end();
    // if (!result) {
      // return;
    // }
    if (process.env.PRINT_QUERIES == 1) {
      console.log('BEGIN QUERY--------------------------------------------')
      console.log(q);
      console.log('END QUERY----------------------------------------------')
    }
    return result;
  })
}

export default {
  connect
};
