import { getData, getDependencyData,getDeletedData, undeleteRecords } from './manageData.js';

let btn = document.querySelector('#btn');
let btndata = document.querySelector('#data');


const handleClick  = (e) => {
    chrome.tabs.create({
        url: 'popup.html'
    });
}
const handleClickData  = (e) => {
    // let results = getData()
    // results.then(res => {console.log('result-->', res)});

    // let results1 = getDeletedData()
    // results1.then(res => {console.log('result-->', res)});

    let results1 = undeleteRecords()
    results1.then(res => {console.log('result-->', res)});
    
    chrome.runtime.sendMessage({message: "getSession", url: window.location.host}, resp => {
        console.log('resp session :: ', resp);
    });
    
    /*
    let results = getDependencyData('01p7Q00000FgSBkQAN');
    results.then(res => {console.log('result-->', res)});*/
}




btn.addEventListener('click', handleClick);
btndata.addEventListener('click', handleClickData);