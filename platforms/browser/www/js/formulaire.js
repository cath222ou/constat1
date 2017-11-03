// $(function(){
// 	$('#app').hide();
// });



 // gestion des tabs
$(function(){
	$("#tabs").tabs(
		{active:0}
	)});
	
	
	
	//accordion
$( function() {
		$( "#accordion" ).accordion(
		{active: 4,
		heightStyle: "content",
		autoHeight: false
		}
		);
	} );
	
	
	//selection choix infraction
	$( function() {
		$( "radio" ).checkboxradio();
	} );
	
	
	//Afficher nombre de caractères restants
	var restants;
	function reste(texte){
			var restants=2-texte.length;
			document.getElementById('caracteres').innerHTML=restants;
			if(restants==0){
					//Coche le checkbox
					$('#checkbox-nested-text').attr('checked',true);
					//ajoute un champ texte supplémentaire
                	$('#faitTxt2').toggleClass('hidden');
			}
	}

	//lance la fonction verifCheck lorsqu'une action est faite sur checkbox
	$("#checkbox-nested-text").on("change", verifCheck);
	function verifCheck(){
		//Si checkbox est coché
		if($('#checkbox-nested-text').attr('checked',true)){
			//affiche textarea
            $('#faitTxt2').toggleClass('hidden');
		}
		else{
			//n'affiche pas textarea
            $('#faitTxt2').toggleClass('hidden');
		}
	}




	//Ajuster taille textarea selon texte
	$('.auto-text-area').on('keyup',function(){
		$(this).css('height','auto');
		$(this).height(this.scrollHeight);
	});
		
	

	
	//Popup pour entrer son matricule
	$( function() {
		
	$( "#dialog" ).dialog({
	dialogClass: "no-close",
	buttons: 
		{
		"OK": addmatricule,
		}
	
	});
	});

	function addmatricule(){
		$('#matriculeNum').append($('#matriculeValue').val());
		$( this ).dialog( "close" );
		$('#app').show();
		
	};
  	
		
		

	//Affichage date et heure dans formulaire
	var myVar=setInterval(function(){myTimer()},1000);
	
	function myTimer()
	{
	var d=new Date();
	var h=d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
	var j=d.toLocaleDateString();
	document.getElementById("heurediv").innerHTML=h;
	document.getElementById("heureSignature").innerHTML=j;
	document.getElementById("datediv").innerHTML=j;
	}
	
	//Afficher champs texte si "Autre" est sélectionné
	$(document).ready(function() {
		$('#descInfraction').hide(); ;
		$('input[type="radio"]').click(function() {
			if($(this).attr('id') == 'radio-4') {
					$('#descInfraction').show();
			}
			else {
					$('#descInfraction').hide();
			}
		});
	});
	