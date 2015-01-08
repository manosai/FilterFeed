var filtered_stories = [];
var word_list = []; 

function filterfeed(){

  // collect posts in news feed 
  stories = document.getElementsByClassName("_4ikz");
  for(var i=0; i < stories.length; i++){
    var story = stories[i];
    filter(story, "feed");

  }

  // collect posts on people's walls
  wall_posts = document.getElementsByClassName("_5pcb _4b0l");
  for(var i=0; i < wall_posts.length; i++){
    var post = wall_posts[i];
    filter(post, "wall");
  }
}

function finalFilter(data, status_list, item) {
  for (i = 0; i < data.words.length; i++) { 
    word_list.push(data.words[i]); 
  }     
  for (a = 0; a < data.words.length; a++) {
    for (b = 0; b < status_list.length; b++) {
      if (status_list[b].indexOf(data.words[a]) !== -1) {
        console.log("hooray"); 
        filterItem(item); 
      }
    }
  }
}

function filter(item, pageType){

  // statuses with no links, store in list
  var status_content= item.getElementsByTagName("p");
  var status_list = []; 
  for(var k=0; k < status_content.length; k++){
    var current_status = status_content[k].innerText; 
    status_list.push(current_status); 
  }
    // get stored keywords and check for match
   
    chrome.storage.local.get('words', function(data) {
      finalFilter(data, status_list, item); 
    }); 

    
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
}

function filterItem(item){

  // set the story to be invisible
  item.style.opacity = "0.0";
  item.style.display = "None";

  // add this story to the list of killed stories
  if (filtered_stories.indexOf(item) == -1){
    console.log("Just filtered" + item); 
    filtered_stories.push(item);
  }
  console.log(filtered_stories.length); 
}

// begin function call
filterfeed();
document.addEventListener("scroll", filterfeed);