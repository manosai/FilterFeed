var filtered_stories = [];
var word_list = []; 

function filterfeed(){

  // collect posts in news feed 
  var stories = document.getElementsByClassName("_4ikz");
  for(var i=0; i < stories.length; i++){
    var story = stories[i];
    filter(story, "status");

  }

  // collect posts on people's walls
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
    if (data.length == 0) {
      return; 
    }
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
  }
  else if (contentType == "link") {
    var link_content = item.getElementsByClassName("_6ma"); 
    var link_header_tags = item.getElementsByClassName("mbs _6m6'");

    for (var k = 0; k < link_content.length; k++) {
      var current_link_content = link_content[k].innerText; 
      link_content_list.push(current_link_content); 
    }
    for (var k = 0; k < link_header_tags.length; k++) {
      var current_link_headers= link_header_tags[0].getElementsByTagName("a");
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
  item.remove();
  console.log(item.className); 
  if (item.className == '_6m3')
  if (item.parents('._4-u2 mbm _5jmm _5pat _5v3q').length) {
    item.parents('._4-u2 mbm _5jmm _5pat _5v3q')[0].remove(); 
  }

  //if the post happens to be a link on a wall, 


  // add this story to the list of killed stories
  if (filtered_stories.indexOf(item) == -1){
    console.log("Just filtered" + item.innerHTML); 
    filtered_stories.push(item);
  }
}

// begin function call
filterfeed();
document.addEventListener("scroll", filterfeed);