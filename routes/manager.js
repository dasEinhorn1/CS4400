import express from 'express';
import db from '../database/db';
import Auth from '../middleware/Auth';

const router = express.Router();
router.use(Auth.manager);

// Screen 25
router.get('/events', (req, res, next) => {
  db.events.getAll()

  const name = req.query.name;
  const keyword = req.query.keyword;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const lowerDuration = req.query.lowerDuration;
  const upperDuration = req.query.upperDuration;
  const lowerVisit = req.query.lowerVisit;
  const upperVisit = req.query.upperVisit;
  const lowerRevenue = req.query.lowerRevenue;
  const upperRevenue = req.query.upperRevenue;

  const events = [
    {
      name: 'Arboretum Walking Tour',
      staffCount: 1,
      duration: 2,
      visits: 34,
      revenue: 0
    }
  ]

  res.render('manager/events', {
    events,
    formValues: {
      name,
      keyword,
      startDate,
      endDate,
      lowerDuration,
      upperDuration,
      lowerVisit,
      upperVisit,
      lowerRevenue,
      upperRevenue
    }
  })
});

router.post('/events', (req, res, next) => {
  // get the siteName associated with the current manager
  const site = "Piedmont Park";
  const eventName = req.body.event;

  // delete the event from the database

  res.redirect(req.originalUrl)
});

// Screen 26
router.get('/events/edit', (req, res, next) => {
  // get the site from the currently logged in manager
  const site = "Piedmont Park";

  // get the event name from the query
  const eventName = req.query.event;

  const lowerDailyVisits = req.query.lowerDailyVisits;
  const upperDailyVisits = req.query.upperDailyVisits;
  const lowerRevenue = req.query.lowerRevenue;
  const upperRevenue = req.query.upperRevenue;

  // get the event from the db
  const event = {
    name: 'Arboretum Walking Tour',
    price: 0,
    capacity: 20,
    minStaff: 1,
    startDate: "2019-02-01",
    endDate: "2019-02-02",
    description: 'Lorem ipsum dolor sit amet, '
      + 'consectetur adipisicing elit, sed do eiusmod tempor '
      + 'incididunt ut labore et dolore magna aliqua. Ut enim'
      + ' ad minim veniam, quis nostrud exercitation ullamco l'
      + 'aboris nisi ut aliquip ex ea commodo consequat. Duis '
      + 'aute irure dolor in reprehenderit in voluptate velit '
      + 'esse cillum dolore eu fugiat nulla pariatur. Excepteu'
      + 'r sint occaecat cupidatat non proident, sunt in culpa '
      + 'qui officia deserunt mollit anim id est laborum.',
    staffAssigned: [
      'ahayward3'
    ]
  }
  const staff = [
    {
      firstName: "Adam",
      lastName: "Hayward",
      username: "ahayward3"
    },
    {
      firstName: "MJ",
      lastName: "Park",
      username: "mjpark"
    }
  ].map(stf => ({
      ...stf,
      assigned: event.staffAssigned
        .find(asgn => stf.username == asgn)
  }));

  const dailies = [
    {
      date: '2019-01-01',
      visits: 34,
      revenue: 34 * 0
    },
    {
      date: '2019-01-02',
      visits: 3,
      revenue: 0
    },
    {
      date: '2019-01-03',
      visits: 40,
      revenue: 0
    },
    {
      date: '2019-01-04',
      visits: 45,
      revenue: 0
    },
  ]
  res.render('manager/edit-event', {
    event,
    dailies,
    staff,
    formValues: {
      lowerDailyVisits,
      upperDailyVisits,
      lowerRevenue,
      upperRevenue
    }
  })
})

router.post('/events/edit', (req, res, next) => {
  // get the site from the current manager
  const site = "Piedmont Park";

  const name = req.body.name;
  const price = req.body.price;
  const capacity = req.body.capacity;
  const minStaff = req.body.minStaff;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const description = req.body.description;
  const assignedStaff = req.body.assignedStaff;

  res.redirect('/manager/events')
})


// Screen 27
router.get('/events/create', (req, res, next) => {
  // get the site from the database
  const site = "Piedmont Park";

  // get all staff from the database
  const staff = [
    {
      firstName: "Adam",
      lastName: "Hayward",
      username: "ahayward3"
    },
    {
      firstName: "MJ",
      lastName: "Park",
      username: "mjpark"
    }
  ];
  res.render('manager/create-event', {
    staff
  })
})

router.post('/events/create', (req, res, next) => {
  // get site from manager currently authenticated
  const site = "Piedmont Park";

  const name = req.body.name;
  const price = req.body.price;
  const capacity = req.body.capacity;
  const minStaff = req.body.minStaff;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const description = req.body.description;
  const assignedStaff = req.body.assignedStaff;

  // create the new entry

  res.redirect('/manager/events')
})

// Screen 28
router.get('/events/staff', (req, res, next) => {
  // get the name of the manager's site as siteName
  const siteName = "Piedmont Park";

  const firstName = req.query.firstName;
  const lastName = req.query.lastName;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  const staff = [
    {
      firstName: "Adam",
      lastName: "Hayward",
      username: "ahayward3",
      eventShifts: 4,
    },
    {
      firstName: "MJ",
      lastName: "Park",
      username: "mjpark",
      eventShifts: 5,
    }
  ];

  res.render('manager/event-staff', {
    site: { name: siteName },
    staff,
    formValues: {
      firstName,
      lastName,
      startDate,
      endDate
    }
  })
})

// Screen 29
router.get('/site', (req, res, next) => {
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const lowerEventCount = req.query.lowerEventCount;
  const upperEventCount = req.query.upperEventCount;
  const lowerStaffCount = req.query.lowerStaffCount;
  const upperStaffCount = req.query.upperStaffCount;
  const lowerVisits = req.query.lowerVisits;
  const upperVisits = req.query.upperVisits;
  const lowerRevenue = req.query.lowerRevenue;
  const upperRevenue = req.query.upperRevenue;

  const dailies = [
    {
      date: '2019-01-23',
      eventCount: 2,
      staffCount: 1,
      visits: 4,
      revenue: 3
    }
  ]

  res.render('manager/site', {
    dailies,
    formValues: {
      startDate,
      endDate,
      lowerEventCount,
      upperEventCount,
      lowerStaffCount,
      upperStaffCount,
      lowerVisits,
      upperVisits,
      lowerRevenue,
      upperRevenue
    }
  })
})

// Screen 30
router.get('/site/detail', (req, res, next) => {
  // get the site from the current manager
  const siteName = "Piedmont Park";

  const date = req.query.date;

  // get each event name, the staff for that day,
  // the daily revenue and visit total

  const eventDailies = [
    {
      name: "Arboretum Walking Tour",
      staff: ["ahayward1"],
      visits: 34,
      revenue: 0
    },
    {
      name: "Bus Tour",
      staff: ["mjpark"],
      visits: 13,
      revenue: 13 * 5
    }
  ]

  res.render('manager/site-detail', {
    eventDailies
  })
})

export default router;
