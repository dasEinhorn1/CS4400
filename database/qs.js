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


// [{
  //   name: 'Connect.TransitType',
  //   operator: '=',
  //   value: transportType,
  //   condition: (transportType && transportType != 'all')
  // }]
const generateFilterGenerator = (filterType) => {
  return (filters) => {
    const statements = filters.filter((filt) => filt.condition(filt.value))
      .map(({name, operator="=", value, interpret=true}) => {
        if (Array.isArray(value) && interpret) return `${name} ${operator} (${value})`;
        if (typeof value === 'string' && interpret) return `${name} ${operator} '${value}'`;
        return `${name} ${operator} ${value}`;
      });
    if (statements.length > 0) {
      return ` ${filterType} ` + statements.join(' AND ') + ' ';
    } else {
      return '';
    }
  }
}

export const generateWhere = generateFilterGenerator('WHERE');
export const generateHaving = generateFilterGenerator('HAVING');

export const createFilter = (name, value, condition=(()=>true), operator='=') => ({
  name, value, condition, operator
})

export const getSingle = (index) => {
  return (rows) => rows[index];
};

export const getFirst = getSingle(0);

export const createConcatFilter = (name, value, condition=(()=>true), operator="LIKE") => {
  return {
    ...createFilter(name, `CONCAT('%','${value}','%')`, (()=>condition(value)), operator),
    interpret: false
  };
}

export const createRangeFilters = (name, [lower, upper], condition, [lInc=true, uInc=true]=[]) => {
  return [
    createFilter(name, lower, condition, `>${(lInc) ? '=' : '' }`),
    createFilter(name, upper, condition, `<${(uInc) ? '=' : '' }`)
  ]
}

export const employeeInsert = `INSERT INTO Employee (Username, Phone, EmployeeAddress, EmployeeCity, EmployeeState, EmployeeZipcode) VALUES `;

export default {
  allUserInfo,
  allUserInfoWithNumEmails,
  createAllUserView,
  employeeInsert,
  generateWhere,
  generateHaving,
  createFilter,
  createRangeFilters,
  createConcatFilter,
  getSingle,
  getFirst
};
