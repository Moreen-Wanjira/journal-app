CREATE DATABASE  IF NOT EXISTS `journal_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `journal_db`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: journal_db
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `entries`
--

DROP TABLE IF EXISTS `entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UserID` int DEFAULT NULL,
  `Category` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_category` (`Category`),
  CONSTRAINT `fk_category` FOREIGN KEY (`Category`) REFERENCES `t_categories` (`categoryid`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entries`
--

LOCK TABLES `entries` WRITE;
/*!40000 ALTER TABLE `entries` DISABLE KEYS */;
INSERT INTO `entries` VALUES (2,'My Second Journal Entry','This is my Second entry. I\'m excited to start journaling!','2025-03-22 09:15:35',NULL,NULL),(3,'Updated Journal Entry','This is an updated version of my first entry.','2023-04-01 21:00:00',NULL,NULL),(4,'My Third Journal Entry','This is my Third entry. I\'m excited to start journaling!','2023-03-31 21:00:00',NULL,NULL),(7,'My First Journal Entry','This is my First entry. I\'m excited to start journaling!','2023-03-31 21:00:00',1,5),(8,'Exploring the Countryside Through Sports','Traveling to the countryside isn’t just about relaxation—it’s also a perfect opportunity for outdoor sports and adventure. With vast open spaces, rolling hills, and fresh air, the countryside offers the ideal setting for physical activities that challenge both the body and mind.\n\nDuring my visit, I took part in various countryside sports, starting with cycling along scenic trails. The winding roads, surrounded by fields and forests, provided a thrilling yet peaceful ride. Every turn revealed a new breathtaking view, making the journey just as exciting as the destination.','2025-03-23 15:25:31',1,4),(12,'A Travel To The Country Side','There’s something refreshing about leaving the hustle and bustle of city life behind and venturing into the peaceful embrace of the countryside. The fresh air, open fields, and simple way of life offer a much-needed escape from modern chaos.\n\nAs I traveled through winding roads lined with lush greenery, I felt an instant sense of calm. The countryside greeted me with golden wheat fields swaying in the wind, quaint cottages with smoke curling from chimneys, and the distant sound of birds chirping. Life here moves at a slower pace, and it allows you to truly soak in the beauty of nature.\n\nI visited a small village where the locals welcomed me with warm smiles. They shared stories of their traditions, daily routines, and their deep connection with the land. The homemade food, prepared with fresh farm ingredients, was a delightful experience—simple yet bursting with flavor.','2025-03-24 14:40:43',8,NULL),(13,'A Travel to the Countryside','There’s something refreshing about leaving the hustle and bustle of city life behind and venturing into the peaceful embrace of the countryside. The fresh air, open fields, and simple way of life offer a much-needed escape from modern chaos.\n\nAs I traveled through winding roads lined with lush greenery, I felt an instant sense of calm. The countryside greeted me with golden wheat fields swaying in the wind, quaint cottages with smoke curling from chimneys, and the distant sound of birds chirping. Life here moves at a slower pace, and it allows you to truly soak in the beauty of nature.\n\nI visited a small village where the locals welcomed me with warm smiles. They shared stories of their traditions, daily routines, and their deep connection with the land. The homemade food, prepared with fresh farm ingredients, was a delightful experience—simple yet bursting with flavor.\n\nOne of the highlights of my journey was a walk through a vast meadow at sunset. The sky painted itself in hues of orange and pink, while the scent of blooming flowers filled the air. I took deep breaths, enjoying the serenity that only the countryside can provide.\n\nThis trip was a reminder of life’s simple joys—connecting with nature, embracing tranquility, and appreciating the little moments that often go unnoticed in city life. The countryside is not just a place; it’s a feeling of peace, nostalgia, and contentment.','2025-03-24 15:34:47',1,1),(15,'Meeting','Today, I attended a journal entry meeting where we reviewed and discussed various financial transactions recorded in the system. The primary focus was ensuring the accuracy of journal entries, identifying any discrepancies, and making necessary adjustments to comply with accounting standards.\n\nThe meeting started with a review of recent journal entries, including adjusting, closing, and correcting entries. Each transaction was carefully examined to ensure proper classification and documentation. We also addressed any inconsistencies and clarified the rationale behind specific adjustments.','2025-03-26 17:05:05',1,1),(16,'Software Development','Today, I found myself reflecting on my journey in software development. It’s incredible how much I’ve grown, from writing basic scripts to building complex applications that solve real-world problems. Every day presents a new challenge, whether it’s debugging stubborn code, optimizing database queries, or ensuring APIs run smoothly.','2025-03-27 10:21:03',1,3),(17,'Test','Test','2025-03-27 15:31:31',1,1),(18,'Enhancing Team Productivity and Collaboration','Today, I focused on improving team productivity and fostering better collaboration across departments. We recently noticed bottlenecks in communication between the sales and product teams, leading to delays in feature rollouts. To address this, I scheduled a brainstorming session where team leads shared their challenges and proposed solutions.','2025-03-27 17:38:21',1,3);
/*!40000 ALTER TABLE `entries` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-28  0:36:37
