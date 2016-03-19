// var statusText = "<h1>hello</h1>	"
// // This function is called onload in the popup code
// // function switchTab(window,id) { 
// // //alert(id)
// // chrome.windows.update(parseInt(window), {focused: true})
// //      chrome.tabs.update(parseInt(id), {active: true});
    
// // }; 

// // chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
// //    //alert(changeInfo.url);
// //    alert("hello")
// // });



// //setInterval(function(){ alert("works") }, 2000)

// // chrome.webRequest.onBeforeSendHeaders.addListener(function(details){
// //    alert("tab updated");
// //    //alert("hello")
// // });

// // var requestFilter = {
// //     urls: [ "<all_urls>" ]
// //   },

// //   extraInfoSpec = ['requestHeaders','blocking'],

// //   handler = function( details ) {

// //    chrome.browserAction.setBadgeText({text:"request"}})

// //   };

// // chrome.webRequest.onBeforeSendHeaders.addListener( handler, requestFilter, extraInfoSpec );

// chrome.webRequest.onCompleted.addListener(
//         function(details) {
//         	//alert("hello");
//      //    	chrome.browserAction.setBadgeText(
// 	   	// {text:"007"}
// 	   	// )
//           var tabId = parseInt(details.tabId);
         
//           var newText = "";
//           var regExp = /\(([^)]+)\)/;
//           if(tabId<0  ){
//           	return;
//           }
//           chrome.tabs.get( 
//           	parseInt(tabId), 
//           	function(tab){
//           		// if (tab.url.indexOf("twitter.com") <=-1){
//           		// 	return
//           		// }
          		 
//           	var matches = regExp.exec(tab.title);
//           	newText = matches[1];
          

// if (newText==""){
//          	return
//          }
//           chrome.browserAction.setBadgeText( 	{text:newText} 	   	)
//           //document.getElementById('status').innerHTML = "<h1>hello</h1>";
//           statusText= newText

//           });

         

//           //END FUNCTION
//         },
//         {urls: ["<all_urls>"]},
//         ["responseHeaders"]
//       );



//Keep important data fields here 
//urls which are to be processed
var validUrls = {"facebook.com":true, "twitter.com":true};
//no of updates for each url
var counters = {"facebook.com": 0, "twitter.com": 0};
//valid title for tab page
var validTitleFormat  = /^\(([^)]+)\)/  //(x) new updates
//counter for toolbar icon
var currentCounter = 0
// validates domain.com for https,http,ftp for domain.com , x.domain.com etc
//var validDomains = /^(https?|ftp):\/\/[.a-z]+\.domain\.com[.a-z0-9/-]+/  




// Listen to any ajax update 
chrome.webRequest.onCompleted.addListener( function(details) {

  // check if the details are valid
  try{
    if (!isValidObject(details) || details.tabId==null || details.tabId<0 ){ return false}

    var tabId = parseInt(details.tabId);
    // get tab Details 
    var tabDetails = getTabDetails(tabId);
    if(!isValidObject(tabDetails) || tabDetails.url==null){ return false}
    // check if url is valid
    if(!isValidUrl(tabDetails.url)){ return false}
    // check if title is valid
    if(!isValidTitle(tabDetails.title)){return  false}
    // get updated values
    var validUrl = isValidUrl(tabDetails.url);
    var updates = {validUrl : getUpdates(tabDetails.title) };

    //update counters 
    updateCounters(updates);
    //update UI and icon
    updateIcon(updates);
    updateUIHtml(updates);
    // wrap up
  }
  catch(err){
    console.log(err);
  }
  


});


// Get url from tabID
function getTabDetails(tabId){
  if(tabId<0){ return false}

  chrome.tabs.get(tabId,function(tab){
        if(isValidObject(tab)){
           return tab;
        }else{ return false}
  });
}

// validate if the URL is of our concern
function isValidUrl(url){
  if(url==null || url=="" || typeof url !== 'string'){return false;}
  //var hostname = (new URL(url)).hostname;
  var curDomain = getDomain(url);
  for(var validUrl in validUrls){
    //  regex = /^(https?|ftp):\/\/[.a-z]+\.domain\.com[.a-z0-9/-]+/     
    ///^(https?|ftp|http):\/\/[.a-z]+\.facebook\.com[.a-z0-9/-]+/
    if(curDomain==validUrl){ return validUrl}

  }
  return false;

}

// validate the tab title 
function isValidTitle(title){
  if(title==""){return false;}
  return validTitleFormat.test(title);

}

// parse the title and return the counter value
function getUpdates(title){
  var matches = validTitleFormat.exec(title);
  if(!isValidObject(matches) || matches.length<2){ return false}
  return matches[1];
}

// send the information back to the controller


// update the updates counter after ajax request
function updateCounters(updates){
  var cur=0;
  if(!isValidObject(updates) ){ return false;}
  for(var url in updates){
    if(updates.hasOwnProperty(url)){
      counters[url] = updates[url];      
    }
    
  }
  return updateCurrentCounter();
}

function updateCurrentCounter(){
  var cur = 0;
  for (var k in counters) {
    if (counters.hasOwnProperty(k)) {
       cur+= parseInt(counters[k]);
    }
  }
  currentCounter = cur;
  return currentCounter;
}

function resetCurrentCounter(){
  currentCounter = 0;
}

// update the toolbar icon text
function updateIcon(){
  //if(currentCounter<=0){ return false}
  chrome.browserAction.setBadgeText(  {text:currentCounter}      );
}

// get tab list for popup html
function getTabList(){
  var tabList = {};
  chrome.tabs.query({}, function(tabs) { 
    if(!isValidObject(tabs)){return false;}
    for(var tab in tabs){
    if(tabs.hasOwnProperty(tab) && isValidUrl(tab.url)){
      tabList.push(tab);
    }
    return tabList;
  }
});
  
}



function isValidObject(a){
  if(!a  || a.length<1 || a !== Object(a)){  return false }
  return true;
  //tested
}


//http://www.primaryobjects.com/2012/11/19/parsing-hostname-and-domain-from-a-url-with-javascript/

function getDomain(url) {
  if(url==""){return false}
    var hostName = getHostName(url);
    var domain = hostName;
    
    if (hostName != null) {
        var parts = hostName.split('.').reverse();
        
        if (parts != null && parts.length > 1) {
            domain = parts[1] + '.' + parts[0];
                
            if (hostName.toLowerCase().indexOf('.co.uk') != -1 && parts.length > 2) {
              domain = parts[2] + '.' + domain;
            }
        }
    }
    
    return domain;
}

function getHostName(url) {
    var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
    return match[2];
    }
    else {
        return null;
    }
}


/* 

TESTED FUNCTIONS
isValidObject test (6)Rerun1 ms
updateCurrentCounter (4)Rerun0 ms
updateCounters (4)Rerun1 ms
getUpdates (16)Rerun1 ms
isValidUrl (16)Rerun
*/