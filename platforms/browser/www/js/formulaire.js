//Fichier pour la création du formulaire

 $(function(){
     $('#app').fadeOut('slow');

     // gestion des tabs
     $("#tabs").tabs(
         {active: 0}
     );
     //accordion
     $("#accordion").accordion(
         {
             active: 2,//Était à 3 mais comme il y a une valeur requise dans ce tab, je crois qu'on devrait commencer par celle-ci
             heightStyle: "content",
             autoHeight: false
         }
     );
     //Gestion des checkbox pour la selection des choix d'infraction
     $("radio").checkboxradio();

    //Popup pour entrer son matricule à l'ouverture de l'application
     $("#dialog1").dialog({
         dialogClass: "no-close",
         buttons:
         {
             "OK": addmatricule
         }
     });

    //Afficher champs texte si "Autre" est sélectionné
     $('#descInfraction').hide();
     $('input[type="radio"]').click(function () {
         //Si la case Autre est coché, afficher le champs texte
         if ($(this).attr('value') === 'Autre' && $(this).is(':checked')) {
             $('#descInfraction').show();
         }
         //Si la case Autre est décoché, cacher le champs texte
         else if ($(this).attr('value') !== 'Autre' && $(!this.checked)){
             $('#descInfraction').hide();
         }
     });
 });

//Vider le champ du nom de la rue et le matricule lorsque l'utilisateur clique pour changer le numéro civique (SEECTION C)
$('#noCivTxt_c').click(function(){
    $('#rueTxt_c').val('');
    $('#rueTxt_c').removeData( "matricule" );
    var matriculeRole = $('#rueTxt_c').data("matricule");
    console.log(matriculeRole)
    }
);

    //Débuter un nouveau constat en vidant tout les champs
    function nouvConstat(){
        $('#listeVideo').empty();
        $('#enrVideo').fadeOut('slow');
        $('#nouvConstat').fadeOut('slow');
        $('button[name="btnEnregistreFormulaire"]').fadeIn('slow');
        //effacer les valeurs entrées
        $('#nomTxt').val('');
        $('#adresseCor').val('');
        $('#telRes').val('');
        $('#telTra').val('');
        $('#descInfraction').val('').hide();
        $('#endroitTxt').val('');
        $('#noCivTxt_c').val('').attr('data-matricule','');
        $('#rueTxt_c').val('');
        $('#descLieux').val('');
        $('#faitTxt').val('');
        $('#faitTxt2').val('');
        $('#noteTxt').val('');
        $('input[type=radio]').prop('checked',false);
        //Retour à l'accordéon initial
        $( "#accordion" ).accordion(
            {active:2}//Etait à 1, je l'ai mis identique à l'initialisation dans le document.ready
        );
        $('#tabs').tabs('option','active',0);//Remet à la première tab
    }

    //Afficher nombre de caractères restants pour le champs texte de faits et gestes

    function reste(texte) {
        var restants = 950 - texte.length;

        //document.getElementById('caracteres').innerHTML = restants; --Même chose mais en jquery :)
        $('#caracteres').html(restants);

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
    }

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

	//Entrer son matricule
    function addmatricule() {
        //donner aux champs la valeur du matricule
        var matriculeMenu = $("#matriculeMenu option:selected");//Évite au navigateur de parser 2 fois de suite pour trouver la valeur
        $('#matriculeNum').text(matriculeMenu.text());
        $('#matAgent').val(matriculeMenu.val());
        //donner à ce champ la valeur de uuid de l'appareil
        $('#uuidApp').val(uuidValue);
        //Fermer la modal de matricule
        $(this).dialog("close");
        //Montrer la division du formulaire
        $('#app').fadeIn('slow');
    }

    //Affichage date et heure dans formulaire
    var myVar = setInterval(function () {
        myTimer()
    }, 1000);

    function myTimer() {
        var d = new Date();
        var h = d.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
        var j = d.toLocaleDateString();
        $("#heurediv").html(h);
        $("#dateSignature").html(j);
        $("#datediv").html(j);
    }

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
            $('#app').hide();
            //navigator.app.exitApp(); Ne fonctionne pas avec iOS, seulement avec Android. Pour utiliser avec iOS, il faut un plugin
            $("#dialog1").dialog({
                dialogClass: "no-close",
                modal:true,
                buttons:
                {
                    "OK": addmatricule
                }
            });
        }
    }

