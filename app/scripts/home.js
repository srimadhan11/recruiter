function Start() {
	var authToken=getCookie("auth");
	if(authToken!=""){
		var request=new XMLHttpRequest();
		request.onreadystatechange=function(){
		    if(request.readyState===XMLHttpRequest.DONE){
		        if(request.status===200){
		            var result=JSON.parse(request.responseText);
					if(authToken===result["auth_token"]){
	    				window.location.href="https://app.cockpit75.hasura-app.io/profile";
					}
		        }
		        if(request.status===401){
				    //user role expired/not exist
	    			window.location.href="https://app.cockpit75.hasura-app.io/";
				}
		    }
		}
		request.open('GET', "https://auth.cockpit75.hasura-app.io/user/account/info", true);
	    request.setRequestHeader('Authorization','Bearer '+authToken);
		request.send(null);
	}
}
Signinonclick=function(){
	var username=document.getElementById("username").value;
	var password=document.getElementById("password").value;
	var params={
		"password":password,
		"username":username
	};
    var request=new XMLHttpRequest();
    request.onreadystatechange=function(){
        if(request.readyState===XMLHttpRequest.DONE){
            if(request.status===200){
                //login sucessfull
                var result=JSON.parse(request.responseText);
                //setcookie
                setCookie("auth",result["auth_token"],10);
                window.location.href="https://app.cockpit75.hasura-app.io/profile";
            }
            if(request.status===403){
                //incorrect username
                alert("Incorrect Credentials");
            }
            if(request.status===401){
                //incorrect credentials
                alert("Incorrect Credentials");
            }
        }
    }
    request.open('POST', "https://auth.cockpit75.hasura-app.io/login", true);
    request.setRequestHeader('Content-Type','application/json');
    request.send(JSON.stringify(params));
}

Createonclick=function(){
	var password=document.getElementById("registerPassword").value;
	var cpassword=document.getElementById("confirmPassword").value;
	var email=document.getElementById("email").value;
	var password=document.getElementById("password").value;
	var username=document.getElementById("uname").value;
	if(cpassword==password){
		var params={
			"password":password,
			"username":username,
			"email":email
		};
		var request=new XMLHttpRequest();
	    request.onreadystatechange=function(){
	        if(request.readyState===XMLHttpRequest.DONE){
	            if(request.status===200){
	                //signup sucess
	                //setcookie
	                var result=JSON.parse(request.responseText);
	                setCookie("auth",result["auth_token"],10);
	                window.location.href="https://app.cockpit75.hasura-app.io/profile";
	            }
	            if(request.status===409){
	                //username or email is already registered
	                alert("Email or Username is already registered");
	            }
	        }
	    }
	    request.open('POST', "https://auth.cockpit75.hasura-app.io/signup", true);
	    request.setRequestHeader('Content-Type','application/json');
	    request.send(JSON.stringify(params));
	}else{
		//notify mismatch password
		alert("Password Mismatch");
	}
    
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

/*function checkCookie() {
    var user = getCookie("username");
    if (user != "") {
        alert("Welcome again " + user);
    } else {
        user = prompt("Please enter your name:", "");
        if (user != "" && user != null) {
            setCookie("username", user, 365);
        }
    }
}*/