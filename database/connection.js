import mysql from 'promise-mysql';

const conn = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'beltline'
});

// conn.connect(err => {
//   if (err) {
//     console.log(err);
//     throw err;
//   }
//   console.log('connected to database');
// });

export default conn;
