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
  // console.log(query);

  return db.query(query);
};

const createSite = args => {
  let { name, zipcode, address, manager } = args;
  if (name.length < 1) name = null;
  const openEveryday = args.openEveryday || '';
  let openEverydayInt = openEveryday == 'Yes' ? 1 : 0;
  let query = `INSERT INTO Site(SiteName, SiteAddress, SiteZipcode, OpenEveryday, ManagerUsername) VALUES ('${name}', '${address}', '${zipcode}', ${openEverydayInt}, '${manager}')`;

  console.log(query);
  return db.query(query);
};

const transitQueryBuilder = filters => {
  let drop1 = `DROP VIEW IF EXISTS Filter_Transit_View;`;
  let drop2 = `DROP VIEW IF EXISTS Filter_Connect_View;`;
  let drop3 = 'DROP VIEW IF EXISTS Transit_Site_View;';
  let drop4 = 'DROP VIEW IF EXISTS Transit_View';

  if (filters) {
    var { siteName } = filters;
  }

  let q1_1 = `
    -- filter by any SiteName
    CREATE VIEW Filter_Connect_View AS SELECT TransitType, TransitRoute FROM Connect`;
  let q1_2 = `GROUP BY TransitType, TransitRoute;`;
  // apply 'siteName' filter
  let query1 = filters
    ? `${q1_1} WHERE SiteName = '${siteName}' ${q1_2}`
    : `${q1_1} ${q1_2}`;

  let query2 = `
    -- Filter Transit By Filtered Type + Price
    CREATE VIEW Filter_Transit_View AS
    SELECT T.TransitType, T.TransitRoute, T.TransitPrice
    FROM Transit AS T INNER JOIN Filter_Connect_View AS FCV
    ON T.TransitType = FCV.TransitType AND T.TransitRoute = FCV.TransitRoute;`;

  let query3 = `
    -- Create a view tih filtered Sites
    CREATE VIEW Transit_Site_View AS
    select T.TransitType, T.TransitRoute, T.TransitPrice, COUNT(*) AS ConnectedSites FROM Filter_Transit_View AS T
    inner join Connect AS C ON T.TransitType = C.TransitType AND T.TransitRoute = C.TransitRoute
    GROUP BY T.TransitType, T.TransitRoute;`;

  let query4 = `
    -- Create a View with with Logs
    CREATE VIEW Transit_View AS 
    SELECT TSV.TransitType, TSV.TransitRoute, TSV.TransitPrice, TSV.ConnectedSites, Count(TT.TransitRoute) AS TransitLogs FROM Transit_Site_View as TSV
    LEFT JOIN TakeTransit AS TT ON TSV.TransitRoute = TT.TransitRoute AND TSV.TransitType = TT.TransitType
    GROUP BY TSV.TransitType, TSV.TransitRoute;
  `;

  let query5 = 'SELECT * FROM Transit_View';
  if (filters) {
    var { transportType, route, priceMin, priceMax } = filters;
    let filterQuery = '';

    if (transportType.length > 0) {
      filterQuery +=
        filterQuery.length > 0
          ? ` AND TransitType = '${transportType}'`
          : ` WHERE TransitType= '${transportType}'`;
    }
    if (route.length > 0) {
      filterQuery +=
        filterQuery.length > 0
          ? ` AND TransitRoute = '${route}'`
          : ` WHERE TransitRoute = '${route}'`;
    }

    if (priceMin.length > 0 && priceMax.length > 0) {
      filterQuery +=
        filterQuery.length > 0
          ? ` AND TransitPrice BETWEEN ${priceMin} AND ${priceMax}`
          : ` WHERE TransitPrice BETWEEN ${priceMin} AND ${priceMax}`;
    }
    if (filterQuery.length > 0) {
      query5 += filterQuery;
    }
    // console.log(query5);
  }

  return { drop1, drop2, drop3, drop4, query1, query2, query3, query4, query5 };
};

const getAllTransits = () => {
  let {
    drop1,
    drop2,
    drop3,
    drop4,
    query1,
    query2,
    query3,
    query4,
    query5
  } = transitQueryBuilder();

  return db
    .query(drop1)
    .then(() => db.query(drop2))
    .then(() => db.query(drop3))
    .then(() => db.query(drop4))
    .then(() => db.query(query1))
    .then(() => db.query(query2))
    .then(() => db.query(query3))
    .then(() => db.query(query4))
    .then(() => db.query(query5));
};

const filterTransits = filters => {
  let {
    drop1,
    drop2,
    drop3,
    drop4,
    query1,
    query2,
    query3,
    query4,
    query5
  } = transitQueryBuilder(filters);

  return db
    .query(drop1)
    .then(() => db.query(drop2))
    .then(() => db.query(drop3))
    .then(() => db.query(drop4))
    .then(() => db.query(query1))
    .then(() => db.query(query2))
    .then(() => db.query(query3))
    .then(() => db.query(query4))
    .then(() => db.query(query5));
  // console.log(query);
};

const getConnect = args => {
  let query = `SELECT T.TransitType, T.TransitRoute, T.TransitPrice, SiteName 
  FROM Transit AS T INNER JOIN Connect as C ON T.TransitType = C.TransitType 
  AND T.TransitRoute = C.TransitRoute`;

  if (args) {
    const { route, type } = args;
    const conditions = qs.generateWhere([
      qs.createFilter('T.TransitRoute', route),
      qs.createFilter('T.TransitType', type)
    ]);

    query += conditions;
  }
  return db.query(query);
};

const updateTransitAndConnect = args => {
  let { type, route, price, sites, initialRoute } = args;

  if (typeof sites == 'string') {
    sites = [sites];
  }
  let siteNames = "'" + sites.join("','") + "'";

  // update Transit
  let query = `UPDATE Transit SET TransitRoute = '${route}', TransitPrice = ${price} 
  WHERE TransitType = '${type}' AND TransitRoute = '${initialRoute}'`;
  return db.query(query).then(() => {
    // remove connect
    query = `DELETE FROM Connect WHERE TransitType = '${type}' AND TransitRoute = '${route}' AND SiteName NOT IN (${siteNames})`;
    return db.query(query).then(() => {
      // insert connect
      let values = sites.map(site => `('${site}', '${type}', '${route}')`);
      values = values.join(',');
      query = `INSERT IGNORE INTO Connect VALUES ${values}`;

      return db.query(query);
    });
  });
};

const createTransit = args => {
  let { type, route, price, sites, initialRoute } = args;
  // parsing
  price = parseFloat(price);
  if (typeof sites == 'string') {
    sites = [sites];
  }
  
  let siteNames = "'" + sites.join("','") + "'";
  let query = `INSERT INTO Transit VALUES ('${type}', '${route}', ${price})`;
  // Create Transit
  return db.query(query).then(() => {
    // Create Connect
    let values = sites.map(site => `('${site}', '${type}', '${route}')`);
    values = values.join(',');
    query = `INSERT INTO CONNECT VALUES ${values}`;

    return db.query(query);
  })
}

const deleteTransit = args => {
  const { route, type } = args;

  let query = `DELETE FROM Transit WHERE TransitRoute = '${route}' AND TransitType = '${type}'`;
  return db.query(query);
}


export default {
  getAllUsers,
  filterUsers,
  updateUserStatus,
  getAllSites,
  filterSites,
  deleteSite,
  createSite,
  updateSite,
  fetchManagers,
  fetchUnassignedManagers,
  getAllTransits,
  filterTransits,
  createTransit,
  deleteTransit,
  getConnect,
  updateTransitAndConnect
};
