import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {});

// Screen 18
router.get('/users', (req, res) => {
  // res.send('Screen 18');
  res.render('admin/users', { title: 'Users'});
});

// Screen 19
router.get('/sites', (req, res) => {
  // res.send('Screen 19');
  res.render('admin/sites', { title: 'Sites' });
});

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
