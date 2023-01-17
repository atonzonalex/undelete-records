import metadata from './metadataTab.js'
import { restCallout } from './callout.js';
import { soapCallout } from './soapCallout.js';

const metadataTab = metadata;

//const sid = '00D7Q000005YtVL!ARwAQIMbs1KKCyGb9PC9avUXYx0ZmqfIqmnzlQ1sc1Kd4jWP2VwHhwd5lK90PdDu2juaiGovZerwMAjJJD05g2xJjT8Xc5n1';
//const sid = '00D7Q000005YtVL!ARwAQMUNtHWe24_onmjRGtlHdvd.d.IYSAtpsIK4vDlt3_AbcFPxz06eI.Mf4Nk4TSDbAIjAKrxMXp7_YdN';
const sid = '00D7Q000005YtVL!ARwAQDpWfHFDxgjdICMDm1eba.JhDrLYiCUwi8ABLs39ECb2tRSBrdTtOd0qgskwf89mkNsJk3tOjr8d1v6URtaoCaGj2g0B';
let restinstanceHostname = 'noeli33-dev-ed.lightning.force.com';

/*chrome.runtime.sendMessage({message: "getSession", url: window.location.host}, resp => {
    console.log('resp session :: ', resp);
});*/


async function getData(){
    let bool = true;
    let dataList =[];
    let dataError =[];
    const objDatas = {}
    for(let i=0; i<metadataTab.length; i++){
        let resturl = `/services/data/v56.0/tooling/query?q=Select+Id,+${metadataTab[i].Name}+From+${metadataTab[i].metadata}`;
        await restCallout(resturl, 'GET', restinstanceHostname, sid).then(dataFromCallOut=>{
                //console.log('dataFromCallOut-->', dataFromCallOut);
                let objData ={};
                let tab = []
                objData.Type = dataFromCallOut.entityTypeName ? dataFromCallOut.entityTypeName : metadataTab[i].metadata
                objData.Size = dataFromCallOut.size
                dataFromCallOut.records.forEach(element =>{
                    switch (metadataTab[i].Name) {
                        case 'MasterLabel':
                            var obj ={};
                            obj.Id = element.Id
                            obj.Name = element.MasterLabel
                            tab = [...tab, obj]
                            break;
                        case 'DeveloperName':
                            var obj ={};
                            obj.Id = element.Id
                            obj.Name = element.DeveloperName
                            tab = [...tab, obj]
                            break;
                        case 'Name':
                            var obj ={};
                            obj.Id = element.Id
                            obj.Name = element.Name
                            tab = [...tab, obj]
                            break;
                        case 'TestSuiteName':
                            var obj ={};
                            obj.Id = element.Id
                            obj.Name = element.TestSuiteName
                            tab = [...tab, obj]
                            break;
                        case 'ValidationName':
                            var obj ={};
                            obj.Id = element.Id
                            obj.Name = element.ValidationName
                            tab = [...tab, obj]
                            break;
                        case 'Subject':
                            var obj ={};
                            obj.Id = element.Id
                            obj.Name = element.Subject
                            tab = [...tab, obj]
                            break;
                        default:
                            break;
                    }
                });
                objData.Metadata = tab
                dataList.push(objData)
            }).catch(error => {
                bool = false;
                dataError.push(error[0]);
            });
            if(!bool){
                break;
            }

    }
    if(bool){
        objDatas.error = !bool;
        objDatas.data = dataList;
        return objDatas;
    }else{
        const tabError = []
        tabError.push(dataError[0])
        objDatas.error = !bool;
        objDatas.data = tabError;
        return objDatas;
    }
}

 async function getDependencyData(dataId){
    let data =[];
    const objDatas = {}
    let resturl = `/services/data/v56.0/tooling/query?q=Select+Id,+RefMetadataComponentId,+RefMetadataComponentName,+RefMetadataComponentType+From+MetadataComponentDependency+Where+MetadataComponentId='${dataId}'`;
    await restCallout(resturl, 'GET', restinstanceHostname, sid).then(dataFromCallOut=>{
        
        data =  dataFromCallOut.records.map(element =>{
            return {
                "Id" : element.Id,
                "Name" : element.RefMetadataComponentName,
                "Type" : element.RefMetadataComponentType
            }
        });
        objDatas.error = false;
        objDatas.data = data;
        console.log('objDatas-->', objDatas);
    })
    .catch(error => {
        data.push(error[0]);
        objDatas.error = true;
        objDatas.data = data;
        console.log('objDatas-->', objDatas);
    });
    return objDatas;
}

