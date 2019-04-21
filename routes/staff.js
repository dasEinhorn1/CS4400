import express from 'express';
import Auth from '../middleware/Auth';
import db from '../database/db';
import Validator from '../middleware/Validator';
import { query, body } from 'express-validator/check';


const router = express.Router();
router.use(Auth.staff);

// Screen 31
router.get('/', (req, res, next) => {
  const name = req.query.name;
  const keyword = req.query.keyword;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  return db.staff.getSchedule(req.session.user.username, {
    eventName: name,
    keyword,
    startDate,
    endDate
  }).then(results => {
    return results.map(r => ({
      ...r,
      startDate: db.helpers.dateify(r.startDate),
      endDate: db.helpers.dateify(r.endDate)
    }));
  }).then(events => {
    return res.render('staff/schedule', {
      events,
      formValues: {
        name,
        keyword,
        startDate,
        endDate
      }
    });
  }).catch()
})

// Screen 32
router.get('/detail', [
  query('event').not().isEmpty(),
  query('startDate').isISO8601(),
  query('site').not().isEmpty(),
], Validator.validate, (req, res, next) => {
  const name = req.query.event;
  const startDate = req.query.startDate;
  const siteName = req.query.site;

  return db.staff.getEvent({name, startDate, siteName})
    .then(event => {
      return res.render('staff/detail', {
        ...event,
        startDate: db.helpers.dateify(event.startDate),
        endDate: db.helpers.dateify(event.endDate)
      })
    }).catch(err=>{
      console.log(err);
      return res.redirect('back')
    })
  // const event = {
  //   name: 'Bus Tour',
  //   siteName: 'Inman Park',
  //   startDate: '2019-01-01',
  //   endDate: '2019-01-02',
  //   staffCount: 1,
  //   duration: 1,
  //   staffAssigned: ["Alice"],
  //   capacity: 200,
  //   price: 50,
  //   description: 'Lorem ipsum dolor sit amet, consectetur adipisicing '
  //     + 'elit, sed do eiusmod tempor incididunt ut labore et dolore ma'
  //     + 'gna aliqua. Ut enim ad minim veniam, quis nostrud exercitatio'
  //     + 'n ullamco laboris nisi ut aliquip ex ea commodo consequat. Du'
  //     + 'is aute irure dolor in reprehenderit in voluptate velit esse '
  //     + 'cillum dolore eu fugiat nulla pariatur. Excepteur sint occaec'
  //     + 'at cupidatat non proident, sunt in culpa qui officia deserunt'
  //     + ' mollit anim id est laborum.'
  // }
})

export default router;
