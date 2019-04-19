import db from '../database/db';
import dotenv from 'dotenv';
dotenv.config();

// WARNING: for debugging only!!
const noAuth = {
  unauthenticated (req, res, next) {
    req.session.user= undefined;
    next();
  },
  user (req, res, next) {
    req.session.user= {
      username: 'james.smith'
    };
    next();
  },
  employee (req, res, next) {
    req.session.user= {
      username: 'staff1'
    };
    next();
  },
  visitor (req, res, next) {
    req.session.user= {
      username: 'visitor1'
    };
    next();
  },
  staff (req, res, next) {
    req.session.user= {
      username: 'staff3'
    };
    next();
  },
  manager (req, res, next) {
    req.session.user= {
      username: 'manager1'
    };
    next();
  },
  admin (req, res, next) {
    req.session.user= {
      username: 'james.smith'
    };
    next();
  },
};

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
    db.auth.isAdmin(req.session.user.username)
      .then(allowed => {
        if (allowed) {
          return next();
        } else {
          return res.redirect('back');
        }
      })
  },
}

let exportedAuth = (process.env.DEBUG_MODE == 1) ? noAuth : Auth;
export default exportedAuth;
