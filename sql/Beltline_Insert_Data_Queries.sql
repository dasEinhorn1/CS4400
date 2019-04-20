-- User (Username, Password, Status, FirstName, LastName)
INSERT INTO `User` VALUES
	('james.smith','jsmith123','a','James','Smith'),
	('michael.smith','msmith456','a','Michael','Smith'),
	('robert.smith','rsmith789','a','Robert','Smith'),
	('maria.garcia','mgarcia123','a','Maria','Garcia'),
	('david.smith','dsmith456','a','David','Smith'),
  ('manager1','manager1','p','Manager','One'),
  ('manager2','manager2','a','Manager','Two'),
  ('manager3','manager3','a','Manager','Three'),
  ('manager4','manager4','a','Manager','Four'),
  ('manager5','manager5','a','Manager','Five'),
  ('maria.hernandez','mhernandez','a','Maria','Hernandez'),
  ('maria.rodriguez','mrodriguez','d','Maria','Rodriguez'),
  ('mary.smith','msmith789','a','Mary','Smith'),
  ('staff1','staff1234','a','Staff','One'),
  ('staff2','staff4567','a','Staff','Two'),
  ('staff3','staff7890','a','Staff','Three'),
  ('user1','user123456','p','User','One'),
  ('visitor1','visitor123','a','Visitor','One');

-- UserEmail
INSERT INTO `Email` VALUES
	('james.smith','jsmith@gatech.edu'),
	('james.smith','jsmith@gmail.com'),
	('james.smith','jsmith@hotmail.com'),
	('james.smith','jsmith@outlook.com'),
	('michael.smith','msmith@gmail.com'),
	('robert.smith','rsmith@hotmail.com'),
	('maria.garcia','mgarcia@gatech.edu'),
	('maria.garcia','mgarcia@yahoo.com'),
	('david.smith','dsmith@outlook.com'),
	('maria.rodriguez','mrodriguez@gmail.com'),
	('mary.smith','mary@outlook.com'),
	('maria.hernandez','mh@gatech.edu'),
	('maria.hernandez','mh123@gmail.com'),
	('manager1','m1@beltline.com'),
	('manager2','m2@beltline.com'),
	('manager3','m3@beltline.com'),
	('manager4','m4@beltline.com'),
	('manager5','m5@beltline.com'),
	('staff1','s1@beltline.com'),
	('staff2','s2@beltline.com'),
	('staff3','s3@beltline.com'),
	('user1','u1@beltline.com'),
	('visitor1','v1@beltline.com');

-- Visitor
INSERT INTO `Visitor` VALUES
	('michael.smith'),
	('maria.garcia'),
	('manager2'),
	('manager4'),
	('manager5'),
	('maria.rodriguez'),
	('mary.smith'),
	('staff2'),
	('staff3'),
	('visitor1');

-- Employee
INSERT INTO `Employee` (Username, Phone, EmployeeAddress, EmployeeCity, EmployeeState, EmployeeZipcode) VALUES
	('james.smith','4043721234','123 East Main Street','Rochester','NY','14604'),
	('michael.smith','4043726789','350 Ferst Drive','Atlanta','GA','30332'),
	('robert.smith','1234567890','123 East Main Street','Columbus','OH','43215'),
	('maria.garcia','7890123456','123 East Main Street','Richland','PA','17987'),
	('david.smith','5124776435','350 Ferst Drive','Atlanta','GA','30332'),
	('manager1','8045126767','123 East Main Street','Rochester','NY','14604'),
	('manager2','9876543210','123 East Main Street','Rochester','NY','14604'),
	('manager3','5432167890','350 Ferst Drive','Atlanta','GA','30332'),
	('manager4','8053467565','123 East Main Street','Columbus','OH','43215'),
	('manager5','8031446782','801 Atlantic Drive','Atlanta','GA','30332'),
	('staff1','8024456765','266 Ferst Drive Northwest','Atlanta','GA','30332'),
	('staff2','8888888888','266 Ferst Drive Northwest','Atlanta','GA','30332'),
	('staff3','3333333333','801 Atlantic Drive','Atlanta','GA','30332');

-- Admin
INSERT INTO `Administrator` VALUES
	('james.smith');

-- Staff
INSERT INTO `Staff` VALUES
	('michael.smith'),
	('robert.smith'),
	('staff1'),
	('staff2'),
	('staff3');

-- Manager
INSERT INTO `Manager` VALUES
	('david.smith'),
	('manager1'),
	('manager2'),
	('manager3'),
	('manager4'),
	('manager5'),
	('maria.garcia');

-- Site
INSERT INTO `Site` VALUES
  ('Piedmont Park','400 Park Drive Northeast','30306',_binary '','manager2'),
	('Atlanta Beltline Center','112 Krog Street Northeast','30307',_binary '\0','manager3'),
	('Historic Fourth Ward Park','680 Dallas Street Northeast','30308',_binary '','manager4'),
	('Westview Cemetery','1680 Westview Drive Southwest','30310',_binary '\0','manager5'),
	('Inman Park','','30307',_binary '','david.smith');

