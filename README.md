# chat-app
A fullstack real time encrypted chat application written in javascript using React, Express and MySQL
### Prerequisites
- node js installed on your computer
- mysql installed on your computer
## database setup
 run the following mysql commands
 ```
 CREATE DATABASE chatapp 
 ```
  ```
 USE chatapp
  ```
  ```
  CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `password` longtext NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
);
```
  ```
  CREATE TABLE `chat` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user1_id` int NOT NULL,
  `user2_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user1_id_idx` (`user1_id`),
  KEY `user2_id_fk_idx` (`user2_id`),
  CONSTRAINT `user1_id_fk` FOREIGN KEY (`user1_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);
```
```
  CREATE TABLE `message` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sender_id` int DEFAULT NULL,
  `receiver_id` int DEFAULT NULL,
  `content` longtext NOT NULL,
  `chat_id` int DEFAULT NULL,
  `timeSt` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  KEY `chat_id_fk_idx` (`chat_id`),
  CONSTRAINT `chat_id_fk` FOREIGN KEY (`chat_id`) REFERENCES `chat` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);
```
Now, in the file `server/index.js` at lines 56-62 add the relevant information about your database. 
## running the code
open a terminal tab and run 
1. `cd server`
2. `npm install`
3. `npm start`

open another one and run
1. `cd client`
2. `npm install`
3. `npm start`


The front end will be opened in localhost:3000 and the backend will be opened in localhost:3001

## technologies used
- MySQL
- React
- Node.js
- Socket.IO
- Express
