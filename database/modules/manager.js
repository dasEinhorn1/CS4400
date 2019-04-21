import db from '../db';
import { getFirst, generateWhere, generateHaving,
  createFilter, createRangeFilters, createConcatFilter} from '../qs';

const notNull = (d) => d || undefined;
const notNullOrAll = (d) => d && d != 'all';
const posNum = (d) => (d || -1) >= 0;

const getManagerSite = (username) => {
  const qStr = `
    SELECT Site.SiteName as name
    FROM Site INNER JOIN Manager
    ON Site.ManagerUsername = Manager.Username
    WHERE Site.ManagerUsername = '${username}'`
  return db.query(qStr)
    .then(getFirst)
    .then(({name}) => name);
}

const getEvents = (filters) => {
  const {
    username, name, keyword,
    startDate, endDate,
    lowerDuration, upperDuration,
    lowerVisit, upperVisit,
    lowerRevenue, upperRevenue
  } = filters;
  return getManagerSite(username).then((site) => {
    const whereClause = generateWhere([
      createFilter('Event.SiteName', site, notNull),
      createConcatFilter('Event.EventName',name, notNull),
      createConcatFilter('Event.Description', keyword, notNull),
      createFilter('Event.StartDate', startDate, notNull, '>='),
      createFilter('Event.EndDate', endDate, notNull, '<='),
    ]);
    const havingClause = generateHaving([
      ...createRangeFilters('duration', [lowerDuration, upperDuration], posNum),
      ...createRangeFilters('visits', [lowerVisit, upperVisit], posNum),
      ...createRangeFilters('revenue', [lowerRevenue, upperRevenue], posNum)
    ]);
    const qStr = `
    SELECT Event.EventName as name,
      Event.StartDate as startDate,
      COUNT(AssignTo.StaffUsername) as staffCount,
      (DATEDIFF(Event.EndDate, Event.StartDate) + 1) AS duration,
      COUNT(VisitEvent.VisitorUsername) AS visits,
      (COUNT(VisitEvent.VisitorUsername) * Event.EventPrice) AS revenue
      FROM Event
      Left JOIN AssignTo
      ON AssignTo.EventName = Event.EventName
      AND AssignTo.StartDate = Event.StartDate
      AND AssignTo.SiteName = Event.SiteName
      left JOIN VisitEvent
      ON AssignTo.EventName = VisitEvent.EventName
        AND AssignTo.StartDate = VisitEvent.StartDate
        AND AssignTo.SiteName = VisitEvent.SiteName
    ${whereClause}
    GROUP BY Event.EventName, Event.StartDate, Event.SiteName;
    ${havingClause}`
    return db.query(qStr)
  })
}

const deleteEvent = (event) => {
  const {startDate, username, eventName} = event;
  // console.log(typeof startDate);
  return getManagerSite(username).then((site) => {
    const qStr = `
      DELETE FROM Event
      WHERE Event.EventName = '${eventName}'
        AND Event.StartDate = '${startDate}'
        AND Event.SiteName = '${site}'`;
    return db.query(qStr)
  })
}

const getStaff = () => {
  return db.query(`
    SELECT User.FirstName as firstName,
           User.LastName as lastName,
           User.Username as username
    FROM User JOIN Staff ON User.Username = Staff.Username`)
}

const getStaffAt = (siteName, filters) => {
  const whereClause = generateWhere([
    createFilter('AssignTo.SiteName', siteName),
    createConcatFilter('firstName', filters.firstName, notNull),
    createConcatFilter('lastName', filters.lastName, notNull),
    createFilter('AssignTo.StartDate', filters.startDate, notNull, '>='),
    createFilter('AssignTo.StartDate', filters.endDate, notNull, '<='),
  ])
  const qStr = `
    SELECT User.Firstname AS firstName,
           User.Lastname AS lastName,
           User.Username AS username,
           COUNT(AssignTo.EventName) AS eventShifts
    FROM AssignTo
    INNER JOIN User ON AssignTo.StaffUsername = User.Username
    INNER JOIN Event ON AssignTo.EventName = Event.EventName
      AND AssignTo.StartDate = Event.StartDate
      AND AssignTo.SiteName = Event.SiteName
    ${whereClause}
    GROUP BY User.Username`
  console.log(qStr);
  return db.query(qStr)
}


