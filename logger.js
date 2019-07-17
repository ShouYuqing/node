const EventEmitter = require("events")

// new class
class Logger extends EventEmitter
{
    log(message)
    {
        console.log(message)
        // Raise an event
        this.emit("message_logged", {id:1, url: "./random"});
    }
}

module.exports = Logger// export to the global, can not use "module.exports.log = log()"
