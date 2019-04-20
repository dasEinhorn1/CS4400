export const allUserInfo = `select  U.*, EmployeeID, Phone, EmployeeAddress as Address, EmployeeCity as City, EmployeeState as State, EmployeeZipcode as Zipcode,
    CASE WHEN exists (select * from Administrator as A where A.Username = U.Username) then 1 else 0 end as isAdmin,
    CASE WHEN exists (select * from Manager as A where A.Username = U.Username) then 1 else 0 end as isManager,
    CASE WHEN exists (select * from Staff as A where A.Username = U.Username) then 1 else 0 end as isStaff,
    CASE WHEN exists (select * from Visitor as A where A.Username = U.Username) then 1 else 0 end as isVisitor
  from User as U left join Employee as E
  on U.Username = E.Username
  `;

export const userCheckQ = (table, username) => `select *
   from ${table}
   where Username='${username}'`;

export const allUserInfoWithNumEmails = `select  U.*, COUNT(*) AS numEmails, EmployeeID, Phone, EmployeeAddress as Address, EmployeeCity as City, EmployeeState as State, EmployeeZipcode as Zipcode,
    CASE WHEN exists (select * from Administrator as A where A.Username = U.Username) then 1 else 0 end as isAdmin,
    CASE WHEN exists (select * from Manager as A where A.Username = U.Username) then 1 else 0 end as isManager,
    CASE WHEN exists (select * from Staff as A where A.Username = U.Username) then 1 else 0 end as isStaff,
    CASE WHEN exists (select * from Visitor as A where A.Username = U.Username) then 1 else 0 end as isVisitor
    from User as U left join Employee as E on U.Username = E.Username
    LEFT JOIN Email ON U.username = Email.Username
    GROUP BY U.Username`;

export const createAllUserView = `CREATE VIEW USERS_VIEW AS
    select  U.*, COUNT(*) AS numEmails, EmployeeID, Phone, EmployeeAddress as Address, EmployeeCity as City, EmployeeState as State, EmployeeZipcode as Zipcode,
      CASE WHEN exists (select * from Administrator as A where A.Username = U.Username) then 1 else 0 end as isAdmin,
      CASE WHEN exists (select * from Manager as A where A.Username = U.Username) then 1 else 0 end as isManager,
      CASE WHEN exists (select * from Staff as A where A.Username = U.Username) then 1 else 0 end as isStaff,
      CASE WHEN exists (select * from Visitor as A where A.Username = U.Username) then 1 else 0 end as isVisitor
    from User as U left join Employee as E on U.Username = E.Username
    LEFT JOIN Email ON U.username = Email.Username
    GROUP BY U.Username`;

export const employeeInsert = `INSERT INTO Employee (Username, Phone, EmployeeAddress, EmployeeCity, EmployeeState, EmployeeZipcode) VALUES `;

export default {
  allUserInfo,
  allUserInfoWithNumEmails,
  createAllUserView,
  employeeInsert
};
