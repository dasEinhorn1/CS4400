import mysql from 'mysql';

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'company'
});

con.connect(err => {
  if (err) {
    console.log(err);
    throw err; 
  }
  console.log('connect')
});


export default con;