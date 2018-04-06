var BROKER_HOST = "192.168.141.31";
var BROKER_PORT = 1884;

// Create a client instance
client = new Paho.MQTT.Client(BROKER_HOST, Number(BROKER_PORT), "clientId");
addLogLine("MQTT init on " + BROKER_HOST + " at port " + BROKER_PORT);

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
client.connect({onSuccess:onConnect});


function sendMqtt(obj, action) {
	var mqttpath = obj.getAttribute("mqttpath");
	addLogLine("Sending MQTT to path : "+ mqttpath + ", action is : "+ action);
	message = new Paho.MQTT.Message(action);
	message.destinationName = mqttpath;
	client.send(message);
}

// called when the client connects
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  addLogLine("MQTT connected");
  client.subscribe("root/+/+/+/uplink/result");
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
	addLogLine("MQTT onConnectionLost:"+responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
  addLogLine("MQTT onMessageArrived:"+message.payloadString);
}