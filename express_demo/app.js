const express = require("express");
const app = express();

app.use(express.json());

// emulate database
courses = [{id: 1, name:"course1"},
{id: 2, name:"course2"},
{id: 3, name:"course3"}]

// express
app.get('api/courses', (req, res)=>{
    res.send(courses);
})

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log('Listening at port ',port);
})


app.post('api/courses', ()=>{
    course = [{id:4, name: "course4"}]
    res.send(course)
    res.send(course)
})

app.put()