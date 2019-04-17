import express from 'express';
import sitesFixture from '../fixtures/sites'

const router = express.Router();

router.get('/', (req, res, next) => {
  res.redirect('/dashboard')
})

// Screen 1
router.get('/login', (req, res, next) => {
  res.render('login')
})
router.post('/login', (req, res, next) => {
  // TODO: validate login
  res.redirect('/dashboard');
})

// Screen 2
router.get('/register', (req, res, next) => {
  res.render('register')
})

// Screen 3
router.get('/register/user', (req, res, next) => {
  res.render('register-user')
})
router.post('/register/user', (req, res, next) => {
  // res.send('registered user')
  res.redirect('/dashboard')
})

// Screen 4
router.get('/register/visitor', (req, res, next) => {
  res.render('register-visitor');
})
router.post('/register/visitor', (req, res, next) => {
  // res.send('registered visitor')
  res.redirect('/dashboard')
})
// Screen 5
router.get('/register/employee', (req, res, next) => {
  res.render('register-employee')
})
router.post('/register/employee', (req, res, next) => {
  // res.send('registered employee')
  res.redirect('/dashboard')
})
// Screen 6
router.get('/register/employee-visitor', (req, res, next) => {
  res.render('register-employee-visitor')
})
router.post('/register/employee-visitor', (req, res, next) => {
  // res.render('register-employee-visitor')
  res.redirect('/dashboard')
})

/*
  BEGIN USER-ONLY ROUTES
*/
// Screen 7-14 (CHECK AUTH; Minimum=user)
router.get('/dashboard', (req, res, next) => {
  // TODO: check user auth, render correct page
  res.render('dashboard', { type: "M", isVisitor: true })
})

// Screen 15 (CHECK AUTH; Minimum=user)
router.get('/transits', (req, res, next) => {
  const siteName = req.query.site;
  const transportType = req.query.transportType;
  const lowerPrice = req.query.lowerPrice;
  const upperPrice = req.query.upperPrice;
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
    },
  ];
  res.render('transits', {
    transits,
    sites: sitesFixture,
    formValues: {
      site: siteName,
      transportType,
      lowerPrice,
      upperPrice
    }
  })
});

// log a new take transit for the user
router.post('/transits', (req, res, next) => {
  const transitRoute = req.body.route;
  const transitType = req.body.type;
  const transitDate = req.body.date;
  // validate the route, type, and date
  // insert the Takes tuple into the database
  res.redirect('transits');
});

// Screen 16 (CHECK AUTH; Minimum=user)
router.get('/transits/history', (req, res, next) => {
  const siteName = req.query.site;
  const transportType = req.query.transportType;
  const route = req.query.route;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  // get all the transitsTaken that we care about
  const transitsTaken = [
    {
      dateTaken: '2019-01-01',
      route: '815',
      type: 'Bus',
      price: 1.5,
      siteCount: 3
    },
    {
      dateTaken: '2019-02-01',
      route: 'Red',
      type: 'MARTA',
      price: 3,
      siteCount: 6
    },
  ];

  res.render('transit-history', {
    sites: sitesFixture,
    formValues: {
      site: siteName,
      transportType,
      route,
      startDate,
      endDate
    },
    transitsTaken,
  })
})

/*
  END USER-ONLY ROUTES

  BEGIN EMPLOYEE-ONLY ROUTES
*/
// Screen 17
router.get('/profile', (req, res, next) => {
  res.render('profile')
})

export default router;
