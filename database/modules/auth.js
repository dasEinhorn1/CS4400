import db from '../db';
import { allUserInfo, userCheckQ } from '../qs';

const UserStatus = {
  APPROVED: 'a',
  PENDING: 'p',
  REJECTED: 'r'
}

const getSingle = (index) => {
  return (rows) => rows[index];
};

const getFirst = getSingle(0);

const createUserChecker = (table) => {
  return (username) => {
    const qStr = userCheckQ(table, username);
    return db.query(qStr)
      .then((rows) => rows.length >= 1)
  }
};

export default {
  login (email, hashedPassword) {
    const qStr = allUserInfo
      + `
        WHERE '${email}' in (select Email from Email
                             where Email.Username = U.Username)
          AND U.Password = '${hashedPassword}'
          AND U.Status = '${UserStatus.APPROVED}'`
    return db.query(qStr)
      .then(getFirst)
  },
  register (user) {
    const qStr = ``;
    return db.query(qStr)
  },
  getUser: (username) => {
    const qStr = allUserInfo
      + `where U.Username = '${username}'`;
    return db.query(qStr)
      .then(getFirst);
  },
  isUser: createUserChecker('User'),
  isVisitor: createUserChecker('Visitor'),
  isEmployee: createUserChecker('Employee'),
  isAdmin: createUserChecker('Administrator'),
  isManager: createUserChecker('Manager'),
  isStaff: createUserChecker('Staff')
}
