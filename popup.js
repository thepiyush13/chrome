function renderStatus(statusText) {
  document.getElementById('status').innerText = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
  var tabList = "<ul>";
 chrome.tabs.query({}, function(tabs) { // blah 
 	for(var i=0;i<tabs.length;i++){
 		tabList+="<li><a id='"+tabs[i].windowId+"|"+tabs[i].id+	"' href='"+tabs[i].url+"'>";
 		tabList+="<img src='"+tabs[i].favIconUrl+"' style='width:16px;height:16px;'>";
 		tabList+=tabs[i].title;
 		tabList+="</a></li>";
 	}
 tabList+="</ul>"

    document.getElementById('status').innerHTML = tabList;
    
    
   
        
  });
});


document.addEventListener("click", function(){ 

var cid = (this.activeElement.id);
var temp = cid.split("|")
var window = temp[0]
var id = temp[1]
 chrome.runtime.getBackgroundPage(function(eventPage) {
       eventPage.switchTab(window,id);
    });

});

