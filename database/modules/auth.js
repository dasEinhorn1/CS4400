import db from '../db';
import { allUserInfo } from '../qs';

const UserStatus = {
  APPROVED: 'a',
  PENDING: 'p',
  REJECTED: 'r'
}

export default {
  login (email, hashedPassword) {
    const qStr = allUserInfo
      + `
        WHERE '${email}' in (select Email from Email
          where Email.Username = U.Username)
        AND U.Password = '${hashedPassword}'
        AND U.Status = '${UserStatus.APPROVED}';`
    return db.query(qStr)
      .then((rows) => {
        return rows[0];
      })
  },
  register (user) {
    const qStr = ``;
    return db.query(qStr)
  },
  isVisitor (username) {
    const qStr =
      + `WHERE Email.Email = '${email}'
        AND User.Password = '${hashedPassword}'
        AND User.Status = '${UserStatus.APPROVED}';`
    return db.query(qStr)
      .then((rows) => {
        return rows[0];
      })
  },
  isEmployee (username) {
    const qStr =
     `SELECT *
      FROM Employee
      WHERE Username = 'username'
        AND User.Password = '${hashedPassword}'
        AND User.Status = '${UserStatus.APPROVED}';`
    return db.query(qStr)
      .then((rows) => {
        return rows[0];
      })
  }
}
