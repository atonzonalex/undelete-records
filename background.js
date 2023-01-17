"use strict";
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('request :: ', request);
  console.log('sender :: ', sender);
  if (request.message == "getSfHost") {
    
    chrome.cookies.get({url: request.url, name: "sid"}, cookie => {
      if (!cookie) {
        return;
      }
      
      let [orgId] = cookie.value.split("!");
      console.log('orgId :: ', orgId);
      
      chrome.cookies.getAll({name: "sid", domain: "salesforce.com", secure: true, storeId: sender.tab.cookieStoreId}, cookies => {
        let sessionCookie = cookies.find(c => c.value.startsWith(orgId + "!"));
        if (sessionCookie) {
          sendResponse(sessionCookie.domain);
        } else {
          chrome.cookies.getAll({name: "sid", domain: "cloudforce.com", secure: true, storeId: sender.tab.cookieStoreId}, cookies => {
            sessionCookie = cookies.find(c => c.value.startsWith(orgId + "!"));
            if (sessionCookie) {
              sendResponse(sessionCookie.domain);
            } else {
              sendResponse(null);
            }
          });
        }
      });
    });
    return true;
  }
  
  if (request.message == "getSession") {
    console.log('getSession -------------------------- getSession')
    chrome.cookies.getAll({name: "sid", domain: "salesforce.com", secure: true, storeId: sender.tab.cookieStoreId}, cookies => {
      if(!cookies){
        console.log('no sid')
        sendResponse(null);
        return;
      }
      cookies.forEach(item => {
        let [root] = item.domain.split('.my.salesforce.com');
        if(request.url.startsWith(root)){
          console.log('item - ', item)
          sendResponse(item);
        }
      });
      
    });
    return true;
  }
  return false;
});
