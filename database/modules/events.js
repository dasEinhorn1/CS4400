import db from '../db';

export default {
  getAll: () => {
    return db.query(`select * from Event`)
      .then((rows) => {
        rows.forEach(console.log);
        return rows;
      })
  }
}
