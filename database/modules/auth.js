import db from '../db';
import bcrypt from 'bcrypt';
import { allUserInfo, userCheckQ } from '../qs';

const SALT_ROUNDS = 10;

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

const helpers = {
  setUserSession(req) {
    return (user) => {
      if (!user) {
        throw new Error('User not found');
      }
      // set the user in the session and go to dashboard
      const seshUser = {
        username: user.Username,
        firstName: user.FirstName,
        lastName: user.LastName
      };
      req.session.user = seshUser;
    }
  },
  hashPassword (password) {
    return bcrypt.hash(password, SALT_ROUNDS)
  },
  comparePassword (password, hash) {
    return bcrypt.compare(password, hash)
  }
}

// QUERIES

const checkEmailsUnique = (emails) => {
  const emailsQuoted = emails.map(email => `'${email}'`).join(',');
  const qStr =
  ` select Count(Email) as conflicts
    from Email
    where Email in (${emailsQuoted});`;
  return db.query(qStr)
    .then(getFirst)
    .then(({conflicts}) => conflicts < 1);
}

const registerUser = (user) => {
  // (Username, Password, Status, FirstName, LastName)
  const qStr =
  `insert into User values (
    '${user.username}',
    '${user.password}',
    'p',
    '${user.firstName}',
    '${user.lastName}'
  );`;

  return checkEmailsUnique(user.emails).then((unique) => {
      if (!unique) {
        throw new Error('Email(s) already in use')
      }
      return db.query(qStr)
    })
    .then(() => {
      const emails = user.emails.map((eml) => `('${user.username}','${eml}')`).join(',')
      const emailInsert = `insert into Email values ${emails}`;
      return db.query(emailInsert)
    })
}


export default {
  login (email, password) {
    const qStr = allUserInfo
      + `
        WHERE '${email}' in (select Email from Email
                             where Email.Username = U.Username)
          AND U.Status = '${UserStatus.APPROVED}'`
    return db.query(qStr)
      .then(getFirst)
      .then(user => {
        if (!user) throw new Error("User not found");
        return bcrypt.compare(password, user.Password)
          .then(eq => (eq || (user.Password === password)) ? user : undefined);
      })
  },
  registerUser,
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
  isStaff: createUserChecker('Staff'),
  helpers,
}
