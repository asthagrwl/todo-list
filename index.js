var express=require("express");

var app= express();
app.use("/",function(req,res,next){

    console.log(req.url);
    console.log(req.query.method);
    next();
});
app.use("/",express.static(__dirname+"/public"));
var todos_db=require("./seed.js");
 var bodyparser=require("body-parser");
 app.use("/",bodyparser.urlencoded({extended: false}));
//console.log(todo_db);

//get all todos GET
app.get("/api/todos",function(req,res){
    res.json(todos_db.todos);
});

// delete a todo DELETE
app.delete("/api/todos/:id",function(req,res){
    //todos_db
    //todos_db.data= { id: {title:, status:}, id: (title:, status:)}

    var del_id= req.params.id;
    var todo = todos_db.todos[del_id];

    //if this todo dosen't exist send appropriate response

    if(!todo){
        res.status(400).json({err : "TODO does not exist.."});
    }else{
        // mark it as delete...
        todo.status= todos_db.statusENUMS.DELETED;
        res.json(todos_db.todos);

    }
});
// modify a todo PUT
app.put("/api/todos/:id",function(req,res){

    var todo = todos_db.todos[req.params.id];
    //console.log("todo fetch" + todo.title);
    if(!todo){
        res.status(400).json({error : "TODO doesn't Exist"});
    }
    else{
        var todo_title = req.body.todo_title;
        if(todo_title && todo_title!="" && todo_title.trim()!=""){
            todo.title = todo_title;
        }
        var todo_status = req.body.todo_status;
        console.log("todo status : "+todo_status);
        if(todo_status && (todo_status == todos_db.statusENUMS.ACTIVE ||
            todo_status == todos_db.statusENUMS.COMPLETE)){
            todo.status = todo_status;
        }

        todos_db.todos[req.params.id] = todo;
        res.json(todos_db.todos);console.log(todo.title);
        }

});
app.put("/api/todos/complete/:id",function(req,res){

    var _id= req.params.id;
    var todo = todos_db.todos[_id];

    //if this todo dosen't exist send appropriate response

    if(!todo){
        res.status(400).json({err : "TODO does not exist.."});
    }else{
        // mark it as complete...
        todo.status= todos_db.statusENUMS.COMPLETE;
        res.send(todos_db);

    }
});
app.put("/api/todos/active/:id",function(req,res){

    var _id= req.params.id;
    var todo = todos_db.todos[_id];

    //if this todo dosen't exist send appropriate response

    if(!todo){
        res.status(400).json({err : "TODO does not exist.."});
    }else{
        // mark it as complete...
        todo.status= todos_db.statusENUMS.ACTIVE;
        res.send(todos_db);

    }
});

// add a todo  POST
app.post("/api/todos",function(req,res){
    var todo= req.body.todo_title;
    //if you dont send a todo then raise errors
    if(!todo || todo=="" || todo.trim()==""){
        res.status(400).json({error: "Todo title cannot be empty..!"});
    }else{
        var new_todo_obj={
            title: req.body.todo_title,
            status: todos_db.statusENUMS.ACTIVE
        }
        todos_db.todos[todos_db.next_todo_id++] = new_todo_obj;
        res.json(todos_db.todos);
    }
});
app.get("/api/todos/active",function(req,res){
    var active={};
    var i=0;
    for(var idd=1;idd<todos_db.next_todo_id;idd++){
        if(todos_db.todos[idd].status==todos_db.statusENUMS.ACTIVE){
            active[i++]=todos_db.todos[idd];
        }
    }

    res.json(active);

});
app.get("/api/todos/complete",function(req,res){
    var complete={};
    var i=0;
    for(var idd=1;idd<todos_db.next_todo_id;idd++){
        if(todos_db.todos[idd].status==todos_db.statusENUMS.COMPLETE){
            complete[i++]=todos_db.todos[idd];
        }
    }

    res.json(complete);

});
app.get("/api/todos/deleted",function(req,res){
    var deleted={};
    var i=0;
    for(var idd=1;idd<todos_db.next_todo_id;idd++){
        if(todos_db.todos[idd].status==todos_db.statusENUMS.DELETED){
            deleted[i++]=todos_db.todos[idd];
        }
    }

    res.json(deleted);

});

app.listen(3000);
