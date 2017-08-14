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

Msgonclick=function(){
	window.location.href="http://app.cockpit75.hasura-app.io/message";
}

Saveonclick=function(){
	var Fname=document.getElementById("fname").value;
	var Lname=document.getElementById("lname").value;
	var Locality=document.getElementById("locality").value;
	var Resume=document.getElementById("resume").value;
	//get dob,gender,qualification
	var DOB="";
	DOB+=document.getElementById("year").value+"-";
	DOB+=document.getElementById("month").value+"-";
	DOB+=document.getElementById("date").value;
	var Gender=document.getElementById("gender").value;
	var Qualification=document.getElementById("qualification").value;
	var request=new XMLHttpRequest();
	request.onreadystatechange=function(){
	    if(request.readyState===XMLHttpRequest.DONE){
	        if(request.status===200){
	            var result=JSON.parse(request.responseText);
				var params={
					"type":"update",
					"args":{
						"table":"profile",
						"$set"      : {
							"fname":Fname,
							"lname":Lname,
							"dob":DOB,
							"gender":Gender,
							"locality":Locality,
							"qualification":Qualification,
							"resume_link":Resume
						},
				    	"where"     : { "user_id" : result["hasura_id"] }
					}
				};
			    var request1=new XMLHttpRequest();
			    request1.onreadystatechange=function(){
			        if(request1.readyState===XMLHttpRequest.DONE){
			            if(request1.status===200){
			                //verified
			                alert("Sucessfully Updated your Profile");
			            }
			            if(request1.status===401){
						    //user role expired/not exist
						    alert("Invalid Session");
                			window.location.href="http://app.cockpit75.hasura-app.io/";
						}
			        }
			    }
			    request1.open('POST', "http://data.cockpit75.hasura-app.io/v1/query", true);
			    request1.setRequestHeader('Content-Type','application/json');
			    request1.setRequestHeader('Authorization','Bearer '+getCookie("auth"));
			    request1.send(JSON.stringify(params));
	        }
	        if(request.status===401){
			    //user role expired/not exist
			    alert("Invalid Session");
    			window.location.href="http://app.cockpit75.hasura-app.io/";
			}
	    }
	}
	request.open('GET', "http://auth.cockpit75.hasura-app.io/user/account/info", true);
	request.setRequestHeader('Authorization','Bearer '+getCookie("auth"));
	request.send(null);
}

function profileTemplate(){
	var request=new XMLHttpRequest();
	request.onreadystatechange=function(){
	    if(request.readyState===XMLHttpRequest.DONE){
	        if(request.status===200){
	            var result=JSON.parse(request.responseText);
				var params={
					"type":"select",
					"args":{
						"table":"profile",
						"columns"      : ["*"],
				    	"where"     : { "user_id" : result["hasura_id"] }
					}
				};
			    var request1=new XMLHttpRequest();
			    request1.onreadystatechange=function(){
			        if(request1.readyState===XMLHttpRequest.DONE){
			            if(request1.status===200){
			                //verified user
			                //give fetched values to profile page
			                var result1=JSON.parse(request1.responseText);
			                document.getElementById("gender").value= result1[0]["gender"];
			                document.getElementById("qualification").value= result1[0]["qualification"];
			                document.getElementById("resume").value= result1[0]["resume_link"];
			                document.getElementById("locality").value= result1[0]["locality"];
			                document.getElementById("lname").value= result1[0]["lname"];
			                document.getElementById("fname").value= result1[0]["fname"];
			                var temp=result1[0]["dob"];
			                temp=temp.split("-");
			                document.getElementById("year").value=temp[0];
							document.getElementById("month").value=temp[1];
							document.getElementById("date").value=temp[2];
			            }
			            if(request1.status===401){
						    //user role expired/not exist
						    alert("Invalid Session");
                			window.location.href="http://app.cockpit75.hasura-app.io/";
						}
						if(request1.status===400){
						    //bad request (table not exist or invalid query)
						    alert("Invalid Session");
                			window.location.href="http://app.cockpit75.hasura-app.io/";
						}
			        }
			    }
			    request1.open('POST', "http://data.cockpit75.hasura-app.io/v1/query", true);
			    request1.setRequestHeader('Content-Type','application/json');
			    request1.setRequestHeader('Authorization','Bearer '+getCookie("auth"));
			    request1.send(JSON.stringify(params));
	        }
	        if(request.status===401){
			    //user role expired/not exist
			    alert("Invalid Session");
                window.location.href="http://app.cockpit75.hasura-app.io/";
			}
	    }
	}
	request.open('GET', "http://auth.cockpit75.hasura-app.io/user/account/info", true);
	request.setRequestHeader('Authorization','Bearer '+getCookie("auth"));
	request.send(null);
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