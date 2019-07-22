const logger = require("./logger.js"); // load a module, and use "const"
const path = require("path");
const os = require("os");
const fs = require("fs");
const http = require("http");
const _ = require("underscore");
const express = require("express");

const files = fs.readdirSync("./"); // return all the files' names in the folder
console.log(files);

const files2 = fs.readdir("./", function(err, files){
    if(err)
        console.log("Error is: ", err);
    else
        console.log("Result is: ", files);
}); // async will call the call back function after the finish of the read file

function p()
{
    global.console.log("my first app!");
}
//logger.log("122"); // call a module

var totalmem = os.totalmem();
console.log("-------------------------------");

//Template string
console.log(`Total Memory: ${totalmem}`); // print the total memory
console.log("-------------------------------");

// Listen an event with event argument and arrow function
const my_eventemitter = new logger();
my_eventemitter.on("message_logged", (arg)=>{
    console.log("received message by the on()!", arg);
}); // listen for the event
my_eventemitter.log("my message");
console.log("-------------------------------");

// http module
const server = http.createServer((req, res)=>{
    if(req.url == "/")
    {
        res.write("Hello World!");
        res.end();
    }
    if(req.url == "/courses")
    {
        res.write(JSON.stringify([1, 2, 3]));
        res.end();
    }
});
server.listen(port = 3000); // listen for port 3000

console.log("Listening at port 3000...");
console.log("-------------------------------");

// express
const app = express();
app.get('/', (req, res)=>{
    res.send("Hello World");
})

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log("Listening at port ${port}");
})