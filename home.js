
$(document).ready(function() {
	// check if there are already words in local storage, then display them
	chrome.storage.local.get('words', function(data) {
		// words exist
		if (!$.isEmptyObject(data)) {
			console.log(data); 
			console.log(data.words[0]); 
			var counter = 0;  
			var html = ""; 
			for (i = 0; i < data.words.length; i++) {
				console.log(data.words[i]); 
				// adding the first word
				if (i == 0) {
					html += "<ul id ='navlist'><li>" + data.words[i] + "</li></ul>";
					$("#keyword_list").append(html);
				}
				// adding the rest
				else {
					html += "<li>" + data.words[i] + "</li>"; 
					$("#keyword_list ul").append(html); 
				}
			}

		}
	}); 

	$("#submit_button").click(function (e) {
		var word = $("#keywords").val(); 
		console.log(word); 
		var word_list = []; 
		chrome.storage.local.get('words', function(data) {
			for (item in data) { 
				word_list.push(item); 
			}
		}); 
		word_list.push(word); 
		// add the word to local storage
		chrome.storage.local.set({'words': word_list}); 

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

