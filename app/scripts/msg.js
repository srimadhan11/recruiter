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
	    			window.location.href="http://app.cockpit75.hasura-app.io/";
				}
		    }
		}
		request.open('GET', "http://auth.cockpit75.hasura-app.io/user/account/info", true);
	    request.setRequestHeader('Authorization','Bearer '+authToken);
		request.send(null);
	}else{
		window.location.href="http://app.cockpit75.hasura-app.io/";
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
	                window.location.href="http://app.cockpit75.hasura-app.io/";

	            }
	            if(request.status===401){
	                //invalid session
	                alert("Invalid Session");
	                window.location.href="http://app.cockpit75.hasura-app.io/";
	            }
	        }
	    }
	    request.open('POST', "http://auth.cockpit75.hasura-app.io/user/logout", true);
	    request.setRequestHeader('Content-Type','application/json');
	    request.setRequestHeader('Authorization','Bearer '+authToken);
	    request.send(null);
	}else{
		window.location.href="http://app.cockpit75.hasura-app.io/";
	}
}

Hireonclick=function(){
	window.location.href="http://app.cockpit75.hasura-app.io/hire";
}

Profileonclick=function(){
	window.location.href="http://app.cockpit75.hasura-app.io/profile";
}

function inboxMessage(msgArray) {
	var cont="";
	for (var i = 0; i < msgArray.length; i++) {
		var temp=msgArray[i];
		var params={
			"type":"select",
			"args":{
				"table":"profile",
				"columns"      : ["*"],
		    	"where"     : { "user_id" : temp["from_user_id"] }
			}
		};
	    var request=new XMLHttpRequest();
	    request.onreadystatechange=function(){
	        if(request.readyState===XMLHttpRequest.DONE){
	            if(request.status===200){
	                //verified
	                var result=JSON.parse(request.responseText);
	                cont+=inboxMsgBuilder(result[0]["fname"],result[0]["lname"],result[0]["email"],msgArray[i]["message"]);
	            }
	            if(request.status===401){
				    //user role expired/not exist
				}
				if(request.status===400){
				    //bad request (table not exist or invalid query)
				}
	        }
	    }
	    request.open('POST', "http://data.cockpit75.hasura-app.io/v1/query", false);
	    request.setRequestHeader('Content-Type','application/json');
	    request.setRequestHeader('Authorization','Bearer '+getCookie("auth"));
	    request.send(JSON.stringify(params));
	}
	document.getElementById("inbox").innerHTML=cont;
}

function sentMessage(msgArray) {
	var cont="";
	for (var i = 0; i < msgArray.length; i++) {
		var temp=msgArray[i];
		var params={
			"type":"select",
			"args":{
				"table":"profile",
				"columns"      : ["*"],
		    	"where"     : { "user_id" : temp["from_user_id"] }
			}
		};
	    var request=new XMLHttpRequest();
	    request.onreadystatechange=function(){
	        if(request.readyState===XMLHttpRequest.DONE){
	            if(request.status===200){
	                //verified
	                var result=JSON.parse(request.responseText);
	                cont+=sentMsgBuilder(result[0]["fname"],result[0]["lname"],msgArray[i]["message"]);
	            }
	            if(request.status===401){
				    //user role expired/not exist
				}
				if(request.status===400){
				    //bad request (table not exist or invalid query)
				}
	        }
	    }
	    request.open('POST', "http://data.cockpit75.hasura-app.io/v1/query", false);
	    request.setRequestHeader('Content-Type','application/json');
	    request.setRequestHeader('Authorization','Bearer '+getCookie("auth"));
	    request.send(JSON.stringify(params));
	}
	document.getElementById("sent").innerHTML=cont;
}

function inboxMsgBuilder(fname,lname,email,msg){
	var template=`
	<div style="border-bottom: 1px solid grey;padding: 5px;background-color: lightgrey;">
		<span>From: </span>
		<strong>
			<span>`+fname+` `+lname+`(`+email+`)</span>
		</strong>
		<br>
		<p style="margin-left: 20px">`+msg+`</p>
	</div>`;
	return template;
}
function sentMsgBuilder(fname,lname,msg){
	var template=`
	<div style="border-bottom: 1px solid grey;padding: 5px;background-color: lightgrey;">
		<span>To: </span>
		<strong>
			<span>`+fname+` `+lname+`</span>
		</strong>
		<br>
		<p style="margin-left: 20px">`+msg+`</p>
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
setInterval(function(){
	var request=new XMLHttpRequest();
	request.onreadystatechange=function(){
	    if(request.readyState===XMLHttpRequest.DONE){
	        if(request.status===200){
	            var result=JSON.parse(request.responseText);

	            //received messages
				var params={
					"type":"select",
					"args":{
						"table":"msg",
						"columns"      : ["*"],
				    	"where"     : { "user_id" : result["hasura_id"] }
					}
				};
			    var request1=new XMLHttpRequest();
			    request1.onreadystatechange=function(){
			        if(request1.readyState===XMLHttpRequest.DONE){
			            if(request1.status===200){
			                //verified user
			                //create recieved messages list
			                var result1=JSON.parse(request1.responseText);
			                inboxMessage(result1);
			            }
			            if(request1.status===401){
						    //user role expired/not exist
						    alert("Invalid Session");
    						window.location.href="http://app.cockpit75.hasura-app.io/";
						}
						if(request1.status===400){
						    //bad request (table not exist or invalid query)
						    alert("Bad query");
						}
			        }
			    }
			    request1.open('POST', "http://data.cockpit75.hasura-app.io/v1/query", true);
			    request1.setRequestHeader('Content-Type','application/json');
			    request1.setRequestHeader('Authorization','Bearer '+getCookie("auth"));
			    request1.send(JSON.stringify(params));


			    //sent messages
			    var params={
					"type":"select",
					"args":{
						"table":"msg",
						"columns"      : ["*"],
				    	"where"     : { "from_user_id" : result["hasura_id"] }
					}
				};
			    var request2=new XMLHttpRequest();
			    request2.onreadystatechange=function(){
			        if(request2.readyState===XMLHttpRequest.DONE){
			            if(request2.status===200){
			                //verified user
			                //create sent messages list
			                var result2=JSON.parse(request2.responseText);
			                sentMessage(result2);
			            }
			            if(request2.status===401){
						    //user role expired/not exist
						    alert("Invalid Session");
    						window.location.href="http://app.cockpit75.hasura-app.io/";
						}
						if(request2.status===400){
						    //bad request (table not exist or invalid query)
						    alert("Bad query");
						}
			        }
			    }
			    request2.open('POST', "http://data.cockpit75.hasura-app.io/v1/query", true);
			    request2.setRequestHeader('Content-Type','application/json');
			    request2.setRequestHeader('Authorization','Bearer '+getCookie("auth"));
			    request2.send(JSON.stringify(params));
	        }
	        if(request.status===401){
			    //user role expired/not exist
			    window.location.href="http://app.cockpit75.hasura-app.io/";
			}
	    }
	}
	request.open('GET', "http://auth.cockpit75.hasura-app.io/user/account/info", true);
	request.setRequestHeader('Authorization','Bearer '+getCookie("auth"));
	request.send(null);
}, 10000);