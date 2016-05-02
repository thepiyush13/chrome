/**
 * background.js
 *
 * @license GNU GPL
 * @version 0.3
 * @author Piyush Tripathi ,  http://piyu.tk
 * @updated 2016
 *
 *
 */


//Keep important data fields here 
//icon file link: http://www.iconarchive.com/show/100-flat-2-icons-by-graphicloads/msg-2-icon.html
//global tab object :
var gTab ={}
//urls which are to be processed
var validUrls = {"facebook.com":true, "twitter.com":true,"google.com":true,};
//no of updates for each url
var counters = {"facebook.com": 0, "twitter.com": 0,"google.com":0};
//valid title for tab page
var validTitleFormat  = /\(([^)]+)\)/  //(x) new updates
//counter for toolbar icon
var currentCounter = 0
// id of the HTML element to be  updated
var ID_TABLIST = "status"
// validates domain.com for https,http,ftp for domain.com , x.domain.com etc
//var validDomains = /^(https?|ftp):\/\/[.a-z]+\.domain\.com[.a-z0-9/-]+/  




/* 

TESTED FUNCTIONS
isValidObject test (6)Rerun1 ms
updateCurrentCounter (4)Rerun0 ms
updateCounters (4)Rerun1 ms
getUpdates (16)Rerun1 ms
isValidUrl (16)Rerun
*/

/************************************************* CONTROLLER START*****************************************/
/**********************************************************************************************************/
// Listen to any ajax update 
chrome.webRequest.onCompleted.addListener( function(details) {

  // check if the details are valid  
  
  if (!isValidObject(details) || details.tabId==null || details.tabId<0  || isValidUrl(details.url)==false ){ return false}
  //check for gmail only requests
  
  
  //process all tabs    
    processAllTabs();

  },
  {
   urls: ["<all_urls>"]
 },
 ["responseHeaders"]);



//event listner for tab close : update all values 
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){  
  processAllTabs();

});

//update global tabs object when new tab is created
chrome.tabs.onCreated.addListener(function(tab){
  processAllTabs();
});



/************************************************* MODAL START**********************************************/
/**********************************************************************************************************/

/*** MAIN FUNCTION process all tabs ***/
// process all opened tabs and update the counters 
function processAllTabs(){
  var updated = getAllTabDetails();
  
}
//get all details of all the tabs in the chrome
//goes through every tab and create update object for counters
function getAllTabDetails(){
  //init

  var tempUpdates = {}
  for(key in validUrls){
    tempUpdates[key] =  0 ;
  }  

  //go through each tab 
  chrome.tabs.query({status:"complete"}, function(tabs){
    if(!isValidObject(tabs)){
      return false;
    } 
    //get each tab     
    for(i in tabs){
     var tab  = tabs[i];
     if(isValidObject(tab)){
      if(tab.url!=null){ 
            // check if url is valid
            var curValidUrl = isValidUrl(tab.url);
            if(curValidUrl){ 
              // check if title is valid
              if(isValidTitle(tab.title)){
                  // get updated values                
                  tempUpdates[curValidUrl] =  parseInt(getUpdates(tab.title)) ;
              }
          }

        }

      }
    }
      
    
    //update global counters
  updateCounters(tempUpdates);
  //update icon with global counters
  updateIcon();
  //print(tempUpdates);

    });
  
  return true;
}


/***** End main function ****/

// get tab list for popup html
function getTabList(filterValids){
  chrome.tabs.query({}, function(tabs) {  
    
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

// parse the title and return the counter value
function getUpdates(title){
  if (typeof title !== 'string') {
    return false;
}
  var cleanTitle = title.replace(",","");
  var matches = validTitleFormat.exec(cleanTitle);
  if(!isValidObject(matches) || matches.length<2){ return false}
    return matches[1];
}


// update the updates counter after ajax request
function updateCounters(updates){
  var cur=0;
  if(!isValidObject(updates) ){ return false;}
  for(var url in updates){
    if(updates.hasOwnProperty(url)){
      //alert("d" ); 
      counters[url] = parseInt(updates[url]); 
      cur+=   parseInt(updates[url]);

    }
    
  }
  
  currentCounter = cur;
  return cur;
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

function resetAllCounters(){
  for(key in validUrls){
    counters[key] =  0 ;
  }  
  currentCounter = 0;
}

/************************************************* VIEW START**********************************************/
/**********************************************************************************************************/

// switch to any tab of any window
function switchTab(window,id) { 
//alert(id)
chrome.windows.update(parseInt(window), {focused: true})
chrome.tabs.update(parseInt(id), {active: true});

};

// validate if the URL is of our concern
function isValidUrl(url){
  if(url==null || url=="" || typeof url !== 'string'){return false;}
  //var hostname = (new URL(url)).hostname;
  //check if it`s a valid gmail reqest
  // lot of google services call *.google.com thus we only need gmail only request
  if(!isValidGmailRequest(url)){
  	return false;
  }
  return getBaseUrl(url);  

}
//return the domain for the complete url 
function getBaseUrl(url){
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



// update the toolbar icon text
function updateIcon(){
  //if(currentCounter<=0){ return false}

  var updateText = (currentCounter!=0) ? currentCounter.toString() : "";
  //alert(currentCounter)
  chrome.browserAction.setBadgeText(  {text: updateText }      );
}





function isValidObject(a){
  if(!a  || a.length<1 || a !== Object(a)){  return false }
    return true;
  //tested
}

//if *.google.com ajax request is from Gmail
function isValidGmailRequest(url){
	var baseDomain = getDomain(url);
  var subDomain = 	getHostName(url);
  if(baseDomain=="google.com"){
  	if(subDomain!="mail.google.com"){
  		//non gmail call
  		return false;
  	}

  }
  return true;
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
  var linkCount = {}
  for(var i=0;i<tabs.length;i++){
    var tabUrl = tabs[i].url
    var validTabUrl = isValidUrl(tabs[i].url) ;
    if( filterValids==false || ( filterValids==true &&  validTabUrl!=false) ){
      var update = counters[validTabUrl]; 
      //alert(update)
      if(!(validTabUrl in linkCount)){  //link not already added
        tabList+="<div class='link'><a class='popupLink' id='"+tabs[i].windowId+"|"+tabs[i].id+ "' href='"+tabs[i].url+"'>";
        tabList+="<img src='"+tabs[i].favIconUrl+"' class='favicon'> <br/>";
        tabList+= "<spn class='notiText' >"+update+"</span>"//abs[i].title;
        tabList+="</a></div>";
        linkCount[validTabUrl] = true;
      }
      
    }
    
  }
  tabList+="</div>";
  return tabList;
}

function print(val){
  alert(JSON.stringify(val));
}