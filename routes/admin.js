import express from 'express';
import Auth from '../middleware/Auth';
// import users from '../fixtures/users';
// import manages from '../fixtures/manages';
// import transits from '../fixtures/transits';
import sites from '../fixtures/sites';
import db from '../database/db';
import qs from '../database/qs';

const router = express.Router();

router.use(Auth.admin);
// router.get('/', (req, res) => {});

// Screen 18
router.get('/users', (req, res) => {
  // res.send('Screen 18');
  // console.log(req.query);
  let types = ['User', 'Visitor', 'Staff', 'Manager'];
  const { username, userType, status, filter } = req.query;

  // filter
  if (filter == 'true') {
    db.admin.filterUsers({ username, userType, status }).then(users => {
      res.render('admin/users', { title: 'Users', users: users });
    });
  } else {
    db.admin.getAllUsers().then(users => {
      res.render('admin/users', { title: 'Users', users: users });
    });
  }
});

router.post('/users', (req, res) => {
  const { username, status } = req.body;
  db.admin.updateUserStatus({ username, status }).then(() => {
    res.redirect('/admin/users');
  });
});

// ========================== SITES ================================

// Screen 19
router.get('/sites', (req, res) => {
  // res.send('Screen 19');
  const { username } = req.session.user;
  const { site, manager, openEveryday, filter } = req.query;

  if (filter == 'true') {
    db.admin.filterSites({ site, manager, openEveryday }).then(manages => {
      res.render('admin/sites', { title: 'Sites', manages: manages });
    });
  } else {
    db.admin.getAllSites().then(manages => {
      res.render('admin/sites', { title: 'Sites', manages: manages });
    });
  }
});
router.post('/sites', (req, res) => {
  const { site, buttonType } = req.body;

  if (buttonType == 'edit') {
    // if 'Edit', retrieve its info and send it to 'edit'
    res.redirect(`/admin/sites/edit?site=${site}`);
  } else if (buttonType == 'delete') {
    // elif 'Delete', just delete it and return back
    db.admin.deleteSite({ site }).then(() => {
      res.redirect(`/admin/sites`);
    });
  }
});

// Screen 21
router.get('/sites/create', (req, res) => {
  // res.send('Screen 21');
  db.admin.fetchUnassignedManagers().then(managers => {
    res.render('admin/create-sites', {
      title: 'Create Sites',
      managers: managers
    });
  });
});
router.post('/sites/create', (req, res) => {
  console.log(req.body);
  db.admin.createSite(req.body);
  res.redirect('/admin/sites');
});

// Screen 20
router.get('/sites/edit', (req, res) => {
  // res.send('Screen 20', {title: 'Edit Site'});
  // console.log(req.query);
  const { site } = req.query;
  db.admin
    .fetchUnassignedManagers()
    .then(managers => managers)
    .then(managers => {
      db.admin.filterSites({ site }).then(site => {
        if (site.length > 0) site = site[0];
        res.render('admin/edit-site', {
          title: 'Edit Site',
          site: site,
          managers: managers
        });
      });
    });
});
router.post('/sites/edit', (req, res) => {
  console.log(req.body);
  const {
    siteName,
    zipcode,
    address,
    manager,
    openEveryday,
    originalSiteName
  } = req.body;
  db.admin
    .updateSite({
      siteName,
      zipcode,
      address,
      manager,
      openEveryday,
      originalSiteName
    })
    .then(() => {
      res.redirect('/admin/sites');
    });
});

// ========================== TRANSITS ================================

// Screen 22
router.get('/transits', (req, res) => {
  // res.send('Screen 22', { title: 'Transits' });
  console.log(req.query);
  const { filter } = req.query;
  if (filter == 'true') {
    db.admin.getAllSites().then(sites => {
      db.admin.filterTransits(req.query).then(transits => {
        // console.log(sites);
        res.render('admin/transits', {
          title: 'Transits',
          transits: transits,
          sites: sites
        });
      });
    });
  } else {
    db.admin.getAllSites().then(sites => {
      db.admin.getAllTransits().then(transits => {
        // console.log(sites);
        res.render('admin/transits', {
          title: 'Transits',
          transits: transits,
          sites: sites
        });
      });
    });
  }
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
