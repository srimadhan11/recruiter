Resetonclick=function(){
	var password=document.getElementById("password").value;
    var url=document.location.search;
	var params={
        "token":url,
		"password":password
	};
    var request=new XMLHttpRequest();
    request.onreadystatechange=function(){
        if(request.readyState===XMLHttpRequest.DONE){
            if(request.status===200){
                alert("Password reset is sucessfull");
            }
            if(request.status===400){
                alert("Invalid/expired token"); 
            }
        }
    }
    request.open('POST', "https://auth.cockpit75.hasura-app.io/password/reset", true);
    request.setRequestHeader('Content-Type','application/json');
    request.send(JSON.stringify(params));
}