const getStaffForEvent = (event) => {
  const {siteName, startDate, name, endDate} = event;
  let markSelected = '',
      assignedCheck = '';
  if (siteName) {
    markSelected = `, CASE WHEN exists (
      select StaffUsername
      from AssignTo
      where User.Username = StaffUsername
        AND AssignTo.StartDate = '${startDate}'
        AND AssignTo.EventName ='${name}'
        AND AssignTo.SiteName ='${siteName}') then 1 else 0 end as assigned`
    assignedCheck = `OR (AssignTo.StartDate = '${startDate}'
      AND AssignTo.EventName ='${name}'
      AND AssignTo.SiteName ='${siteName}')`
  }
  const qStr = `
    Select User.Username as username,
           User.FirstName as firstName,
           User.LastName as lastName ${markSelected}
    FROM User INNER JOIN Staff ON User.Username = Staff.Username
    WHERE User.username IN (SELECT StaffUsername
        FROM AssignTo
        WHERE AssignTo.StartDate NOT BETWEEN '${startDate}' AND '${endDate}'
      		${assignedCheck})`
  return db.query(qStr)
}

const staffAreAvailable = (staffList, [startDate, endDate]) => {
  const staffQList = staffList.map(s => `'${s}'`)
  const qStr = `Select Count(*) as ct
    FROM Employee INNER JOIN Staff on Employee.Username = Staff.Username
    WHERE Employee.username IN (
        SELECT StaffUsername
        FROM AssignTo
        WHERE AssignTo.StartDate NOT BETWEEN '${startDate}' AND '${endDate}'
          AND StaffUsername IN (${staffQList}))`
  return db.query(qStr)
    .then(getFirst)
    .then(({ ct }) => {
      console.log(ct);
      return ct == staffList.length
    })
}

const createEvent = (username, newEvent) => {
  const {name, startDate, endDate, price,
    capacity, description, minStaff, assignedStaff} = newEvent;
  return getManagerSite(username)
    .then(siteName => {
      // make sure the staff are available
      return staffAreAvailable(assignedStaff, [startDate, endDate])
        .then(staffAvailable => {
          if (!staffAvailable) {
            throw new Error('Some selected staff are unavailable during this time')
          }
          const qStr = `INSERT INTO Event
          (EventName, StartDate, SiteName, EndDate, EventPrice, Capacity, Description, MinStaffRequired)
          VALUES ('${name}',
            '${startDate}',
            '${siteName}',
            '${endDate}',
            ${price},
            ${capacity},
            '${description}',
            '${minStaff}')`
          return db.query(qStr)
        }).then(() => {
          const inserts = assignedStaff.map((s) => {
            return `('${s}', '${name}', '${startDate}', '${siteName}')`
          }).join(',')
          const qStr = `INSERT INTO AssignTo (StaffUsername, EventName, StartDate, SiteName) VALUES
            ${inserts}`
          return db.query(qStr)
        })
    })
}

const getEvent = (username, event) => {
  const {name, startDate} = event;
  console.log(event);
  return getManagerSite(username).then(siteName => {
    const qStr = `
    SELECT Event.EventName AS name,
           Event.EventPrice AS price,
           Event.StartDate AS startDate,
           Event.EndDate AS endDate,
           Event.MinStaffRequired AS minStaff,
           Event.Capacity AS capacity,
           Event.Description AS description,
           Event.SiteName AS siteName
    FROM Event
    WHERE Event.SiteName = '${siteName}'
      AND Event.EventName = '${name}'
      AND Event.StartDate = '${db.helpers.dateify(startDate)}'`
    console.log(qStr);
    return db.query(qStr)
      .then(getFirst)
      .then(evt => {
        if (!evt) throw new Error('No event found')
        return {
          ...evt,
          startDate: db.helpers.dateify(evt.startDate),
          endDate: db.helpers.dateify(evt.endDate)
        }
      })
  })
};

const updateEvent = (username, event) => {
  const {name, startDate, description, assignedStaff} = event;
  return getManagerSite(username).then(siteName => {
    const qStr = `
      UPDATE Event
      SET Event.Description = '${description}'
      WHERE Event.EventName = '${name}'
        AND Event.StartDate = '${startDate}'
        AND Event.SiteName = '${siteName}'`
    return db.query(qStr).then(() => {
      const qStr = `
        DELETE FROM AssignTo
        WHERE AssignTo.EventName = '${name}'
          AND AssignTo.StartDate = '${startDate}'
          AND AssignTo.SiteName = '${siteName}'`;
      return db.query(qStr)
    }).then(() => {
      const inserts = assignedStaff.map((s) => {
        return `('${s}', '${name}', '${startDate}', '${siteName}')`
      }).join(',')
      const qStr = `INSERT INTO AssignTo (StaffUsername, EventName, StartDate, SiteName) VALUES
        ${inserts}`
      return db.query(qStr)
    })
  })
}

