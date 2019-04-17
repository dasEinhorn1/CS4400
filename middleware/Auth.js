const Auth = {
  unauthenticated (req, res, next) {
    next();
  },

  user (req, res, next) {
    next();
  },

  employee (req, res, next) {
    next();
  },

  visitor (req, res, next) {
    next();
  },

  staff (req, res, next) {
    next();
  },

  manager (req, res, next) {
    next();
  },

  admin (req, res, next) {
    next();
  },
}

export default Auth;
