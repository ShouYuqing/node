var log = function(message)
{
    console.log(message)
}

module.exports.log = log // export to the global, can not use "module.exports.log = log()"