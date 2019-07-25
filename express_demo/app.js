const express = require("express");
const app = express();

app.use(express.json()); // middle layer

// add new middle layer
//app.use(function(req, res, next){
//   console.log("Logging....");
//    next();
//})

// emulate database
courses = [{id: 1, name:"course1"},
{id: 2, name:"course2"},
{id: 3, name:"course3"}];

// express
// GET
app.get('/api/courses', (req, res)=>{
    res.send(courses);
    console.log("GET new course....");
    return ;
});

// POST
app.post('/api/courses', (req, res)=>{
    const course = [{id:courses.length+1, name: req.body.name}];
    courses.push(course);
    console.log(courses);
    return ;
});

// PUT
app.put('/api/courses/:id', (req, res)=>{
    const course = courses.find(req.params.id);
    course.name = req.body.name;
    return ;
});

// DELETE
//app.delete('api/courses/:id', (req, res)=>{
//
//})

const port = process.env.PORT || 3000;
app.listen(port, (req, res)=>{
    console.log('Listening at port ',port);
});

