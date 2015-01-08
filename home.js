
$(document).ready(function() {
	// check if there are already words in local storage, then display them
	chrome.storage.local.get('words', function(data) {
		// words exist
		if (!$.isEmptyObject(data)) {

			// display the words in the popup
			var word_list =[]; 
			for (i = 0; i < data.words.length; i++) { 
				word_list.push(data.words[i]); 
			}
			console.log(word_list);   
			var html = ""; 
			$("#keyword_list").append("<ul id='navlist'></ul>");
			for (i = 0; i < data.words.length; i++) {
				html += "<li>" + data.words[i] + "</li>"; 
				console.log(data.words[i]); 
				 
			}
			$("#keyword_list ul").append(html);

		}
	}); 

	$("#submit_button").click(function (e) {
		var word = $("#keywords").val(); 
		console.log(word); 
		var word_list = []; 
		chrome.storage.local.get('words', function(data) {
			if (!$.isEmptyObject(data)) {
				for (i = 0; i < data.words.length; i++) { 
					word_list.push(data.words[i]); 
				}
			}
			word_list.push(word); 
			// add the word to local storage
			chrome.storage.local.set({'words': word_list}); 
			console.log("we just added a word"); 
		}); 

		// display the added words in the popup 
		var html = ""; 
		var ul = $("#navlist"); 
		// adding additional keywords 
		if (ul.length) {
			html += "<li>" + word + "</li>"; 
			console.log(word); 
			$("#keyword_list ul").append(html); 
		}
		// adding the first keyword
		else {
			html += "<ul id ='navlist'><li>" + word + "</li></ul>"; 
			console.log(word); 
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

