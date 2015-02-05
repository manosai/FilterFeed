
$(document).ready(function() {
	var counter = 0; 

	chrome.storage.local.get('words', function(data) {
		// words exist
		if (data.words.length != 0) {
			chrome.tabs.query(
			{currentWindow: true, active: true},
			function (tabArray) {
				chrome.pageAction.setIcon({tabId: tabArray[0].id, path: {'38': 'toolbar_icon.png'}}); 
			}
		)
		}
	});

	$("#clear").click(function (e) {
		$("img").remove(); 
		var img_html = "<img src='inactive.png' style='margin-left:auto; margin-right:auto; margin-top:-25px;'>"; 
		$("#img").append(img_html); 
		chrome.storage.local.clear(); 
		var current_height = $("#keyword_list").height(); 
		$("#keyword_list").css('display', 'none'); 
		$("#navlist").remove(); 
		var old_height = $("#content1").height(); 
		var sum = current_height + old_height; 
		
		chrome.tabs.query(
						{currentWindow: true, active: true},
							function (tabArray) {
							chrome.pageAction.setIcon({tabId: tabArray[0].id, path: {'38': 'inactive.png'}}); 
						}
		)
		
		//$("#content1").css('height', sum); 
	});

	function deleteWord(keyword, current_words) {
		// delete from DB
		chrome.storage.local.clear(); 
		var new_word_list = []; 
		for (i = 0; i < current_words.words.length; i++) {
			if (keyword != current_words.words[i]) {
				new_word_list.push(current_words.words[i]); 
			}
			else {
				console.log("we just deleted a word"); 
			}
		}
		console.log(new_word_list); 
		chrome.storage.local.set({'words': new_word_list}); 

		// words no longer exist
		if (!new_word_list.length) {
			$("#keyword_list").css('display', 'none'); 
			$("#navlist").remove(); 

		}	
	}
    
	// check if there are already words in local storage, then display them
	chrome.storage.local.get('words', function(data) {
		var del_data = []; 
		// words exist
		if (data.words.length != 0) {

			// change the logo to blue one
			$("img").remove(); 
			var img_html = "<img src='toolbar_icon.png' style='margin-left:auto; margin-right:auto; margin-top:-25px;'>"; 
			$("#img").append(img_html); 


			// display the words in the popup
			var word_list =[]; 
			for (i = 0; i < data.words.length; i++) { 
				word_list.push(data.words[i]); 
			}
			console.log(word_list);   
			var html = ""; 
			$("#keyword_list").append("<ul id='navlist'></ul>");
			for (i = 0; i < data.words.length; i++) {
				html += "<div class='x'><span class='close'>&#10006;</span><li>"+ data.words[i] + "</li></div>"; 
				 
			}
			$("#keyword_list ul").append(html);

			// display a clear all button

			var clear_html = ""; 
			clear_html += "<input type='text' placeholder='clear keywords' id='clear'/>"; 

			$("#input_group").append(clear_html);
			$("#keyword_list").css('display', 'block');

			
			// listen for a delete specific keyword click and handle
			// the event
			$('.x .close').on('click', function() { 
				chrome.storage.local.clear(); 
				var word = $(this).closest('.x').find('li')[0].innerText; 

				// remove the elements from DOM
				$(this).closest('.x').remove(); 
				var new_word_list = []; 
				// if it's the first time, we're deleting a word since clicking
				if (del_data.length == 0) {
					for (i = 0; i < data.words.length; i++) {
						if (word != data.words[i]) {
							new_word_list.push(data.words[i]); 
						}
					}
					del_data = new_word_list;  
				}
				else {
					var output = []; 
					for (i = 0; i < del_data.length; i++) {
						if (word != del_data[i]) {
							output.push(del_data[i]); 
						}
					}
					del_data = output; 
				}
				if (!$('.x').length) {
					$("img").remove(); 
					var img_html = "<img src='inactive.png' style='margin-left:auto; margin-right:auto; margin-top:-25px;'>"; 
					$("#img").append(img_html); 
					$("#keyword_list").css('display', 'none'); 
					$("#navlist").remove(); 
					chrome.tabs.query(
						{currentWindow: true, active: true},
							function (tabArray) {
							chrome.pageAction.setIcon({tabId: tabArray[0].id, path: {'38': 'inactive.png'}}); 
						}
					)
				}
				chrome.storage.local.set({'words': output}); 
			});
			
			
		}
		else {
			$("img").remove(); 
			var img_html = "<img src='inactive.png' style='margin-left:auto; margin-right:auto; margin-top:-25px;'>"; 
			$("#img").append(img_html); 
			$("#keyword_list").css('display', 'none'); 
			$("#navlist").remove(); 
			chrome.tabs.query(
				{currentWindow: true, active: true},
					function (tabArray) {
						chrome.pageAction.setIcon({tabId: tabArray[0].id, path: {'38': 'inactive.png'}}); 
					}
			)
			
		}
	}); 


	
	function addKeyword(word) {
		console.log("added"); 
		counter++; 
		$("img").remove(); 
		var img_html = "<img src='toolbar_icon.png' style='margin-left:auto; margin-right:auto; margin-top:-25px;'>"; 
		$("#img").append(img_html); 
		chrome.tabs.query(
			{currentWindow: true, active: true},
			function (tabArray) {
				chrome.pageAction.setIcon({tabId: tabArray[0].id, path: {'38': 'toolbar_icon.png'}}); 
			}
		)
		//chrome.pageAction.setIcon({tabId: tab, path: 'toolbar_icon.png'});


		var word_list = []; 
		chrome.storage.local.get('words', function(data) {
			var del_data = []; 
			if (!$.isEmptyObject(data)) {
				for (i = 0; i < data.words.length; i++) { 
					word_list.push(data.words[i]); 
				}
			}
			// if the word doesn't already exist 
			if (word_list.indexOf(word.toLowerCase()) == -1) {
				word_list.push(word); 
				// add the word to local storage
				chrome.storage.local.set({'words': word_list}); 
				console.log("we just added a word"); 
			} 

			// listen for a delete specific keyword click and handle
			// the event
			$('.x .close').on('click', function() {
				console.log("delete"); 
				chrome.storage.local.clear(); 
				var word = $(this).closest('.x').find('li')[0].innerText; 

				if (counter == 1) {
					$("#keyword_list").css('display', 'none'); 
					$("#navlist").remove(); 
					$("img").remove(); 
					var img_html = "<img src='inactive.png' style='margin-left:auto; margin-right:auto; margin-top:-25px;'>"; 
					$("#img").append(img_html); 
					chrome.tabs.query(
						{currentWindow: true, active: true},
						function (tabArray) {
							chrome.pageAction.setIcon({tabId: tabArray[0].id, path: {'38': 'inactive.png'}}); 
						}
					)
					counter = 0; 
				}

				// remove the elements from DOM
				$(this).closest('.x').remove(); 
				var new_word_list = []; 
				// if it's the first time, we're deleting a word since clicking
				if (del_data.length == 0) {
					for (i = 0; i < data.words.length; i++) {
						if (word != data.words[i]) {
							new_word_list.push(data.words[i]); 
						}
					}
					del_data = new_word_list;  
				}
				else {
					var output = []; 
					for (i = 0; i < del_data.length; i++) {
						if (word != del_data[i]) {
							output.push(del_data[i]); 
						}
					}
					del_data = output; 
				}
				if (!$('.x').length) {
					$("#keyword_list").css('display', 'none'); 
					$("#navlist").remove(); 
					$("img").remove(); 
					var img_html = "<img src='inactive.png' style='margin-left:auto; margin-right:auto; margin-top:-25px;'>"; 
					$("#img").append(img_html); 

					chrome.tabs.query(
						{currentWindow: true, active: true},
						function (tabArray) {
							chrome.pageAction.setIcon({tabId: tabArray[0].id, path: {'38': 'inactive.png'}}); 
						}
					)

					counter = 0; 
				}
				
				chrome.storage.local.set({'words': output}); 
			});

		});

		$("#keyword_list").css('display', 'block');
		// display the added words in the popup 
		var html = ""; 
		var ul = $("#navlist"); 
		// adding additional keywords 
		if (ul.length) {
			var matches = $( 'ul#navlist' ).find( 'li:textEquals('+ word.toLowerCase() +') ' ); 
			if (!matches.length) {
				html += "<div class='x'><span class='close'>&#10006;</span><li>"+ word + "</li></div>"; 
				console.log(word); 
				$("#keyword_list ul").append(html); 
			}
		}
		// adding the first keyword
		else {
			html += "<ul id ='navlist'><div class='x' id ='delete'><span class='close'>&#10006;</span><li>"+ word + "</li></div></ul>"; 
			console.log(word); 
			$("#keyword_list").append(html);
		} 

		// clear the textbox
		$("#keywords").val(''); 


	} 

	// listen for enter keypress
	$("#keywords").keyup(function(event){
    	if(event.keyCode == 13){
    		var word = $("#keywords").val(); 
        	addKeyword(word); 
        	// signal to the background page that it's time to refresh
			//chrome.runtime.sendMessage({type:"refresh"});  	
    	}
	});

	function setDOMInfo(info) { 
		var html = info.stories; 
		if (html == 1) {
			$("#keyword_list").append("<ul id='navlist'>" + html + " story has been filtered from your news feed. </ul>");
		}
		else if (html > 1) {
			$("#keyword_list").append("<ul id='navlist'>" + html + " stories have been filtered from your news feed. </ul>");
		}
		
	}

	window.addEventListener('DOMContentLoaded', function() {
		chrome.tabs.query({
	        active: true,
	        currentWindow: true
    	}, function(tabs) {
	        /* ...and send a request for the DOM info... */
	        chrome.tabs.sendMessage(
	                tabs[0].id,
	                {from: 'home', subject: 'DOMInfo'},
	                /* ...also specifying a callback to be called 
	                 *    from the receiving end (content script) */
	                setDOMInfo);
    	});
	}); 

}); 

