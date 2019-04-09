import express from 'express';

const router = express.Router();

// Screen 38
router.get('/history', (req, res, next) => {
  res.render('visit/history')
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
  res.render('visit/events')
})

// Screen 34
router.get('/events/:id', (req, res, next) => {
  res.render('visit/event-detail')
})

export default router;
