async function restCallout(url, method, instanceHostname, sid, headers = {}){
    let logErrors = true;
    let xhr = new XMLHttpRequest();
    url += (url.includes("?") ? "&" : "?") + "cache=" + Math.random();
    xhr.open(method, "https://" + instanceHostname + url, true);
    console.log(method, " :: https://" + instanceHostname + url);
    xhr.setRequestHeader("Accept", "application/json; charset=UTF-8");
    xhr.setRequestHeader("Authorization", "Bearer " + sid);
    for (let [name, value] of Object.entries(headers)) {
        xhr.setRequestHeader(name, value);
    }
    xhr.responseType = "json";
    // the function called when an XMLHttpRequest transaction completes successfully
    xhr.onload = function() {
        if (xhr.status != 200) {
          console.log(`Error ${xhr.status}: ${xhr.statusText}`);
        } else {
            console.log(`Done, got ${JSON.stringify(xhr.response.totalSize)} records`);
        }
        
    };
    //The progress event is fired periodically when a request receives more data.
    xhr.onprogress = function(event) {
    if (event.lengthComputable) {
        console.log(`Received ${event.loaded} of ${event.total} bytes`);
    } else {
        console.log(`Received ${event.loaded} bytes`);
    }
    
    }; 
    xhr.onerror = function() {
        console.log("Request failed");
    };
    xhr.send();
    return  new Promise((resolve, reject) => {
        xhr.onreadystatechange = () => {
          if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                resolve(xhr.response);
            } else if (xhr.status == 0) {
                reject(xhr.response);
                console.error("Received no response from Salesforce REST API - ", xhr);
            } else {
                reject(xhr.response);
                console.error("Received error response from Salesforce REST API", xhr);
            }
          } 
        };
    });
}

export { restCallout };