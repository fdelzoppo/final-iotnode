function addLogLine(str) {
	var today = new Date();
	$("#logs").append("[" + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + "] " + str + "<br/>");
	console.log(str);
	$('#logs').scrollTop(1E10);
}