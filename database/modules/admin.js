import db from '../db';
import qs from '../qs';

import { filter } from 'bluebird';

// Screen 18
const getAllUsers = () => {
  let query = qs.allUserInfoWithNumEmails;

  return db.query(query).then(users => {
    users = users.map(user => {
      let userType = '';
      if (user.isAdmin) {
        userType = 'Admin';
      } else if (user.isManager) {
        userType = 'Manager';
      } else if (user.isStaff) {
        userType = 'Staff';
      } else if (user.isVisitor) {
        userType = 'Visitor';
      } else {
        userType = 'User';
      }

      let status = '';
      if (user.Status == 'a') {
        status = 'Approved';
      } else if (user.Status == 'p') {
        status = 'Pending';
      } else if (user.Status == 'd') {
        status = 'Declined';
      }

      return { ...user, userType: userType, status: status };
    });
    return users;
  });
};

const filterUsers = args => {
  // filter: username, userType, status
  const username = args.username || '';
  const userType = args.userType || '';
  const status = args.status || '';
  // console.log(username, userType, status);

  let query = qs.createAllUserView;
  let filterQuery = 'SELECT * FROM USERS_VIEW';
  let conditions = '',
    usernameFilter = '',
    statusFilter = '',
    userTypeFilter = '';

  if (username.length > 0) {
    usernameFilter = `Username = '${username}'`;
    conditions +=
      conditions.length > 0
        ? ` AND ${usernameFilter}`
        : ` WHERE ${usernameFilter}`;
  }
  if (status.length > 0 && status != 'all') {
    statusFilter = `Status = '${status}'`;
    conditions +=
      conditions.length > 0 ? ` AND ${statusFilter}` : ` WHERE ${statusFilter}`;
  }
  if (userType.length > 0 && userType != 'User') {
    if (userType == 'Manager') {
      userTypeFilter = `isManager = 1`;
    } else if (userType == 'Staff') {
      userTypeFilter = `isStaff = 1`;
    } else if (userType == 'Visitor') {
      userTypeFilter = `isVisitor = 1`;
    }

    conditions +=
      conditions.length > 0
        ? ` AND ${userTypeFilter}`
        : ` WHERE ${userTypeFilter}`;
  }

  filterQuery += conditions;
  // console.log(filterQuery);

  return db
    .query('DROP VIEW IF EXISTS USERS_VIEW')
    .then(() => {
      return db.query(query);
    })
    .then(() => {
      return db.query(filterQuery);
    })
    .then(users => {
      const results = users.map(user => {
        let status = '';
        if (user.Status == 'a') {
          status = 'Approved';
        } else if (user.Status == 'p') {
          status = 'Pending';
        } else if (user.Status == 'd') {
          status = 'Declined';
        }

        return { ...user, userType: userType, status: status };
      });
      return results;
    });
};

const updateUserStatus = args => {
  const username = args.username || '';
  const status = args.status || '';

  const query = `UPDATE User SET Status = '${status}' WHERE Username = '${username}';`;
  console.log(query);
  return db.query(query).then(result => {
    console.log(result);
  });
};



export default {
  getAllUsers,
  filterUsers,
  updateUserStatus,
  
};
