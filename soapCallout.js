const soapCallout = async (url, instanceHostname, tabIds, sid) => {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://" + instanceHostname + url + "?cache=" + Math.random(), true);
    xhr.setRequestHeader("Content-Type", "text/xml");
    let requestBody = myBody(sid, tabIds);
    console.log(xhr)
    xhr.send(requestBody);

    return  new Promise((resolve, reject) => {
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    resolve(xhr);
                } else if (xhr.status == 0) {
                    reject(xhr);
                    console.error("Received no response from Salesforce SOAP API - ", xhr);
                } else {
                    reject(xhr);
                    console.error("Received error response from Salesforce SOAP API", xhr);
                }
            } 
        };
    });
}

const myBody = (sessionId, tabIds) =>{
    let nam = "soapenv:Envelope"
    let attributes =   'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:partner.soap.sforce.com"'
    let doc = new DOMParser().parseFromString("<" + nam + attributes + "/>", "text/xml");
    let header = doc.documentElement.appendChild(doc.createElement("soapenv:Header"));
    let urnSessionHeader = header.appendChild(doc.createElement("urn:SessionHeader"))
    let urnSessionId = urnSessionHeader.appendChild(doc.createElement("urn:sessionId"))
    urnSessionId.textContent = sessionId
    let body = doc.documentElement.appendChild(doc.createElement("soapenv:Body"));
    let urnUndelete = body.appendChild(doc.createElement("urn:undelete"));
    for (let element of tabIds){
        let urnIds = urnUndelete.appendChild(doc.createElement("urn:ids"));
        urnIds.textContent = element;
    }
    console.log('xmlxmlxmlxml','<?xml version="1.0" encoding="UTF-8"?>' + new XMLSerializer().serializeToString(doc))
    return '<?xml version="1.0" encoding="UTF-8"?>' + new XMLSerializer().serializeToString(doc);
}

export{soapCallout}