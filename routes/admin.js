import express from 'express';
import Auth from '../middleware/Auth';
// import users from '../fixtures/users';
import manages from '../fixtures/manages';
import transits from '../fixtures/transits';
import sites from '../fixtures/sites';
import conn from '../database/connection';

const router = express.Router();

router.use(Auth.admin);
// router.get('/', (req, res) => {});

// Screen 18
router.get('/users', (req, res) => {
  // res.send('Screen 18');

  console.log(req.query);
  let users = [];
  const employeeQuery =
    'select U.Username, count(*) as numEmails, Status from User as U left join Email as E1 on U.Username = E1.Username left join Employee as E2 on U.Username = E2.Username group by U.Username';
  const managerQuery =
    'select U.Username, count(*) as numEmails, Status from User as U left join Email as E1 on U.Username = E1.Username left join Manager as E2 on U.Username = E2.Username group by U.Username';

  conn
    .query(employeeQuery)
    .then(employees => {
      // console.log(users);
      users = users.concat(employees);
      console.log(users.length);
      return conn.query(managerQuery);
    })
    .then(managers => {
      users = users.concat(managers);
      console.log(users.length);
    })
    .then(() => {
      console.log(users);
      res.render('admin/users', { title: 'Users', users: users });
    });
});

router.post('/users', (req, res) => {
  console.log(req.body);
  res.redirect('/admin/users');
});

// ========================== SITES ================================

// Screen 19
router.get('/sites', (req, res) => {
  // res.send('Screen 19');
  // console.log(req.query);
  const { sites, manager, openEveryday, buttonType } = req.query;
  res.render('admin/sites', { title: 'Sites', manages: manages });
});
router.post('/sites', (req, res) => {
  // console.log(req.body);
  const { selectedSiteName } = req.body;

  if (buttonType == 'edit') {
    // if 'Edit', retrieve its info and send it to 'edit'
    // TODO: inject site's info
    res.redirect(`/admin/sites/edit?selectedSiteName=${selectedSiteName}`);
  } else if (buttonType == 'delete') {
    // elif 'Delete', just delete it and return back

    // TODO: perform delete
    res.redirect(`/admin/sites`);
  }
});

// Screen 21
router.get('/sites/create', (req, res) => {
  // res.send('Screen 21');
  // TODO: send only the managers
  res.render('admin/create-sites', { title: 'Create Sites', users: users });
});
router.post('/sites/create', (req, res) => {
  // TODO: create an instance with data
  console.log(req.body);

  res.redirect('/admin/sites');
});

// Screen 20
router.get('/sites/edit', (req, res) => {
  // res.send('Screen 20', {title: 'Edit Site'});
  // console.log(req.query);
  const { selectedSiteName } = req.query;
  // todo: fetch data for selected site, and inject
  res.render('admin/edit-site', { title: 'Edit Site' });
});
router.post('/sites/edit', (req, res) => {
  console.log(req.body);

  res.redirect('/admin/sites');
});

// ========================== TRANSITS ================================

// Screen 22
router.get('/transits', (req, res) => {
  // res.send('Screen 22', { title: 'Transits' });
  console.log(req.query);
  // TODO: Fetch filtered data and update 'transit'

  res.render('admin/transits', { title: 'Transits', transits: transits });
});

router.post('/transits', (req, res) => {
  const buttonType = req.body.buttonType;
  console.log(req.body);

  const { route, type } = req.body;

  if (buttonType == 'edit') {
    // if 'Edit', retrieve its info and send it to 'edit'
    // TODO: inject site's info

    res.redirect(`/admin/transits/edit?route=${route}&type=${type}`);
  } else if (buttonType == 'delete') {
    // elif 'Delete', just delete it and return back

    // TODO: perform delete and redirect
    res.redirect('/admin/transits');
  }
});

// Screen 24
router.get('/transits/create', (req, res) => {
  // res.send('Screen 24', {title: 'Create Transit'});

  // TODO: fetch 'Sites' info, and inject
  res.render('admin/create-transit', { title: 'Create Transit', sites: sites });
});
router.post('/transits/create', (req, res) => {
  console.log(req.body);
  const { transportType, route, price, connectedSites } = req.body;

  // TODO: create an instance, fetch updated ones, and insert
  res.redirect('/admin/transits');
});

// Screen 23
router.get('/transits/edit', (req, res) => {
  // res.send('Screen 23', { title: 'Edit Transit' });
  // console.log(req.query);
  const { route, type } = req.query;
  res.render('admin/edit-transit', { title: 'Edit Transit' });
});
router.post('/transits/edit', (req, res) => {
  res.redirect('/admin/transits');
});

export default router;
