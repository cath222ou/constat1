//Fichier de la table demo

//Variable
var x = '';
var y = '';
// var uuidValue = '2E9F2ADA-8992-4971-925A-C2DCDA04042A'; ///////////changerrr
var uuidValue;
$(function(){
	$('#nouvConstat').fadeOut();
	$('#enrVideo').fadeOut();
	$('#videoThumbnail').fadeOut();
	$('#progress').progressbar({
		value:0
	});
})
// Wait for Cordova to load
    document.addEventListener("deviceready", onDeviceReady, false);

//Cordova ready
function onDeviceReady() {
	//Valeur du UUID de l'appareil
	uuidValue = device.uuid; ////////////////////////////////////changer
	$('#uuid').html(uuidValue);
	$('#buildVersion').html('1.2.6');
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    //Création de la Table de constat
    db.transaction(populateDBConstat, errorCB, getConstatsNonSync);
    //Création de la Table de vidéo
    db.transaction(populateDBVideo, errorCB, getVideosNonSync);
    //Création de la Table de Agent
    db.transaction(populateDBAgent, errorCB, function(tx,result){successCBAgent(tx,result)});
    //Création de la Table de Adresse
    db.transaction(populateDBAdr, errorCB, function(tx,result){successCBAdr(tx,result)});

}

		//Création de la table constats
		function populateDBConstat(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS constats (constat_id INTEGER PRIMARY KEY AUTOINCREMENT,user_id,device_id,a_nom,a_adresse,a_telephone1,a_telephone2,b_date,b_heure,b_description,b_description_autre,c_endroit,c_nociv, c_rue, adresse_id, c_description,e_details,e_suite,e_detailsSuite,lat,lon,note,sync INTEGER, nbrVideo INTEGER,dossier_id)');
		}

		//Création de la table demo pour visualisation dans l'application
		function afficherTableConstats(tx, results) {
		var table01 = $('#tbl tbody');
		table01.html('');
		var len = results.rows.length;
		for (var i = 0; i < len; i++) {
			table01.append(
				'<tr>'
					+ '<td data-title="Numéro du constat" data-desc="constat_id">'+results.rows.item(i).constat_id +'</td>'
					+ '<td data-title="user_id" data-desc="user_id" class="hidden">'+results.rows.item(i).user_id +'</td>'
                	+ '<td data-title="device_id" data-desc="device_id" class="hidden">'+results.rows.item(i).device_id +'</td>'
                	+ '<td data-title="a_nom" data-desc="a_nom" class="hidden">'+results.rows.item(i).a_nom +'</td>'
                	+ '<td data-title="a_adresse" data-desc="a_adresse" class="hidden">'+results.rows.item(i).a_adresse +'</td>'
                	+ '<td data-title="a_telephone1" data-desc="a_telephone1" class="hidden">'+results.rows.item(i).a_telephone1 +'</td>'
                	+ '<td data-title="a_telephone2" data-desc="a_telephone2" class="hidden">'+results.rows.item(i).a_telephone2 +'</td>'
                	+ '<td data-title="b_date" data-desc="b_date" class="hidden">'+results.rows.item(i).b_date +'</td>'
                	+ '<td data-title="b_heure" data-desc="b_heure" class="hidden">'+results.rows.item(i).b_heure +'</td>'
                	+ '<td data-title="b_description" data-desc="b_description" class="hidden">'+results.rows.item(i).b_description +'</td>'
                	+ '<td data-title="b_description_autre" data-desc="b_description_autre" class="hidden">'+results.rows.item(i).b_description_autre +'</td>'
                	+ '<td data-title="c_endroit" data-desc="c_endroit" class="hidden">'+results.rows.item(i).c_endroit +'</td>'
                	+ '<td data-title="Numéro civique" data-desc="c_nociv">'+results.rows.item(i).c_nociv +'</td>'
                	+ '<td data-title="Nom de la rue"  data-desc="c_rue">'+results.rows.item(i).c_rue +'</td>'
                	+ '<td data-title="adresse_id" data-desc="adresse_id" class="hidden">'+results.rows.item(i).adresse_id +'</td>'
                	+ '<td data-title="c_description" data-desc="c_description" class="hidden">'+results.rows.item(i).c_description +'</td>'
                	+ '<td data-title="e_details" data-desc="e_details" class="hidden">'+results.rows.item(i).e_details +'</td>'
                	+ '<td data-title="e_suite" data-desc="e_suite" class="hidden">'+results.rows.item(i).e_suite +'</td>'
                	+ '<td data-title="e_detailsSuite" data-desc="e_detailsSuite" class="hidden">'+results.rows.item(i).e_detailsSuite +'</td>'
                	+ '<td data-title="lat" data-desc="lat" class="hidden">'+results.rows.item(i).lat +'</td>'
                	+ '<td data-title="lon" data-desc="lon" class="hidden">'+results.rows.item(i).lon +'</td>'
                	+ '<td data-title="note" data-desc="note" class="hidden">'+results.rows.item(i).note +'</td>'
                	+ '<td data-title="sync" data-desc="sync" class="hidden">'+results.rows.item(i).sync +'</td>'
					+ '<td><button type="button" data-toggle="modal" data-target="#constatModalEdit" style="hidden">Modifier</button>'+
					//+ '<button type="button" class="btn1" onClick="syncConstat()">Synchronisation</button></td>'+
				'</tr>'
				);
			}
		}

		//Callback d'erreur générique
        function errorCB(something) {
			if (typeof something == 'object') {
				something = JSON.stringify(something);
			}
			console.log(something);
		}

        // Lancer la requête de sélection de tous dans la table demo
        function getConstatsNonSync(tx) {
            db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
            db.transaction(function(tx){
				tx.executeSql('SELECT * FROM constats WHERE sync = ?', [0], afficherTableConstats, errorCB);
                // tx.executeSql('SELECT * FROM constats', [], afficherTableConstats, errorCB);
			}, errorCB);
        }

        //Lancer la requête pour raffraichir la table dans Constats à synchroniser lorsque l'on clique sur cet tabs
		$('#tabs-2ID').click(function() {
    		getConstatsNonSync()
		});

		//Requête d'insertion dans la table demo lorsque l'on clique sur enregistrer
		function insertDB(tx, position) {
        	var matricule = $("#matriculeMenu").val();
			var nom = $("#nomTxt").val();
			var adresse_a = $("#adresseCor").val();
			var tel1 = $("#telRes").val();
			var tel2 = $("#telTra").val();
			var newdate = moment().format('DD/MM/YYYY');
			var newheure = moment().format('h:mm a');
			var descInfraction = [];
            var descInfractionAutre = null;

            //Donner à la variable descInfraction les valeurs de 1 à 7 selon les checkbox sélectionnés
            $('.radio-input:radio:checked').each(function(){
            	var checkboxValue = $(this).val();
            	if(checkboxValue == 'Autre'){
                    descInfractionAutre = ($("#descInfraction").val());
				}
				descInfraction.push(checkboxValue);

			});

			// //Donner à la variable descInfraction la valeur de 1 à 7 selon le radiobox sélectionné
			// 	if ($('#radio-1').is(':checked') || $('#radio-2').is(':checked') || $('#radio-3').is(':checked')|| $('#radio-4').is(':checked')|| $('#radio-5').is(':checked')|| $('#radio-6').is(':checked')|| $('#radio-7').is(':checked')){
			// 			descInfraction = $("input:checked").val();
			// 		}
			// 	//Si radiobox 8 est coché, prendre la valeur du champ texte
			// 	else if ($('#radio-8').is(':checked')){
             //        descInfraction = $("#descInfraction").val();
             //    }
			var endroit = $("#endroitTxt").val();
			var nociv = $("#noCivTxt_c").val();
			var rue = $("#rueTxt_c").val();
			var adresseid = $('#rueTxt_c').data("matricule");
			var decriptionLieux = $("#descLieux").val();
            var faits = $("#faitTxt").val();
            var faits2 = $("#faitTxt2").val();
			var note = $("#noteTxt").val();

			var suite = null;
            //Si la case est coché, mettre la valeur true à la variable suite
			if($('#checkbox-nested-text').is(':checked')){
				 suite = true
			}
			//Sinon mettre la valeur false
			else {
				 suite = false
			}

            //Insérer les données dans la table constats
			///TODO parametrized ->
            tx.executeSql('INSERT INTO constats (user_id,device_id,a_nom,a_adresse,a_telephone1,a_telephone2,b_date,b_heure,b_description,b_description_autre,c_endroit,c_nociv,c_rue,adresse_id,c_description,e_details,e_suite,e_detailsSuite,lat,lon,note,sync) VALUES ("'+ matricule +'","'+ uuidValue +'","'+ nom +'","'+adresse_a+'","'+tel1+'","'+tel2+'","'+ newdate +'","'+newheure+'","'+descInfraction+'","'+descInfractionAutre+'","'+endroit+'","'+nociv+'","'+rue+'","'+adresseid+'","'+decriptionLieux+'","'+faits+'","'+suite+'","'+faits2+'","'+ position.coords.latitude +'","'+ position.coords.longitude +'","'+ note +'","'+0+'")');
			//rendre visible le bouton de sélection de vidéo

		}

		function validerMatriculeRole(){
			var matriculeRole = $('#rueTxt_c').data("matricule");
			if(typeof matriculeRole == "string" && matriculeRole.length > 0){//Matricule du role existe
				return true;
			}
			else if(($("#nomTxt").val() != 'null' && $('#adresseCor').val() != 'null') && typeof matriculeRole == "undefined"){ //Matricule est inexistant et les champs ont été remplis par une valeur autre que null, c'est bon on accepte :)
				$("#nomTxt").closest('.parent').prev().removeClass("ChampsObligatoire");
				$("#nomTxt").css("border", '').removeClass('obligatoire');
				$('#adresseCor').css('border','').removeClass('obligatoire');
				return true;
			}
			else{
				$("#nomTxt").closest('.parent').prev().addClass("ChampsObligatoire");
				$("#nomTxt").css("border", "3px solid red").addClass('obligatoire').val('');
				$('#adresseCor').css('border','3px solid red').addClass('obligatoire').val('');
				return false;
			}


		}

		function goInsert(position) {
            //lance la fonction pour remplir les champs vide non obligatoire par NULL
			validA();

            //Vérifier les champs obligatoire
			var nbr = 0;
			var radioNbr =0;
			var isValide = true;
            var a = $('#accordion');

			if(!validerMatriculeRole()){
				isValide = false;
			}


			//Compter le nombre de description d'infraction sélectionné (1 ou 0)
            // a.find(".radio-input").each(function() {
            	//Si un radio box est sélectionné, augmenter la radioNbr de 1
            	// if(( $(this).is(':checked') && $(this).attr('id')!== 'radio-8') || ($(this).is(':checked') && $(this).attr('id')=== 'radio-8' && $('#descInfraction').val() !== "")){
                 //    //radioNbr = radioNbr + 1;
					// ++radioNbr;
                // }
                radioNbr = $('.radio-input:radio:checked').length;

            // });
			// Vérification qu'il y a une description d'infraction sélectionnée
            if ((radioNbr === 0) || (($('#radio-8').is(':checked') && $('#descInfraction').val() === ""))){

            	radioNbr = 0;
            	if($('#radio-8').is(':checked')){
                    $('#b').addClass("ChampsObligatoire");
                    $('#descInfraction').addClass("divObligatoire");
				}
				else {
                    $('#b').addClass("ChampsObligatoire");
                    $('#descInfCheck').addClass("divObligatoire");
                }
            }
            else {
                $('#b').removeClass("ChampsObligatoire");
                $('#descInfCheck').removeClass("divObligatoire");
                $('#descInfraction').removeClass("divObligatoire");
            }





			//Vérification que les champs textes obligatoires sont remplis
            $(".obligatoire").each(function() {
                if ($(this).val() === "null" || $(this).val() === " " || $(this).val() === "") {
                	//nbr = nbr +1;
					++nbr;
					$(this).css("border", "3px solid red");
                    $(this).closest('.parent').prev().addClass("ChampsObligatoire");

                }
                else{
                    $(this).closest('.parent').prev().removeClass("ChampsObligatoire");
                    $(this).css("border", "");
				}
            });

			//Si un des champs obligatoires n'est pas remplis ou aucun radio n'est sélectionné
			if (nbr > 0 || radioNbr === 0 || !isValide){
				console.log('nbr: '+nbr);
                console.log('radionbr: '+radioNbr);
				$('#enrVideo').fadeOut('slow');
				$('#nouvConstat').fadeOut('slow');
				$('button[name="btnEnregistreFormulaire"]').fadeIn('slow');
                alert('Des champs obligatoires ne sont pas remplis');
			}

			//sinon lance la transaction insertDB pour insérer les données dans la table DEMO
			else{
				$('#enrVideo').fadeIn('slow');//petite animation pour cacher et afficher les boutons
				$('#nouvConstat').fadeIn('slow');
				$('button[name="btnEnregistreFormulaire"]').fadeOut('slow');
                    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
                    db.transaction(function (tx) {
						insertDB(tx, position);
					},
						errorCB)
						// getConstatsNonSync());
                }
		}

		//Supprimer le contenu de la BD
		$('button[name="btnDropTableConstats"]').on('click',function(){
			db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
			db.transaction(function(tx){
				tx.executeSql('DROP TABLE IF EXISTS constats',[],function(){console.log('Table constats droppée');onDeviceReady()});
			}, errorCB);
			$('.cf').empty();
			//db.transaction(onDeviceReady, errorCB);
		});



	/////////////////////////////
	//////geolocalisation////////
	/////////////////////////////


    //Callback d'erreur du géopositionnement
    function onError(error) {
        alert('code:  '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }


$('button[name="btnEnregistreFormulaire"]').on('click',function(event){
	event.preventDefault();
	//Trouver la position et l'intégrer dans la BD lors de l'enregistrement du constat
	navigator.geolocation.getCurrentPosition(goInsert, onError);
});