async function getDeletedData(){
    let data =[];
    let data1 =[];
    let data2 =[];
    const objDatas = {}
    let done;
    let done1;
    let nextRecordsUrl;
    let resturl = `/services/data/v56.0/queryAll?q=SELECT+Id,+IsDeleted+FROM+Case+WHERE+IsDeleted+=+FALSE`;
    // do {
        await restCallout(resturl, 'GET', restinstanceHostname, sid).then(dataFromCallOut=>{
            console.log('dataFromCallOut-->', dataFromCallOut);
            done = dataFromCallOut.done;
            nextRecordsUrl = dataFromCallOut.nextRecordsUrl?.split("/");
            data1 =  dataFromCallOut.records.map(element =>{
                return {
                    "Id" : element.Id,
                    "IsDeleted" : element.IsDeleted
                    // "Type" : element.RefMetadataComponentType
                }
            });
         
            objDatas.error = false;
            // objDatas.data = data;
            // console.log('objDatas-->', objDatas);
        })
        .catch(error => {
            data.push(error[0]);
            objDatas.error = true;
            objDatas.data = data1;
            console.log('objDatas-->', objDatas);
        });


        if (!done){
            do {
                resturl =`/services/data/v56.0/queryAll/'${nextRecordsUrl[nextRecordsUrl.length-1]}'`;
                await restCallout(resturl, 'GET', restinstanceHostname, sid).then(dataFromCallOut1=>{
                    console.log('dataFromCallOut1-->', dataFromCallOut1);
                    done1 = dataFromCallOut1.done;
                    nextRecordsUrl = dataFromCallOut1.nextRecordsUrl?.split("/");
                    let data3 =  dataFromCallOut1.records.map(element =>{
                        return {
                            "Id" : element.Id,
                            "IsDeleted" : element.IsDeleted
                            // "Type" : element.RefMetadataComponentType
                        }
                    });
                    data2 = [... data3];
                    objDatas.error = false;
                })
                .catch(error => {
                    data.push(error[0]);
                    objDatas.error = true;
                    objDatas.data = data2;
                    console.log('objDatas-->', objDatas);
                });

            } while (done1);

        }
        data = [...data1,... data2];
        // objDatas.error = false;
        objDatas.data = data;
        console.log('objDatas-->', objDatas);
    return objDatas;
}

 async function undeleteRecords(){
    let url = '/services/Soap/u/56.0';

        await soapCallout(url,restinstanceHostname,['a141q000001RfNeAAK'],sid);
//     var xmlhttp = new XMLHttpRequest();
//     xmlhttp.open('POST', restinstanceHostname +'/services/Soap/u/56.0', true);
//     var sr = 
//     '<?xml version="1.0" encoding="utf-8"?>' +
//    '<soapenv:Header>' +
//    '<urn:SessionHeader>' +
//       '<urn:sessionId>'+ sid+'</urn:sessionId>' +
//       '</urn:SessionHeader>' +
//         '</soapenv:Header>' +
//           '<soapenv:Body>' +
//           '<urn:undelete>' +
//             '<urn:ids>a141q000001RfNeAAK</urn:ids>' +
//             '<urn:ids>a141q000001RfOVAA0</urn:ids>' +
//           '</urn:undelete>' +
//           '</soapenv:Body>' +
//         '</soapenv:Envelope>';

//     xmlhttp.onreadystatechange = function () {
//         if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
//             console.log(xmlhttp.response);
//         }
//     };
//     xmlhttp.setRequestHeader('Content-Type', 'text/xml');
//     xmlhttp.send(sr);
}



export  { getData, getDependencyData, getDeletedData, undeleteRecords }