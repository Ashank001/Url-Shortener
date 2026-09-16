require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const healthRoute = require("./routes/healthRoutes");
const urlRoutes = require("./routes/urlRoutes");
const app = express();
const PORT = 5000;

connectDB();

app.use(express.json());
app.use("/", urlRoutes);
app.use("/api/url", urlRoutes);
app.use("/api/health", healthRoute);

app.listen( PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
























/*const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/crud_db')
.then(() => console.log("Successfully connected to MongoDB"))
.catch((err) => console.log("MongoDB connection error", err));

const taskSchema = new mongoose.Schema({
    title: String,
    status: String
});
const Task = mongoose.model('Task',taskSchema);
app.use(express.json());

//---------------GET----------------------------------

app.get('/Hello', (req,res) => {
    res.json({ "message" : "Hello World"});
});

app.get('/' ,  (req,res) => {
    res.json({ " Message" : "Hello WOrld"});
});

app.get('/greet/:name' , (req,res) => {
    res.json({ "Message" : `Hello ${req.params.name}`})
});

app.get('/task' , async(req,res) => {
    try{
        const allTasks = await Task.find();
        res.json({allTasks});
    }catch(err){
        res.status(500).json({err:"Failed to fetch Tasks"});
    }
});

// --------------POST----------------------------

app.post('/task' , async (req,res) => {
    try{
        const t = req.body;
        const newTask = new Task(t);
        await newTask.save();
        res.json(newTask);
    }catch(err){
        res.status(500).json({err:"Failed to save task"});
    }
});

//--------------DELETE----------------------------

app.delete('/task/:id' , async (req,res) => {
    try{
        const taskId = req.params.id;
        await Task.findByIdAndDelete(taskId);
        res.json({message:"task deleted"});
    }catch(err){
        console.log("MONGODB ERROR:", err.message);
        res.status(500).json({err:"Failed to delete task"});
    }
});

// ------------------PUT------------------------------------

app.put('/task/:id' , async(req,res) => {
    try{
        const taskId = req.params.id;
        const updatedData = req.body;
        const updatedTask = await Task.findByIdAndUpdate(taskId, updatedData, {returnDocument:'after'});
        res.jsonp(updatedTask);
    }catch(err){
        console.log("MONGODB ERROR:", err,message);
        res.status(500).json({err:"Failed to update task"});
    }
});

const PORT = 3000;
app.listen( PORT, () => {
    console.log( `Server is  running on http://localhost:${PORT}`)
});
*/

