//Fichier pour la création du formulaire

 $(function(){
 	$('#app').hide();
 });



    // gestion des tabs
    $(function () {
        $("#tabs").tabs(
            {active: 0}
        )
    });


    //accordion
    $(function () {
        $("#accordion").accordion(
            {
                active: 3,
                heightStyle: "content",
                autoHeight: false
            }
        );
    });


    //Gestion des checkbox pour la selection des choix d'infraction
    $(function () {
        $("radio").checkboxradio();
    });

//Débuter un nouveau constat en vidant tout les champs
    function nouvConstat(){
        $('#enrVideo').addClass('hidden');
        //effacer les valeurs entrées
        $('#nomTxt').val('');
        $('#adresseCor').val('');
        $('#telRes').val('');
        $('#telTra').val('');
        $('#descInfraction').val('');
        $('#endroitTxt').val('');
        $('#noCivTxt_c').val('');
        $('#rueTxt_c').val('');
        $('#descLieux').val('');
        $('#faitTxt').val('');
        $('#faitTxt2').val('');
        $('#noteTxt').val('');
        $('input[type=radio]').prop('checked',false);
        $('#descInfraction').hide();
        //Retour à l'accordéon initial
        $( "#accordion" ).accordion(
            {active:1}
        );
    }


    //Afficher nombre de caractères restants pour le champs texte de faits et gestes

   function reste(texte) {
        var restants = 950 - texte.length;
        document.getElementById('caracteres').innerHTML = restants;
        //Si le nombre de caractères restants est égale à 0
        if (restants <= 0) {
            //Coche le checkbox
            $('#checkbox-nested-text').attr('checked', true);
            //ajoute un champ texte supplémentaire
            $('#faitTxt2').removeClass('hidden');
        }
        //Sinon décocher la case et cacher la division du champ texte
        else{
            $('#checkbox-nested-text').attr('checked', false);
            $('#faitTxt2').addClass('hidden');
		}
    };

    //lance la fonction verifCheck lorsqu'une action est faite sur checkbox
    $(document).on("change", '#checkbox-nested-text', function () {
        //Si checkbox est coché
        if ($(this).prop('checked') === true) {
            //affiche le champ texte
            $('#faitTxt2').toggleClass('hidden');
        }
        //Sinon cacher le champ texte
        else {
            //n'affiche pas textarea
            $('#faitTxt2').toggleClass('hidden');
        }
    });


    //Ajuster taille du champ texte selon le texte
    $('.auto-text-area').on('keyup', function () {
        $(this).css('height', 'auto');
        $(this).height(this.scrollHeight);
    });


    //Popup pour entrer son matricule à l'ouverture de l'application
    $(function () {
        $("#dialog1").dialog({
            dialogClass: "no-close",
            buttons:
                {
                    "OK": addmatricule
                }
        });
    });

	//Entrer son matricule
    function addmatricule() {
        //donner aux champs la valeur du matricule
        $('#matriculeNum').text($("#matriculeMenu option:selected").val());
        $('#matAgent').val($("#matriculeMenu option:selected").val());
        //donner à ce champ la valeur de uuid de l'appareil
        $('#uuidApp').val(uuidValue);
        //Fermer la modal de matricule
        $(this).dialog("close");
        //Montrer la division du formulaire
        $('#app').show();
    };


    //Affichage date et heure dans formulaire
    var myVar = setInterval(function () {
        myTimer()
    }, 1000);

    function myTimer() {
        var d = new Date();
        var h = d.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
        var j = d.toLocaleDateString();
        document.getElementById("heurediv").innerHTML = h;
        document.getElementById("dateSignature").innerHTML = j;
        document.getElementById("datediv").innerHTML = j;
    }

    //Afficher champs texte si "Autre" est sélectionné
    $(document).ready(function () {
        $('#descInfraction').hide();
        $('input[type="radio"]').click(function () {
            if ($(this).attr('id') === 'radio-8') {
                $('#descInfraction').show();
            }
            else {
                $('#descInfraction').hide();
            }
        });
    });


    //Fermer l'Application lorsque l'on clique sur le bouton Fermer application
function showConfirm() {
    navigator.notification.confirm(
        'Êtes-vous certain de vouloir fermer l\'application?',  // message
        exitFromApp,              // callback to invoke with index of button pressed
        'Fermeture',            // title
        'Annuler,OK'         // buttonLabels
    );
}


function exitFromApp(buttonIndex) {
    if (buttonIndex==2){
        navigator.app.exitApp();
    }
    }

