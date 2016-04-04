/**
 * popup.js
 *
 * @license GNU GPL
 * @version 0.3
 * @author Piyush Tripathi ,  http://piyu.tk
 * @updated 2016
 *
 *
 */


//Check if user has clicked the Icon button in the toolbar:
document.addEventListener('DOMContentLoaded', function() {
	//popup loaded completely

	//get required tabs
	chrome.runtime.getBackgroundPage(function(bgPage) {
		 bgPage.getTabList(true); //filtered tab list		 		
	});



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
  document.getElementById(id).innerHTML = value;
}

//listen to any request from the background page
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

