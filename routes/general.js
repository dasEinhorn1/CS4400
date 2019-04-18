import express from 'express';
import sitesFixture from '../fixtures/sites'
import Auth from '../middleware/Auth';


const router = express.Router();

router.get('/', Auth.user, (req, res, next) => {
  res.redirect('/dashboard');
})

// Screen 1
router.get('/login', Auth.unauthenticated, (req, res, next) => {
  // if the user is logged in redirect to dashboard
    // res.redirect('dashboard')
  // else
  res.render('login');
})

router.post('/login', Auth.unauthenticated, (req, res, next) => {
  // TODO: validate login
  const email = req.body.email;
  const password = req.body.password;

  // TODO: hash the password
  const hashedPassword = password;

  // check if a user exists with the given email
  // call the database with email and hashed password
  // if they don't, redirect to login with an error
    // res.redirect('login')
  // else
    // set the user in the session, give the session to the cookie
    res.redirect('dashboard');
})

// Screen 2
router.get('/register', Auth.unauthenticated, (req, res, next) => {
  res.render('register');
})

// Screen 3
router.get('/register/user', Auth.unauthenticated, (req, res, next) => {
  res.render('register-user')
})

// register the new user in the database
router.post('/register/user', Auth.unauthenticated, (req, res, next) => {
  // res.send('registered user')
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const username = req.body.username;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const emails = req.body.emails;
  const isVisitor = false;

  // check password is string >= 8 characters and == confirmPassword
    // if not, redirect and show an error
  // make sure username is not empty
  // make sure emails are valid
  // insert new user with status 'P' for pending
  // if the insertion fails, then the email or username must already exist
    // redirect and show an error
  // otherwise, set the user in the session and go to dashboard
  res.redirect('/dashboard')
})


// Screen 4
router.get('/register/visitor', Auth.unauthenticated, (req, res, next) => {
  res.render('register-visitor');
})

//
router.post('/register/visitor', Auth.unauthenticated, (req, res, next) => {
  // res.send('registered visitor')
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const username = req.body.username;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const emails = req.body.emails;
  const isVisitor = true;
  // check password is string >= 8 characters and == confirmPassword
    // if not, redirect and show an error
  // make sure username is not empty
  // make sure emails are valid
  // insert new user with status 'P' for pending
  // if the insertion fails, then the email or username must already exist
    // redirect and show an error
  // otherwise, set the user in the session and go to dashboard
  res.redirect('/dashboard')
})


// Screen 5
router.get('/register/employee', Auth.unauthenticated, (req, res, next) => {
  res.render('register-employee')
})

router.post('/register/employee', Auth.unauthenticated, (req, res, next) => {
  // res.send('registered employee')
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const username = req.body.username;
  const userType = req.body.userType;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const phone = req.body.phone;       // must be 10 digits
  const address = req.body.zipcode;   // must be 5 digits
  const city = req.body.city;
  const state = req.body.state;
  const zipcode = req.body.zipcode;
  const emails = req.body.emails;
  const isVisitor = false;
  // check password is string >= 8 characters and == confirmPassword
    // if not, redirect and show an error
  // make sure username is not empty
  // make sure emails are valid
  // insert new user with status 'P' for pending
  // if the insertion fails, then the email or username must already exist
    // redirect and show an error
  // otherwise, set the user in the session and go to dashboard
  res.redirect('/dashboard')
})


// Screen 6
router.get('/register/employee-visitor', Auth.unauthenticated, (req, res, next) => {
  res.render('register-employee-visitor')
})

router.post('/register/employee-visitor', Auth.unauthenticated, (req, res, next) => {
  // res.render('register-employee-visitor')
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const username = req.body.username;
  const userType = req.body.userType;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const phone = req.body.phone;       // must be 10 digits
  const address = req.body.zipcode;   // must be 5 digits
  const city = req.body.city;
  const state = req.body.state;
  const zipcode = req.body.zipcode;
  const emails = req.body.emails;
  const isVisitor = true;
  // check password is string >= 8 characters and == confirmPassword
    // if not, redirect and show an error
  // make sure username is not empty
  // make sure emails are valid
  // insert new user with status 'P' for pending
  // if the insertion fails, then the email or username must already exist
    // redirect and show an error
  // otherwise, set the user in the session and go to dashboard
  res.redirect('/dashboard')
})

/*
  BEGIN USER-ONLY ROUTES
*/
// Screen 7-14 (CHECK AUTH; Minimum=user)
router.get('/dashboard', Auth.user, (req, res, next) => {
  // TODO: check user auth, render correct page
  const currentUser = {
    type: "M",
    isVisitor: true
  };

  res.render('dashboard', {
    type: currentUser.type,
    isVisitor:currentUser.isVisitor
  })
})

// Screen 15 (CHECK AUTH; Minimum=user)
router.get('/transits', Auth.user, (req, res, next) => {
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
router.post('/transits', Auth.user, (req, res, next) => {
  const transitRoute = req.body.route;
  const transitType = req.body.type;
  const transitDate = req.body.date;
  // validate the route, type, and date
  // insert the Takes tuple into the database
  res.redirect('transits');
});

// Screen 16 (CHECK AUTH; Minimum=user)
router.get('/transits/history', Auth.user, (req, res, next) => {
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
router.get('/profile', Auth.employee, (req, res, next) => {
  // get the current employee's profile
  const employee = {
    firstName: 'Adam',
    lastName: 'Hayward',
    username: 'ahayward3',
    site: 'Inman Park',
    id: '903247965',
    address: '8 Sabra Circle, Derry NH, 03038',
    phone: '(603)247-8988',
    isVisitor: true,
    emails: [
      'achayward1@gmail.com',
      'adam.hayward@gatech.edu'
    ]
  }
  //
  res.render('profile', {
    employee
  })
})

// update the employee profile
router.post('/profile', Auth.employee, (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const phone = req.body.phone;
  const isVisitor = req.body.isVisitor;
  const emails = req.body.emails;

  /* get the currently logged in employee and update
   * these values for them
   */

  res.redirect('profile');
})

export default router;
