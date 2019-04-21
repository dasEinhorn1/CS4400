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
      AND Event.StartDate = '${startDate}'`
    return db.query(qStr)
      .then(getFirst)
      .then(evt => ({
        ...evt,
        startDate: db.helpers.dateify(evt.startDate),
        endDate: db.helpers.dateify(evt.endDate)
      }))
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

export default {
  getManagerSite,
  getEvents,
  getEvent,
  getStaffForEvent,
  deleteEvent,
  getStaff,
  createEvent,
  updateEvent
}
