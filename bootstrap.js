// when the extension is first installed
chrome.runtime.onInstalled.addListener(function(details) {
    localStorage["existing_user"] = true;
});

// setting up context menu for when the extension is installed
chrome.runtime.onInstalled.addListener(function() {
    var context = "selection"; 
    var title = "Filter %s from news feed";
    var id = chrome.contextMenus.create({"title": title, "contexts":[context], "id":"context" + context}); 
});



// Listen for any changes to the URL of any tab.
// see: http://developer.chrome.com/extensions/tabs.html#event-onUpdated
chrome.tabs.onUpdated.addListener(function(id, info, tab){


    // decide if we're ready to inject content script
    if (tab.status !== "complete"){
        console.log("not yet");
        return;
    }
    if (tab.url.toLowerCase().indexOf("facebook.com") === -1){
        console.log("not here");
        return;
    }

    console.log(tab.url.toLowerCase().indexOf("facebook.com")); 

    if (localStorage["existing_user"] == "true"){

        // show the page action
        chrome.pageAction.show(tab.id);

        // inject the content script onto the page
        console.log("injecting content script");
        chrome.tabs.executeScript(null, {"file": "filterfeed.js"});
    }

});

// show the popup when the user clicks on the page action.
chrome.pageAction.onClicked.addListener(function(tab) {
    chrome.pageAction.show(tab.id);
});


// update the icon when the user's settings change
// chrome.storage.onChanged.addListener(function(changes, areaName){
//     alert("changed settings");
//     console.log("changed settings");
//     if (localStorage["be_a_buzzkill"] == "true"){
//         path = "active-icon.jpeg";
//     } else {
//         path = "inactive-icon.jpeg";
//     }
//     chrome.tabs.getCurrent( function(tab){
//         chrome.pageAction.setIcon({
//             "tabId": tab.id,
//             "path": path
//         });
//     });
// }); 
