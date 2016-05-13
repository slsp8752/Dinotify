window.onload = function() {
	var startLink = document.getElementById("start");
	document.getElementById("verifyButton").disabled = true;
	console.log("Trying GET to 192.168.4.1");
	var macGet = getBackoff("http://192.168.4.1/i?", 10, 100, function(result){
		console.log("We got:", result);
	});
}
