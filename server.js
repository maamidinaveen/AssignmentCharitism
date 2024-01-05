const express = require('express');
const app = express();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const Todos = require('./models/productModel');
const Users = require('./models/auth');


const mongoose = require("mongoose");

app.use(express.json())

// connection to cloud database mongoDB

mongoose.
connect("mongodb+srv://naveen:1234@cluster0.zhfyqyn.mongodb.net/Cluster0?retryWrites=true&w=majority")
.then(()=>{
    console.log('connected to mongoDB')
    app.listen(4000,()=>{
        console.log('server is running')
    })
})

.catch((error)=>{
    console.log(error)
})

// Register user API 

app.post('/register', async (request, response) => {
    try {
        const { username, password, age } = request.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const userDetails = {
            username: username,
            password: hashedPassword,
            age: age,
        };

        const existingUser = await Users.find({ username });
        if (existingUser.length > 0) {
            response.status(400).json({ message: 'User already exists' });
        } else {
            const user = await Users.create(userDetails);
            response.send('User created successfully');
        }
    } catch (error) {
        console.log(error.message);
        response.status(500).json({ message: error.message });
    }
});


//login user API

app.post('/login', async (request, response) => {
    try {
        const { username, password } = request.body;
        const user = await Users.find({ username });//  The find method in most database libraries, including Mongoose for MongoDB, returns an array even if it finds a single document
        if (user.length > 0) {
            const isPasswordMatched = await bcrypt.compare(password, user[0].password);
            if (isPasswordMatched) {
                const payload = { username: username };
                const Token = jwt.sign(payload, 'secret-key');
                response.send({ jwt: Token });
            } else {
                response.status(400).json({ message: 'Invalid password' });
            }
        } else {
            response.status(400).json({ message: 'User not found' });
        }
    } catch (error) {
        console.log(error.message);
        response.status(500).json({ message: error.message });
    }
});

//Authenticaion middleware function

const authenticateToken = (request, response, next) => {
    let jwtToken;
    const authHeader = request.headers["authorization"];
    if (authHeader !== undefined) {
      jwtToken = authHeader.split(" ")[1];
    }
    if (jwtToken === undefined) {
      response.status(401);
      response.send("Invalid JWT Token");
    } else {
      jwt.verify(jwtToken, "secret-key", async (error, payload) => {
        if (error) {
          response.status(401);
          response.send("Invalid JWT Token");
        } else {
          next();
        }
      });
    }
  };



/// CRUD operations 
//use model to save the data in mongoDB 

//creating a todo(method: create())

app.post('/todo',authenticateToken,async (request,response)=>{
    try{
        const todo = await Todos.create(request.body)
        response.status(200).json(todo)

    } catch(error){
        console.log(error.message)
        response.status(500).json({message:error.message})
    }
})


//Retrieving todos from database (method:find())

app.get('/todo',authenticateToken, async(request,response)=>{
    try{
        const todos = await Todos.find({})
        response.status(200).json(todos)
    } catch(error){
        console.log(error.message)
        response.status(500).json({message:error.message})
    }
})


//Retrieving todo from database (single todo item based on id) (method:find(id))

app.get('/todo/:id',authenticateToken, async(request,response)=>{
    try{
        const {id} = request.params;
        const todo = await Todos.findById(id)
        response.status(200).json(todo)
    } catch(error){
        console.log(error.message)
        response.status(500).json({message:error.message})
    }
})

//update a todo in database (based on id) (method:findByIdAndUpdate(id,requrest.body))

app.put('/todo/:id', authenticateToken,async (request, response) => {
    try {
        const { id } = request.params;
        const todo = await Todos.findByIdAndUpdate({ _id: id }, request.body);

        // If no todo is found in the database
        if (!todo) {
            return response.status(404).json({ message: `Cannot find any todo with ID: ${id}` });
        }
        const Todo = await Todos.findById(id)

        response.send(`todo item updated successfully:{${Todo}}`)
        
    } catch (error) {
        console.log(error.message);
        response.status(500).json({ message: error.message });
    }
});


// delete a todo from database (method:findByIdAndDelte(id))

app.delete('/todo/:id', async(request,response) =>{
    try{
        const {id} = request.params
        const todo = await Todos.findByIdAndDelete(id)
        // If no todo is found in the database
        if (!todo) {
            return response.status(404).json({ message: `Cannot find any todo with ID: ${id}` });
        }
        response.send('todo deleted successfully')


    }catch(error){
        console.log(error.message)
        response.status(500).json({message:error.message})
    }
})

