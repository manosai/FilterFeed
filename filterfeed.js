var filtered_stories = [];

function filterfeed(){

  // collect posts in news feed 
  stories = document.getElementsByClassName("_4ikz");
  for(var i=0; i < stories.length; i++){
    var story = stories[i];
    filter(story, "feed");

  }

  // be a buzz kill on people's walls
  wall_posts = document.getElementsByClassName("fbTimelineUnit");
  for(var i=0; i < wall_posts.length; i++){
    var post = wall_posts[i];
    killLinks(post, "wall");
  }
}

function filter(item, pageType){

  // statuses with no links
  var status_content= item.getElementsByTagName("p");
  for(var k=0; k < status_content.length; k++){
    var current_status = status_content[k];
    // var href = status.href.toLowerCase();

    // search for a keyword match
    if (current_status.innerText.indexOf("Foster Farms") !== -1) {
      console.log("do we get here"); 
      filterItem(item); 
    }
  }
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

}

// begin function call
filterfeed();
document.addEventListener("scroll", filterfeed);