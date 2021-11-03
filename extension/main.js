const weight = [ 2.50124961e-01, -2.21857844e-04, -7.49192668e-01,
         1.24918816e-01,  4.99889400e-01,  2.12435461e+00,
         4.99871474e-01, -2.49602859e-01, -1.01886194e-03,
         2.50186115e-01,  2.74975452e+00,  7.49740317e-01,
         4.99942740e-01,  2.64681862e-04,  1.25061207e-01,
        -6.04849997e-04]


let url = window.location.href
let ip_reg = /\d{1,3}[\.]{1}\d{1,3}[\.]{1}\d{1,3}[\.]{1}\d{1,3}/;
let http_reg = /^http:/;
let https_reg = /^https:/;
let reg = /[a-zA-Z]\//;

function getIdenticalDomainCount(tag){    
    let i;
	let identicalCount=0;
    let mainDomain = url.substring(0,url.search(reg)+1);    
    let nodeList = document.querySelectorAll(tag);
    if(tag=="img" || tag=="script"){
        nodeList.forEach(function(element,index) {        
        i = nodeList[index].src
        if(mainDomain==(i.substring(0,i.search(reg)+1))){
           identicalCount++;
        }   
      });
    }  
    else if(tag=="form"){
        nodeList.forEach(function(element,index) {        
        i = nodeList[index].action
        if(mainDomain==(i.substring(0,i.search(reg)+1))){
           identicalCount++;
        }   
      });
    }  
    else if(tag=="a"){
        nodeList.forEach(function(element,index) {        
        i = nodeList[index].href
        if((mainDomain==(i.substring(0,i.search(reg)+1))) && ((i.substring(0,i.search(reg)+1))!=null) && ((i.substring(0,i.search(reg)+1))!="")){
           identicalCount++;
        }    
      });
    } 
    else{
        nodeList.forEach(function(element,index) {        
        i = nodeList[index].href
        if(mainDomain==(i.substring(0,i.search(reg)+1))){
           identicalCount++;
        }    
      });
    }  
    return identicalCount;
}

function predict(data){
    var f = 0;
    for(var j=0;j<data.length;j++) {
      f += data[j] * weight[j];
    }
    return f > 0 ? 1 : -1;
}


let result = predict([
	ip_reg.exec(url)==null ? -1 : 1,
	url.length < 54 ? -1 : (url.length>=54 && url.length<=75) ? 0 : 1,
	url.length > 20 ? -1 : 1,
	url.match("@") == null ? -1 : 1,
	(url.search("//")==5 && http_reg.exec(url)!=null && (url.substring(7)).match("//")==null) ? -1 :
	(url.search("//")==6 && https_reg.exec(url)!=null && (url.substring(8)).match("//")==null) ? -1 : 1,
	((url.substring(0,url.search(reg)+1)).match("-")) == null ? -1 : 1,
	(url.substring(0,url.search(reg)+1)).split('.').length < 5 ? -1 : 1,
	(() => {
        if(document.querySelectorAll("link[rel*='shortcut icon']").length>0){            
            let faviconurl = document.querySelectorAll("link[rel*='shortcut icon']")[0].href;
            if((url.substring(0,url.search(reg)+1))==(faviconurl.substring(0,faviconurl.search(reg)+1)))
                return -1; 
            else
                return 1;
        }
        else
            return -1;
    })(),
	((url.substring(url.search("//"))).match("https"))==null ? -1 : 1,
	(() => {
        let totalCount = document.querySelectorAll("img").length
        let identicalCount = getIdenticalDomainCount("img");
        if(((totalCount-identicalCount)/totalCount)<0.22)
            return -1;
        else if((((totalCount-identicalCount)/totalCount)>=0.22) && (((totalCount-identicalCount)/totalCount)<=0.61))
            return 0;
        else
            return 1;
    })(),
	(() => {
        let totalCount = document.querySelectorAll("a").length
        let identicalCount = getIdenticalDomainCount("a");
        if(((totalCount-identicalCount)/totalCount)<0.31)
            return -1;
        else if((((totalCount-identicalCount)/totalCount)>=0.31) && (((totalCount-identicalCount)/totalCount)<=0.67))
            return 0;
        else
            return 1;
    })(),
	(() => {
        let totalCount = document.querySelectorAll("script").length + document.querySelectorAll("link").length
        let identicalCount = getIdenticalDomainCount("script") + getIdenticalDomainCount("link");
        if(((totalCount-identicalCount)/totalCount)<0.17)
            return -1;
        else if((((totalCount-identicalCount)/totalCount)>=0.17) && (((totalCount-identicalCount)/totalCount)<=0.81))
            return 0;
        else
            return 1;
    })(),
	(() => {
        let totalCount = document.querySelectorAll("form").length
        let identicalCount = getIdenticalDomainCount("form");
        if(document.querySelectorAll('form[action]').length<=0)
            return -1;
        else if(identicalCount!=totalCount)
            return 0;
        else if(document.querySelectorAll('form[action*=""]').length>0)
            return 1;
        else
            return -1;
    })(),
	document.querySelectorAll('a[href^=mailto]').length<=0 ? -1 : 1,
	((document.querySelectorAll("a[onmouseover*='window.status']").length<=0) || (document.querySelectorAll("a[onclick*='location.href']").length<=0)) ? -1 : 1,
	document.querySelectorAll('iframe').length<=0 ? -1 : 1
]);

if (result == 1) Modal.ui(result);

browser.runtime.onConnect.addListener((port) => {

    console.assert(port.name == "establish_connection");
    console.log(`content_script: ${port.sender.Tab}`);

    port.onMessage.addListener(request => {
        if (request.action == "showStatus") {
            Modal.ui(result);
        }
    })
});
