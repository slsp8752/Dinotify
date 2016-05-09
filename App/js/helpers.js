function strip(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

//Get Request, used to get the ESP's MAC address
function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
			var resp = strip(xmlHttp.responseText);
			var MACre = /Soft AP MAC(.*)Station/;
			var reArray = MACre.exec(resp); 
			if(reArray != null) var reResult = reArray[1]; 
            callback(reResult);
			return true;
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

//Exponential backoff for the GET request, in case the ESP isn't connected/the user isn't connected to the ESP's access point
function exponentialBackoff(toTry, max, delay, callback) {
    var result = toTry();
    if (result != undefined) {
        callback(result);
    } else {
        if (max > 0) {
            setTimeout(function() {
                exponentialBackoff(toTry, --max, delay * 2, callback);
            }, delay);

        } else {
             console.log('Max backoffs exceeded');   
			 callback(false);
        }
    }
}
