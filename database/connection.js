import mysql from 'mysql';

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'beltline'
});

conn.connect(err => {
  if (err) {
    console.log(err);
    throw err; 
  }
  console.log('connected to database');
});


export default conn;