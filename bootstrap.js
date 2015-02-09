// when the extension is first installed
chrome.runtime.onInstalled.addListener(function(details) {
    localStorage["existing_user"] = true;
});


// Listen for any changes to the URL of any tab.
// see: http://developer.chrome.com/extensions/tabs.html#event-onUpdated
chrome.tabs.onUpdated.addListener(function(id, info, tab){


    // decide if we're ready to inject content script
    if (tab.status !== "complete" && localStorage["existing_user"] == "true" && tab.url.toLowerCase().indexOf("facebook.com") != -1){
         // show the page action
        chrome.pageAction.show(tab.id);

        // figure out which icon to show 
        chrome.storage.local.get('words', function(data) {
            // words exist
            if (data.words.length != 0) {
                chrome.pageAction.setIcon({tabId: tab.id, path: {'38': 'toolbar_icon.png'}}); 
            }
            else {
                chrome.pageAction.setIcon({tabId: tab.id, path: {'38': 'inactive.png'}});
            }
        }); 
        // inject the content script onto the page
        console.log("injecting content script");
        chrome.tabs.executeScript(tab.id, {"file": "filterfeed.js"});
        return;
    }
    if (tab.url.toLowerCase().indexOf("facebook.com") === -1){
        return;
    }

});

// maintaining state in the background
var tabId = null;

// listening for new tabIds and refresh requests
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(request); 

        // if this is a store request, save the tabid
        if(request.type == "new tabid") {
            tabId = request.tabid;
        }

        // if this is a refresh request, refresh the tab if it has been set
        else if(request.type == "refresh" && tabId !== null) {
            console.log("refresh"); 
            chrome.tabs.reload(tabId);
        }
});

// Speed up calls to hasOwnProperty
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}


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
