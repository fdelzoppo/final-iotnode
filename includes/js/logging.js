function addLogLine(str) {
	var today = new Date();
	$("#logs").append("[" + today.getHours() + ":" + today.getMinutes() + "] " + str + "<br/>");
	console.log(str);
	$('#logs').animate({
        scrollTop: $('#logs')[0].scrollHeight}, 20000);
}