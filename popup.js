function renderStatus(statusText) {
  document.getElementById('status').innerText = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
  var tabList = "<ul>";
 chrome.tabs.query({}, function(tabs) { // blah 
 	for(var i=0;i<tabs.length;i++){
 		tabList+="<li><a id='"+tabs[i].id+"' href='"+tabs[i].url+"'>";
 		tabList+="<img src='"+tabs[i].favIconUrl+"' style='width:16px;height:16px;'>";
 		tabList+=tabs[i].title;
 		tabList+="</a></li>";
 	}
 tabList+="</ul>"

    document.getElementById('status').innerHTML = tabList;
    
    
   
        
  });
});


document.addEventListener("click", function(){ 

var id = (this.activeElement.id);
 chrome.runtime.getBackgroundPage(function(eventPage) {
       eventPage.switchTab(id);
    }); 

});

