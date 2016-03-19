// function renderStatus(statusText) {
//   document.getElementById('status').innerText = statusText;
// }

// document.addEventListener('DOMContentLoaded', function() {
//  //  var tabList = "<ul>";
//  // chrome.tabs.query({}, function(tabs) { // blah 
//  // 	for(var i=0;i<tabs.length;i++){
//  // 		tabList+="<li><a id='"+tabs[i].windowId+"|"+tabs[i].id+	"' href='"+tabs[i].url+"'>";
//  // 		tabList+="<img src='"+tabs[i].favIconUrl+"' style='width:16px;height:16px;'>";
//  // 		tabList+=tabs[i].title;
//  // 		tabList+="</a></li>";
//  // 	}
//  // tabList+="</ul>"

//  //    document.getElementById('status').innerHTML = tabList;
    
    
   
        
//  //  });
// chrome.browserAction.setBadgeText( 	{text:""} 	   	)
//  document.getElementById('status').innerHTML = '<h2>'+chrome.extension.getBackgroundPage().statusText+'</h2>';
// });



// // chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
// //    //alert(changeInfo.url);
// //    alert("hello")
// // });


// // chrome.tabs.onActivated.addListener(function(activeInfo) {
// //   // how to fetch tab url using activeInfo.tabid
// //   chrome.tabs.get(activeInfo.tabId, function(tab){
// //      console.log(tab.url);
// //   });
// // })




// // //chrome alarms
// //chrome.alarms.create("myalarm", {,1,1})

// // var requestFilter = {
// //     urls: [ "<all_urls>" ]
// //   },

// //   extraInfoSpec = ['requestHeaders','blocking'],

// //   handler = function( details ) {

// //    chrome.browserAction.setBadgeText(
// //    	{text:"new"}
// //    	)
   
// //   };

// // chrome.webRequest.onHeadersReceived.addListener( handler, requestFilter, extraInfoSpec );



// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//   	alert("msg:"+request.newText)
//  	document.getElementById('status_text').innerText = request.newText;
    
//     sendResponse({farewell: "goodbye"});
//     return true
//   });

// function setHtmlContent(identifier, value){
// 	if(identifier=""){ return false }
	
// }



//Check if user has clicked the Icon button in the toolbar:
document.addEventListener('DOMContentLoaded', function() {
	//popup loaded completely

	//get required tabs
	chrome.runtime.getBackgroundPage(function(bgPage) {
		 bgPage.getTabList(true); //filtered tab list
		
	});

	//wrap up

});

// Evenet listner for tab switch 
document.addEventListener("click", function(){ 

var cid = (this.activeElement.id);
var temp = cid.split("|")
if(cid==null || cid=="" || temp.length<2 ){return false;}
var window = temp[0]
var id = temp[1]
 chrome.runtime.getBackgroundPage(function(bgPage) {
       bgPage.switchTab(window,id);
    });

});


//main function which updates the UI elements of popup page
function updateHtml(id, value){
  //alert('hello')
  document.getElementById(id).innerHTML = value;
}


chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	switch (request.method) 
	{
	case 'updateUIHtml':
		//localTicker.currentTicker = request.data;
		var data = request.data;
		updateHtml(data.id, data.val)
		break;
	}
});


//Check if user has closed any important tabs
