import db from '../db';
import qs from '../qs';

const getSiteNames = () => {
  return db.query('SELECT SiteName as name FROM Site;')
    .then(rows => rows.map(site => site.name));
}

const filterTransits = (filters) => {
  const { transportType, siteName, lowerPrice, upperPrice } = filters;
  const notNullOrAll = (d) => d && d != 'all';
  const posNum = (d) => (d || -1) >= 0;

  const connectTransWhere = qs.generateWhere([
    qs.createFilter('Connect.TransitType', transportType, notNullOrAll)
  ])
  const optionalWhere = qs.generateWhere([
    qs.createFilter('Connect.SiteName', siteName, notNullOrAll),
    qs.createFilter('Transit.TransitType', transportType, notNullOrAll),
    qs.createFilter('Transit.TransitPrice', lowerPrice, posNum, '<='),
    qs.createFilter('Transit.TransitPrice', upperPrice, posNum, '>=')
  ])

  const qStr =
    ` SELECT Transit.TransitRoute as route, Transit.TransitType as type,
        Transit.TransitPrice as price,
           (SELECT COUNT(Connect.SiteName)
            FROM Connect ${connectTransWhere}) AS siteCount
      FROM Transit INNER JOIN Connect
      ON Transit.TransitType = Connect.TransitType
        AND Transit.TransitRoute = Connect.TransitRoute ${optionalWhere}`;
  return db.query(qStr);
}

const logTransit = (transitTaken) => {
  const qStr =
    `INSERT INTO TakeTransit (Username, TransitType,
      TransitRoute, TransitDate) VALUES
    ('${transitTaken.username}', '${transitTaken.type}', '${transitTaken.route}', '${transitTaken.date}');`
  return db.query(qStr);
}

const getTransitsTaken = () => {
  
}


export default {
  filterTransits,
  getSiteNames,
  logTransit
}
