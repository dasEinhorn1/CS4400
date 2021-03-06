import express from 'express';
import sitesFixture from '../fixtures/sites'
import Auth from '../middleware/Auth';
import Validator from '../middleware/Validator';
import db from '../database/db';
import { query, body } from 'express-validator/check';
// import { sanitizeBody } = require('express-validator/filter');

const router = express.Router();

router.get('/', Auth.user, (req, res, next) => {
  res.redirect('/dashboard');
})

// Screen 1
router.get('/login', Auth.unauthenticated, (req, res, next) => {
  res.render('login');
})

router.post('/login', Auth.unauthenticated, (req, res, next) => {
  // TODO: validate login
  const email = req.body.email;
  const password = req.body.password;

  // check if a user exists with the given email
  // call the database with email and hashed password
  db.auth.login(email, password)
    .then(db.auth.helpers.setUserSession(req))
    .then(() => {
      res.redirect('/dashboard');
    }).catch((err) => {
      console.log(err);
      res.redirect('login');
    })
})

// no screen logout
router.get('/logout', Auth.user, (req, res, next) => {
  req.session.user = undefined;
  res.redirect('login');
});

// Screen 2
router.get('/register', Auth.unauthenticated, (req, res, next) => {
  res.render('register');
})

// Screen 3
router.get('/register/user', Auth.unauthenticated, (req, res, next) => {
  res.render('register-user')
})

// register the new user in the database
router.post('/register/user', Auth.unauthenticated,
  Validator.userRegister,
  Validator.validate,
  (req, res, next) => {
  // res.send('registered user')
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const username = req.body.username;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const emails = req.body.emails.split(',').map(email => email.trim());

  // hash password
  const hashPassword = db.auth.helpers.hashPassword(password);
  // insert new user with status 'P' for pending
  hashPassword.then((hashedPassword) => {
    return db.auth.register({
      firstName,
      lastName,
      username,
      emails,
      password: hashedPassword
    }, false)
  })
  .then(() => {
    res.redirect('/login');
  }).catch(err => {
    console.log(err)
    res.redirect('back');
  })
})


// Screen 4
router.get('/register/visitor', Auth.unauthenticated, (req, res, next) => {
  res.render('register-visitor');
})

//
router.post('/register/visitor', Auth.unauthenticated,
  Validator.userRegister, Validator.validate,
  (req, res, next) => {
  // res.send('registered visitor')
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const username = req.body.username;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const emails = req.body.emails.split(',').map(email => email.trim());
  // hash password
  const hashPassword = db.auth.helpers.hashPassword(password);
  // insert new user with status 'P' for pending
  hashPassword.then((hashedPassword) => {
    return db.auth.register({
      firstName,
      lastName,
      username,
      emails,
      password: hashedPassword
    }, true)
  })
  .then(() => {
    res.redirect('/login');
  }).catch(err => {
    console.log(err)
    res.redirect('back');
  })
})


// Screen 5
router.get('/register/employee', Auth.unauthenticated, (req, res, next) => {
  res.render('register-employee')
})

router.post('/register/employee', Auth.unauthenticated,
  Validator.employeeRegister, Validator.validate,
  (req, res, next) => {
  // res.send('registered employee')
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const username = req.body.username;
  const userType = req.body.userType;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const phone = req.body.phone;       // must be 10 digits
  const zipcode = req.body.zipcode;   // must be 5 digits
  const city = req.body.city;
  const state = req.body.state;
  const address = req.body.zipcode;
  const emails = req.body.emails.split(',').map(email => email.trim());
  // const isVisitor = false;
  // hash password
  const hashPassword = db.auth.helpers.hashPassword(password);
  // insert new user with status 'P' for pending
  hashPassword.then((hashedPassword) => {
    return db.auth.register({
      firstName,
      lastName,
      username,
      emails,
      password: hashedPassword,
      phone,
      zipcode,
      city,
      state,
      address,
      employeeType: userType
    }, false)
  })
  .then(() => {
    res.redirect('/login');
  }).catch(err => {
    console.log(err)
    res.redirect('back');
  })
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
  const emails = req.body.emails.split(',').map(email => email.trim());

  const hashPassword = db.auth.helpers.hashPassword(password);
  // insert new user with status 'P' for pending
  hashPassword.then((hashedPassword) => {
    return db.auth.register({
      firstName,
      lastName,
      username,
      emails,
      password: hashedPassword,
      phone,
      zipcode,
      city,
      state,
      address,
      employeeType: userType
    }, true)
  })
  .then(() => {
    res.redirect('/login');
  }).catch(err => {
    console.log(err)
    res.redirect('back');
  })
})

