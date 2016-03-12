// This function is called onload in the popup code
function switchTab(window,id) { 
//alert(id)
chrome.windows.update(parseInt(window), {focused: true})
     chrome.tabs.update(parseInt(id), {active: true});
    
}; 
