import express from 'express';

const router = express.Router();

// Screen 31
router.get('/', (req, res, next) => {
  res.render('staff/schedule');
})

// Screen 32
router.get('/detail', (req, res, next) => {
  res.render('staff/detail')
})

export default router;