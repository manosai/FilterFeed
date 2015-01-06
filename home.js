$("#keywords").keyup(function(event){
    if(event.keyCode == 13){
        $("#submit_button").click();
    }
});

function addKeyword() {
	console.log("success"); 
}