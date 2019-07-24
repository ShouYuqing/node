const express = require("express");
const app = express();

app.use(express.json());

// emulate database
courses = [{id: 1, name:"course1"},
{id: 2, name:"course2"},
{id: 3, name:"course3"}]

// express
const port = process.env.PORT || 3000;
app.listen(port, (req, res)=>{
    console.log('Listening at port ',port);
});

// GET
app.get('api/courses', (req, res)=>{
    res.send(courses);
});

// POST
app.post('api/courses', (req, res)=>{
    const course = [{id:courses.length+1, name: req.body.name}]
    courses.push(course);
});

// PUT
app.put('api/courses/:id', (req, res)=>{
    const course = courses.find(req.params.id);
    course.name = req.body.name
})

// DELETE
app.delete('api/courses/:id', (req, res)=>{
    
})