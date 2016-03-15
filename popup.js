function renderStatus(statusText) {
  document.getElementById('status').innerText = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
 //  var tabList = "<ul>";
 // chrome.tabs.query({}, function(tabs) { // blah 
 // 	for(var i=0;i<tabs.length;i++){
 // 		tabList+="<li><a id='"+tabs[i].windowId+"|"+tabs[i].id+	"' href='"+tabs[i].url+"'>";
 // 		tabList+="<img src='"+tabs[i].favIconUrl+"' style='width:16px;height:16px;'>";
 // 		tabList+=tabs[i].title;
 // 		tabList+="</a></li>";
 // 	}
 // tabList+="</ul>"

 //    document.getElementById('status').innerHTML = tabList;
    
    
   
        
 //  });

 document.getElementById('status').innerHTML = chrome.extension.getBackgroundPage().statusText;
});


// document.addEventListener("click", function(){ 

// var cid = (this.activeElement.id);
// var temp = cid.split("|")
// var window = temp[0]
// var id = temp[1]
//  chrome.runtime.getBackgroundPage(function(eventPage) {
//        eventPage.switchTab(window,id);
//     });

// });

// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//    //alert(changeInfo.url);
//    alert("hello")
// });


// chrome.tabs.onActivated.addListener(function(activeInfo) {
//   // how to fetch tab url using activeInfo.tabid
//   chrome.tabs.get(activeInfo.tabId, function(tab){
//      console.log(tab.url);
//   });
// })




// //chrome alarms
//chrome.alarms.create("myalarm", {,1,1})

// var requestFilter = {
//     urls: [ "<all_urls>" ]
//   },

//   extraInfoSpec = ['requestHeaders','blocking'],

//   handler = function( details ) {

//    chrome.browserAction.setBadgeText(
//    	{text:"new"}
//    	)
   
//   };

// chrome.webRequest.onHeadersReceived.addListener( handler, requestFilter, extraInfoSpec );



chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	alert("msg:"+request.newText)
 	document.getElementById('status_text').innerText = request.newText;
    
    sendResponse({farewell: "goodbye"});
    return true
  });