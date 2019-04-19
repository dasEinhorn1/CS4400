import db from '../database/db';
const Auth = {
  unauthenticated (req, res, next) {
    if (req.session.user) {
      return res.redirect('back');
    }
    next();
  },

  user (req, res, next) {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    db.auth.isUser(req.session.user.username)
      .then(isUser => {
        if (isUser) {
          return next();
        } else {
          return res.redirect('back');
        }
      })
  },

  employee (req, res, next) {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    db.auth.isEmployee(req.session.user.username)
      .then(allowed => {
        if (allowed) {
          return next();
        } else {
          return res.redirect('back');
        }
      })
  },

  visitor (req, res, next) {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    db.auth.isVisitor(req.session.user.username)
      .then(allowed => {
        if (allowed) {
          return next();
        } else {
          return res.redirect('back');
        }
      })
  },

  staff (req, res, next) {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    db.auth.isStaff(req.session.user.username)
      .then(allowed => {
        if (allowed) {
          return next();
        } else {
          return res.redirect('back');
        }
      })
  },

  manager (req, res, next) {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    db.auth.isManager(req.session.user.username)
      .then(allowed => {
        if (allowed) {
          return next();
        } else {
          return res.redirect('back');
        }
      })
  },

  admin (req, res, next) {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    db.auth.isManager(req.session.user.username)
      .then(allowed => {
        if (allowed) {
          return next();
        } else {
          return res.redirect('back');
        }
      })
  },
}

export default Auth;
