CREATE SCHEMA `Register-Sarma` ;
CREATE TABLE `Register-Sarma.Register` (
  `First_name` varchar(45) NOT NULL,
  `Last_name` varchar(45) NOT NULL,
  `Email` varchar(45) NOT NULL,
  `Password` varchar(100) NOT NULL,
  `Phone` bigint NOT NULL,
  PRIMARY KEY (`Email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
