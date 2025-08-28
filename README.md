<<<<<<< HEAD
# E-Commerce
=======
# E-Commerce-Backend-API

  

E-Commerce API | Nodejs,Express.js,MongoDB, Crypto,Bcrypt ,Nodemailer 

 - Created the backend ( API ) using Nodejs and Express.js for an
   e-commerce website
 - User authentication was implemented through saving JSON web tokens as cookies
 -  Different access control for users and admins
 - Implemented reset password functionality through a link sent to registered email using nodemailer.
 -  Implemented review system to add , remove or update reviews on a
   product

  

## To run the API on your local dev environment :

 1. Fork the repo
 2. Clone the repo
 3. Cd into the clone and run the following command
 ```
npm i
```
 4. Set up a config file named - .env
 5. Set up the following variables in the config file :
  
```
MONGO_URI=

JWT_SECRET_KEY=

JWT_LIFETIME=

COOKIE_LIFETIME=

SMPT_MAIL=

SMPT_PASS=

SMPT_SERVICE=
```
  

 - MONGO_URI - This variable should contain the connection string to
   your mongo database.
 - JWT_SECRET_KEY - This variable should contain your 256-bit encryption key for issuing and signing payload using JSON web token
 -  JWT_LIFETIME - This defines the validity of the token issued
 - COOKIE_LIFETIME - This defines the duration the cookie is saved in
   the browser.
 -  SMPT_MAIL - This should contain the email with which you want to send the email to the client
 -  SMPT_PASS - Password for the SMPT_MAIL
 -  SMPT_SERVICE - The service which you'll be using ( Eg. gmail )

 6. Run the command:
 ```
npm run dev
```
  
This will start your local dev environment.
