import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {});

// Screen 18
router.get('/users', (req, res) => {
  res.send('Screen 18');
});

// Screen 19
router.get('/sites', (req, res) => {
  res.send('Screen 19');
});

// Screen 21
router.get('/sites/create', (req, res) => {
  res.send('Screen 21');
});

// Screen 20
router.get('/sites/:id/edit', (req, res) => {
  res.send('Screen 20');
});

// Screen 22
router.get('/transits', (req, res) => {
  res.send('Screen 22');
});

// Screen 24
router.get('/transits/create', (req, res) => {
  res.send('Screen 24');
});

// Screen 23
router.get('/transits/:id/edit', (req, res) => {
  res.send('Screen 23');
});

export default router;
