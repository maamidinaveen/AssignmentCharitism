Implemenation of authentication and CRUD operation 

Initialize a new nodejs project using commands like mkdir project_name , cd project_name, npm init-y

Install all dependependencies

dependependencies are - 1) bcrypt - used to hash the password by using bcrypt.hash() method , 2) bcrypt.compare() compares the password with given password 
2) express -  It simplifies the process of building web applications and APIs by providing a set of features and tools to handle common tasks.
3) jsonwebtokens - used to generate the tokens 

4) mongoose - Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a higher-level, schema-based       abstraction over MongoDB

5)nodemon - whenever code changes, it will restart the server 

Create a server using express and assign port number 

Connect the database from node js using connecting string  from mongoDB

For user registration, user need to send information in the body, access details from request and add to the database
For login, if username and password matched with database, then it will return a json webToken

this token will be user for CRUD operation.
For each interaction, user need to send this token in the authorization

For Todos schema - we have title,description,completed and createdAt

Middleware function authenticateToken will be used to check the jwtToken, if token is there then it will next operation like CRUD 

For running code, open the terminal and enter 'npm run dev'

test this api using postman we will get desired results 
