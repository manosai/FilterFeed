$(document).ready(function() {

	$("#submit_button").click(function (e) {
		console.log("success"); 

		// display the added words in the popup 


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

