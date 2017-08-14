var toUserId;

function Start() {
	var authToken=getCookie("auth");
	if(authToken!=""){
		var request=new XMLHttpRequest();
		request.onreadystatechange=function(){
		    if(request.readyState===XMLHttpRequest.DONE){
		        if(request.status===200){
		            var result=JSON.parse(request.responseText);
					if(authToken===result["auth_token"]){
	    				//user role exist
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
	}else{
		window.location.href="https://app.cockpit75.hasura-app.io/";
	}
}

Logoutonclick=function(){
	var authToken=getCookie("auth");
	if (authToken!="") {
		var request=new XMLHttpRequest();
	    request.onreadystatechange=function(){
	        if(request.readyState===XMLHttpRequest.DONE){
	            if(request.status===200){
	                //logged out
	                alert("Sucessfully Logged out");
	                setCookie("auth","",-30);
	                window.location.href="https://app.cockpit75.hasura-app.io/";

	            }
	            if(request.status===401){
	                //invalid session
	                alert("Invalid Session");
	                window.location.href="https://app.cockpit75.hasura-app.io/";
	            }
	        }
	    }
	    request.open('POST', "https://auth.cockpit75.hasura-app.io/user/logout", true);
	    request.setRequestHeader('Content-Type','application/json');
	    request.setRequestHeader('Authorization','Bearer '+authToken);
	    request.send(null);
	}else{
		window.location.href="https://app.cockpit75.hasura-app.io/";
	}
}

function setUserId(userId){
	toUserId=userId;
}

Profileonclick=function(){
	window.location.href="https://app.cockpit75.hasura-app.io/profile";
}

Msgonclick=function(){
	window.location.href="https://app.cockpit75.hasura-app.io/message";
}

Searchonclick=function(){
	var Gender=document.getElementById("gender").value;
	var Locality=document.getElementById("locality").value;
	var Qualification=document.getElementById("qualification").value;
	var paramString={};

	if(Gender!=null){
		paramString.gender=Gender;
	}
	if(Locality!=null||Locality!=""){
		paramString.locality=Locality;
	}
	if(Qualification!=null){
		paramString.qualification=Qualification;
	}
	var params={
	    "type" : "select",
	    "args" : {
	        "table" : "profile",
	        "columns" : ["*"],
	        "where" :  paramString
	        
	    }
	};
    var request=new XMLHttpRequest();
    request.onreadystatechange=function(){
        if(request.readyState===XMLHttpRequest.DONE){
            if(request.status===200){
                //verified
                //TODO:display search result
                var result=JSON.parse(request.responseText);
                var temp="";
                for (var i = 0; i < result.length; i++) {
                	temp+=resultsBuilder(result[i]);
                }
                document.getElementById("results").innerHTML=temp;
            }
            if(request.status===401){
			    //user role expired/not exist
			    alert("Invalid Session");
                window.location.href="https://app.cockpit75.hasura-app.io/";
			}
			if(request.status===400){
			    //bad request (table not exist or invalid query)
			    alert("Bad query");
			}
        }
    }
    request.open('POST', "https://data.cockpit75.hasura-app.io/v1/query", true);
    request.setRequestHeader('Content-Type','application/json');
    request.setRequestHeader('Authorization','Bearer '+getCookie("auth"));
    request.send(JSON.stringify(params));
}

Sendonclick=function(){
	if(toUserId){
		var To=document.getElementById("to").value;
		var From=document.getElementById("from").value;
		var MessageContent=document.getElementById("messageContent").value;
		var request=new XMLHttpRequest();
		request.onreadystatechange=function(){
		    if(request.readyState===XMLHttpRequest.DONE){
		        if(request.status===200){
		            var result=JSON.parse(request.responseText);
					var params={
						"type":"insert",
						"args":{
							"table":"msg",
							"objects":[
								{
									"user_id":toUserId,
									"message":MessageContent,
									"from_user_id":result["hasura_id"]
								}
							]
						}
					};
				    var request1=new XMLHttpRequest();
				    request1.onreadystatechange=function(){
				        if(request1.readyState===XMLHttpRequest.DONE){
				            if(request1.status===200){
				                //verified
				                alert("Message Sent");
				            }
				            if(request1.status===401){
							    //user role expired/not exist
							    alert("Invalid Session");
	                			window.location.href="https://app.cockpit75.hasura-app.io/";
							}
							if(request1.status===400){
							    //bad request (table not exist or invalid query)
							    alert("Bad query");
							}
				        }
				    }
				    request1.open('POST', "https://data.cockpit75.hasura-app.io/v1/query", true);
				    request1.setRequestHeader('Content-Type','application/json');
				    request1.setRequestHeader('Authorization','Bearer '+getCookie("auth"));
				    request1.send(JSON.stringify(params));
		        }
		        if(request.status===401){
				    //user role expired/not exist
				    alert("Invalid Session");
	                window.location.href="https://app.cockpit75.hasura-app.io/";
				}
		    }
		}
		request.open('GET', "https://auth.cockpit75.hasura-app.io/user/account/info", true);
		request.setRequestHeader('Authorization','Bearer '+getCookie("auth"));
		request.send(null);
	}else{
		alert("Select a User from Search Result");
	}
}

function resultsBuilder(objects) {
	var template=`
	<div onclick="setUserId(`+objects["user_id"]+`)" style="border-bottom: 1px solid grey;padding: 5px;background-color: lightgrey;">
		<span>From: </span>
		<strong>
			<span>`+objects["fname"]+` `+objects["lname"]+`</span>
		</strong>
		<br>
		<div style="margin-left: 20px">Date of birth:`+objects["dob"]+`
		<br>Locality:`+objects["locality"]+`
		<br>Gender:`+objects["gender"]+`
		<br>Qualification:`+objects["qualification"]+`
		<br>Resume Link: <a href=https://`+objects["resume_link"]+`>click here</a></div>
	</div>`;
	return template;
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