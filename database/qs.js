export const allUserInfo =
  `select U.*, E.*,
    CASE WHEN exists (select * from Administrator as A where A.Username = U.Username) then 1 else 0 end as isAdmin,
    CASE WHEN exists (select * from Manager as A where A.Username = U.Username) then 1 else 0 end as isManager,
    CASE WHEN exists (select * from Staff as A where A.Username = U.Username) then 1 else 0 end as isStaff,
    CASE WHEN exists (select * from Visitor as A where A.Username = U.Username) then 1 else 0 end as isVisitor
  from User as U left join Employee as E
  on U.Username = E.Username `;

export default {
  allUserInfo
}
