import mysql from 'promise-mysql';

const conn = mysql.createPool({
  host: process.env.HOST || 'localhost',
  user: process.env.USER || 'root',
  password: process.env.PASSWORD || 'password',
  database: process.env.DATABASE || 'beltline'
});

// conn.connect(err => {
//   if (err) {
//     console.log(err);
//     throw err;
//   }
//   console.log('connected to database');
// });

export default conn;
