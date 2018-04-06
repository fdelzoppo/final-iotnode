//Variables de connexion au serveur web
var SRV_PRTO = "http";
var SRV_HOST = "192.168.140.48";
var SRV_PORT = "8080";

//Permet d'éviter de détecter trop de geste 
var lastGesture = Date.now();
var gesture_threshold = 800;

var socket = io.connect(SRV_PRTO + '://' + SRV_HOST + ':' + SRV_PORT);	
socket.on('message', function(cmd) {
	//addLogLine((Date.now() - lastGesture));
	if((Date.now() - lastGesture) <= gesture_threshold) {
		//addLogLine("leap motion gesture <b>ignored</b> : "+cmd);
	}
	else {
		lastGesture = Date.now();
		addLogLine("leap motion gesture : "+cmd);
		switch(cmd) {
			case "prev" : {
				prevBtn();
				break;
			}
			case "next" : {
				nextBtn();
				break;
			}
			case "clic" : {
				clicBtn();
				break;
			}
			case "back" : {
				backBtn();
				break;
			}
			default : {
				console.log("err: unknown command received from leap motion : "+cmd);
			}
		}
	}
	
});