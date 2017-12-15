// $(function(){
// 	$('#app').hide();
// });



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

    $(function () {
        $("#accordion1").accordion(
            {
                active: 4,
                heightStyle: "content",
                autoHeight: false
            }
        );
    });


    //selection choix infraction
    $(function () {
        $("radio").checkboxradio();
    });

//Débuter un nouveau constat
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






    //Afficher nombre de caractères restants

   function reste(texte) {
        var restants = 2 - texte.length;
        document.getElementById('caracteres').innerHTML = restants;
        if (restants <= 0) {
            //Coche le checkbox
            $('#checkbox-nested-text').attr('checked', true);
            //ajoute un champ texte supplémentaire
            $('#faitTxt2').removeClass('hidden');
        }
        else{
            $('#checkbox-nested-text').attr('checked', false);
            $('#faitTxt2').addClass('hidden');
		}
    }

    //lance la fonction verifCheck lorsqu'une action est faite sur checkbox
    $(document).on("change", '#checkbox-nested-text', function () {
        //Si checkbox est coché

        if ($(this).prop('checked') === true) {
            //affiche textarea
            $('#faitTxt2').toggleClass('hidden');

        }
        else {
            //n'affiche pas textarea
            $('#faitTxt2').toggleClass('hidden');
        }
    })


    //Ajuster taille textarea selon texte
    $('.auto-text-area').on('keyup', function () {
        $(this).css('height', 'auto');
        $(this).height(this.scrollHeight);
    });


    //Popup pour entrer son matricule
    $(function () {

        $("#dialog1").dialog({
            dialogClass: "no-close",
            buttons:
                {
                    "OK": addmatricule,
                }

        });
    });
	//Entrer son matricule
    function addmatricule() {
        $('#matriculeNum').text($("#matriculeMenu option:selected").val());
        $('#matAgent').val($("#matriculeMenu option:selected").val());
        $('#uuidApp').val(uuidValue);
        $(this).dialog("close");
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
    })


