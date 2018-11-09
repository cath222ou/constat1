//Fichier pour la partie d'édition du formulaire (lorsque l'on clique sur Modifier)

var constat;

$("#noCivTxtEdit_c").prop("readonly", true);
$("#rueTxtEdit_c").prop("readonly", true);

// gestion des tabs dans le modal d'édition des constats
$(function () {
    //Gestion des accordions
    $("#tabsEdit").tabs(
        {active: 0}
    );
    $("#accordion1").accordion(
        {
            active: 1,
            heightStyle: "content",
            autoHeight: false
        }
    );
    // Modal d'édition de la BD
    $('#exampleModal').modal({
        show:false
    });

    //Afficher champs texte si "Autre" est sélectionné
    $('#descInfractionEdit').hide();
    $('input[class="radio-input edit"]').click(function () {
        //Si la case Autre est coché, afficher le champs texte
        if ($(this).attr('value') === 'Autre' && $(this).is(':checked')) {
            $('#descInfractionEdit').show();
        }
        //Si la case Autre est décoché, cacher le champs texte
        else if ($(this).attr('value') !== 'Autre' && $(!this.checked)){
            $('#descInfractionEdit').hide();
        }
    });

});

//Découcher toutes les checkbox du modal d'édition
function decocherCheckbox() {
    $('.radio-input.edit:checkbox').each(function () {
        $(this).prop('checked', false);
    })
}



    //Afficher nombre de caractères restants
    function resteEdit(texte1) {

        var restants1 = 950 - texte1.length;
        document.getElementById('caracteresEdit').innerHTML = restants1;
        //Si le nombre de caractère restant est égale à 0
        if (restants1 <= 0) {
            //Coche le checkbox
            $('#checkbox-nested-text1').attr('checked', true);
            //Rendre visible le champ texte supplémentaire
            $('#faitTxt2Edit').removeClass('hidden');

        }

        else{
            //Sinon ne pas cocher la case
            $('#checkbox-nested-text1').attr('checked', false);
            //Cacher le champs texte additionnelle
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
    });

    //Remplir les champs du modal selon les informations de la ligne sélectionnée
    $(document).on('show.bs.modal', "#constatModalEdit", function (event) {

        var row = $(event.relatedTarget).closest('tr');
        var modal = $(this);
        $('#idCache').val(row.find('td[data-desc="constat_id"]').html());
        //Donner aux différents champs la valeur des données de la ligne de la table sélectionnée
        modal.find('.modal-title').text('Édition du constat ' + row.find('td[data-desc="constat_id"]').html());
        modal.find('#nomTxtEdit').val(row.find('td[data-desc="a_nom"]').html());
        modal.find('#adresseCorEdit').val(row.find('td[data-desc="a_adresse"]').html());
        modal.find('#telResEdit').val(row.find('td[data-desc="a_telephone1"]').html());
        modal.find('#telTraEdit').val(row.find('td[data-desc="a_telephone2"]').html());
        modal.find('#datedivEdit').text(row.find('td[data-desc="b_date"]').html());
        modal.find('#heuredivEdit').text(row.find('td[data-desc="b_heure"]').html());
        modal.find('#endroitTxtEdit').val(row.find('td[data-desc="c_endroit"]').html());
        modal.find('#noCivTxtEdit_c').val(row.find('td[data-desc="c_nociv"]').html());
        modal.find('#rueTxtEdit_c').val(row.find('td[data-desc="c_rue"]').html());
        modal.find('#descLieuxEdit').val(row.find('td[data-desc="c_description"]').html());
        modal.find('#descLieuxEdit').val(row.find('td[data-desc="c_description_autre"]').html());
        modal.find('#faitTxtEdit').val(row.find('td[data-desc="e_details"]').html());
        modal.find('#faitTxt2Edit').val(row.find('td[data-desc="e_detailsSuite"]').html());
        modal.find('#noCivTxtEdit_c').attr('matricule',row.find('td[data-desc="adresse_id"]').html());
            //cocher la case si texte valeur dans le deuxième champ texte
            var champ = $('#faitTxt2Edit').val();
            if (champ.length > 1 && champ !== 'null'){
                $('#checkbox-nested-text1').attr('checked', true);
                $('#faitTxt2Edit').removeClass('hidden');
                }
            else {
                $('#checkbox-nested-text1').attr('checked', false);
                $('#faitTxt2Edit').addClass('hidden');
            }
        modal.find('#noteTxtEdit').val(row.find('td[data-desc="note"]').html());
        modal.find('#matriculeNum').text(row.find('td[data-desc="user_id"]').html());
        modal.find('#dateSignatureEdit').text(row.find('td[data-desc="b_date"]').html());
        modal.find('#idCache').text(row.find('td[data-desc="id"]').html());
        modal.find('#detailCache').text(row.find('td[data-desc="e_suite"]').html());
        modal.find('#descInfCheckEdit').val(

            // Vérifier quel radiobox est coché
            function verifCheck(){
                $('#descInfractionEdit').hide();
                //Exploser les valeurs de description infraction dans une liste
                var descValue = row.find('td[data-desc="b_description"]').text();
                var descListValue = descValue.split(',');

                //Pour chaque valeur de checkbox, vérifier si le constat inclu cette valeur
                $('.radio-input.edit:radio').each(function(){
                    var checkboxValue = $(this).val();
                        //Si Autre est coché, afficher le champs texte et donner la valeur de la colonne b_description_autre
                        if (descListValue.includes('Autre')){
                            modal.find('#descInfractionEdit').val(row.find('td[data-desc="b_description_autre"]').html());
                            $('#descInfractionEdit').show();
                        }
                        //Cocher les cases selon les valeurs de la colonne b_description
                        if (descListValue.includes(checkboxValue)){
                            $('#radio-'+checkboxValue+'Edit').prop('checked', true);
                        }
                });
            }
        );
        // donner à la variable constat la valeur du constat_id de la ligne sélectionnée
        constat = row.find('td[data-desc="constat_id"]').html();
        //Lancer la fonction
        videoConstat();
    });



        //Lorsque l'on clique sur enregistrer, faire la modification sur la table
        function editRow(tx){

            var descInfraction = [];
            var descInfractionAutre = null;

            //Donner à la variable descInfraction les valeurs de 1 à 7 selon les checkbox sélectionnés
            $('.radio-input:radio:checked').each(function(){
                var checkboxValue = $(this).val();
                if(checkboxValue == 'Autre'){
                    descInfractionAutre= ($("#descInfractionEdit").val());
                }
                descInfraction.push(checkboxValue);
            });

            // Si la case est coché, donner la valeur true
            if ($('#checkbox-nested-text1').is(':checked')){
                $('#detailCache').val(true);
            }
            //Sinon, donner la valeur false et au champ texte la valeur null
            else {
                $('#detailCache').val(false);
                $('#faitTxt2Edit').val("null");
            }

            // lancer la fonction suivant pour donner aux champs vide la valeur null
            validAEdit();

            //Modifier les valeurs des champs de la table DEMO où le constat est égale à celui de la ligne sélecionnée
            ///TODO parametrized ->
            tx.executeSql('UPDATE constats SET a_nom="'+$("#nomTxtEdit").val()+
                '", a_adresse ="'+$("#adresseCorEdit").val()+
                '", a_telephone1 ="'+$("#telResEdit").val()+
                '", a_telephone2 ="'+$("#telTraEdit").val()+
                '", b_description="'+ descInfraction +
                '", b_description_autre="'+ descInfractionAutre +
                '", c_endroit ="'+$("#endroitTxtEdit").val()+
                '", c_nociv ="'+$("#noCivTxtEdit_c").val()+
                '", c_rue ="'+$("#rueTxtEdit_c").val()+
                // '", adresse_id ="'+$("#rueTxtEdit_c").data("matricule")+
                '", c_description ="'+$('#descLieuxEdit').val()+
                '", e_details ="'+$("#faitTxtEdit").val()+
                '", e_suite ="'+$("#detailCache").val()+
                '", e_detailsSuite ="'+$("#faitTxt2Edit").val()+
                '", note ="'+$("#noteTxtEdit").val()+
                '" WHERE constat_id ='
                + constat, [], errorCB);

            //Cacher le modal
            $('#constatModalEdit').modal('hide');
            //Décocher tous les checkbox
            decocherCheckbox();

        }

    //    Rafraichir la table d'édition lorsque l'utilisateur appuie du Enregistrer
    $('#EnrModifConstat').click(function() {
        getConstatsNonSync()
    });

		//Fonction de validation des champs qui doivent être obligatoirement remplis
        function goEdit() {
            //Lancer la fonction qui remplis les champs vides non obligatoires par la valeur null
            validA();

            //Vérifier les champs obligatoire
            var nbr = 0;
            var radioNbr =0;
            var a = $('#accordion1');

            //Compter le nombre de description d'infraction sélectionné (1 ou 0)

            radioNbr = $('.radio-input.edit:radio:checked').length;
            // });
            // Vérification qu'il y a une description d'infraction sélectionnée
            if ((radioNbr === 0) || (($('#radio-AutreEdit').is(':checked') && $('#descInfractionEdit').val() === ""))){
                radioNbr = 0;
                if($('#radio-AutreEdit').is(':checked')){
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


            //Vérification que les champs ayant une classe obligaroieEdit sont remplis
            $(".obligatoireEdit").each(function() {
                //Si le champ est null ou vide, augmenter la variable nbr de 1
                if ($(this).val() === "null" || $(this).val() === " " || $(this).val() === "") {
                    nbr = nbr +1;
                    // mettre la bordure en rouger et ajouter la classe
                    $(this).css("border", "3px solid red");
                    $(this).closest('.parent').prev().addClass("ChampsObligatoire");

                }
                //Sinon, enlever la bordure rouge et la classe
                else{
                    $(this).closest('.parent').prev().removeClass("ChampsObligatoire");
                    $(this).css("border", "");
                }
            });

            //Si un des champs obligatoires n'est pas remplis ou aucun radio n'est sélectionné
            if (nbr > 0 || radioNbr === 0){
                alert('Des champs obligatoires ne sont pas remplis');
            }

            //sinon lance la transaction insertDB pour insérer les données dans la table DEMO
            else{
                db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
                db.transaction(editRow, errorCB);
            }
        }

