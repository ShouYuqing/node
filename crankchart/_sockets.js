var app = require('express')();
var http = require('http').Server(app);
var port = process.env.PORT || 40510;


var db = require('../dbconnection');
var session = require('express-session');
const crypto = require('crypto'); 

var socket_msg = {
    
    //Function for model (executed when called in POST controller... /s_msg)
    stageMessage:function(req,res,callback){

        //must call socket.io instance inside of stageMessage function for it to work when called as a model by pipeline controller - app.post('/s_msg'...
        let io = require('socket.io')(http);

        //simple code that shows each user that's connected. Varible i is incremented each time a new user connects via socket.io
        var i = 0;
        io.on('connection', function(socket){
            i = i + 1;
            console.log('a user connected ' + i);
        });

        //Function used to process messages - purpose is to ensure that the message should be broadcasted on the stage 
		function processMsg(user_id,company_id,pipeline_uid,stage_uid,msg,owned_by,dbconn,cb){

            var results = {};

            //verify pipeline by pipeline unique id (pipeline_uid) -> this is passed to function 
            var query = "SELECT * FROM cc_pipeline WHERE unique_id=? and company_id=? and view=?";
            dbconn.query(query,[pipeline_uid,company_id,'visible'], function(err, p_line) {
        
                if (err)
                    throw err;
        
                if(p_line.length){
                    //NOTE: We ALWAYS check company_id for security purposes because we are a multitenancy SaaS application that logically separates customer data by company_id

                    //Check if user is on the data or business team (owned_by 1=>biz and 2=>data) by checking all task assignments for the given side
                    var query = "SELECT * FROM tasks WHERE assigned_uid=? and owned_by=? and pipeline_id=? and company_id=? and view=?";
                    dbconn.query(query,[user_id,owned_by,p_line[0].id,company_id,'visible'], function(err, allowed) {
        
                        if (err)
                            throw err;
        
                        if(allowed.length){//user authorized
        
                            //get user's name -> not using this immediately but will likely need it later :)
                            var query = "SELECT * FROM users WHERE company_id=? and id=?";
                            dbconn.query(query,[company_id,user_id], function(err, user_name){
        
                                if (err)
                                    throw err;
                                
                                if(user_name.length){//user's name exist because user exists
        
                                    var name = user_name[0].name;

                                    //check to see if stage exist -> per stage unique_id (stage_uid)
                                    var query = "SELECT * FROM stages WHERE company_id=? and unique_id=?";
                                    dbconn.query(query,[company_id,stage_uid], function(err, stage_exist){
                
                                        if (err)
                                            throw err;
        
                                        //broadcast via websocket here -> make sure stage_uid is not null
                                        if(stage_exist.length){

                                            results.stage_uid = stage_uid;
                                            results.pipeline_uid = pipeline_uid;
                                            //console.log(io);
            
                                            //Process messages sent to server and decide to send to channel
                                            var stage_message = "INSERT INTO team_activity (unique_id,company_id,stage_id,pipeline_id,user_id,message) VALUES (?,?,?,?,?,?)";
                                            dbconn.query(stage_message,[crypto.randomBytes(16).toString("hex"),company_id,allowed[0].stage_id,p_line[0].id,user_id,msg], function(err, s_msg) {
                            
                                                if (err)
                                                    throw err;

                                                if(s_msg.affectedRows){//successfully inserted into db
                                                    results.success = 201;
                                                }
                                                else{//bail didn't insert                                                   
                                                    results.success = 400;
                                                    results.message = "Uable to insert message into database";
                                                }

                                                cb(null, results);

                                            });
            
            
                                        }
                                        else {//Stage_uid needed to broadcast message
                                            results.success = 400;
                                            results.message = "Stage_uid needed to broadcast message";
                                            cb(null,results);
                                        }

                                    });
        
                                }
                                else {//unable to get name
                                    results.success = 400;
                                    results.message = "Unable to get name";
                                    cb(null,results);
                                }
        
                            });
        
                        }
                        else {//not authorized to post messages here
                            results.success = 400;
                            results.message = "Not authorized to post messages here";
                            cb(null,results);
                        }
                    });
        
                }
                else {
                    //bail -> Pipeline doesn't exist for pipeline_uid....
                    results.success = 400;
                    results.message = "Pipeline doesn't exist for pipeline_uid: " + pipeline_uid;
                    cb(null,results);
                }
            });

		}
        
  
        

        //hardcoded values for user_id, owned_by and company_id -> for testing purposes
        var stage_uid = req.body.stage_uid;
        var pipeline_uid = req.body.pipeline_uid;
        var msg = req.body.msg;
        var user_id = 63; //req.user.id;
        var owned_by = 1; //req.body.message; //note - need to determined which side (business, data or hybrid) owns the message and send to the controller on GET call .... IMPORTANT!
        var company_id = 59; //req.body.company_id;
        
        var clients = {};

        io.on('connection', function(socket){//broadcast message

            //This is key -> Must first join room. This only happens
            socket.on('join', function(room) {
                socket.join(room);
            });

            //call to socket isntance on the 'chat message' message handler
            socket.on('chat message', function(msgs){

                //function to process message run inside socket.on call
                processMsg(user_id,company_id,pipeline_uid,stage_uid,msg,owned_by,db, function(err,valid){

                    //if message was proccessed successfully, resulting in 201, message will be broadcasted to channel. So everyone listening on channel will see it.
                    if(valid.success == 201){//only allow on channel if query returns a 201

                        io.to(valid.stage_uid).emit('chat message', msgs); //send message to all listening in on the stage_uid channel

                    }

                }); 

            });

            //super important!!!!!! verify that this correctly drops the objects once clients are disconnected from socket
            clients[socket.id] = socket;

            socket.on('disconnect', function() {
                delete clients[socket.id];
            });
        });

            
        callback(null,201);
    }

}

http.listen(port, function(){
    console.log('listening on *****:' + port);
});

module.exports = socket_msg;
