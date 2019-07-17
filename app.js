const logger = require("./logger.js"); // load a module, and use "const"
const path = require("path");
const os = require("os");
const fs = require("fs");

const files = fs.readdirSync("./"); // return all the files' names in the folder
console.log(files);

function p()
{
    global.console.log("my first app!");
}
logger.log("122"); // call a module

var totalmem = os.totalmem()
//Template string
console.log(`Total Memory: ${totalmem}`)
