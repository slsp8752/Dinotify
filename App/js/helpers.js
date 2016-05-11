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
function getBackoff(url, max, delay, callback) {
	var result;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
			var resp = strip(xmlHttp.responseText);
			var MACre = /Soft AP MAC(.*)Station/;
			var reArray = MACre.exec(resp); 
			if(reArray != null) var reResult = reArray[1]; 
			var result = reResult;
            //callback(reResult);
			//return true;
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
    if (result != undefined) {
        callback(result);
    } else {
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
