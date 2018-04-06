var SRV_PRTO = "http";
var SRV_HOST = "localhost";
var SRV_PORT = "8080";

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