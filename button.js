
/* exported initButton */
/* global showStdPageDetails */
"use strict";

// sfdcBody = normal Salesforce page
// ApexCSIPage = Developer Console
// auraLoadingBox = Lightning / Salesforce1
// location.host.endsWith("visualforce.com") = Visualforce page
if (document.querySelector("body.sfdcBody, body.ApexCSIPage, #auraLoadingBox") || location.host.endsWith("visualforce.com")) {
  // We are in a Salesforce org
  let args = new URLSearchParams(location.search.slice(1));
  let sfHost = args.get("host");
  console.log('sfHost :: ', sfHost)
  chrome.runtime.sendMessage({message: "getSession", url: window.location.host}, resp => {
        console.log('resp :: ', resp);
    if (resp) {
      initButton(resp, false);
    }
  });
}

function initButton(sfHost, inInspector) {
        console.log('----------------------------');
        console.log('zaza')
        let rootEl = document.createElement("div");
        rootEl.style.height = "310px";
        rootEl.style.width = "310px";
        rootEl.style.backgroundColor = "red";
        rootEl.style.display = "block";
        rootEl.classList.add("insext-active");
        rootEl.style.zIndex = "1000";
        rootEl.style.position = "absolute";
        rootEl.style.top = "150px";
        rootEl.style.right = "8px";
        let popupSrc = chrome.runtime.getURL("popup.html");
        let popupEl = document.createElement("iframe");
        popupEl.src = popupSrc;
        rootEl.appendChild(popupEl);       
        document.body.appendChild(rootEl);

}