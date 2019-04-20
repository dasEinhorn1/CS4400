import db from '../db';
import bcrypt from 'bcrypt';
import { allUserInfo, userCheckQ, employeeInsert, getFirst } from '../qs';

const SALT_ROUNDS = 10;

const UserStatus = {
  APPROVED: 'a',
  PENDING: 'p',
  REJECTED: 'r'
}

export const userTypeInsertion = (table, user) => {
  return db.query(`insert into ${table} values ('${user.username}')`)
    .then(() => user);
}


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
const login = (email, password) => {
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
}

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

const checkPhoneUnique = (phone) => {
  const qStr =
    `select Count(Phone) as conflicts
     from Employee
     where Phone = '${phone}';`;
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

  return checkEmailsUnique(user.emails)
    .then((unique) => {
      if (!unique) {
        throw new Error('Email(s) already in use')
      }
      return db.query(qStr)
    }).then(() => {
      const emails = user.emails.map((eml) => `('${user.username}','${eml}')`).join(',')
      const emailInsert = `insert into Email values ${emails}`;
      return db.query(emailInsert)
    }).then(() => user);
}

const registerEmployee = (user) => {
  const insertEmpStr = employeeInsert + `(
    '${user.username}',
    '${user.phone}',
    '${user.address}',
    '${user.city}',
    '${user.state}',
    '${user.zipcode}');`;
  return checkPhoneUnique(user.phone)
    .then((unique) => {
      if (!unique) {
        throw new Error('Phone number already in use');
      }
      return registerUser(user)
    }).then(() => db.query(insertEmpStr))
      .then(() => user);
}

const register = (user, isVisitor=false) => {
  const registerFn = (!user.employeeType) ? registerUser : registerEmployee;
  return registerFn(user)
    .then(u => {
      if (!u.employeeType) {
        return u;
      } else {
        const table = (u.employeeType == "M") ? "Manager" : "Staff";
        return userTypeInsertion(table, u);
      }
    }).then(u => {
      if (isVisitor) {
        return userTypeInsertion('Visitor', u)
      }
      return u
    })
}

const getUser = (username) => {
  const qStr = allUserInfo
    + `where U.Username = '${username}'`;
  return db.query(qStr)
    .then(getFirst);
};

export default {
  login,
  register,
  getUser,
  checkEmailsUnique,
  checkPhoneUnique,
  isUser: createUserChecker('User'),
  isVisitor: createUserChecker('Visitor'),
  isEmployee: createUserChecker('Employee'),
  isAdmin: createUserChecker('Administrator'),
  isManager: createUserChecker('Manager'),
  isStaff: createUserChecker('Staff'),
  helpers,
}
