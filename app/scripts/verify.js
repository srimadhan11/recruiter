function startVerify(){
    var Content=document.getElementById("content");
	var url=document.location.search;
	var request=new XMLHttpRequest();
    request.onreadystatechange=function(){
        if(request.readyState===XMLHttpRequest.DONE){
            if(request.status===200){
            	var result0=JSON.parse(request.responseText);
                //setcookie
                setCookie("auth",result0["auth_token"],10);
                var request1=new XMLHttpRequest();
			    request1.onreadystatechange=function(){
			        if(request1.readyState===XMLHttpRequest.DONE){
			            if(request1.status===200){
			                var result=JSON.parse(request1.responseText);
							var params={
								"type":"insert",
								"args":{
									"table":"profile",
									"objects":[
										{
											"user_id":result["hasura_id"],
											"email":result["email"]
										}
									]
								}
							};
						    var request2=new XMLHttpRequest();
						    request2.onreadystatechange=function(){
						        if(request2.readyState===XMLHttpRequest.DONE){
						            if(request2.status===200){
						                //verified
						                window.location.href="https://app.cockpit75.hasura-app.io/profile";
						            }
						            if(request2.status===401){
						                //invalid or expired session
						                window.location.href="https://app.cockpit75.hasura-app.io/";
						            }
						            if(request2.status===400){
						                //violation of database rules
						                window.location.href="https://app.cockpit75.hasura-app.io/";
						            }
						        }
						    }
						    request2.open('POST', "https://data.cockpit75.hasura-app.io/v1/query", true);
						    request2.setRequestHeader('Content-Type','application/json');
						    request2.setRequestHeader('Authorization','Bearer '+getCookie("auth"));
						    request2.send(JSON.stringify(params));
			            }
			            if(request1.status===401){
						    //user role expired/not exist
						    window.location.href="https://app.cockpit75.hasura-app.io/";
						}
			        }
			    }
			    request1.open('GET', "https://auth.cockpit75.hasura-app.io/user/account/info", true);
			    request1.setRequestHeader('Authorization','Bearer '+getCookie("auth"));
			    request1.send(null);
            }
            if(request.status===400){
                //invalid or token expired
                alert("Invalid or Expired Token");
            }
        }
    }
    request.open('GET', "https://auth.cockpit75.hasura-app.io/email/confirm?token="+url, true);
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