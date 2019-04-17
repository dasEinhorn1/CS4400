import express from 'express';
import visitsFixture from '../fixtures/visits';
import sitesFixture from '../fixtures/sites';
import eventsFixture from '../fixtures/events';

// TODO: Add validations

const router = express.Router();

// Screen 38
router.get('/history', (req, res, next) => {
  const eventName = req.query.event || '';
  const siteName = req.query.site || '';
  const startDate = req.query.startDate || '';
  const endDate = req.query.endDate || '';
  // query with the above parameters
  // get queried visits from both sites or events
  /* visit = {
    *   date: '2019-01-01',
    *   event: event.name
    *   site: site.name
    *   price: event.price
    * }
    */
  const sites = sitesFixture;
  const visits = visitsFixture;
  const filteredVisits = visits.filter((v) => {
    if (!eventName) return true;
    return eventName === v.event;
  }).filter((v) => {
    if (!siteName || siteName.toLowerCase() === 'all') return true;
    return siteName === v.site;
  }).filter((v) => {
    if (!startDate) return true;
    const dateVal = new Date(startDate);
    if (dateVal === "Invalid Date") return true;
    return dateVal <= new Date(v.date);
  }).filter((v) => {
    if (!endDate) return true;
    const dateVal = new Date(endDate);
    if (dateVal === "Invalid Date") return true;
    return dateVal >= new Date(v.date);
  })
  // get sites to populate site dropdown
  // store user info in session?

  res.render('visit/history', {
    formValues: {
      event: eventName,
      site: siteName,
      startDate: startDate,
      endDate: endDate
    },
    visits: filteredVisits,
    sites: sites
  })
})

// Screen 35
router.get('/sites', (req, res, next) => {
  res.render('visit/sites')
})
// Screen 36
router.get('/sites/:id/transits', (req, res, next) => {
  res.render('visit/site-transit')
})

// Screen 37
router.get('/sites/:id', (req, res, next) => {
  res.render('visit/site')
})

// Screen 33
router.get('/events', (req, res, next) => {
  // get all site names
  const events = eventsFixture;
  const sites = sitesFixture;
  res.render('visit/events', {
    events,
    sites
  })
})

// Screen 34
router.get('/events/:id', (req, res, next) => {
  res.render('visit/event-detail')
})

export default router;
