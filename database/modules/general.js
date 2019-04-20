import db from '../db';
import qs from '../qs';

const getSiteNames = () => {
  return db.query('SELECT SiteName as name FROM Site;')
    .then(rows => rows.map(site => site.name));
}

const filterTransits = (filters) => {
  const { transportType, siteName, lowerPrice, upperPrice } = filters;
  const connectTransWhere = (transportType && transportType != 'all') ?
    `WHERE Connect.TransitType = '${transportType}'` : '';

  const filterArr = [];
  if (siteName && siteName !== 'all') {
    filterArr.push(`Connect.SiteName = '${siteName}'`);
  }
  if (transportType && transportType !== 'all') {
    filterArr.push(`Transit.TransitType = '${transportType}'`);
  }
  if ((lowerPrice || -1) >= 0) {
    filterArr.push(`Transit.TransitPrice >= ${lowerPrice}`);
  }
  if ((upperPrice || -1) >= 0) {
    filterArr.push(`Transit.TransitPrice <= ${upperPrice}`);
  }

  const optionalWhere = (filterArr.length > 0) ?
    ` WHERE ${filterArr.join(' AND ')}` : '';

  const qStr =
    ` SELECT Transit.TransitRoute as route, Transit.TransitType as type,
        Transit.TransitPrice as price,
           (SELECT COUNT(Connect.SiteName)
            FROM Connect ${connectTransWhere}) AS siteCount
      FROM Transit INNER JOIN Connect
      ON Transit.TransitType = Connect.TransitType
        AND Transit.TransitRoute = Connect.TransitRoute ${optionalWhere};`;
  return db.query(qStr);
}

const logTransit = (transitTaken) => {
  const qStr =
    `INSERT INTO TakeTransit (Username, TransitType,
      TransitRoute, TransitDate) VALUES
    ('${transitTaken.username}', '${transitTaken.type}', '${transitTaken.route}', '${transitTaken.date}');`
  return db.query(qStr);
}


export default {
  filterTransits,
  getSiteNames,
  logTransit
}
