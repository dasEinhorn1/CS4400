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
      createFilter('AssignTo.SiteName', site, notNull),
      createConcatFilter('AssignTo.EventName',name, notNull),
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
      SELECT AssignTo.EventName as name,
      AssignTo.StartDate as startDate,
      COUNT(AssignTo.StaffUsername) as staffCount,
      (DATEDIFF(Event.EndDate, Event.StartDate) + 1) AS duration,
      COUNT(VisitEvent.VisitorUsername) AS visits,
      (COUNT(VisitEvent.VisitorUsername) * Event.EventPrice) AS revenue
      FROM AssignTo
      INNER JOIN Event
      ON AssignTo.EventName = Event.EventName
      AND AssignTo.StartDate = Event.StartDate
      AND AssignTo.SiteName = Event.SiteName
      INNER JOIN VisitEvent
      ON AssignTo.EventName = VisitEvent.EventName
        AND AssignTo.StartDate = VisitEvent.StartDate
        AND AssignTo.SiteName = VisitEvent.SiteName
      ${whereClause}
      GROUP BY AssignTo.EventName, AssignTo.StartDate, AssignTo.SiteName
      ${havingClause}`
    return db.query(qStr)
  })
}

const deleteEvent = (event) => {
  const {startDate, username, eventName} = event;
  console.log(startDate);
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

export default {
  getManagerSite,
  getEvents,
  deleteEvent
}
