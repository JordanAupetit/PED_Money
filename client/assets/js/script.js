$(".signup").click(function(){
	$("#signup").animate({top: "10%"});
	$("#back-signup").fadeIn();

})

$(".x,#back-signup").click(function(){
	$("#signup").animate({top: "-200%"});
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
	else if((psw.length)<1) // TODO set at 8
		{
		  $("#contenu").html("Mot de passe doit au moins contenir 8 caractères de longueur");
		  $('html, body').animate({scrollTop : 0},400);
		  return false;
		}
		
	else if(!(psw).match(repsw))
		{
		  $("#contenu").html("Vos mots de passe ne correspondent pas. Essayer à nouveau?");
		  $('html, body').animate({scrollTop : 0},400);
		  return false;
		} 
	else 
	   {
	      $("#signup").animate({top: "-100%"});
		  $("#back-signup").fadeOut();
	   }
});