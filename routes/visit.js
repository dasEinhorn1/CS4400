import express from 'express';

const router = express.Router();

// Screen 38
router.get('/history', (req, res, next) => {
  res.render('visit/history')
})

// Screen 35
router.get('/site', (req, res, next) => {
  res.render('visit/sites')
})
// Screen 36
router.get('/site/:id/transits', (req, res, next) => {
  res.render('visit/site-transit')
})

// Screen 37
router.get('/site/:id', (req, res, next) => {
  res.render('visit/site')
})

// Screen 33
router.get('/site/events', (req, res, next) => {
  // get all site names
  res.render('visit/events')
})

// Screen 34
router.get('/site/events/:id', (req, res, next) => {
  res.render('visit/event-detail')
})