-- Event
INSERT INTO `Event` VALUES
	('Eastside Trail','2019-02-04','Piedmont Park','2019-02-05',0.00,99999,'A combination of multi-use trail and linear greenspace, the Eastside Trail was the first finished section of the Atlanta BeltLine trail in the old rail corridor. The Eastside Trail, which was funded by a combination of public and private philanthropic sources, runs from the tip of Piedmont Park to Reynoldstown. More details at https://beltline.org/explore-atlanta-beltline-trails/eastside-trail/',1),
	('Eastside Trail','2019-02-04','Inman Park','2019-02-05',0.00,99999,'A combination of multi-use trail and linear greenspace, the Eastside Trail was the first finished section of the Atlanta BeltLine trail in the old rail corridor. The Eastside Trail, which was funded by a combination of public and private philanthropic sources, runs from the tip of Piedmont Park to Reynoldstown. More details at https://beltline.org/explore-atlanta-beltline-trails/eastside-trail/',1),
	('Eastside Trail','2019-02-13','Historic Fourth Ward Park','2019-02-14',0.00,99999,'A combination of multi-use trail and linear greenspace, the Eastside Trail was the first finished section of the Atlanta BeltLine trail in the old rail corridor. The Eastside Trail, which was funded by a combination of public and private philanthropic sources, runs from the tip of Piedmont Park to Reynoldstown. More details at https://beltline.org/explore-atlanta-beltline-trails/eastside-trail/',1),
	('Eastside Trail','2019-03-01','Inman Park','2019-03-02',0.00,99999,'A combination of multi-use trail and linear greenspace, the Eastside Trail was the first finished section of the Atlanta BeltLine trail in the old rail corridor. The Eastside Trail, which was funded by a combination of public and private philanthropic sources, runs from the tip of Piedmont Park to Reynoldstown. More details at https://beltline.org/explore-atlanta-beltline-trails/eastside-trail/',1),
	('Westside Trail','2019-02-18','Westview Cemetery','2019-02-21',0.00,99999,'The Westside Trail is a free amenity that offers a bicycle and pedestrian-safe corridor with a 14-foot-wide multi-use trail surrounded by mature trees and grasses thanks to Trees Atlanta’s Arboretum. With 16 points of entry, 14 of which will be ADA-accessible with ramp and stair systems, the trail provides numerous access points for people of all abilities. More details at: https://beltline.org/explore-atlanta-beltline-trails/westside-trail/',1),
	('Bus Tour','2019-02-01','Inman Park','2019-02-02',25.00,6,'The Atlanta BeltLine Partnership’s tour program operates with a natural gas-powered, ADA accessible tour bus funded through contributions from 10th & Monroe, LLC, SunTrust Bank Trusteed Foundations – Florence C. and Harry L. English Memorial Fund and Thomas Guy Woolford Charitable Trust, and AGL Resources',2),
	('Bus Tour','2019-02-08','Inman Park','2019-02-10',25.00,6,'The Atlanta BeltLine Partnership’s tour program operates with a natural gas-powered, ADA accessible tour bus funded through contributions from 10th & Monroe, LLC, SunTrust Bank Trusteed Foundations – Florence C. and Harry L. English Memorial Fund and Thomas Guy Woolford Charitable Trust, and AGL Resources',2),
	('Private BusTour','2019-02-01','Inman Park','2019-02-02',40.00,4,'Private tours are available most days, pending bus and tour guide availability. Private tours can accommodate up to 4 guests per tour, and are subject to a tour fee (nonprofit rates are available). As a nonprofit organization with limited resources, we are unable to offer free private tours. We thank you for your support and your understanding as we try to provide as many private group tours as possible. The Atlanta BeltLine Partnership’s tour program operates with a natural gas-powered, ADA accessible tour bus funded through contributions from 10th & Monroe, LLC, SunTrust Bank Trusteed Foundations – Florence C. and Harry L. English Memorial Fund and Thomas Guy Woolford Charitable Trust, and AGL Resources',1),
	('Arboretum Walking Tour','2019-02-08','Inman Park','2019-02-11',5.00,5,'Official Atlanta BeltLine Arboretum Walking Tours provide an up-close view of the Westside Trail and the Atlanta BeltLine Arboretum led by Trees Atlanta Docents. The one and a half hour tours step off at at 10am (Oct thru May), and 9am (June thru September). Departure for all tours is from Rose Circle Park near Brown Middle School. More details at: https://beltline.org/visit/atlanta-beltline-tours/#arboretum-walking',1),
	('Official Atlanta BeltLine Bike Tour','2019-02-09','Atlanta BeltLine Center','2019-02-14',5.00,5,'These tours will include rest stops highlighting assets and points of interest along the Atlanta BeltLine. Staff will lead the rides, and each group will have a ride sweep to help with any unexpected mechanical difficulties.',1);

