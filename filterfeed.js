var filtered_stories = [];
var word_list = []; 


function filterfeed(){

  // collect posts in news feed 
  var stories = document.getElementsByClassName("_4ikz");
  for(var i=0; i < stories.length; i++){
    var story = stories[i];
    filter(story, "status");

  }

  // collect links and posts on people's walls
  var wall_posts = document.getElementsByClassName("_4-u2 mbm _5jmm _5pat _5v3q");
  for(var i=0; i < wall_posts.length; i++){
    var post = wall_posts[i];
    filter(post, "status");
  }

  // collect link descriptions and headers in news feed
  var links = document.getElementsByClassName("_6m3"); 
  for (var i = 0; i < links.length; i++) {
    var link = links[i]; 
    filter(link, "link"); 
  }

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

  console.log("we filtered" + item); 
  // set the story to be invisible
  item.style.opacity = "0.0";
  item.style.display = "None";

  // or remove that fucking div from the DOM
  if (item.parentNode != null) {
    item.parentNode.removeChild(item);
  }


  // add this story to the list of killed stories
  if (filtered_stories.indexOf(item) == -1){
    console.log("Just filtered" + item.innerHTML); 
    filtered_stories.push(item);
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

// begin function call
filterfeed();
document.addEventListener("scroll", filterfeed);