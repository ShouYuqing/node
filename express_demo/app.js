const courses = require("./route/courses");
const express = require("express");
const app = express();

app.use(express.json()); // middle layer
app.use("/api/courses", courses);

const port = process.env.PORT || 3000;
app.listen(port, (req, res)=>{
    console.log('Listening at port ',port);
});