const getEventVisitDetails = ({siteName, name, startDate}, filters) => {
  const {lowerDailyVisits, upperDailyVisits, lowerRevenue, upperRevenue} = filters;
  const havingClause = generateHaving([
    ...createRangeFilters('visits', [lowerDailyVisits, upperDailyVisits], posNum),
    ...createRangeFilters('revenue', [lowerRevenue, upperRevenue], posNum)
  ])
  const qStr = `
  SELECT VisitEvent.VisitEventDate as date,
    COUNT(VisitEvent.VisitorUsername) AS visits,
    (COUNT(VisitEvent.VisitorUsername) * Event.EventPrice) AS revenue
  FROM VisitEvent INNER JOIN Event
    ON VisitEvent.EventName = Event.EventName
      AND VisitEvent.StartDate = Event.StartDate
      AND VisitEvent.SiteName = Event.SiteName
  WHERE VisitEvent.SiteName = '${siteName}'
    AND VisitEvent.EventName = '${name}'
    AND VisitEvent.StartDate = '${startDate}'
  GROUP BY VisitEvent.VisitEventDate
  ${havingClause}`
  return db.query(qStr)
}


const makeSiteReport = (siteName, startDate, endDate) => {
  `SELECT VisitSite.VisitDate AS date,
           COUNT(DISTINCT AssignTo.EventName AS name,
           AssignTo.StartDate, AssignTo.SiteName) AS eventCount,
           COUNT(AssignTo.StaffUsername) AS staffCount,
           COUNT(VisitSite.VisitorUsername) AS totalVisits,
           SUM(Event.EventPrice) AS totalRevenue
    FROM AssignTo
    INNER JOIN Event ON AssignTo.EventName = Event.EventName
      AND AssignTo.StartDate = Event.StartDate
      AND AssignTo.SiteName = Event.SiteName
    INNER JOIN VisitSite ON AssignTo.SiteName = VisitSite.SiteName
    INNER JOIN VisitEvent ON AssignTo.EventName = VisitEvent.EventName
      AND AssignTo.StartDate = VisitEvent.StartDate
      AND AssignTo.SiteName = VisitEvent.SiteName
    WHERE AssignTo.SiteName = ${sitename}
      AND Event.StartDate <= ${sitedate}
      AND Event.EndDate >= ${sitedate}
      AND VisitSite.VisitDate = ${sitedate}
      AND VisitEvent.VisitEventDate = ${sitedate}
    GROUP BY VisitSite.VisitDate
    HAVING EventCount >= ${lowerevent}
      AND Eventcount <= ${higherevent}
      AND StaffCount >= ${lowerstaff}
      AND StaffCount <= ${higherstaff}
      AND TotalVisits >= ${lowervisits}
      AND TotalVisits <= ${highervisits}
      AND TotalRevenue >= ${lowerrevenue}
      AND TotalRevenue <= ${highervisits}`
}

const getSiteDaily = (siteName, siteDate) => {
  const qStr = `
    SELECT VisitEvent.EventName as name,
           CONCAT(User.Firstname, ' ', User.Lastname) AS staff,
           COUNT(VisitEvent.VisitorUsername) AS visits,
           (COUNT(VisitEvent.VisitorUsername)*Event.EventPrice) AS revenue
    FROM VisitEvent
    INNER JOIN AssignTo ON VisitEvent.EventName = AssignTo.EventName
      AND VisitEvent.StartDate = AssignTo.StartDate
      AND VisitEvent.SiteName = AssignTo.SiteName
    INNER JOIN Event ON VisitEvent.EventName = Event.EventName
      AND VisitEvent.StartDate = Event.StartDate
      AND VisitEvent.SiteName = Event.SiteName
    INNER JOIN User ON AssignTo.StaffUsername = User.Username
    WHERE VisitEvent.VisitEventDate = '${siteDate}'
      AND VisitEvent.SiteName = '${siteName}'
    GROUP BY VisitEvent.EventName, VisitEvent.StartDate, VisitEvent.SiteName, staff`
  return db.query(qStr)
    .then(dailies => Object.values(dailies.reduce((daily, evt) => {
      if (!daily[evt.name]) {
        daily[evt.name] = {...evt, staff: [evt.staff]};
      } else {
        daily[evt.name].staff.push(evt.staff)
      }
      return daily;
    }, {})))
}

export default {
  getManagerSite,
  getEvents,
  getEvent,
  getStaffForEvent,
  getEventVisitDetails,
  deleteEvent,
  getStaff,
  getStaffAt,
  createEvent,
  updateEvent,
  getSiteDaily
}
