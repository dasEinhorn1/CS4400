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

const updateEmployee = (employee)=> {

};

export default {
  getEmployee,
  updateEmployee
}
