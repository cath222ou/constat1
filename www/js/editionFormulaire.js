var currentRow;
var constat;

// gestion des tabs
$(function () {
    $("#tabsEdit").tabs(
        {active: 0}
    )
});

    //Afficher champs texte si "Autre" est sélectionné
    $(document).ready(function () {
        $('#descInfractionEdit').hide();
        $('input[type="radio"]').click(function () {
            if ($(this).attr('id') === 'radio-8Edit') {
                $('#descInfractionEdit').show();
            }
            else {
                $('#descInfractionEdit').hide();
            }
        });
    });
		
	// Édition de la BD
	 	$('#exampleModal').modal({show:false})//.


    //Afficher nombre de caractères restants
    var restants1

    function resteEdit(texte1) {

        var restants1 = 2 - texte1.length;
        document.getElementById('caracteresEdit').innerHTML = restants1;
        if (restants1 <= 0) {
            //Coche le checkbox
            $('#checkbox-nested-text1').attr('checked', true);
            //ajoute un champ texte supplémentaire
            $('#faitTxt2Edit').removeClass('hidden');

        }
        else{
            $('#checkbox-nested-text1').attr('checked', false);
            $('#faitTxt2Edit').addClass('hidden');
        }
    }


    //lance la fonction verifCheck lorsqu'une action est faite sur checkbox
    $(document).on("change", '#checkbox-nested-text1', function () {
        //Si checkbox est coché

        if ($(this).prop('checked') === true) {
            //affiche textarea
            $('#faitTxt2Edit').removeClass('hidden');
        }
        else {
            //n'affiche pas textarea
            $('#faitTxt2Edit').addClass('hidden');
        }
    })

    //Remplir les champs du modal selon les informations de la ligne sélectionnée
    $(document).on('show.bs.modal', "#exampleModal", function (event) {

        var row = $(event.relatedTarget).closest('tr');
        var modal = $(this);

        modal.find('.modal-title').text('Édition du numéro de dossier' + ' ' + row.find('td[data-title="user_id"]').html() + "-" + (row.find('td[data-title="b_date"]').html()).substr((row.find('td[data-title="b_date"]').html()).length - 2) + "-" + row.find('td[data-title="id"]').html());
        modal.find('#no_dossierEdit').text(row.find('td[data-title="user_id"]').html() + "-" + (row.find('td[data-title="b_date"]').html()).substr((row.find('td[data-title="b_date"]').html()).length - 2) + "-" + row.find('td[data-title="id"]').html());
        modal.find('#nomTxtEdit').val(row.find('td[data-title="a_nom"]').html());
        modal.find('#adresseCorEdit').val(row.find('td[data-title="a_adresse"]').html());
        modal.find('#telResEdit').val(row.find('td[data-title="a_telephone1"]').html());
        modal.find('#telTraEdit').val(row.find('td[data-title="a_telephone2"]').html());
        modal.find('#datedivEdit').text(row.find('td[data-title="b_date"]').html());
        modal.find('#heuredivEdit').text(row.find('td[data-title="b_heure"]').html());
        modal.find('#endroitTxtEdit').val(row.find('td[data-title="c_endroit"]').html());
        modal.find('#noCivTxtEdit_c').val(row.find('td[data-title="c_nociv"]').html());
        modal.find('#rueTxtEdit_c').val(row.find('td[data-title="c_rue"]').html());
        modal.find('#descLieuxEdit').val(row.find('td[data-title="c_description"]').html());
        modal.find('#faitTxtEdit').val(row.find('td[data-title="e_details"]').html());
        modal.find('#faitTxt2Edit').val(row.find('td[data-title="e_detailsSuite"]').html());
            //cocher la case si texte valeur dans le deuxième champ texte
            var champ = $('#faitTxt2Edit').val();
            if (champ.length > 0 && champ !== 'null'){
                $('#checkbox-nested-text1').attr('checked', true);
                $('#faitTxt2Edit').removeClass('hidden');
                }
            else {
                $('#checkbox-nested-text1').attr('checked', false);
                $('#faitTxt2Edit').addClass('hidden');
            }
        modal.find('#noteTxtEdit').val(row.find('td[data-title="note"]').html());
        modal.find('#matriculeNum').text(row.find('td[data-title="user_id"]').html());
        modal.find('#dateSignatureEdit').text(row.find('td[data-title="b_date"]').html());
        modal.find('#idCache').text(row.find('td[data-title="id"]').html());
        modal.find('#detailCache').text(row.find('td[data-title="e_suite"]').html());
        modal.find('#descInfCheckEdit').val(
            function verifCheck() {
                $('#descInfractionEdit').hide();
                if (row.find('td[data-title="b_description"]').html() === "1") {
                    $('#radio-1Edit').prop('checked', true);
                    modal.find('#descInfractionEdit').val(" ");
                }
                else if (row.find('td[data-title="b_description"]').html() === "2") {
                    $('#radio-2Edit').prop('checked', true);
                    modal.find('#descInfractionEdit').val(" ");
                }
                else if (row.find('td[data-title="b_description"]').html() === "3") {
                    $('#radio-3Edit').prop('checked', true);
                    modal.find('#descInfractionEdit').val(" ");
                }
                else if (row.find('td[data-title="b_description"]').html() === "4") {
                    $('#radio-4Edit').prop('checked', true);
                    modal.find('#descInfractionEdit').val(" ");
                }
                else if (row.find('td[data-title="b_description"]').html() === "5") {
                    $('#radio-5Edit').prop('checked', true);
                    modal.find('#descInfractionEdit').val(" ");
                }
                else if (row.find('td[data-title="b_description"]').html() === "6") {
                    $('#radio-6Edit').prop('checked', true);
                    modal.find('#descInfractionEdit').val(" ");
                }
                else if (row.find('td[data-title="b_description"]').html() === "7") {
                    $('#radio-7Edit').prop('checked', true);
                    modal.find('#descInfractionEdit').val(" ");
                }
                else {
                    $('#radio-8Edit').prop('checked', true);
                    modal.find('#descInfractionEdit').val(row.find('td[data-title="b_description"]').html());
                    $('#descInfractionEdit').show();
                }

            }
        );

        constat = row.find('td[data-title="constat_id"]').html();
        videoConstat();
    });




        function editRow(tx){

            if ($('#radio-1Edit').is(':checked') || $('#radio-2Edit').is(':checked') || $('#radio-3Edit').is(':checked')|| $('#radio-4Edit').is(':checked')|| $('#radio-5Edit').is(':checked')|| $('#radio-6Edit').is(':checked')|| $('#radio-7Edit').is(':checked')){
                descInfraction = $("input:checked").val();
            }
            else {
                descInfraction = $("#descInfractionEdit").val();
            }


                if ($('#checkbox-nested-text1').is(':checked')){
                    $('#detailCache').val(true);
                }
                else {
                    $('#detailCache').val(false);
                    $('#faitTxt2Edit').val("null");
                }

                validAEdit();


            tx.executeSql('UPDATE DEMO SET a_nom="'+$("#nomTxtEdit").val()+
                '", a_adresse ="'+$("#adresseCorEdit").val()+
                '", a_telephone1 ="'+$("#telResEdit").val()+
                '", a_telephone2 ="'+$("#telTraEdit").val()+
                '", b_description="'+ descInfraction +
                '", c_endroit ="'+$("#endroitTxtEdit").val()+
                '", c_nociv ="'+$("#noCivTxtEdit_c").val()+
                '", c_rue ="'+$("#rueTxtEdit_c").val()+
                '", adresse_id ="'+$("#rueTxtEdit_c").data("matricule")+
                '", c_description ="'+$('#descLieuxEdit').val()+
                '", e_details ="'+$("#faitTxtEdit").val()+
                '", e_suite ="'+$("#detailCache").val()+
                '", e_detailsSuite ="'+$("#faitTxt2Edit").val()+
                '", note ="'+$("#noteTxtEdit").val()+
                '" WHERE constat_id ='
                + constat, [], queryDB, errorCB);

            $('#exampleModal').modal('hide');

        }


		
        function goEdit() {
            validA();

            //Vérifier les champs obligatoire
            var nbr = 0;
            var radioNbr =0;
            var a = $('#accordion1');

            //Compter le nombre de description d'infraction sélectionné (1 ou 0)
            a.find(".radio-input").each(function() {
                //Si un radio box est sélectionné, augmenter la radioNbr de 1
                if(( $(this).is(':checked') && $(this).attr('id')!== 'radio-8Edit') || ($(this).is(':checked') && $(this).attr('id')=== 'radio-8Edit' && $('#descInfractionEdit').val() !== "")){
                    radioNbr = radioNbr + 1;
                }
            });
            // Vérification qu'il y a une description d'infraction sélectionnée
            if (radioNbr === 0 ){
                if($('#radio-8Edit').is(':checked')){
                    $('#bEdit').addClass("ChampsObligatoire");
                    $('#descInfractionEdit').addClass("divObligatoire");
                }
                else {
                    $('#bEdit').addClass("ChampsObligatoire");
                    $('#descInfCheckEdit').addClass("divObligatoire");
                }
            }
            else {
                $('#bEdit').removeClass("ChampsObligatoire");
                $('#descInfCheckEdit').removeClass("divObligatoire");
                $('#descInfractionEdit').removeClass("divObligatoire");
            }


            //Vérification que les champs textes obligatoires sont remplis
            $(".obligatoireEdit").each(function() {
                if ($(this).val() === "null" || $(this).val() === " " || $(this).val() === "") {
                    nbr = nbr +1;

                    $(this).css("border", "3px solid red");
                    $(this).closest('.parent').prev().addClass("ChampsObligatoire");

                }
                else{
                    $(this).closest('.parent').prev().removeClass("ChampsObligatoire");
                    $(this).css("border", "");
                }
            });

            //Si un des champs obligatoires n'est pas remplis ou aucun radio n'est sélectionné
            if (nbr > 0 || radioNbr === 0){
                console.log(nbr);
                console.log(radioNbr);
                alert('Des champs obligatoires ne sont pas remplis');
            }

            //sinon lance la transaction insertDB pour insérer les données dans la table DEMO
            else{

                db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
                db.transaction(editRow, errorCB);
            }
        }

//Autocomplete d'adresse requête en édition

function selectNoCivEdit(){
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(selectNoCivEditSucces, errorCB);
}

function selectNoCivEditSucces(tx, results){
    tx.executeSql('SELECT * FROM ADRESSE WHERE nocivique='+$('#noCivTxtEdit_c').val(),[],function(tx, results){nomRueSelectEdit(tx, results)}, errorCB)

}

function nomRueSelectEdit(tx, results){
    nomRueResult = [];
    var len = results.rows.length;
    for (var i = 0; i < len; i++) {
        nomRueResult.push({value: results.rows.item(i).adresse_id, label: results.rows.item(i).adresse});
    }
    // Autocomplete Jquery
    $("#rueTxtEdit_c").autocomplete({
        source: nomRueResult,
        minLength: 2,
        select: function(event, ui) {
            event.preventDefault();
            $("#rueTxtEdit_c").val(ui.item.label);
            $('#rueTxtEdit_c').data("matricule",ui.item.value);
        }
    });
}





