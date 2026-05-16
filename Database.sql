create database if not exists Healthy;
use Healthy;

create table dataset(
  id int primary key auto_increment,
  email varchar(50),
  password varchar(500)
);

create table HealthPredictData(
  id int primary key auto_increment,
  currentUser varchar(40),
  healthScore float,
  risk varchar(10),
  diabetes float,
  heartDisease float,
  advice text,
  predictionDate datetime,
  patientName varchar(100)
);


create table feedbackData(
  id int primary key auto_increment,
  currentUser varchar(50),
  patientName varchar(50),
  accuracy int,
  easyToUse int,
  rating int,
  suggestions text,
  duration datetime
);


-- -------------------------------------------------------
-- Migration: Run these if tables already exist in prod
-- -------------------------------------------------------
-- ALTER TABLE HealthPredictData ADD COLUMN patientName varchar(100);
-- ALTER TABLE feedbackData MODIFY COLUMN duration datetime;
-- -------------------------------------------------------

select * from dataset;
select * from HealthPredictData;
select * from feedbackData;