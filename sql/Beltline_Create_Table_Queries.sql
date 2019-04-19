create database if not exists beltline;
use beltline;
-- DROP ALL EXISTING TABLES

DROP TABLE IF EXISTS `AssignTo`;
DROP TABLE IF EXISTS `Connect`;
DROP TABLE IF EXISTS `TakeTransit`;
DROP TABLE IF EXISTS `VisitSite`;
DROP TABLE IF EXISTS `VisitEvent`;
DROP TABLE IF EXISTS `Transit`;
DROP TABLE IF EXISTS `Event`;
DROP TABLE IF EXISTS `Site`;
DROP TABLE IF EXISTS `Manager`;
DROP TABLE IF EXISTS `Staff`;
DROP TABLE IF EXISTS `Administrator`;
DROP TABLE IF EXISTS `Visitor`;
DROP TABLE IF EXISTS `Employee`;
DROP TABLE IF EXISTS `Email`;
DROP TABLE IF EXISTS `User`;

-- CREATE TABLE BELOW

-- User
CREATE TABLE User (
  Username varchar(160) NOT NULL,
  Password varchar(160) NOT NULL,
  Status char(1) NOT NULL, -- (a)pproved, (p)ending, (d)enied
  FirstName varchar(160) NOT NULL,
  LastName varchar(160) NOT NULL,
  PRIMARY KEY (Username));

-- Email
CREATE TABLE Email (
  Username varchar(160) NOT NULL,
  Email varchar(160) NOT NULL UNIQUE,
  PRIMARY KEY (Username, Email),
  CONSTRAINT Fk_EmailUser FOREIGN KEY (Username) REFERENCES User (Username)
    ON DELETE RESTRICT ON UPDATE CASCADE);

-- Visitor
CREATE TABLE Visitor (
Username varchar(160) NOT NULL,
PRIMARY KEY (Username),
CONSTRAINT Fk_VistorUsername FOREIGN KEY (Username) REFERENCES User(Username)
 ON DELETE RESTRICT ON UPDATE CASCADE);


-- Employee
CREATE TABLE Employee (
  Username varchar(160) NOT NULL,
  EmployeeID char(9) NOT NULL UNIQUE,
  Phone varchar(10) NOT NULL UNIQUE,
  EmployeeAddress varchar(160) NOT NULL,
  EmployeeCity varchar(100) NOT NULL,  -- longest city name is less than 100
  EmployeeState char(2) NOT NULL, -- OT for 'Other'
  EmployeeZipcode char(5) NOT NULL,  -- string instead of decimal to leverage fixed char
  PRIMARY KEY (Username),
  CONSTRAINT Fk_Username FOREIGN KEY (Username) REFERENCES User(Username)
    ON DELETE RESTRICT ON UPDATE CASCADE);

-- Administrator
CREATE TABLE Administrator (
 Username varchar(160) NOT NULL,
 PRIMARY KEY (Username),
 CONSTRAINT Fk_AdminUsername FOREIGN KEY (Username) REFERENCES Employee(Username)
 ON DELETE RESTRICT ON UPDATE CASCADE);

-- Staff
CREATE TABLE Staff (
  Username varchar(160) NOT NULL,
PRIMARY KEY (Username),
CONSTRAINT Fk_StaffUsername FOREIGN KEY (Username) REFERENCES Employee(Username)
 ON DELETE RESTRICT ON UPDATE CASCADE);




-- Manager
CREATE TABLE Manager (
  Username varchar(160) NOT NULL,
PRIMARY KEY (Username),
CONSTRAINT Fk_ManagerUsername FOREIGN KEY (Username) REFERENCES Employee(Username)
 ON DELETE RESTRICT ON UPDATE CASCADE);


-- SITE
CREATE TABLE Site (
  SiteName varchar(160) NOT NULL,
  SiteAddress varchar(160),
  SiteZipcode char(5) NOT NULL,
  OpenEveryday bit(1) NOT NULL DEFAULT 0,
  ManagerUsername varchar(160) NOT NULL UNIQUE,
  PRIMARY KEY (SiteName),
  CONSTRAINT Fk_SiteMgr FOREIGN KEY (ManagerUsername) REFERENCES Manager(Username)
    ON DELETE RESTRICT ON UPDATE CASCADE);

