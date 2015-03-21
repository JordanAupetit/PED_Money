$(".signup").click(function(){
	$("#signup").animate({top: "10%"});
	$("#back-signup").fadeIn();

})

$(".x, #back-signup").click(function(){
	$("#signup").animate({top: "-100%"});
	$("#back-signup").fadeOut();
})


$("#sign").click(function(){

	var username = $("#username").val();
	var first = $("#first").val();
	var last = $("#last").val();
	var email = $("#email").val();
	var psw = $("#psw").val();
	var repsw = $("#repsw").val();
	
	if( username == '' || first == '' || last == '' || email == '' || psw == '' || repsw == '')
		{
		  $("#contenu").html("Fill in all required entry fields");
		  $('html, body').animate({scrollTop : 0},400);
		  return false;
		}
	else if(validateEmail(email) == false)
		{
		  $("#contenu").html(" Incorrect email ");
		  $('html, body').animate({scrollTop : 0},400);
		  return false;
		}
	else if((psw.length)<5)
		{
		  $("#contenu").html("Password must contain at least 8 letter");
		  $('html, body').animate({scrollTop : 0},400);
		  return false;
		}
		
	else if(!(psw).match(repsw))
		{
		  $("#contenu").html("Password does not match");
		  $('html, body').animate({scrollTop : 0},400);
		  return false;
		} 
	else 
	   {
	      $("#signup").animate({top: "-200%"});
		  $("#back-signup").fadeOut();
		  $('#signup-form').reset();
		  return false;
	   }
});


function validateEmail(email) { 
    var re = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return re.test(email);
} 