-- AssignTo
INSERT INTO `AssignTo` VALUES
  ('michael.smith','Eastside Trail','2019-02-04','Piedmont Park'),
	('staff1','Eastside Trail','2019-02-04','Piedmont Park'),
	('robert.smith','Eastside Trail','2019-02-04','Inman Park'),
	('staff2','Eastside Trail','2019-02-04','Inman Park'),
	('staff1','Eastside Trail','2019-03-01','Inman Park'),
	('michael.smith','Eastside Trail','2019-02-13','Historic Fourth Ward Park'),
	('staff1','Westside Trail','2019-02-18','Westview Cemetery'),
	('staff3','Westside Trail','2019-02-18','Westview Cemetery'),
	('michael.smith','Bus Tour','2019-02-01','Inman Park'),
	('staff2','Bus Tour','2019-02-01','Inman Park'),
	('robert.smith','Bus Tour','2019-02-08','Inman Park'),
	('michael.smith','Bus Tour','2019-02-08','Inman Park'),
	('robert.smith','Private BusTour','2019-02-01','Inman Park'),
	('staff3','Arboretum Walking Tour','2019-02-08','Inman Park'),
	('staff1','Official Atlanta BeltLine Bike Tour','2019-02-09','Atlanta BeltLine Center');

-- Transit
INSERT INTO `Transit` VALUES
	('Bike','Relay',1.00),
	('Bus','152',2.00),
	('MARTA','Blue',2.00);

-- Connect
INSERT INTO `Connect` VALUES
	('Inman Park','MARTA','Blue'),
	('Piedmont Park','MARTA','Blue'),
	('Historic Fourth Ward Park','MARTA','Blue'),
	('Westview Cemetery','MARTA','Blue'),
	('Inman Park','Bus','152'),
	('Piedmont Park','Bus','152'),
	('Historic Fourth Ward Park','Bus','152'),
	('Piedmont Park','Bike','Relay'),
	('Historic Fourth Ward Park','Bike','Relay');

-- TakeTransit
INSERT INTO `TakeTransit` VALUES
	('manager2','MARTA','Blue','2019-03-20'),
	('manager2','Bus','152','2019-03-20'),
	('manager3','Bike','Relay','2019-03-20'),
	('manager2','MARTA','Blue','2019-03-21'),
	('maria.hernandez','Bus','152','2019-03-20'),
	('maria.hernandez','Bike','Relay','2019-03-20'),
	('manager2','MARTA','Blue','2019-03-22'),
	('maria.hernandez','Bus','152','2019-03-22'),
	('mary.smith','Bike','Relay','2019-03-23'),
	('visitor1','MARTA','Blue','2019-03-21');

-- VisitSite
INSERT INTO `VisitSite` VALUES
	('mary.smith','Inman Park','2019-02-01'),
	('mary.smith','Inman Park','2019-02-02'),
	('mary.smith','Inman Park','2019-02-03'),
	('mary.smith','Atlanta Beltline Center','2019-02-01'),
	('mary.smith','Atlanta Beltline Center','2019-02-10'),
	('mary.smith','Historic Fourth Ward Park','2019-02-02'),
	('mary.smith','Piedmont Park','2019-02-02'),
	('visitor1','Piedmont Park','2019-02-11'),
	('visitor1','Atlanta Beltline Center','2019-02-13'),
	('visitor1','Historic Fourth Ward Park','2019-02-11'),
	('visitor1','Westview Cemetery','2019-02-06'),
	('visitor1','Inman Park','2019-02-01'),
	('visitor1','Piedmont Park','2019-02-01'),
	('visitor1','Atlanta Beltline Center','2019-02-09');

-- VisitEvent
INSERT INTO `VisitEvent` VALUES
	('mary.smith','Bus Tour','2019-02-01','Inman Park','2019-02-01'),
	('maria.garcia','Bus Tour','2019-02-01','Inman Park','2019-02-02'),
	('manager2','Bus Tour','2019-02-01','Inman Park','2019-02-02'),
	('manager4','Bus Tour','2019-02-01','Inman Park','2019-02-01'),
	('manager5','Bus Tour','2019-02-01','Inman Park','2019-02-02'),
	('staff2','Bus Tour','2019-02-01','Inman Park','2019-02-02'),
	('mary.smith','Private BusTour','2019-02-01','Inman Park','2019-02-01'),
	('mary.smith','Private BusTour','2019-02-01','Inman Park','2019-02-02'),
	('mary.smith','Official Atlanta BeltLine Bike Tour','2019-02-09','Atlanta BeltLine Center','2019-02-10'),
	('mary.smith','Arboretum Walking Tour','2019-02-08','Inman Park','2019-02-10'),
	('mary.smith','Westside Trail','2019-02-18','Westview Cemetery','2019-02-19'),
	('mary.smith','Eastside Trail','2019-02-04','Piedmont Park','2019-02-04'),
	('mary.smith','Eastside Trail','2019-02-13','Historic Fourth Ward Park','2019-02-13'),
	('mary.smith','Eastside Trail','2019-02-13','Historic Fourth Ward Park','2019-02-14'),
	('visitor1','Eastside Trail','2019-02-13','Historic Fourth Ward Park','2019-02-14'),
	('visitor1','Official Atlanta BeltLine Bike Tour','2019-02-09','Atlanta BeltLine Center','2019-02-10'),
	('visitor1','Westside Trail','2019-02-18','Westview Cemetery','2019-02-19');
