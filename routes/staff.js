import express from 'express';
import Auth from '../middleware/Auth';

const router = express.Router();
router.use(Auth.staff);

// Screen 31
router.get('/', (req, res, next) => {
  res.render('staff/schedule');
})

// Screen 32
router.get('/detail', (req, res, next) => {
  res.render('staff/detail')
})

export default router;
