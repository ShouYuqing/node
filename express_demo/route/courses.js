const express = require("express");
const router = express.Router();

// emulate database
courses = [{id: 1, name:"course1"},
{id: 2, name:"course2"},
{id: 3, name:"course3"}];

// real database


// GET
router.get('/', (req, res)=>{
    res.send(courses);
    console.log("GET new course....");
    return ;
});

// POST
router.post('/', (req, res)=>{
    const course = [{id:courses.length+1, name: req.body.name}];
    courses.push(course);
    return courses;
});

// PUT
router.put('/:id', (req, res)=>{
    const course = courses.find(req.params.id);
    course.name = req.body.name;
    return ;
});

// DELETE
//app.delete('api/courses/:id', (req, res)=>{
//
//})

module.exports = router;