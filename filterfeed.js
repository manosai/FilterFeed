var filtered_stories = [];
var word_list = []; 

function filterfeed(){

  // collect posts in news feed 
  if (document.url == "https://www.facebook.com/") {
    var stories = document.getElementsByClassName("_4ikz");
    for(var i=0; i < stories.length; i++){
      var story = stories[i];
      filter(story, "status");
    }
    // collect link descriptions and headers in news feed
    var links = document.getElementsByClassName("_6m3"); 
    for (var i = 0; i < links.length; i++) {
      var link = links[i]; 
      filter(link, "link"); 
    }
  }
  else {
    // collect links and posts on people's walls
    var wall_posts = document.getElementsByClassName("_4-u2 mbm _5jmm _5pat _5v3q");
    for(var i=0; i < wall_posts.length; i++){
      var post = wall_posts[i];
      filter(post, "status");
    }
  }

}

function filter(item, contentType){
  var status_list = []; 
  var link_content_list = []; 
  var link_header_list = []; 
  // statuses
  if (contentType == "status") {
    var status_content= item.getElementsByTagName("p");
    for(var k=0; k < status_content.length; k++){
      var current_status = status_content[k].innerText; 
      status_list.push(current_status); 
    }
    var wall_link_content = item.getElementsByClassName("_6m3"); 
    var wall_link_header_tags = item.getElementsByClassName("mbs _6m6'");
    for (var k = 0; k < wall_link_content.length; k++) {
      var current_wall_link_content = wall_link_content[k].innerText; 
      link_content_list.push(current_wall_link_content); 
    }
    for (var k = 0; k < wall_link_header_tags.length; k++) {
      var current_wall_link_headers= wall_link_header_tags[k].getElementsByTagName("a");
      for (var l = 0; l < current_wall_link_headers.length; l++) {
        var current_wall_link_header = current_wall_link_headers[l].innerText; 
         link_header_list.push(current_wall_link_header); 
      } 
    }
  }
  else if (contentType == "link") {
    var link_content = item.getElementsByClassName("_6m3"); 
    var link_header_tags = item.getElementsByClassName("mbs _6m6'");

    for (var k = 0; k < link_content.length; k++) {
      var current_link_content = link_content[k].innerText; 
      link_content_list.push(current_link_content); 
    }
    for (var k = 0; k < link_header_tags.length; k++) {
      var current_link_headers= link_header_tags[k].getElementsByTagName("a");
      for (var l = 0; l < current_link_headers.length; l++) {
        var current_link_header = current_link_headers[l].innerText; 
         link_header_list.push(current_link_header); 
      } 
    }
  }
    // get stored keywords and check for match
  finalFilter(status_list, link_content_list, link_header_list, item); 
  }

function finalFilter(status_list, link_content_list, link_header_list, item) {
  chrome.storage.local.get('words', function(data) {
    if (!isEmpty(data)) { 
      for (i = 0; i < data.words.length; i++) { 
        word_list.push(data.words[i]); 
      }     
      for (a = 0; a < data.words.length; a++) {
        for (b = 0; b < status_list.length; b++) {
          if (status_list[b].toLowerCase().indexOf(data.words[a].toLowerCase()) !== -1) {
            filterItem(item); 
          }
        }
      }

      for (a = 0; a < data.words.length; a++) {
        for (b = 0; b < link_content_list.length; b++) {
          if (link_content_list[b].toLowerCase().indexOf(data.words[a].toLowerCase()) !== -1) {
            filterItem(item); 
          }
        }
      }
      for (a = 0; a < data.words.length; a++) {
        for (b = 0; b < link_header_list.length; b++) {
          if (link_header_list[b].toLowerCase().indexOf(data.words[a].toLowerCase()) !== -1) { 
            filterItem(item); 
          }
        }
      }
    }
  }); 
}



    
    /*
      for (i = 0; i < data.words.length; i++) { 
          console.log(data.words[i]); 
          console.log(current_status); 
          if (current_status.indexOf(data.words[i]) !== -1) {
            console.log("hooray"); 
            filterItem(item); 
          }
      }
    }); 
*/

function filterItem(item){
  // set the story to be invisible
  item.style.opacity = "0.0";
  item.style.display = "None";

  // or remove that fucking div from the DOM
  if (item.parentNode != null) {
    item.parentNode.removeChild(item);
  }


  // add this story to the list of killed stories
  if (filtered_stories.indexOf("item") == -1) {
    filtered_stories.push("item"); 
    chrome.storage.local.get('num', function(data) {
      // adding to the counter for the first time 
      if ($.isEmptyObject(data) || data['num'] == 0) {
        chrome.storage.local.set({'num': 1});
        console.log("1"); 
      }
      else {
        var new_value = parseInt(data['num']) + 1; 
        console.log(new_value); 
        chrome.storage.local.set({'num': new_value}); 
      } 
    });
    //console.log("something was filtered");
  }
}

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

/* Inform the backgrund page that 
 * this tab should have a page-action */
chrome.runtime.sendMessage({
    from:    'filterfeed',
    subject: 'showPageAction'
});


function clear() { 
  chrome.storage.local.set({'num': 0}); 
  chrome.storage.local.get('num', function(data) {
      //console.log(data['num']); 
  }); 
}
//window.addEventListener("beforeunload", function() {

//}); 

document.addEventListener("DOMContentLoaded", function(){
  filterfeed(); 
}); 



var old_URL = document.URL;
var old_body = document.body; 
var old_posts = document.getElementsByClassName("_4ikz");
document.addEventListener("click", function(){
  var new_URL = document.URL; 
  if (old_URL != new_URL) {
    setTimeout(function() {
        clear(); 
        filterfeed(); 
        var observer = new MutationObserver(function(mutations) {
           mutations.forEach(function(mutation) {
           filterfeed(); 
          });
        });

        feed = document.getElementById("stream_pagelet"); 
        wall = document.getElementById("timeline_tab_content");
        if (feed != undefined) {
          //console.log("we better see feed"); 
          observer.observe(document.getElementById("stream_pagelet"), {
            childList: true, 
            subtree: true
          });
        } else if (wall != undefined) {
          //console.log("we better see wall"); 
          observer.observe(document.getElementById("timeline_tab_content"), {
            childList: true, 
            subtree: true
          }); 
        }
    }, 2000); 
  }

});



var observer = new MutationObserver(function(mutations) {
 mutations.forEach(function(mutation) {
   filterfeed(); 
 });
});

feed = document.getElementById("stream_pagelet"); 
wall = document.getElementById("timeline_tab_content");
if (feed != undefined) {
  observer.observe(document.getElementById("stream_pagelet"), {
    childList: true, 
    subtree: true
  });
} else if (wall != undefined) {
  //console.log("we better see wall"); 
    observer.observe(document.getElementById("timeline_tab_content"), {
    childList: true, 
    subtree: true
  }); 
}
 





//document.addEventListener("DOMNodeInserted", filterfeed);