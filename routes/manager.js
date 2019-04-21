import express from 'express';
import db from '../database/db';
import Auth from '../middleware/Auth';
import Validator from '../middleware/Validator';
import { query, body } from 'express-validator/check';

const router = express.Router();
router.use(Auth.manager);

// Screen 25
router.get('/events', (req, res, next) => {
  // db.events.getAll()
  const username = req.session.user.username;
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

  db.manager.getEvents({
    username,
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
  }).then((events) => {
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
  }).catch((err) => {
    console.log(err);
    res.redirect('back');
  })
});

router.post('/events', (req, res, next) => {
  // get the siteName associated with the current manager
  const username = req.session.user.username;
  const eventName = req.body.event;
  const startDate = db.helpers.dateify(req.body.date);

  // delete the event from the database
  db.manager.deleteEvent({username, eventName, startDate})
    .then(() => {
      return res.redirect(req.originalUrl)
    }).catch(err => {
      console.log(err)
      res.redirect(req.originalUrl)
    })
});

// Screen 26
router.get('/events/edit', (req, res, next) => {
  // get the site from the currently logged in manager

  // get the event name from the query
  const eventName = req.query.event;
  const startDate = db.helpers.dateify(req.query.date);

  const lowerDailyVisits = req.query.lowerDailyVisits;
  const upperDailyVisits = req.query.upperDailyVisits;
  const lowerRevenue = req.query.lowerRevenue;
  const upperRevenue = req.query.upperRevenue;

  // get the event from the db
  db.manager.getEvent(req.session.user.username, {
    name: eventName,
    startDate
  }).then(event => {
    return db.manager.getStaffForEvent(event).then((staff) => {
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
      return res.render('manager/edit-event', {
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
  }).catch(err => {
    console.log(err)
    res.redirect('back')
  })
})

router.post('/events/edit', [
  body('name').not().isEmpty(),
  body('startDate').not().isEmpty().isISO8601(),
  body('description').not().isEmpty(),
  body('assignStaff').custom((v,{req}) => {
    return v.length >= Number.parseInt(req.body.minStaff)
  }),
], Validator.validate, (req, res, next) => {
  // get the site from the current manager
  const name = req.body.name;
  const startDate = req.body.startDate;
  const description = req.body.description;
  const assignedStaff = req.body.assignStaff;

  db.manager.updateEvent(req.session.user.username, {
    name,
    startDate,
    description,
    assignedStaff
  }).then(() => {
    return res.redirect('back')
  }).catch((err) => {
    console.log(err);
    return res.redirect('back')
  })

})


// Screen 27
router.get('/events/create', (req, res, next) => {
  // get the site from the database

  // get all staff from the database
  db.manager.getStaff()
    .then(staff => {
      res.render('manager/create-event', {
        staff
      })
    })

})

router.post('/events/create', [
  body('name').not().isEmpty(),
  body('price').not().isEmpty().isFloat(),
  body('capacity').not().isEmpty().isInt(),
  body('minStaff').not().isEmpty().isInt(),
  body('startDate').not().isEmpty().isISO8601(),
  body('endDate').not().isEmpty().isISO8601().custom((v, {req}) => {
    return new Date(req.body.startDate) <= new Date(v);
  }),
  body('description').not().isEmpty(),
  body('assignedStaff').custom((v,{req}) => {
    return v.length >= Number.parseInt(req.body.minStaff)
  }),
],Validator.validate, (req, res, next) => {
  // get site from manager currently authenticated

  const name = req.body.name;
  const price = req.body.price;
  const capacity = req.body.capacity;
  const minStaff = req.body.minStaff;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const description = req.body.description;
  const assignedStaff = (Array.isArray(req.body.assignedStaff)) ?
    req.body.assignedStaff : [req.body.assignedStaff];
  console.log(assignedStaff);
  if (!Array.isArray(assignedStaff)) {
    assignedStaff
  }
  return db.manager.createEvent(req.session.user.username, {
      name, price,
      capacity, minStaff, startDate,
      endDate, description, assignedStaff,
    }).then(() => {
      res.redirect('/manager/events')
    }).catch((err) => {
      console.log(err)
      res.redirect('/manager/events')
    })
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
