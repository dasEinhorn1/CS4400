// TODO: this user model may needs to change
const User = (firstName, lastName, status, username, type, emails) => ({
  firstName,
  lastName,
  status,
  username,
  type,
  emails
});

const users = [
  User('mj', 'park', 'Approved', 'spark359', 'User', [
    'spark359@gatech.edu',
    'test@test.com'
  ]),
  User('first-test', 'last-test', 'Declined', 'test1', 'Visitor', [
    'test1@gmail.com',
    'test11@test.com'
  ]),
  User('first-test2', 'last-test2', 'Pending', 'test2', 'Staff', [
    'test2@gmail.com',
    'test22@test.com'
  ]),
  User('first-test3', 'last-test3', 'Pending', 'test3', 'Manager', [
    'test3@gmail.com',
    'test33@test.com'
  ])
];

export default users;
