import express from 'express';

const router = express.Router();

// Screen 25
router.get('/events', (req, res, next) => {
  res.send('Screen 25')
})

// Screen 27
router.get('/events/create', (req, res, next) => {
  res.send('Screen 27')
})

// Screen 26
router.get('/events/:id/edit', (req, res, next) => {
  res.send('Screen 26')
})

// Screen 28
router.get('/events/staff', (req, res, next) => {
  res.send('Screen 28')
})

// Screen 29
router.get('/site', (req, res, next) => {
  res.send('Screen 29')
})

// Screen 30
router.get('/site/detail', (req, res, next) => {
  res.send('Screen 30')
})

export default router;
