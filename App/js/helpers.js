function strip(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

function buttonSwitch(){
	var verButton = document.getElementById("verifyButton");
	var statusMessage = document.getElementById("statusText");
	statusMessage.innerHTML = "Looking for your ESP8266... Please Wait.";
	verButton.disabled = true;
	verButton.value = "Searching";
	getBackoff("http://192.168.4.1/i?", 6, 100, function(result){
		console.log("We got:", result);
		if(result == false){
				
			verButton.disabled = false;
			verButton.firstChild.data = "Retry";
			statusMessage.innerHTML = "We could not find your ESP8266. Please make sure that it is connected and that you are connected to its access point. Click the button below to retry.";
			verButton.onclick = function(){ buttonSwitch(); }; 
		}
		else{
			verButton.disabled = false;
			verButton.firstChild.data = "Continue";
			statusMessage.innerHTML = "We found your ESP8266! Its MAC address is " + result + " Click the button below to connect your ESP8266 to the internet!";

			verButton.onclick = function(){ console.log("Continue to Setup"); };
		}
	});
}
//Exponential backoff for the GET request, in case the ESP isn't connected/the user isn't connected to the ESP's access point

var getDone = false;
function getBackoff(url, max, delay, callback) {
	var result;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200 && getDone == false){
			var resp = strip(xmlHttp.responseText);
			var MACre = /Soft AP MAC(.*)Station/;
			var reArray = MACre.exec(resp); 
			if(reArray != null) var result = reArray[1]; 
			if (result != undefined){
				getDone = true;
				callback(result);
			}
		}
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);

	if(!getDone) { // exponential backoff
        if (max > 0) {
			console.log("Max is", max);
            setTimeout(function() {
                getBackoff(url, --max, delay * 2, callback);
            }, delay);

        } else {
             console.log('Max backoffs exceeded');   
			 callback(false);
        }
    }
}
