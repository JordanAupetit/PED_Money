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
		  $("#contenu").html("Veulliez remplir tous les champs");
		  $('html, body').animate({scrollTop : 0},400);
		  return false;
		}
	// else if(validateEmail(email) == false)
	else if(false)
		{
		  $("#contenu").html("Votre email est incorrect");
		  $('html, body').animate({scrollTop : 0},400);
		  return false;
		}
	else if((psw.length)<-10000000000000000000000000000000000)
		{
		  $("#contenu").html("Mot de passe doit au moins contenir 8 caracteres de longueur");
		  $('html, body').animate({scrollTop : 0},400);
		  return false;
		}
		
	else if(!(psw).match(repsw))
		{
		  $("#contenu").html("Vos mots de passe ne concorde pas. Essayer a nouveau");
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