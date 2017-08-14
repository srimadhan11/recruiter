Resetonclick=function(){
	var email=document.getElementById("email").value;
	var params={
		"email":email
	};
    var request=new XMLHttpRequest();
    request.onreadystatechange=function(){
        if(request.readyState===XMLHttpRequest.DONE){
            if(request.status===200){
                //reset link sent
                alert("Reset link has been sent");
            }
            if(request.status===401){
                //invalid session
                alert("Invalid user session");
            }
        }
    }
    request.open('POST', "http://auth.cockpit75.hasura-app.io/password/forgot", true);
    request.setRequestHeader('Content-Type','application/json');
    request.send(JSON.stringify(params));
}