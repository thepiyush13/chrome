var statusText = "<h1>hello</h1>	"
// This function is called onload in the popup code
// function switchTab(window,id) { 
// //alert(id)
// chrome.windows.update(parseInt(window), {focused: true})
//      chrome.tabs.update(parseInt(id), {active: true});
    
// }; 

// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//    //alert(changeInfo.url);
//    alert("hello")
// });



//setInterval(function(){ alert("works") }, 2000)

// chrome.webRequest.onBeforeSendHeaders.addListener(function(details){
//    alert("tab updated");
//    //alert("hello")
// });

// var requestFilter = {
//     urls: [ "<all_urls>" ]
//   },

//   extraInfoSpec = ['requestHeaders','blocking'],

//   handler = function( details ) {

//    chrome.browserAction.setBadgeText({text:"request"}})

//   };

// chrome.webRequest.onBeforeSendHeaders.addListener( handler, requestFilter, extraInfoSpec );

chrome.webRequest.onCompleted.addListener(
        function(details) {
        	//alert("hello");
     //    	chrome.browserAction.setBadgeText(
	   	// {text:"007"}
	   	// )
          var tabId = parseInt(details.tabId);
         
          var newText = "";
          var regExp = /\(([^)]+)\)/;
          if(tabId<0  ){
          	return;
          }
          chrome.tabs.get( 
          	parseInt(tabId), 
          	function(tab){
          		// if (tab.url.indexOf("twitter.com") <=-1){
          		// 	return
          		// }
          		 
          	var matches = regExp.exec(tab.title);
          	newText = matches[1];
          

if (newText==""){
         	return
         }
          chrome.browserAction.setBadgeText( 	{text:newText} 	   	)
          //document.getElementById('status').innerHTML = "<h1>hello</h1>";
          statusText= newText

          });

         

          //END FUNCTION
        },
        {urls: ["<all_urls>"]},
        ["responseHeaders"]
      );