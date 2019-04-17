import express from 'express';
import Auth from '../middleware/Auth';

const router = express.Router();
router.use(Auth.manager);

// Screen 25
router.get('/events', (req, res, next) => {
  res.render('manager/events', {title:"Piedmont Park Events"})
})

// Screen 27
router.get('/events/create', (req, res, next) => {
  res.render('manager/create-event', {title:"Create Event"})
})

router.post('/events/create', (req, res, next) => {
  console.log(req.body)
  res.redirect('/manager/events')
})

// Screen 26
router.get('/events/:id/edit', (req, res, next) => {
  res.render('manager/edit-event', {title:"Edit Event"})
})

// Screen 28
router.get('/events/staff', (req, res, next) => {
  res.render('manager/event-staff', {title:"Event Staff"})
})

// Screen 29
router.get('/site', (req, res, next) => {
  res.render('manager/site', {title:"Sites"})
})

// Screen 30
router.get('/site/detail', (req, res, next) => {
  res.render('manager/site-detail', {title:"Site Detail"})
})

export default router;
