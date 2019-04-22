import express from 'express';
import Auth from '../middleware/Auth';
import visitsFixture from '../fixtures/visits';
import sitesFixture from '../fixtures/sites';
import eventsFixture from '../fixtures/events';
import db from '../database/db';

// TODO: Add validations

const router = express.Router();
router.use(Auth.visitor);

// Screen 38
router.get('/history', (req, res, next) => {
  const eventName = req.query.event || '';
  const siteName = req.query.site || '';
  const startDate = req.query.startDate || '';
  const endDate = req.query.endDate || '';

  const sites = sitesFixture;
  const visits = visitsFixture;
  const filteredVisits = visits
    .filter(v => {
      if (!eventName) return true;
      return eventName === v.event;
    })
    .filter(v => {
      if (!siteName || siteName.toLowerCase() === 'all') return true;
      return siteName === v.site;
    })
    .filter(v => {
      if (!startDate) return true;
      const dateVal = new Date(startDate);
      if (dateVal === 'Invalid Date') return true;
      return dateVal <= new Date(v.date);
    })
    .filter(v => {
      if (!endDate) return true;
      const dateVal = new Date(endDate);
      if (dateVal === 'Invalid Date') return true;
      return dateVal >= new Date(v.date);
    });
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
  });
});

// Screen 35
router.get('/sites', (req, res, next) => {
  const name = req.query.site;
  const openEveryday = req.query.openEveryday;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const lowerVisitTotal = req.query.lowerVisitTotal;
  const upperVisitTotal = req.query.upperVisitTotal;
  const lowerEventCount = req.query.lowerEventCount;
  const upperEventCount = req.query.upperEventCount;
  const includeVisited = req.query.includeVisited;

  // get the sites from the database
  const sites = [
    {
      name: 'Inman Park',
      address: 'Inman Park',
      city: 'Atlanta',
      state: 'GA',
      zipcode: '30307',
      eventCount: 4,
      openEveryday: true,
      totalVisits: 200,
      myVisits: 1
    },
    {
      name: 'Gorden-White Park',
      address: 'Gorden-White Park',
      city: 'Atlanta',
      state: 'GA',
      zipcode: '30307',
      openEveryday: true,
      eventCount: 2,
      totalVisits: 80,
      myVisits: 0
    },
    {
      name: 'Rose Circle Park',
      address: 'Rose Circle Park',
      city: 'Atlanta',
      state: 'GA',
      zipcode: '30307',
      openEveryday: false,
      eventCount: 2,
      totalVisits: 55,
      myVisits: 0
    }
  ];

  res.render('visit/sites', {
    sites,
    formValues: {
      site: name,
      openEveryday,
      startDate,
      endDate,
      lowerVisitTotal,
      upperVisitTotal,
      lowerEventCount,
      upperEventCount,
      includeVisited
    }
  });
});
// Screen 36
router.get('/sites/site/transits', (req, res, next) => {
  const siteName = req.query.site;
  if (!req.query.site) {
    res.redirect('/visit/sites');
  }
  const transportType = req.query.transportType;
  const site = {
    name: 'Rose Circle Park',
    address: 'Rose Circle Park',
    city: 'Atlanta',
    state: 'GA',
    zipcode: '30307',
    openEveryday: false,
    eventCount: 2,
    totalVisits: 55,
    myVisits: 0
  };

  const transits = [
    {
      route: 'Red',
      type: 'MARTA',
      price: 2,
      siteCount: 4
    },
    {
      route: '815',
      type: 'Bus',
      price: 1.5,
      siteCount: 3
    }
  ];

  res.render('visit/site-transit', {
    site,
    transits,
    formValues: {
      transportType
    }
  });
});

router.post('/sites/site/transits', (req, res, next) => {
  const siteName = req.body.site;
  const date = req.body.transitDate;
  const route = req.body.route;
  const type = req.body.type;
  console.log('new transit taken');
  console.log({ siteName, date, route, type });

  res.redirect(req.originalUrl);
});

// Screen 37
router.get('/sites/site', (req, res, next) => {
  const siteName = req.query.site;
  if (!siteName) res.redirect('/visit/sites');

  res.render('visit/site', {
    site: {
      name: 'Gorden-White Park',
      address: 'Gorden-White Park',
      city: 'Atlanta',
      state: 'GA',
      zipcode: '30307',
      openEveryday: true,
      eventCount: 2,
      totalVisits: 80,
      myVisits: 0
    }
  });
});

router.post('/sites/site', (req, res, next) => {
  const date = req.body.visitDate;
  const site = req.body.site;

  // create a new site visit with date

  res.redirect(req.originalUrl);
});

// Screen 33
router.get('/events', (req, res, next) => {

  const username = req.session.user.username;
  db.admin.getAllSites().then(sites => {
    db.visitor.getEvents({...req.query, username }).then(events => {
      // console.log(events);
      res.render('visit/events', { events, sites });
    });
  });
});

// Screen 34
router.get('/events/event', (req, res, next) => {
  const eventName = req.query.event;
  const siteName = req.query.site;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  // console.log(req.query);

  if (!eventName || !siteName) res.redirect('back');

  db.visitor.oneEvent(req.query).then(event => {
    event = event.length > 0 ? event[0] : event;
    res.render('visit/event-detail', { event });
  });
});

router.post('/events/event', (req, res, next) => {
  const date = req.body.visitDate;
  const site = req.body.site;
  const eventName = req.body.event;
  const username = req.session.user.username;

  db.visitor.logEvent({...req.body, username }).then(() => {
    // res.redirect(req.originalUrl);
    res.redirect("/visit/events")
  })
  // create a new visit between the visit and the event
  // console.log({date, site, eventName})
});

export default router;
