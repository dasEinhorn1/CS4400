import qs from '../qs';
import db from '../db';

const notNull = (d) => d || undefined;

const getSchedule = (username, filters) => {
  const {eventName, keyword, startDate, endDate } = filters;
  const whereClause = qs.generateAdditional([
    qs.createConcatFilter('AssignTo.EventName', eventName, notNull),
    qs.createConcatFilter('Event.Description', keyword, notNull),
    qs.createConcatFilter('Event.Description', keyword, notNull),
    qs.createFilter('Event.StartDate', startDate, notNull, '>='),
    qs.createFilter('Event.EndDate', endDate, notNull, '<='),
  ])
  const qStr = `
    SELECT AssignTo.EventName as name,
           AssignTo.SiteName as siteName,
           Event.StartDate as startDate,
           Event.EndDate as endDate,
           COUNT(AssignTo.StaffUsername) AS staffCount
    FROM AssignTo INNER JOIN Event
    ON AssignTo.EventName = Event.EventName
      AND AssignTo.StartDate = Event.StartDate
      AND AssignTo.SiteName = Event.SiteName
    WHERE '${username}' in (
      select StaffUsername
      from AssignTo
      where Event.StartDate=AssignTo.StartDate
        AND Event.SiteName=AssignTo.SiteName
        AND Event.EventName = AssignTo.EventName)
    ${whereClause}
    GROUP BY AssignTo.EventName, AssignTo.SiteName, AssignTo.StartDate`;
  return db.query(qStr)
}

const getEvent = (event) => {
  const {name, siteName, startDate} = event;
  const qStr = `
    SELECT Event.EventName as name,
           Event.SiteName as siteName,
           Event.StartDate as startDate,
           Event.EndDate as endDate,
           DATEDIFF(Event.EndDate, Event.StartDate)+ 1 AS duration,
           CONCAT(User.FirstName, ' ', User.LastName) AS staffAssigned,
           User.username,
           Event.Capacity as capacity,
           Event.EventPrice as price,
           Event.Description as description
    FROM AssignTo
    INNER JOIN Event
    ON AssignTo.EventName = Event.EventName
      AND AssignTo.StartDate = Event.StartDate
      AND AssignTo.SiteName = Event.SiteName
    INNER JOIN User
      ON AssignTo.StaffUsername = User.Username
    WHERE AssignTo.SiteName = '${siteName}'
      AND AssignTo.EventName = '${name}'
      AND AssignTo.StartDate = '${startDate}'
    ORDER BY Name`
  return db.query(qStr)
    .then(staffEvents => Object.values(staffEvents.reduce((events, evt) => {
      // add the username as the key of the object
      if (!events[evt.eventName]) {
        events[evt.eventName] = {...evt, staffAssigned: [evt.staffAssigned]};
      } else {
        events[evt.eventName].staffAssigned.push(evt.staffAssigned)
      }
      return events;
    }, {})))
    .then(qs.getFirst)
}


export default {
  getSchedule,
  getEvent
}