/*
  BEGIN USER-ONLY ROUTES
*/
// Screen 7-14 (CHECK AUTH; Minimum=user)
router.get('/dashboard', Auth.user, (req, res, next) => {
  // TODO: check user auth, render correct page
  db.auth.getUser(req.session.user.username)
    .then(user => {
      const currentUser = {
        isVisitor: user.isVisitor,
        isStaff: user.isStaff,
        isManager: user.isManager,
        isAdmin: user.isAdmin
      }
      return res.render('dashboard', currentUser);
    }).catch(err => {
      console.log(err);
      res.redirect('back');
    })
})

// Screen 15 (CHECK AUTH; Minimum=user)
router.get('/transits', Auth.user, [
  ...Validator.discreteSelect('transportType', ["MARTA", "Bus", "Bike", "all", undefined]),
  ...Validator.range(['lowerPrice', 'upperPrice'])
], Validator.validate,
(req, res, next) => {
  const siteName = req.query.site || 'all';
  const transportType = req.query.transportType || 'all';
  const lowerPrice = req.query.lowerPrice;
  const upperPrice = req.query.upperPrice;
  db.general.filterTransits({siteName, transportType, lowerPrice, upperPrice})
    .then(transits => {
      return db.general.getSiteNames()
        .then(sites => {
          return res.render('transits', {
            transits,
            sites,
            formValues: {
              site: siteName,
              transportType,
              lowerPrice,
              upperPrice
            }
          })
        });
    }).catch(err => {
      console.log(err);
      res.render(req.originalUrl);
    })
});

// log a new take transit for the user
router.post('/transits', Auth.user, [
  body('route').not().isEmpty(),
  ...Validator.discreteSelect('type', ["MARTA", "Bus", "Bike"]),
  body('date').isISO8601()], Validator.validate,
 (req, res, next) => {
  const username = req.session.user.username;
  const route = req.body.route;
  const type = req.body.type;
  const date = req.body.date;

  db.general.logTransit({username, type, route, date}).then(() => {
    return res.redirect('transits')
  }).catch(err => {
    console.log(err);
    return res.redirect('back')
  })
  // insert the Takes tuple into the database
});

// Screen 16 (CHECK AUTH; Minimum=user)
router.get('/transits/history', Auth.user, (req, res, next) => {
  const siteName = req.query.site;
  const transportType = req.query.transportType;
  const route = req.query.route;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  // get all the transitsTaken that we care about
  return db.general.getTransitsTaken({
    username: req.session.user.username, ...req.query
  }).then((transitsTaken) => {
      return res.render('transit-history', {
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
  }).catch(err => {
    console.log(err);
    return res.redirect('back')
  })

})

/*
  END USER-ONLY ROUTES

  BEGIN EMPLOYEE-ONLY ROUTES
*/
// Screen 17
router.get('/profile', Auth.employee, (req, res, next) => {
  // get the current employee's profile
  // const employee = {
  //   firstName: 'Adam',
  //   lastName: 'Hayward',
  //   username: 'ahayward3',
  //   site: 'Inman Park',
  //   id: '903247965',
  //   address: '8 Sabra Circle, Derry NH, 03038',
  //   phone: '(603)247-8988',
  //   isVisitor: true,
  //   emails: [
  //     'achayward1@gmail.com',
  //     'adam.hayward@gatech.edu'
  //   ]
  // }
  return db.employee.getEmployee(req.session.user.username)
    .then((employee) => {
      // console.log(employee);
      return res.render('profile', {employee})
    }).catch(err => {
      console.log(err);
      return res.redirect('back');
    })
})

// update the employee profile
router.post('/profile', Auth.employee, [
  body('firstName').not().isEmpty(),
  body('lastName').not().isEmpty(),
  body('phone').isLength(10),
  Validator.emails('emails')
], Validator.validate, (req, res, next) => {
  const username = req.session.user.username;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const phone = req.body.phone;
  const isVisitor = (req.body.isVisitor) ? true : false;
  const emails = req.body.emails.split(',').map(e => e.trim());

  /* get the currently logged in employee and update
   * these values for them
   */
   console.log({firstName, lastName, phone, isVisitor, username, emails});
  db.employee.updateEmployee({
    username,
    firstName,
    lastName,
    phone,
    isVisitor,
    emails,
  }).then(() => {
    res.redirect('profile');
  }).catch(err => {
    console.log(err);
    res.redirect('back');
  })

})

export default router;
