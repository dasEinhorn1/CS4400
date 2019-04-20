import { check, body, query, validationResult } from 'express-validator/check';

const emails = (name='emails') => {
  return check(name).custom((emails) => {
    const allValid = emails.split(',')
      .map(email => email.trim())
    .reduce((valid, email) => valid
      && /[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+/.test(email), true)
    if (allValid) return true;
    throw new Error('One or more emails invalid');
  })
}

const discreteSelect = (name, options) => [
  check(name).custom(val => {
    if (options.includes(val))
      return true;
    throw new Error('Invalid Transport Type');
  })
]

const range = ([lower, upper]) => [
  check(upper)
    .custom((val) => {
      const numVal = Number.parseFloat(val)
      if (!val || (!Number.isNaN(numVal) && numVal >= 0)) return true;
      throw new Error('Invalid bound entry')
    }),
  check(lower)
    .custom((val) => {
      const numVal = Number.parseFloat(val)
      if (!val || (!Number.isNaN(numVal) && numVal >= 0)) return true;
      throw new Error('Invalid bound entry')
    }).custom((val, {req}) => {
      if (req.query.upperPrice && val && req.query.upperPrice < val) {
        throw new Error('Upper price must be higher than lower price')
      }
      return true;
    })
]

const userRegister = [
  body('firstName').not().isEmpty(),
  body('lastName').not().isEmpty(),
  body('username').not().isEmpty(),
  // check password is string >= 8 characters
  body('password').isLength({ min: 8 }),
  // check password == confirmPassword
  body('confirmPassword').custom((value, { req }) => {
    if (value === req.body.password)
      return true;
    throw new Error('Password confirmation does not match password');
  }),
  emails
]

const employeeRegister = [
  ...userRegister,
  body('phone').isLength(10),
  body('address').not().isEmpty(),
  body('city').not().isEmpty(),
  body('state').isLength(2),
  body('zipcode').isLength(5),
  body('userType').custom((v) => {
    if (v === "M" || v === "S")
      return true;
    throw new Error('Invalid employee type')
  })
]

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach(console.log);
    return res.redirect('back');
  }
  return next();
}

export default {
  userRegister,
  employeeRegister,
  discreteSelect,
  emails,
  range,
  validate
}
