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
            if ($(this).attr('id') == 'radio-8Edit') {
                $('#descInfractionEdit').show();
            }
            else {
                $('#descInfractionEdit').hide();
            }
        });
    })
		
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

        if ($(this).prop('checked') == true) {
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
        $(document).ready(function () {
            $('#descInfractionEdit').hide();
            $('input[type="radio"]').click(function () {
                if ($(this).attr('id') == 'radio-4Edit') {
                    $('#descInfractionEdit').show();
                }
                else {
                    $('#descInfractionEdit').hide();
                }
            });
        })

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
            if (champ.length > 0){
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
                if (row.find('td[data-title="b_description"]').html() == "1") {
                    $('#radio-1Edit').prop('checked', true);
                    modal.find('#descInfractionEdit').val(" ");
                }
                else if (row.find('td[data-title="b_description"]').html() == "2") {
                    $('#radio-2Edit').prop('checked', true);
                    modal.find('#descInfractionEdit').val(" ");
                }
                else if (row.find('td[data-title="b_description"]').html() == "3") {
                    $('#radio-3Edit').prop('checked', true);
                    modal.find('#descInfractionEdit').val(" ");
                }
                else if (row.find('td[data-title="b_description"]').html() == "4") {
                    $('#radio-4Edit').prop('checked', true);
                    modal.find('#descInfractionEdit').val(" ");
                }
                else if (row.find('td[data-title="b_description"]').html() == "5") {
                    $('#radio-5Edit').prop('checked', true);
                    modal.find('#descInfractionEdit').val(" ");
                }
                else if (row.find('td[data-title="b_description"]').html() == "6") {
                    $('#radio-6Edit').prop('checked', true);
                    modal.find('#descInfractionEdit').val(" ");
                }
                else if (row.find('td[data-title="b_description"]').html() == "7") {
                    $('#radio-7Edit').prop('checked', true);
                    modal.find('#descInfractionEdit').val(" ");
                }
                else {
                    $('#radio-8Edit').prop('checked', true);
                    modal.find('#descInfractionEdit').val(row.find('td[data-title="b_description"]').html());
                }
            }
        );
        constat = row.find('td[data-title="constat_id"]').html();
        videoConstat();
    });


        // // Transaction error callback
        // //
        // function errorCB(err) {
        //     alert("Error processing SQL: "+err.code);
        // }

        // Transaction success callback
        //
        // function successCB() {
        //     db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
        //     db.transaction(queryDB, errorCB);
        // }




        function editRow(tx){
            radioValue();
            detailValue();
            function radioValue(){
                if ($('#radio-1Edit').is(':checked') || $('#radio-2Edit').is(':checked') || $('#radio-3Edit').is(':checked') || $('#radio-4Edit').is(':checked') || $('#radio-5Edit').is(':checked') || $('#radio-6Edit').is(':checked') || $('#radio-7Edit').is(':checked')){
                    $('#radioCache').val($("input:checked").val());
                }
                else if ($('#radio-8Edit').is(':checked')){
                    $('#radioCache').val($("#descInfractionEdit").val());
                }};

            function detailValue(){

                if ($('#checkbox-nested-text1').is(':checked')){
                    $('#detailCache').val(true);
                }
                else {
                    console.log('allo');
                    $('#detailCache').val(false);
                    $('#faitTxt2Edit').val(" ");
                }
            }

            tx.executeSql('UPDATE DEMO SET a_nom="'+$("#nomTxtEdit").val()+
                '", a_adresse ="'+$("#adresseCorEdit").val()+
                '", a_telephone1 ="'+$("#telResEdit").val()+
                '", a_telephone2 ="'+$("#telTraEdit").val()+
                '", c_endroit ="'+$("#endroitTxtEdit").val()+
                '", c_description ="'+$("#adresseTxt_cEdit").val()+
                '", e_details ="'+$("#faitTxtEdit").val()+
                '", e_suite ="'+$("#detailCache").val()+
                '", e_detailsSuite ="'+$("#faitTxt2Edit").val()+
                '", note ="'+$("#noteTxtEdit").val()+
                '", b_description="'+$("#radioCache").val()+
                '", user_id ="'+$("#matriculeNum").val()+ '" WHERE id = '
                + $("#idCache").html(), [], null, errorCB);
            $('#exampleModal').modal('hide');

        }



		
        function goEdit() {
            db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
            db.transaction(editRow, errorCB);
        }




