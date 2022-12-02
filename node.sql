create Table `ip_info`.`information` ( `id` INT(255) NOT NULL AUTO_INCREMENT , `date` VARCHAR(255) NOT NULL ,
 `ip_adress` VARCHAR(255) NOT NULL , `description` VARCHAR(255) NOT NULL , `malware_family` VARCHAR(255) NOT NULL ,
  `status` VARCHAR(255) NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;
