import { body, query, validationResult } from 'express-validator/check';

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
  body('emails').custom((value) => {
    const allValid = value.split(',')
      .map(email => email.trim())
      .reduce((valid, email) => valid &&
        /[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+/.test(email))
    if (allValid)
      return true;
    throw new Error('One or more emails invalid');
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
  validate
}
