$(document).ready(function() {

	// check if there are already words in local storage, then display them


	$("#submit_button").click(function (e) {
		var word = $("#keywords").val(); 
		console.log(word); 

		// add the word to local storage
		chrome.storage.sync.set({'words': word}); 

		// display the added words in the popup 
		var html = ""; 
		var ul = $("#navlist"); 
		// adding additional keywords 
		if (ul.length) {
			html += "<li>" + word + "</li>"; 
			$("#keyword_list ul").append(html); 
		}
		// adding the first keyword
		else {
			html += "<ul id ='navlist'><li>" + word + "</li></ul>"; 
			$("#keyword_list").append(html);
		} 

		// clear the textbox
		$("#keywords").val(''); 
	}); 


	// listen for enter keypress
	$("#keywords").keyup(function(event){
    	if(event.keyCode == 13){
        	$("#submit_button").click();
    	}
	});
}); 

