var SRV_PRTO = "http";
var SRV_HOST = "localhost";
var SRV_PORT = "8080";

var socket = io.connect(SRV_PRTO + '://' + SRV_HOST + ':' + SRV_PORT);	
socket.on('message', function(cmd) {
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
			console.log("err: unknwon command received from leap motion : "+cmd);
		}
	}
});