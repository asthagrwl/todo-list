const RESPONSE_DONE=4;
const STATUS_OK=200;
const TODOS_LIST_ID = "todos";
function add_todo(id,todos_data_json){
    var parent= document.getElementById(id);
    parent.innerText=todos_data_json;
}
function getTodos(){

    var xhr= new XMLHttpRequest(); // by this object we will interact with server
    xhr.open("GET","/api/todos",true);

    xhr.onreadystatechange= function(){  // callback
        //code to be executed after response
        if(xhr.readyState == RESPONSE_DONE){
            //response is ready ==4
            //is response ok
            //status code==200
            if(xhr.status==STATUS_OK){
                //xhr.response
                //xhr.responseText
                console.log(xhr.responseText);
                add_todo(TODOS_LIST_ID,xhr.responseText);
            }

        }
    }// end of callback
    xhr.send(data=null);
}
