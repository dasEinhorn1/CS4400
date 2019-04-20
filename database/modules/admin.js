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

// SCREEN 19
const getAllSites = () => {
  let query =
    'SELECT Site.SiteName, User.FirstName, User.LastName, Site.OpenEveryday, User.Username FROM Site INNER JOIN User ON Site.ManagerUsername = User.Username';

  return db.query(query).then(rows => {
    rows = rows.map(row => {
      const fullName = `${row.FirstName} ${row.LastName}`;
      let isOpenEveryday = row.OpenEveryday.toJSON().data[0];
      return {
        ...row,
        fullName: fullName,
        openEveryday: isOpenEveryday ? 'Yes' : 'No'
      };
    });
    // console.log(rows);
    return rows;
  });
};

const filterSites = args => {
  const site = args.site || '';
  const manager = args.manager || ''; // manager's username
  let openEveryday = args.openEveryday || '';

  let query =
    'SELECT Site.SiteName, User.FirstName, User.LastName, User.Username, Site.OpenEveryday, Site.SiteAddress, Site.SiteZipcode FROM Site INNER JOIN User ON Site.ManagerUsername = User.Username';
  let conditions = '';

  if (site.length > 0) {
    const siteFilter = `Site.SiteName = '${site}'`;
    conditions +=
      conditions.length > 0 ? ` AND ${siteFilter}` : ` WHERE ${siteFilter}`;
  }

  if (manager.length > 0) {
    const managerFilter = `User.Username = '${manager}'`;
    conditions +=
      conditions.length > 0
        ? ` AND ${managerFilter}`
        : ` WHERE ${managerFilter}`;
  }

  if (openEveryday.length > 0) {
    openEveryday = openEveryday == 'true' ? 1 : 0;
    const everydayFilter = `Site.OpenEveryDay = ${openEveryday}`;
    conditions +=
      conditions.length > 0
        ? ` AND ${everydayFilter}`
        : ` WHERE ${everydayFilter}`;
  }
  query += conditions;
  // console.log(query);

  return db.query(query).then(rows => {
    return rows.map(row => {
      const fullName = `${row.FirstName} ${row.LastName}`;
      let isOpenEveryDay = row.OpenEveryday.toJSON().data[0];
      return {
        ...row,
        fullName: fullName,
        openEveryday: isOpenEveryDay ? 'Yes' : 'No'
      };
    });
  });
};

const deleteSite = args => {
  const site = args.site || '';
  let query = `DELETE FROM Site WHERE Site.SiteName = '${site}'`;
  console.log(query);
  return db.query(query);
};

const fetchManagers = () => {
  let query =
    'select User.Username, FirstName, LastName from User INNER JOIN Manager ON User.Username = Manager.Username';
  return db.query(query).then(rows => {
    return rows.map(row => {
      const fullName = `${row.FirstName} ${row.LastName}`;
      return {
        ...row,
        fullName: fullName
      };
    });
  });
};
const fetchUnassignedManagers = () => {
  let query =
    'select User.Username, FirstName, LastName from User INNER JOIN Manager ON User.Username = Manager.Username WHERE User.Username NOT IN (SELECT ManagerUsername FROM Site)';
  return db.query(query).then(rows => {
    return rows.map(row => {
      const fullName = `${row.FirstName} ${row.LastName}`;
      return {
        ...row,
        fullName: fullName
      };
    });
  });
};

const updateSite = args => {
  const {
    siteName,
    zipcode,
    address,
    manager,
    openEveryday,
    originalSiteName
  } = args;
  let openEverydayInt = openEveryday == 'true ' ? 1 : 0;
  let query = `UPDATE Site SET SiteName = '${siteName}', SiteAddress = '${address}', SiteZipcode = '${zipcode}', OpenEveryday = ${openEverydayInt}, ManagerUsername = '${manager}' WHERE SiteName = '${originalSiteName}'`;
  console.log(query);

  return db.query(query);
};

export default {
  getAllUsers,
  filterUsers,
  updateUserStatus,
  getAllSites,
  filterSites,
  deleteSite,
  updateSite,
  fetchManagers,
  fetchUnassignedManagers
};
