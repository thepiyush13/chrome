
//Keep important data fields here 
//icon file link: http://www.iconarchive.com/show/100-flat-2-icons-by-graphicloads/msg-2-icon.html
//urls which are to be processed
var validUrls = {"facebook.com":true, "twitter.com":true};
//no of updates for each url
var counters = {"facebook.com": 0, "twitter.com": 0};
//valid title for tab page
var validTitleFormat  = /^\(([^)]+)\)/  //(x) new updates
//counter for toolbar icon
var currentCounter = 0
// id of the HTML element to be  updated
var ID_TABLIST = "status"
// validates domain.com for https,http,ftp for domain.com , x.domain.com etc
//var validDomains = /^(https?|ftp):\/\/[.a-z]+\.domain\.com[.a-z0-9/-]+/  




// Listen to any ajax update 
chrome.webRequest.onCompleted.addListener( function(details) {

  // check if the details are valid
  
    if (!isValidObject(details) || details.tabId==null || details.tabId<0 ){ return false}

    var tabId = parseInt(details.tabId);
    // get tab Details 
    var tabDetails = getTabDetails(tabId);
    
    // wrap up
 
 
  


},
{
 urls: ["<all_urls>"]
},
["responseHeaders"]);

// switch to any tab of any window
function switchTab(window,id) { 
//alert(id)
  chrome.windows.update(parseInt(window), {focused: true})
  chrome.tabs.update(parseInt(id), {active: true});
    
};

// get tab list for popup html
function getTabList(filterValids){
  chrome.tabs.query({}, function(tabs) { 
    //console.log(tabs)
    
    if(isValidObject(tabs)){
      filterValids = (typeof filterValids == 'undefined') ? false : true;
      var tabHtml = createListHtml(tabs,filterValids);
      // show poup html
      updateUIHtml(ID_TABLIST,tabHtml);
      //reset the counter
      resetCurrentCounter();
      //update the icon text
      updateIcon();
    }

  
});
  
}

// Get url from tabID
function getTabDetails(tabId){
  if(tabId<0){ return false}

  chrome.tabs.get(tabId,function(tabDetails){
        if(isValidObject(tabDetails)){
            if(!isValidObject(tabDetails) || tabDetails.url==null){ return false}
            // check if url is valid
            var curValidUrl = isValidUrl(tabDetails.url);
            if(!curValidUrl){ return false}
            // check if title is valid
            if(!isValidTitle(tabDetails.title)){return  false}
            // get updated values
            var updates = {}
            updates[curValidUrl] =  getUpdates(tabDetails.title) ;

            //update counters 
            updateCounters(updates);
            //update UI and icon
            updateIcon(updates);
            // var tabHtml = createListHtml(tabs,filterValids);
            // // show poup html
            // updateUIHtml(ID_TABLIST,tabHtml);
            
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
      counters[url] = parseInt(updates[url]);      
    }
    
  }
  console.log(counters)
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
  var updateText = (currentCounter!=0) ? currentCounter.toString() : "";
  chrome.browserAction.setBadgeText(  {text: updateText }      );
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


//UPDATE UI FUNCTIONS

// update the popup html
function updateUIHtml(eid, evalue){
  var data  = {id:eid,val:evalue}
    chrome.extension.sendRequest({method: 'updateUIHtml', data: data}, function(response) {
      return true;
    });

}

// create tab list html
function createListHtml(tabs,filterValids){
  var tabList = "<div class='links'>";
  for(var i=0;i<tabs.length;i++){
    if( filterValids==false || ( filterValids==true &&  isValidUrl(tabs[i].url) ) ){
      var update = counters[isValidUrl(tabs[i].url)];
      //alert(update)
      tabList+="<div class='link'><a class='popupLink' id='"+tabs[i].windowId+"|"+tabs[i].id+ "' href='"+tabs[i].url+"'>";
      tabList+="<img src='"+tabs[i].favIconUrl+"' class='favicon'> <br/>";
      tabList+= "<spn class='notiText' >"+update+"</span>"//abs[i].title;
      tabList+="</a></div>";
    }
    
  }
  tabList+="</div>";
  return tabList;
}

/* 

TESTED FUNCTIONS
isValidObject test (6)Rerun1 ms
updateCurrentCounter (4)Rerun0 ms
updateCounters (4)Rerun1 ms
getUpdates (16)Rerun1 ms
isValidUrl (16)Rerun
*/