import express from 'express';

const router = express.Router();

// Screen 31
router.get('/', (req, resp, next) => {
  req.render('staff/schedule')
})

// Screen 32
router.get('/detail', (req, resp, next) => {
  req.render('staff/detail')
})

export default router;