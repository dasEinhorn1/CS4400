import express from 'express';
import Auth from '../middleware/Auth';

const router = express.Router();
router.use(Auth.staff);

// Screen 31
router.get('/', (req, res, next) => {
  const name = req.query.name;
  const keyword = req.query.keyword;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  const events = [
    {
      name: 'Bus Tour',
      siteName: 'Inman Park',
      startDate: '2019-01-01',
      endDate: '2019-01-02',
      staffCount: 1
    }
  ]

  res.render('staff/schedule', {
    events,
    formValues: {
      name,
      keyword,
      startDate,
      endDate
    }
  });
})

// Screen 32
router.get('/detail', (req, res, next) => {
  const name = req.query.event;
  const site = req.query.site;

  if (!name || !site) {
    res.redirect('/staff')
  }

  const event = {
    name: 'Bus Tour',
    siteName: 'Inman Park',
    startDate: '2019-01-01',
    endDate: '2019-01-02',
    staffCount: 1,
    duration: 1,
    staffAssigned: ["Alice"],
    capacity: 200,
    price: 50,
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing '
      + 'elit, sed do eiusmod tempor incididunt ut labore et dolore ma'
      + 'gna aliqua. Ut enim ad minim veniam, quis nostrud exercitatio'
      + 'n ullamco laboris nisi ut aliquip ex ea commodo consequat. Du'
      + 'is aute irure dolor in reprehenderit in voluptate velit esse '
      + 'cillum dolore eu fugiat nulla pariatur. Excepteur sint occaec'
      + 'at cupidatat non proident, sunt in culpa qui officia deserunt'
      + ' mollit anim id est laborum.'
  }
  res.render('staff/detail', {
    event
  })
})

export default router;
