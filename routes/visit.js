import express from 'express';
import Auth from '../middleware/Auth';
import visitsFixture from '../fixtures/visits';
import sitesFixture from '../fixtures/sites';
import eventsFixture from '../fixtures/events';

// TODO: Add validations

const router = express.Router();
router.use(Auth.visitor);

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
      name: "Inman Park",
      address: "Inman Park",
      city: "Atlanta",
      state: "GA",
      zipcode: "30307",
      eventCount: 4,
      openEveryday: true,
      totalVisits: 200,
      myVisits: 1
    },
    {
      name: "Gorden-White Park",
      address: "Gorden-White Park",
      city: "Atlanta",
      state: "GA",
      zipcode: "30307",
      openEveryday: true,
      eventCount: 2,
      totalVisits: 80,
      myVisits: 0
    },
    {
      name: "Rose Circle Park",
      address: "Rose Circle Park",
      city: "Atlanta",
      state: "GA",
      zipcode: "30307",
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
  })
})
// Screen 36
router.get('/sites/site/transits', (req, res, next) => {
  const siteName = req.query.site;
  if (!req.query.site) {
    res.redirect('/visit/sites')
  }
  const transportType = req.query.transportType;
  const site = {
    name: "Rose Circle Park",
    address: "Rose Circle Park",
    city: "Atlanta",
    state: "GA",
    zipcode: "30307",
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
  })
})

router.post('/sites/site/transits', (req, res, next) => {
  const siteName = req.body.site;
  const date = req.body.transitDate;
  const route = req.body.route;
  const type = req.body.type;
  console.log('new transit taken')
  console.log({siteName, date, route, type})

  res.redirect(req.originalUrl);
})

// Screen 37
router.get('/sites/site', (req, res, next) => {
  const siteName = req.query.site;

  res.render('visit/site', {
    site: {
      name: "Gorden-White Park",
      address: "Gorden-White Park",
      city: "Atlanta",
      state: "GA",
      zipcode: "30307",
      openEveryday: true,
      eventCount: 2,
      totalVisits: 80,
      myVisits: 0
    }
  })
})

router.post('/sites/site', (req, res, next) => {
  const date = req.body.visitDate;
  const site = req.body.site;

  // create a new site visit with date

  res.redirect(req.originalUrl);
})

// Screen 33
router.get('/events', (req, res, next) => {
  const name = req.query.name;
  const keyword = req.query.keyword;
  const site = req.query.site;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const lowerVisitTotal = req.query.lowerVisitTotal;
  const upperVisitTotal = req.query.upperVisitTotal;
  const lowerTicketPrice = req.query.lowerTicketPrice;
  const upperTicketPrice = req.query.upperTicketPrice;
  const includeVisited = req.query.includeVisited;
  const includeSoldOut = req.query.includeSoldOut;

  // get all site names
  const events = eventsFixture;
  // const sites = sitesFixture;
  const sites = [
    {
      name: "Inman Park",
      address: "Inman Park",
      city: "Atlanta",
      state: "GA",
      zipcode: "30307",
      eventCount: 4,
      openEveryday: true,
      totalVisits: 200,
      myVisits: 1
    },
    {
      name: "Gorden-White Park",
      address: "Gorden-White Park",
      city: "Atlanta",
      state: "GA",
      zipcode: "30307",
      openEveryday: true,
      eventCount: 2,
      totalVisits: 80,
      myVisits: 0
    },
    {
      name: "Rose Circle Park",
      address: "Rose Circle Park",
      city: "Atlanta",
      state: "GA",
      zipcode: "30307",
      openEveryday: false,
      eventCount: 2,
      totalVisits: 55,
      myVisits: 0
    }
  ];
  res.render('visit/events', {
    events,
    sites,
    formValues: {
      name,
      keyword,
      site,
      startDate,
      endDate,
      lowerVisitTotal,
      upperVisitTotal,
      lowerTicketPrice,
      upperTicketPrice,
      includeVisited,
      includeSoldOut
    }
  })
})

// Screen 34
router.get('/events/event', (req, res, next) => {
  const eventName = req.query.event;


  const event = {
    name: 'Bus Tour',
    siteName: 'Inman Park',
    startDate: '2019-01-01',
    endDate: '2019-01-02',
    description: 'Lorem ipsum dolor sit amet, '
      + 'consectetur adipisicing elit, sed do eiusmod tempor '
      + 'incididunt ut labore et dolore magna aliqua. Ut enim'
      + ' ad minim veniam, quis nostrud exercitation ullamco l'
      + 'aboris nisi ut aliquip ex ea commodo consequat. Duis '
      + 'aute irure dolor in reprehenderit in voluptate velit '
      + 'esse cillum dolore eu fugiat nulla pariatur. Excepteu'
      + 'r sint occaecat cupidatat non proident, sunt in culpa '
      + 'qui officia deserunt mollit anim id est laborum.'
  }

  res.render('visit/event-detail', {
    event
  })
})

router.post('/events/event', (req, res, next) => {
  const date = req.body.visitDate;
  const site = req.body.site;
  const eventName = req.body.event;

  // create a new visit between the visit and the event
  console.log({date, site, eventName})

  res.redirect(req.originalUrl)
})

export default router;
