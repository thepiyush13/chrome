// This function is called onload in the popup code
function switchTab(id) { 
//alert(id)
     chrome.tabs.update(parseInt(id), {active: true});
    
}; 
