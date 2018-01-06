//Fichier pour la partie d'édition du formulaire (lorsque l'on clique sur Modifier)

var constat;

// gestion des tabs dans le modal d'édition des constats
$(function () {
    $("#tabsEdit").tabs(
        {active: 0}
    )
});

//Gestion des accordions
$(function () {
    $("#accordion1").accordion(
        {
            active: 1,
            heightStyle: "content",
            autoHeight: false
        }
    );
});


    //Afficher champs texte si "Autre" est sélectionné
    $(document).ready(function () {
        //cacher la division de champs texte additionnel
        $('#descInfractionEdit').hide();
        $('input[type="radio"]').click(function () {
            //Si radio-8Edit est coché montrer la division de champs texte
            if ($(this).attr('id') === 'radio-8Edit') {
                $('#descInfractionEdit').show();
            }
            //Sinon la cacher
            else {
                $('#descInfractionEdit').hide();
            }
        });
    });
		
	// Modal d'édition de la BD
	 	$('#exampleModal').modal({
            show:false
	 	});


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
    $(document).on('show.bs.modal', "#exampleModal", function (event) {

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
        modal.find('#faitTxtEdit').val(row.find('td[data-desc="e_details"]').html());
        modal.find('#faitTxt2Edit').val(row.find('td[data-desc="e_detailsSuite"]').html());

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
        modal.find('#noteTxtEdit').val(row.find('td[data-desc="note"]').html());
        modal.find('#matriculeNum').text(row.find('td[data-desc="user_id"]').html());
        modal.find('#dateSignatureEdit').text(row.find('td[data-desc="b_date"]').html());
        modal.find('#idCache').text(row.find('td[data-desc="id"]').html());
        modal.find('#detailCache').text(row.find('td[data-desc="e_suite"]').html());
        modal.find('#descInfCheckEdit').val(
            // Vérifier quel radiobox est coché
            function verifCheck() {
                //Cacher la division
                $('#descInfractionEdit').hide();
                //Si la valeur de la ligne b_description est de 1 à 7 est coché, cocher la case et vider le champs texte
                if (row.find('td[data-desc="b_description"]').html() === "1") {
                    $('#radio-1Edit').prop('checked', true);
                    modal.find('#descInfractionEdit').val(" ");
                }
                else if (row.find('td[data-desc="b_description"]').html() === "2") {
                    $('#radio-2Edit').prop('checked', true);
                    modal.find('#descInfractionEdit').val(" ");
                }
                else if (row.find('td[data-desc="b_description"]').html() === "3") {
                    $('#radio-3Edit').prop('checked', true);
                    modal.find('#descInfractionEdit').val(" ");
                }
                else if (row.find('td[data-desc="b_description"]').html() === "4") {
                    $('#radio-4Edit').prop('checked', true);
                    modal.find('#descInfractionEdit').val(" ");
                }
                else if (row.find('td[data-desc="b_description"]').html() === "5") {
                    $('#radio-5Edit').prop('checked', true);
                    modal.find('#descInfractionEdit').val(" ");
                }
                else if (row.find('td[data-desc="b_description"]').html() === "6") {
                    $('#radio-6Edit').prop('checked', true);
                    modal.find('#descInfractionEdit').val(" ");
                }
                else if (row.find('td[data-desc="b_description"]').html() === "7") {
                    $('#radio-7Edit').prop('checked', true);
                    modal.find('#descInfractionEdit').val(" ");
                }
                //Sinon, cocher le radiobox 8, montrer le champ texte et afficher la valeur dans le champs texte
                else {
                    $('#radio-8Edit').prop('checked', true);
                    modal.find('#descInfractionEdit').val(row.find('td[data-desc="b_description"]').html());
                    $('#descInfractionEdit').show();
                }

            }
        );
        // donner à la variable constat la valeur du constat_id de la ligne sélectionnée
        constat = row.find('td[data-desc="constat_id"]').html();
        //Lancer la fonction
        videoConstat();
    });



        //Lorsque l'on clique sur enregistrer, faire la modification sur la table
        function editRow(tx){
            //Si le radiobox 1 à 7 est coché, donner à la variable descInfraction la valeur 1 à 7 selon celui sélectionné
            if ($('#radio-1Edit').is(':checked') || $('#radio-2Edit').is(':checked') || $('#radio-3Edit').is(':checked')|| $('#radio-4Edit').is(':checked')|| $('#radio-5Edit').is(':checked')|| $('#radio-6Edit').is(':checked')|| $('#radio-7Edit').is(':checked')){
                descInfraction = $("input:checked").val();
            }
            //Sinon, donner à la variable la valeur dans le champs texte
            else {
                descInfraction = $("#descInfractionEdit").val();
            }

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

            //Cacher le modal
            $('#exampleModal').modal('hide');

        }


		//Fonction de validation des champs qui doivent être obligatoirement remplis
        function goEdit() {
            //Lancer la fonction qui remplis les champs vides non obligatoires par la valeur null
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
                //Si le radiobox 8 est sélectionné ajouter à la division du champ texte et à l'accordion

                if($('#radio-8Edit').is(':checked')){
                    $('#bEdit').addClass("ChampsObligatoire");
                    $('#descInfractionEdit').addClass("divObligatoire");
                }
                //Sinon, ajouter la classe uniquement la classe à la division des radiobox et de l'accordion
                else {
                    $('#bEdit').addClass("ChampsObligatoire");
                    $('#descInfCheckEdit').addClass("divObligatoire");
                }
            }
            //Si une case est coché, enlever la classe
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

//Autocomplete d'adresse requête en édition
//function selectNoCivEdit(){
//    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
//    db.transaction(selectNoCivEditSuccess, errorCB);
//}

//Sélectionner les informations de la table où le numéro civique correspond à celui inscrit dans le champs texte
//function selectNoCivEditSuccess(tx, results){
//    tx.executeSql('SELECT * FROM ADRESSE WHERE nocivique='+$('#noCivTxtEdit_c').val(),[],function(tx, results){nomRueSelectEdit(tx, results)}, errorCB)

//}

//remplir la variable nomRueResult par la matricule et le nom de la rue
//function nomRueSelectEdit(tx, results){
//    nomRueResult = [];
//    var len = results.rows.length;
//    for (var i = 0; i < len; i++) {
 //       nomRueResult.push({value: results.rows.item(i).adresse_id, label: results.rows.item(i).adresse});
 //   }
 //   // Autocomplete Jquery du nom de la rue
 //   $("#rueTxtEdit_c").autocomplete({
 //       source: nomRueResult,
  //      minLength: 2,
  //      select: function(event, ui) {
  //          event.preventDefault();
  //          $("#rueTxtEdit_c").val(ui.item.label);
  //          $('#rueTxtEdit_c').data("matricule",ui.item.value);
  //      }
  //  });
//}

