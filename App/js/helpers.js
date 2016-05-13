function strip(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
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
