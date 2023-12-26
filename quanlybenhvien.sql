CREATE DATABASE IF NOT EXISTS `hospital_db`;
USE `hospital_db`;

-- -----------------------------------------------------
-- Table `credentials`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `credentials` (
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `id` VARCHAR(5) NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `departments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `departments` (
  `department_id` INT NOT NULL AUTO_INCREMENT,
  `department_name` VARCHAR(45) NOT NULL,
  `description` TEXT NOT NULL,
  `head_of_department` VARCHAR(20) NOT NULL,
  `department_phone` VARCHAR(10) NOT NULL,
  `department_email` VARCHAR(45) NOT NULL,
  `department_address` VARCHAR(2) NOT NULL,
  PRIMARY KEY (`department_id`)
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `doctors`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `doctors` (
  `doctor_id` VARCHAR(5) NOT NULL,
  `expertise` VARCHAR(45) NOT NULL,
  `department` INT NOT NULL,
  PRIMARY KEY (`doctor_id`)
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `drugs`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `drugs` (
  `drug_id` INT NOT NULL AUTO_INCREMENT,
  `drug_name` VARCHAR(50) NOT NULL,
  `dosage` TEXT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `origin` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`drug_id`)
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `drugs_used_per_id`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `drugs_used_per_id` (
  `medicine_bill_id` INT NOT NULL,
  `drug_id` INT NOT NULL,
  `quantity_used` INT NOT NULL,
  PRIMARY KEY (`medicine_bill_id`, `drug_id`)
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `employees`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `employees` (
  `employee_id` VARCHAR(5) NOT NULL,
  `full_name` VARCHAR(30) NOT NULL,
  `dob` DATE NOT NULL,
  `gender` VARCHAR(3) NOT NULL,
  `phone_number` VARCHAR(10) NOT NULL,
  `email` VARCHAR(30) NOT NULL,
  `address` VARCHAR(45) NOT NULL,
  `salary` DECIMAL(10,2) NOT NULL,
  `work_from` DATE NOT NULL,
  `status` VARCHAR(10) DEFAULT "active",
  PRIMARY KEY (`employee_id`)
) ENGINE = InnoDB;



-- -----------------------------------------------------
-- Table `equipment_bills`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `equipment_bills` (
  `equipment_bill_id` INT NOT NULL AUTO_INCREMENT,
  `total_equipment_bill` DECIMAL(10,2) DEFAULT NULL,
  PRIMARY KEY (`equipment_bill_id`)
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `equipments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `equipments` (
  `equipment_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `status` VARCHAR(45) NOT NULL,
  `quantity_left` INT NOT NULL,
  `fee_per_day` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`equipment_id`)
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `equipments_used_per_id`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `equipments_used_per_id` (
  `equipment_bill_id` INT NOT NULL AUTO_INCREMENT,
  `equipment_id` INT NOT NULL,
  `quantity_used` INT NOT NULL,
  `day_used` INT NOT NULL,
  PRIMARY KEY (`equipment_bill_id`, `equipment_id`)
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `manager`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `manager` (
  `id` VARCHAR(5) NOT NULL,
  `role` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `medical_reports`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `medical_reports` (
  `report_id` INT NOT NULL AUTO_INCREMENT,
  `patient_id` VARCHAR(5) NOT NULL,
  `doctor_id` VARCHAR(5) NOT NULL,
  `diagnostic` TEXT NULL,
  `conclusion` TEXT NULL,
  `note` TEXT NULL,
  `booking_time` TIME NOT NULL,
  `appointment_date` DATE NOT NULL,
  `bill_id` INT NOT NULL,
  `money_need_to_pay` DECIMAL(10,2) NULL,
  PRIMARY KEY (`report_id`, `patient_id`,`doctor_id`)
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `medicine_bills`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `medicine_bills` (
  `medicine_bill_id` INT NOT NULL AUTO_INCREMENT,
  `total_medicine_bill` DECIMAL(10,2) DEFAULT NULL,
  PRIMARY KEY (`medicine_bill_id`)
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nurses`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nurses` (
  `nurse_id` VARCHAR(5) NOT NULL,
  `department` INT NOT NULL,
  `shift` VARCHAR(5) NOT NULL,
  PRIMARY KEY (`nurse_id`)
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `patient`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `patient` (
  `patient_id` VARCHAR(5) NOT NULL,
  `full_name` VARCHAR(30) NOT NULL,
  `dob` DATE NOT NULL,
  `gender` VARCHAR(3) NOT NULL,
  `phone_number` CHAR(10) NULL,
  `address` VARCHAR(45) NULL,
  `email` VARCHAR(30) NULL,
  `health_insurance_percent` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`patient_id`)
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `service_bills`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `service_bills` (
  `service_bill_id` INT NOT NULL AUTO_INCREMENT,
  `total_service_bill` DECIMAL(10,2) DEFAULT NULL,
  PRIMARY KEY (`service_bill_id`)
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `services`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `services` (
  `service_id` INT NOT NULL AUTO_INCREMENT,
  `service_name` VARCHAR(45) NULL,
  `service_fee` DECIMAL(10,2) NULL,
  PRIMARY KEY (`service_id`)
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `services_used_per_id`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `services_used_per_id` (
  `service_bill_id` INT NOT NULL,
  `service_id` INT NOT NULL,
  PRIMARY KEY (`service_bill_id`, `service_id`)
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `total_bills`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `total_bills` (
  `total_bill_id` INT NOT NULL AUTO_INCREMENT,
  `service_bill_id` INT DEFAULT NULL,
  `medicine_bill_id` INT DEFAULT NULL,
  `equipment_bill_id` INT DEFAULT NULL,
  `total_bill_raw` DECIMAL(10,2) DEFAULT NULL,
  PRIMARY KEY (`total_bill_id`)
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `wait_list`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `wait_list` (
  `wait_id` INT NOT NULL AUTO_INCREMENT,
  `patient_id` VARCHAR(5) NOT NULL,
  `description` TEXT NOT NULL,
  `status` VARCHAR(15) DEFAULT "waiting",
  `priority` VARCHAR(3) NOT NULL,
  PRIMARY KEY (`wait_id`)
) ENGINE = InnoDB;


-- Add foreign key constraints


-- Table `doctors`
ALTER TABLE `doctors`
  ADD CONSTRAINT `fk_doctors_departments`
  FOREIGN KEY (`department`)
  REFERENCES `departments` (`department_id`),
  ADD CONSTRAINT `fk_doctors_employees`
  FOREIGN KEY (`doctor_id`)
  REFERENCES `employees` (`employee_id`);

-- Table `drugs_used_per_id`
ALTER TABLE `drugs_used_per_id`
  ADD CONSTRAINT `fk_drugs_used_per_id_medicine_bills`
  FOREIGN KEY (`medicine_bill_id`)
  REFERENCES `medicine_bills` (`medicine_bill_id`),
  ADD CONSTRAINT `fk_drugs_used_per_id_drugs`
  FOREIGN KEY (`drug_id`)
  REFERENCES `drugs` (`drug_id`);


-- Table `equipments_used_per_id`
ALTER TABLE `equipments_used_per_id`
  ADD CONSTRAINT `fk_equipments_used_per_id_equipment_bills`
  FOREIGN KEY (`equipment_bill_id`)
  REFERENCES `equipment_bills` (`equipment_bill_id`),
  ADD CONSTRAINT `fk_equipments_used_per_id_equipments`
  FOREIGN KEY (`equipment_id`)
  REFERENCES `equipments` (`equipment_id`);

-- Table `manager`
ALTER TABLE `manager`
  ADD CONSTRAINT `fk_executive_board_employees`
  FOREIGN KEY (`id`)
  REFERENCES `employees` (`employee_id`);

-- Table `medical_reports`
ALTER TABLE `medical_reports`
  ADD CONSTRAINT `fk_medical_reports_doctors`
  FOREIGN KEY (`doctor_id`)
  REFERENCES `doctors` (`doctor_id`),
  ADD CONSTRAINT `fk_medical_reports_total_bills`
  FOREIGN KEY (`bill_id`)
  REFERENCES `total_bills` (`total_bill_id`),
  ADD CONSTRAINT `fk_medical_reports_patient`
  FOREIGN KEY (`patient_id`)
  REFERENCES `patient` (`patient_id`);

-- Table `nurses`
ALTER TABLE `nurses`
  ADD CONSTRAINT `fk_nurse_departments`
  FOREIGN KEY (`department`)
  REFERENCES `departments` (`department_id`),
  ADD CONSTRAINT `fk_nurse_employees`
  FOREIGN KEY (`nurse_id`)
  REFERENCES `employees` (`employee_id`);

-- Table `services_used_per_id`
ALTER TABLE `services_used_per_id`
  ADD CONSTRAINT `fk_services_used_per_id_service_bills`
  FOREIGN KEY (`service_bill_id`)
  REFERENCES `service_bills` (`service_bill_id`),
  ADD CONSTRAINT `fk_services_used_per_id_services`
  FOREIGN KEY (`service_id`)
  REFERENCES `services` (`service_id`);

-- Table `total_bills`
ALTER TABLE `total_bills`
  ADD CONSTRAINT `fk_total_bills_service_bills`
  FOREIGN KEY (`service_bill_id`)
  REFERENCES `service_bills` (`service_bill_id`),
  ADD CONSTRAINT `fk_total_bills_medicine_bills`
  FOREIGN KEY (`medicine_bill_id`)
  REFERENCES `medicine_bills` (`medicine_bill_id`),
  ADD CONSTRAINT `fk_total_bills_equipment_bills`
  FOREIGN KEY (`equipment_bill_id`)
  REFERENCES `equipment_bills` (`equipment_bill_id`);

-- Table `wait_list`
ALTER TABLE `wait_list`
  ADD CONSTRAINT `fk_wait_list_patient`
  FOREIGN KEY (`patient_id`)
  REFERENCES `patient` (`patient_id`);


INSERT INTO `credentials` (`username`, `password`, `id`) VALUES
('bs001', 'abcd1234', 'BS001'),
('ql003', 'abcdef123456', 'QL003'),
('yt002', 'abcde12345', 'YT002');


INSERT INTO `departments` (`department_id`, `department_name`, `description`, `head_of_department`, `department_phone`, `department_email`, `department_address`) VALUES
(1, 'Dermatology', 'Khoa da liễu', 'Hoai Thuong', '0000000000', 'dermatology@hospital.com', 'C1'),
(2, 'Laboratory', 'Khoa xét nghiệm', 'Tuan Vu', '1111111111', 'laboratory@hospital.com', 'B2'),
(3, 'Ophthalmology', 'Khoa mắt', 'Trong Duc', '2222222222', 'ophthalmology@hospital.com', 'C3'),
(4, 'Psychology', 'Khoa tâm lý', 'Duc Hieu', '3333333333', 'psychology@hospital.com', 'D4');


INSERT INTO `services` (`service_id`, `service_name`, `service_fee`) VALUES
(1, 'Siêu âm', 100000),
(2, 'Chụp X-quang', 200000),
(3, 'Xét nghiệm máu', 150000),
(4, 'Khám mắt', 80000);


INSERT INTO `drugs` (`drug_id`, `drug_name`, `dosage`, `price`, `origin`) VALUES
(1, 'Thuốc hạ sốt', 'sáng 1, chiều 1, trước ăn', 100, 'Mỹ'),
(2, 'Thuốc cảm cúm', 'sáng 2, chiều 2, uống sau ăn', 200, 'Việt Nam'),
(3, 'Thuốc ho', 'Dùng mỗi khi bị ho', 50, 'Đức');


INSERT INTO `equipments` (`equipment_id`, `name`, `status`, `quantity_left`, `fee_per_day`) VALUES
(2, 'Quần áo', 'Tốt', 100, 20),
(3, 'Hộp đựng nước tiểu', 'Tốt', 100, 5),
(4, 'Khăn', 'Tốt', 100, 10),
(5, 'Bình nước', 'Tốt', 100, 15);


INSERT INTO `patient` (`patient_id`, `full_name`, `dob`, `gender`, `phone_number`, `address`, `email`, `health_insurance_percent`) VALUES
('BN001', 'Bệnh Nhân Một', '2023-01-01', 'Nam', '0111111111', 'Địa chỉ bệnh nhân một', 'benhnhan1@gmail.com', 10),
('BN002', 'Bệnh Nhân Hai', '2023-02-02', 'Nam', '0222222222', 'Địa chỉ bệnh nhân hai', 'benhnhan2@gmail.com', 20),
('BN003', 'Bệnh Nhân Ba', '2023-03-03', 'Nữ', '0333333333', 'Địa chỉ bệnh nhân ba', 'benhnhan3@gmail.com', 30),
('BN004', 'Bệnh Nhân Bốn', '2023-04-04', 'Nam', '0444444444', 'Địa chỉ bệnh nhân bốn', 'benhnhan4@gmail.com', 40),
('BN005', 'Bệnh Nhân Năm', '2023-05-05', 'Nữ', '0555555555', 'Địa chỉ bệnh nhân năm', 'benhnhan5@gmail.com', 50),
('BN006', 'Bệnh Nhân Sáu', '2023-06-06', 'Nữ', '0666666666', 'Địa chỉ bệnh nhân sáu', 'benhnhan6@gmail.com', 60);


INSERT INTO `employees` (`employee_id`, `full_name`, `dob`, `gender`, `phone_number`, `email`, `address`, `salary`, `work_from`) VALUES
('BS001', 'Bac Si Mot', '2023-12-04', 'Nam', '0123456789', 'bacsimot@gmail.com', 'Dia chi bac si mot', 100000, '2023-12-14'),
('BS002', 'Bac Si Hai', '2023-12-04', 'Nu', '0127657473', 'bacsihai@gmail.com', 'Dia chi bac si hai', 200000, '2023-11-14'),
('QL001', 'Quan Ly Mot', '2023-02-03', 'Nam', '057483920', 'quanlymot@gmail.com', 'Dia chi quan ly mot', 1000000, '2023-12-11'),
('QL002', 'Quan Ly Hai', '2023-11-11', 'Nu', '0574848372', 'quanlyhai@gmail.com', 'Dia chi quan ly hai', 2000000, '2023-12-12'),
('YT001', 'Y Ta Mot', '2023-01-04', 'Nu', '047392845', 'ytamot@gmail.com', 'Dia chi y ta mot', 10000, '2023-09-03'),
('YT002', 'Y Ta Hai', '2023-04-06', 'Nam', '0849302834', 'ytahai@gmail.com', 'Dia chi y ta hai', 20000, '2023-02-07');


INSERT INTO `doctors` (`doctor_id`, `expertise`, `department`) VALUES
('BS001', 'Tam than hoc', 4),
('BS002', 'Da lieu', 1);


INSERT INTO `manager` (`id`, `role`) VALUES
('QL001', 'Quan ly abc'),
('QL002', 'Quan ly xyz');


INSERT INTO `nurses` (`nurse_id`, `department`, `shift`) VALUES
('YT001', 1, 'Sáng'),
('YT002', 4, 'Chiều');


INSERT INTO `equipment_bills` (`equipment_bill_id`, `total_equipment_bill`) VALUES
(1, 510.00),
(2, NULL),
(3, NULL),
(4, NULL),
(5, NULL);


INSERT INTO `equipments_used_per_id` (`equipment_bill_id`, `equipment_id`, `quantity_used`, `day_used`) VALUES
(1, 2, 2, 3),
(1, 4, 5, 6),
(1, 5, 2, 3);


INSERT INTO `medicine_bills` (`medicine_bill_id`, `total_medicine_bill`) VALUES
(1, 1300.00),
(2, NULL),
(3, NULL),
(4, NULL),
(5, NULL);


INSERT INTO `drugs_used_per_id` (`medicine_bill_id`, `drug_id`, `quantity_used`) VALUES
(1, 1, 7),
(1, 2, 2),
(1, 3, 4);


INSERT INTO `service_bills` (`service_bill_id`, `total_service_bill`) VALUES
(1, 450000.00),
(2, NULL),
(3, NULL),
(4, NULL),
(5, NULL);


INSERT INTO `services_used_per_id` (`service_bill_id`, `service_id`) VALUES
(1, 1),
(1, 2),
(1, 3);


INSERT INTO `total_bills` (`total_bill_id`, `service_bill_id`, `medicine_bill_id`, `equipment_bill_id`, `total_bill_raw`) VALUES
(2, 1, 1, 1, 451810);


INSERT INTO `medical_reports` (`report_id`, `patient_id`, `doctor_id`, `diagnostic`, `conclusion`, `note`, `booking_time`, `appointment_date`, `bill_id`, `money_need_to_pay`) VALUES
(1, 'BN001', 'BS001', 'Bệnh nhân thấy đau khổ vì làm database lỗi lên lỗi xuống', 'Chịu', 'Làm ít thôi là được', '10:35:19', '2023-12-03', 2, 406629);


INSERT INTO wait_list (wait_id, patient_id, description, status, priority) VALUES
(1, 'BN001', 'gsfgfffdfdgfd', 'waiting', 'yes'),
(2, 'BN005', 'fghfhfghfg', 'waiting', 'yes'),
(3, 'BN002', 'fhfhfghfgh', 'waiting', 'no'),
(4, 'BN003', 'ytrytryttr', 'waiting', 'no');