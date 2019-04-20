import db from '../db';
import { getFirst } from '../qs';

const getEmployee = (username) => {
  const qStr = `
    SELECT  FirstName as firstName,
            LastName as lastName,
            User.Username as username,
            SiteName as site,
            EmployeeID as id,
            Phone as phone,
            EmployeeAddress as address,
            EmployeeCity as city,
            Email.Email as email,
            CASE WHEN exists (
              select *
              from Visitor as V
              where V.Username = User.Username) then 1 else 0 end as isVisitor
    FROM User LEFT JOIN Site
      ON User.Username = Site.ManagerUsername
    INNER JOIN Employee
      ON User.Username = Employee.Username
    INNER JOIN Email
      ON User.Username = Email.Username
    WHERE User.Username = '${username}'`
  return db.query(qStr)
    .then(employees => Object.values(employees.reduce((usersObj, emp) => {
      // add the username as the key of the object
      if (!usersObj[emp.username]) {
        usersObj[emp.username] = {...emp, emails: [emp.email]};
      } else {
        usersObj[emp.username].emails.push(emp.email)
      }
      return usersObj;
    }, {})))
    .then(getFirst)
};

const checkNewEmailsUniqueFor = (employee) => {
  const emails = employee.emails;
  const emailsQuoted = emails.map(email => `'${email}'`).join(',');
  const qStr =
  ` select Count(Email) as conflicts
    from Email
    where Email in (${emailsQuoted})
      and Email.Username != '${employee.username}';`;
  return db.query(qStr)
    .then(getFirst)
    .then(({conflicts}) => conflicts < 1);
}

export const userTypeInsertion = (table, user) => {
  return db.query(`insert into ${table} values ('${user.username}')`)
    .then(() => user);
}


const updateEmployee = (employee) => {
  console.log(employee);
  const { firstName, lastName, username, phone, isVisitor, emails } = employee;
  let insertEmails = 'INSERT INTO Email VALUES '
  if (emails.length < 1) {
    insertEmails = ''
  } else {
    insertEmails += emails.map(email =>`('${username}', '${email}')`).join(',');
  }

  const setVisitor = (isVisitor) ? userTypeInsertion : false;

  return checkNewEmailsUniqueFor(employee)
    .then(result => {
      if (!result) throw new Error("1 or more emails not unique.")
      return db.query(`
        UPDATE User
        SET User.FirstName = '${firstName}', User.LastName = '${lastName}'
        WHERE User.Username = '${username}';`);
    }).then(() => {
      return db.query(`UPDATE Employee
        SET Employee.Phone='${phone}' WHERE Employee.Username = '${username}';`)
    }).then(() => {
      return db.query(`DELETE FROM Visitor WHERE Username = '${username}';`)
    }).then(() => {
      if (setVisitor) {
        return userTypeInsertion('Visitor', employee)
      };
    }).then(() => {
      return db.query(`DELETE FROM Email WHERE Email.Username = '${username}'`)
    }).then(() => {
      if (!insertEmails) {
        return;
      }
      return db.query(insertEmails)
    })



};

export default {
  getEmployee,
  updateEmployee
}
