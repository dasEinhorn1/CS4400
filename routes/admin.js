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

  // console.log(req.query);
  res.render('admin/sites', { title: 'Sites' , manages: manages });
});
router.post('/sites', (req, res) => {

  // console.log(req.body);
  const buttonType = req.body.buttonType;
  const { selectedSiteName } = req.body;

  if (buttonType == 'edit') {
    // if 'Edit', retrieve its info and send it to 'edit'
    // TODO: inject site's info 
    res.redirect(`/admin/sites/edit?selectedSiteName=${selectedSiteName}`)
  } else if (buttonType == 'delete') {
    // elif 'Delete', just delete it and return back
    
    // TODO: perform delete
    res.redirect(`/admin/sites`);
  }
})

// Screen 21
router.get('/sites/create', (req, res) => {
  // res.send('Screen 21');
  // TODO: send only the managers
  res.render('admin/create-sites', { title: 'Create Sites', users: users });
});
router.post('/sites/create', (req, res) => {


  console.log(req.body);
  res.redirect('/admin/sites');
})

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