-- EVENT
CREATE TABLE Event (
  EventName varchar(160) NOT NULL,
  StartDate date NOT NULL,
  SiteName varchar(160) NOT NULL,
  EndDate date NOT NULL,
  EventPrice decimal(9, 2) NOT NULL DEFAULT 0,
Capacity int(1) NOT NULL,
  Description text NOT NULL,
  MinStaffRequired int NOT NULL DEFAULT 1, -- (> 0)
  PRIMARY KEY (EventName, StartDate, SiteName),
  CONSTRAINT Fk_EventSite FOREIGN KEY (SiteName) REFERENCES Site (SiteName)
    ON DELETE CASCADE ON UPDATE CASCADE);

-- AssignTo
CREATE TABLE AssignTo (
  StaffUsername varchar(160) NOT NULL,
  EventName varchar(160) NOT NULL,
  StartDate date NOT NULL,
  SiteName varchar(160) NOT NULL,
  PRIMARY KEY(StaffUsername, EventName, StartDate, SiteName),
  CONSTRAINT Fk_AssignToUser FOREIGN KEY (StaffUsername) REFERENCES Staff (Username)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT Fk_AssignToEvent FOREIGN KEY (EventName, StartDate, SiteName)
  	REFERENCES Event (EventName, StartDate, SiteName)
    ON DELETE CASCADE ON UPDATE CASCADE);


-- Transit
CREATE TABLE Transit (
  TransitType varchar(5) NOT NULL,
  TransitRoute varchar(128) NOT NULL,
  TransitPrice decimal(9,2) NOT NULL DEFAULT 0, -- (>= 0)
  PRIMARY KEY (TransitType, TransitRoute));


-- Connect
CREATE TABLE Connect (
  SiteName varchar(160) NOT NULL,
  TransitType varchar(5) NOT NULL,
  TransitRoute varchar(128) NOT NULL,
  PRIMARY KEY (SiteName, TransitType, TransitRoute),
  CONSTRAINT Fk_ConnectSite FOREIGN KEY (SiteName) REFERENCES Site (SiteName)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT Fk_ConnectTransit FOREIGN KEY (TransitType, TransitRoute) REFERENCES Transit (TransitType, TransitRoute)
    ON DELETE CASCADE ON UPDATE CASCADE);


-- TakeTransit
CREATE TABLE TakeTransit (
  Username varchar(160) NOT NULL,
  TransitType varchar(5) NOT NULL,
  TransitRoute varchar(128) NOT NULL,
  TransitDate Date NOT NULL,
  PRIMARY KEY (Username, TransitType, TransitRoute, TransitDate),
  CONSTRAINT Fk_TakeUser FOREIGN KEY (Username) REFERENCES User(Username)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT Fk_TakeTransit FOREIGN KEY (TransitType, TransitRoute) REFERENCES Transit(TransitType, TransitRoute)
    ON DELETE CASCADE ON UPDATE CASCADE);

-- Visit_Site
CREATE TABLE VisitSite (
  VisitorUsername varchar(160) NOT NULL,
  SiteName varchar(160) NOT NULL,
  VisitDate date NOT NULL,
  PRIMARY KEY (VisitorUsername, Sitename, VisitDate),
  CONSTRAINT Fk_SiteVisitUser FOREIGN KEY (VisitorUsername) REFERENCES User (Username)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT Fk_SiteVisitName FOREIGN KEY (SiteName) REFERENCES Site (SiteName)
    ON DELETE CASCADE ON UPDATE CASCADE);

-- Visit_Event
CREATE TABLE VisitEvent (
  VisitorUsername varchar(160) NOT NULL,
  EventName varchar(160) NOT NULL,
  StartDate date NOT NULL,
  SiteName varchar(160) NOT NULL,
  VisitEventDate date NOT NULL,
  PRIMARY KEY (VisitorUsername, EventName, StartDate, SiteName, VisitEventDate),
  CONSTRAINT Fk_EventVisitUser FOREIGN KEY (VisitorUsername) REFERENCES User (Username)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT Fk_EventVisitKey FOREIGN KEY (EventName, StartDate, SiteName)
    REFERENCES Event (EventName, StartDate, SiteName)
    ON DELETE CASCADE ON UPDATE CASCADE);
