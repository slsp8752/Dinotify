function strip(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

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
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}
