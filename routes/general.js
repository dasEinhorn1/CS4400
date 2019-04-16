import express from 'express';
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
  res.redirect('/dashboard')
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
  res.send('registered user')
})

// Screen 4
router.get('/register/visitor', (req, res, next) => {
  res.render('register-visitor');
})
router.post('/register/visitor', (req, res, next) => {
  res.send('registered visitor')
})
// Screen 5
router.get('/register/employee', (req, res, next) => {
  res.render('register-employee')
})
router.post('/register/employee', (req, res, next) => {
  res.send('registered employee')
})
// Screen 6
router.get('/register/employee-visitor', (req, res, next) => {
  res.render('register-employee-visitor')
})
router.post('/register/employee-visitor', (req, res, next) => {
  res.render('register-employee-visitor')
})

/*
  BEGIN USER-ONLY ROUTES
*/
// Screen 7-14 (CHECK AUTH; Minimum=user)
router.get('/dashboard', (req, res, next) => {
  // TODO: check user auth, render correct page
  res.render('dashboard', { type: "A", isVisitor: true })
})

// Screen 15 (CHECK AUTH; Minimum=user)
router.get('/transits', (req, res, next) => {
  res.render('transits')
})

// Screen 16 (CHECK AUTH; Minimum=user)
router.get('/transits/history', (req, res, next) => {
  res.render('transit-history')
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
