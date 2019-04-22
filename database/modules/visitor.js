import db from '../db';
import qs from '../qs';

const getEvents = args => {
  const { username } = args;
  const drop1 = 'DROP VIEW IF EXISTS MY_VISIT_VIEW';
  const drop2 = 'DROP VIEW IF EXISTS ALL_VISIT_VIEW';
  const query1 = `CREATE VIEW MY_VISIT_VIEW AS
  SELECT E.EventName, E.SiteName, E.StartDate, 
  Count(case when VisitorUsername = '${username}' then 'VISIT' ELSE NULL END) AS MyVisits
  FROM Event as E LEFT JOIN VisitEvent as VE
  ON E.EventName = VE.EventName 
  AND E.StartDate = VE.StartDate 
  AND E.SiteName = VE.SiteName
  GROUP BY E.EventName, E.StartDate, E.SiteName`;

  const query2 = `CREATE VIEW ALL_VISIT_VIEW AS
  SELECT E.EventName, E.SiteName, E.StartDate, E.EndDate, E.EventPrice, E.Capacity,
  (E.Capacity - COUNT(VE.VisitorUsername) ) AS TicketsRemaining, COUNT(VE.StartDate) AS TotalVisits, MyVisits,
  E.Description
  FROM Event AS E INNER JOIN VisitEvent AS VE ON E.EventName = VE.EventName
  AND E.SiteName = VE.SiteName AND E.StartDate = VE.StartDate
  INNER JOIN MY_VISIT_VIEW AS MV ON E.EventName = MV.EventName
  AND E.SiteName = MV.SiteName AND E.StartDate = MV.StartDate
  GROUP BY E.EventName, E.SiteName, E.StartDate;`;

  let query3 = 'Select * From ALL_VISIT_VIEW';

  // console.log(args);
  const { filter } = args;
  if (filter == 'true') {
    const {
      name,
      keyword,
      siteName,
      startDate,
      endDate,
      lowerVisitTotal,
      upperVisitTotal,
      lowerTicketPrice,
      upperTicketPrice,
      includeSoldOut,
      includeVisited
    } = args;

    // conditions for an exact match
    let conditions = '';
    let filter = '';
    if (name) {
      filter = `EventName = '${name}'`;
      conditions +=
        conditions.length > 0 ? ` AND ${filter}` : ` WHERE ${filter}`;
    }
    if (keyword) {
      filter = `Description LIKE '%${keyword}%'`;
      conditions +=
        conditions.length > 0 ? ` AND ${filter}` : ` WHERE ${filter}`;
    }
    if (siteName) {
      filter = `SiteName = '${siteName}'`;
      conditions +=
        conditions.length > 0 ? ` AND ${filter}` : ` WHERE ${filter}`;
    }
    if (startDate && endDate) {
      filter = ` StartDate >= '${startDate}' AND EndDate <= '${endDate}'`;
      conditions +=
        conditions.length > 0 ? ` AND ${filter}` : ` WHERE ${filter}`;
    }
    if (lowerVisitTotal && upperVisitTotal) {
      filter = ` TotalVisits >= ${lowerVisitTotal} AND TotalVisits <= ${upperVisitTotal}`;
      conditions +=
        conditions.length > 0 ? ` AND ${filter}` : ` WHERE ${filter}`;
    }
    if (lowerTicketPrice && upperTicketPrice) {
      filter = ` EventPrice >= ${lowerTicketPrice} AND EventPrice <= ${upperTicketPrice}`;
      conditions +=
        conditions.length > 0 ? ` AND ${filter}` : ` WHERE ${filter}`;
    }

    // special checkboxes
    if (!includeSoldOut) {
      filter = ` TicketsRemaining > 0`;
      conditions +=
        conditions.length > 0 ? ` AND ${filter}` : ` WHERE ${filter}`;
    }
    if (!includeVisited) {
      filter = ` MyVisits = 0`;
      conditions +=
        conditions.length > 0 ? ` AND ${filter}` : ` WHERE ${filter}`;
    }

    query3 += conditions;
  } else {
    let required = ' WHERE TicketsRemaining > 0 AND MyVisits = 0';
    query3 += required;
  }

  return db.query(drop1).then(() =>
    db.query(drop2).then(() =>
      db.query(query1).then(() =>
        db.query(query2).then(() =>
          db.query(query3).then(results => {
            return results.map(result => {
              const startDate = result.StartDate.toJSON()
                .toString()
                .slice(0, 10);
              const endDate = result.StartDate.toJSON()
                .toString()
                .slice(0, 10);
              return { ...result, startDate, endDate };
            });
          })
        )
      )
    )
  );
};

const oneEvent = args => {
  const { event, site, startDate, endDate } = args;
  // console.log(event, site, startDate, endDate);
  let query = `  SELECT E.EventName, E.SiteName, E.StartDate, E.EndDate, E.EventPrice, E.Capacity,
  (E.Capacity - COUNT(VE.VisitorUsername) ) AS TicketsRemaining, COUNT(VE.StartDate) AS TotalVisits, E.Description
  FROM Event AS E INNER JOIN VisitEvent AS VE ON E.EventName = VE.EventName
  AND E.SiteName = VE.SiteName AND E.StartDate = VE.StartDate
  WHERE E.EventName = '${event}' AND E.SiteName = '${site}' AND E.StartDate = '${startDate}'
  GROUP BY E.EventName, E.SiteName, E.StartDate`;

  return db.query(query).then(results => {
    return results.map(result => {
      const startDate = result.StartDate.toJSON()
        .toString()
        .slice(0, 10);
      const endDate = result.StartDate.toJSON()
        .toString()
        .slice(0, 10);
      return { ...result, startDate, endDate };
    });
  });
};

const logEvent = args => {

    const { visitDate, event, site, startDate, username } = args;

    let query = `INSERT INTO VisitEvent VALUES ('${username}', '${event}', '${startDate}', '${site}', '${visitDate}')`;
    console.log(query);
    return db.query(query);
};

export default {
  getEvents,
  oneEvent,
  logEvent
};
