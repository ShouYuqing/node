const logger = require("./logger.js"); // load a module, and use "const"
const path = require("path");
const os = require("os");
const fs = require("fs");
const EventEmitter = require("events")

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
logger.log("122"); // call a module

var totalmem = os.totalmem();
//Template string
console.log(`Total Memory: ${totalmem}`); // print the total memory

// Listen an event with event argument and arrow function
my_eventemitter = new EventEmitter();
my_eventemitter.on("message_logged", (arg)=>{
    console.log("received message!", arg);
});

// Raise an event
my_eventemitter.emit("message_logged", {id:1, url: "./random"});


