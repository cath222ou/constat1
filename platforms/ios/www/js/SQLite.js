var x = '';
var y = '';
var uuidValue;
var matAgent1 = 1; //$('#matAgent').val();
//var uuidApp1 = '21FE5A66-7C7D-4183-87E6-2A58739DE667';//$('#uuidApp').val();


// Wait for Cordova to load
    document.addEventListener("deviceready", onDeviceReady, false);

//Cordova ready
function onDeviceReady() {
	//Valeur du UUID de l'appareille
    uuidValue= '21FE5A66-7C7D-4183-87E6-2A58739DE667';//device.uuid; A ENLEBVEERERRRRRRr
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    //Création de la Table de constat
    db.transaction(populateDBConstat, errorCB, successCBConstat);
    //Création de la Table de vidéo
    db.transaction(populateDBVideo, errorCB, successCBVideo);
    //Création de la Table de Agent
    db.transaction(populateDBAgent, errorCB, function(tx,result){successCBAgent(tx,result)});
    //Création de la Table de Adresse
    db.transaction(populateDBAdr, errorCB, function(tx,result){successCBAdr(tx,result)});

}



    // Populate the database
        //

		function deleteDB(tx){
			tx.executeSql('DROP TABLE IF EXISTS DEMO');
		}

		function populateDBConstat(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (constat_id INTEGER PRIMARY KEY AUTOINCREMENT,user_id,device_id,a_nom,a_adresse,a_telephone1,a_telephone2,b_date,b_heure,b_description,c_endroit,c_nociv, c_rue, adresse_id, c_description,e_details,e_suite,e_detailsSuite,lat,lon,note,sync INTEGER, nbrVideo)');
		}

        // Query the database
        //
        function queryDB(tx) {
            tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
        }


        // Query the success callback
        //

		function querySuccess(tx, results) {
		var table01 = $('#tbl tbody');
		table01.html('');
		var len = results.rows.length;
		for (var i = 0; i < len; i++) {
			table01.append(
				'<tr>'
					+ '<td data-title="constat_id" id="id">'+results.rows.item(i).constat_id +'</td>'
					+ '<td data-title="user_id">'+results.rows.item(i).user_id +'</td>'
					+ '<td data-title="device_id">'+results.rows.item(i).device_id +'</td>'
                	+ '<td data-title="a_nom">'+results.rows.item(i).a_nom +'</td>'
					+ '<td data-title="a_adresse">'+results.rows.item(i).a_adresse +'</td>'
                	+ '<td data-title="a_telephone1">'+results.rows.item(i).a_telephone1 +'</td>'
                	+ '<td data-title="a_telephone2">'+results.rows.item(i).a_telephone2 +'</td>'
					+ '<td data-title="b_date">'+results.rows.item(i).b_date +'</td>'
					+ '<td data-title="b_heure">'+results.rows.item(i).b_heure +'</td>'
                	+ '<td data-title="b_description">'+results.rows.item(i).b_description +'</td>'
                	+ '<td data-title="c_endroit">'+results.rows.item(i).c_endroit +'</td>'
                	+ '<td data-title="c_nociv">'+results.rows.item(i).c_nociv +'</td>'
                	+ '<td data-title="c_rue">'+results.rows.item(i).c_rue +'</td>'
                	+ '<td data-title="adresse_id">'+results.rows.item(i).adresse_id +'</td>'
                	+ '<td data-title="c_description">'+results.rows.item(i).c_description +'</td>'
               	 	+ '<td data-title="e_details">'+results.rows.item(i).e_details +'</td>'
                	+ '<td data-title="e_suite">'+results.rows.item(i).e_suite +'</td>'
                	+ '<td data-title="e_detailsSuite">'+results.rows.item(i).e_detailsSuite +'</td>'
                	+ '<td data-title="lat">'+results.rows.item(i).lat +'</td>'
               	 	+ '<td data-title="lon">'+results.rows.item(i).lon +'</td>'
                	+ '<td data-title="note">'+results.rows.item(i).note +'</td>'
                	+ '<td data-title="sync">'+results.rows.item(i).sync +'</td>'
					+ '<td><button type="button" data-toggle="modal" data-target="#exampleModal">Modifier</button>'
					+ '<button type="button" class="btn1" onClick="syncConstat()">Synchronisation</button></td>'+
				'</tr>'
				);
			}
		}





        // Transaction error callback
        //
        function errorCB(err) {
            console.log('erreur',err);
        }

        // Transaction success callback
        //
        function successCBConstat(tx,result,matAgent1,uuidApp1) {
            db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
            db.transaction(queryDB, errorCB);
        }




		//Insert query
        //

		function insertDB(tx, position) {
        	var matricule = document.getElementById("matriculeMenu").value;

			var nom = document.getElementById("nomTxt").value;
			var adresse_a = document.getElementById("adresseCor").value;
			var tel1 = document.getElementById("telRes").value;
			var tel2 = document.getElementById("telTra").value;
			var newdate = moment().format('DD/MM/YYYY');
			var newheure = moment().format('h:mm a');
			var descInfraction = null;

				if ($('#radio-1').is(':checked') || $('#radio-2').is(':checked') || $('#radio-3').is(':checked')|| $('#radio-4').is(':checked')|| $('#radio-5').is(':checked')|| $('#radio-6').is(':checked')|| $('#radio-7').is(':checked')){
						descInfraction = $("input:checked").val();
					}
				else if ($('#radio-8').is(':checked')){
                    descInfraction = document.getElementById("descInfraction").value;
                }
			var endroit = document.getElementById("endroitTxt").value;
			var nociv = document.getElementById("noCivTxt_c").value;
			var rue = document.getElementById("rueTxt_c").value;
			var adresseid = $('#rueTxt_c').data("matricule");
			var decriptionLieux = document.getElementById("descLieux").value;
            var faits = document.getElementById("faitTxt").value;
            var faits2 = document.getElementById("faitTxt2").value;
			var note = document.getElementById("noteTxt").value;

			var suite = null;

				if($('#checkbox-nested-text').is(':checked')){
					var suite = true
				}
				else {
					var suite = false
				}

            tx.executeSql('INSERT INTO DEMO (user_id,device_id,a_nom,a_adresse,a_telephone1,a_telephone2,b_date,b_heure,b_description,c_endroit,c_nociv,c_rue,adresse_id,c_description,e_details,e_suite,e_detailsSuite,lat,lon,note,sync) VALUES ("'+ matricule +'","'+ uuidValue +'","'+ nom +'","'+adresse_a+'","'+tel1+'","'+tel2+'","'+ newdate +'","'+newheure+'","'+descInfraction+'","'+endroit+'","'+nociv+'","'+rue+'","'+adresseid+'","'+decriptionLieux+'","'+faits+'","'+suite+'","'+faits2+'","'+ position.coords.latitude +'","'+ position.coords.longitude +'","'+ note +'","'+0+'")');

		}



		function goInsert(position) {
            //lance la fonction pour remplir les champs vide non obligatoire par NULL
			validA();


            //Vérifier les champs obligatoire
			var nbr = 0;
			var radioNbr =0;
            var a = $('#accordion');

			//Compter le nombre de description d'infraction sélectionné (1 ou 0)
            a.find(".radio-input").each(function() {
            	//Si un radio box est sélectionné, augmenter la radioNbr de 1
            	if(( $(this).is(':checked') && $(this).attr('id')!== 'radio-8') || ($(this).is(':checked') && $(this).attr('id')=== 'radio-8' && $('#descInfraction').val() !== "")){
                    radioNbr = radioNbr + 1;
                }
            });
			// Vérification qu'il y a une description d'infraction sélectionnée
            if (radioNbr === 0 ){
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
                    db.transaction(function (tx) {
                            insertDB(tx, position);
                        }
                        , errorCB, successCBConstat);
                }
		}


		//Supprimer le contenu de la BD

		function deleteBaseD() {
			db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
            db.transaction(deleteDB, errorCB);
			$('cf').empty();
			db.transaction(onDeviceReady, errorCB);
        }


	/////////////////////////////
	//////geolocalisation////////
	/////////////////////////////


    //onError Callback receives a PositionError object

    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }




	//Trouver la position et l'intégrer dans la BD lors de l'enregistrement
	function enregistre(){
		navigator.geolocation.getCurrentPosition(goInsert, onError);
		$('#enrVideo').removeClass('hidden');
	};





	
