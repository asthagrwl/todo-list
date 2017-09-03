const RESPONSE_DONE=4;
const STATUS_OK=200;
const ACTIVE_ID = "active_todos";
const COMPLETE_ID = "completed_todos";
const DELETED_ID = "deleted_todos";
const INPUT_TODO= "input_todo";
//window.onlad is more supported.
window.onload=getTodos();
function addTodoElements(todos_data_json){
    var todos= JSON.parse(todos_data_json);
    var active_parent=document.getElementById(ACTIVE_ID);
    var complete_parent=document.getElementById(COMPLETE_ID);
    var deleted_parent=document.getElementById(DELETED_ID);
    // figure out something else for it.
    active_parent.innerHTML="";
    complete_parent.innerHTML="";
    deleted_parent.innerHTML="";
    //parent.innerText=todos_data_json;
    // var hideCompleteElementButton=document.createElement("label");
    // hideCompleteElementButton.innerText="Hide All Elements";
    // hideCompleteElementButton.setAttribute("onclick",hideCompleteDIv(COMPLETE_ID));
    // hideCompleteElementButton.style.float="right";
    // complete_parent.appendChild(hideCompleteElementButton);
        // {id: { todo object}, id : {todo object}}
        Object.keys(todos).forEach(
            function(key){
               var todo_element = createTodoElement(key, todos[key]);
               //console.log("Add todo"+todo_element.innerText);
                if(todos[key].status=="ACTIVE"){
                    active_parent=document.getElementById(ACTIVE_ID);
                    active_parent.appendChild(todo_element);
                }else if(todos[key].status=="COMPLETE"){
                    complete_parent=document.getElementById(COMPLETE_ID);
                    complete_parent.appendChild(todo_element);
                }else if(todos[key].status=="DELETED"){
                    deleted_parent=document.getElementById(DELETED_ID);
                    deleted_parent.appendChild(todo_element);
                }

            }
        );

}
function createTodoElement(id,todo_object){
    var todo_element= document.createElement("div");
    todo_element.setAttribute("data-id",id);
   // todo_element.innerText=;
    if(todo_object.status == 'ACTIVE'){
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.name = todo_object.title;
        checkbox.value = todo_object.title;
        checkbox.id = id;
        checkbox.setAttribute("data-id",id);
        checkbox.setAttribute("onchange","completeTodo("+id+")");
        //checkbox.setAttribute('class','checkbox');
        todo_element.appendChild(checkbox);

        var lbl_title = document.createElement("label");
        lbl_title.innerText = todo_object.title;
       // lbl_title.setAttribute("class",'active_status');

        todo_element.appendChild(lbl_title);

        var lbl = document.createElement("label");
        lbl.innerText = "x";
        lbl.style.float="right";
        lbl.style.marginRight= "200px";
        lbl.style.color="RED";
        lbl.setAttribute("onclick" , "deleteTodo("+id+")");
      //  lbl.setAttribute("class",'delete_label');
        todo_element.appendChild(lbl);
    }

    if(todo_object.status == 'COMPLETE'){
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.id = id;
        checkbox.checked = true;
        checkbox.setAttribute("data-id",id);
        checkbox.setAttribute("onchange","activeTodo("+id+")");
     //   checkbox.setAttribute('class','checkbox');
        todo_element.appendChild(checkbox);

        var lbl_title = document.createElement("label");
        lbl_title.innerText = todo_object.title;
    //    lbl_title.setAttribute("class",'complete_status');
        todo_element.appendChild(lbl_title);


        var lbl = document.createElement("label");
        lbl.innerText = "x";
        lbl.style.float="right";
        lbl.style.marginRight= "200px";
        lbl.style.color="RED";
        //lbl.style.marginRight= 100px;
    //    lbl.setAttribute("class",'delete_label');
        lbl.setAttribute("onclick" , "deleteTodo("+id+")");
        todo_element.appendChild(lbl);
    }


    if(todo_object.status == 'DELETED'){
        var lbl = document.createElement("label");
        lbl.innerText = todo_object.title;
     //   lbl.setAttribute("class",'delete_status');
        todo_element.appendChild(lbl);
    }
    console.log("create todo"+todo_element.innerText);
    return todo_element;
}
function getTodos(){

    var xhr= new XMLHttpRequest(); // by this object we will interact with server
    xhr.open("GET","/api/todos",true);
    xhr.onreadystatechange= function(){  // callback
        //code to be executed after response
        if(xhr.readyState == RESPONSE_DONE){
            if(xhr.status==STATUS_OK){
                console.log(xhr.responseText);
                addTodoElements(xhr.responseText);
            }
        }
    }// end of callbacz
    xhr.send(data=null);
}
function addTodo(){
    var new_todo_title=document.getElementById(INPUT_TODO).value;

    var xhr= new XMLHttpRequest(); // by this object we will interact with server
    xhr.open("POST","/api/todos",true);

    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    var body_data="todo_title=" + encodeURI(new_todo_title);

    xhr.onreadystatechange = function(){
        if(xhr.readyState == RESPONSE_DONE){
            //response is ready ==4
            //is response ok
            //status code==200
            if(xhr.status==STATUS_OK) {
                //xhr.response
                //xhr.responseText
                addTodoElements(xhr.responseText);
            }else{
                console.log(xhr.responseText);
            }

        }
    }
    xhr.send(body_data);
}

function completeTodo(id){
    var xhr = new XMLHttpRequest();
    xhr.open("PUT","/api/todos/"+id,true);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    data="todo_status=COMPLETE";
    xhr.onreadystatechange = function(){
        if(xhr.readyState == RESPONSE_DONE){
            if(xhr.status==STATUS_OK) {
                //console.log("complete todo function "+ xhr.responseText);
                addTodoElements(xhr.responseText);
            }else{
                console.log(xhr.responseText+"complete todo not done");
            }
        }
    }
    xhr.send(data);
}
function deleteTodo(id){
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE","/api/todos/"+id,true);

    //the body should contain these parameters
    //todo_title
    //todo_status
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    data="todo_status=DELETED";
    xhr.onreadystatechange = function(){
        if(xhr.readyState == RESPONSE_DONE){
            if(xhr.status==STATUS_OK) {
                addTodoElements(xhr.responseText);
            }else{
                console.log(xhr.responseText);
            }
        }
    }
    xhr.send(data);
}
function activeTodo(id){
    var xhr = new XMLHttpRequest();
    xhr.open("PUT","/api/todos/"+id,true);

    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    data="todo_status=ACTIVE";
    xhr.onreadystatechange = function(){
        if(xhr.readyState == RESPONSE_DONE){
            if(xhr.status==STATUS_OK) {
                addTodoElements(xhr.responseText);
            }else{
                console.log(xhr.responseText+"active todo not done");
            }
        }
    }
    xhr.send(data);
}
function hideCompleteDIv(id){
    var hide=document.getElementById(id);
    hide.style.color="RED";
    hide.style.display="block";
}
