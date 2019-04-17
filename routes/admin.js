import express from 'express';
import Auth from '../middleware/Auth'
import users from '../fixtures/users';
import manages from '../fixtures/manages';

const router = express.Router();

router.use(Auth.admin)
// router.get('/', (req, res) => {});

// Screen 18
router.get('/users', (req, res) => {
  // res.send('Screen 18');

  console.log(req.query);
  res.render('admin/users', { title: 'Users', users: users});
});

router.post('/users', (req, res) => {

  console.log(req.body);
  res.redirect('/admin/users');
})

// Screen 19
router.get('/sites', (req, res) => {
  // res.send('Screen 19');

  console.log(req.query);
  res.render('admin/sites', { title: 'Sites' , manages: manages });
});
router.post('/sites', (req, res) => {

  console.log(req.body);
  const buttonType = req.body.buttonType;

  if (buttonType == 'edit') {
    // if 'Edit', retrieve its info and send it to 'edit'

  } else if (buttonType == 'delete') {
    // elif 'Delete', just delete it and return back

  }
})

// Screen 21
router.get('/sites/create', (req, res) => {
  // res.send('Screen 21');
  res.render('admin/create-sites', { title: 'Create Sites' });
});

// Screen 20
router.get('/sites/:id/edit', (req, res) => {
  // res.send('Screen 20', {title: 'Edit Site'});
  res.render('admin/edit-site', { title: 'Edit Site' });
});

// Screen 22
router.get('/transits', (req, res) => {
  // res.send('Screen 22', { title: 'Transits' });
  res.render('admin/transits', { title: 'Transits' });
});

// Screen 24
router.get('/transits/create', (req, res) => {
  // res.send('Screen 24', {title: 'Create Transit'});
  res.render('admin/create-transit', { title: 'Create Transit' });
});

// Screen 23
router.get('/transits/:id/edit', (req, res) => {
  // res.send('Screen 23', { title: 'Edit Transit' });
  res.render('admin/edit-transit', { title: 'Edit Transit'});
});

export default router;
