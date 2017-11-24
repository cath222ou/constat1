var x = '';
var y = '';
//var db = null;
var currentRow;
var uuidValue;
var matAgent1 = 1; //$('#matAgent').val();
var uuidApp1 = '21FE5A66-7C7D-4183-87E6-2A58739DE667';//$('#uuidApp').val();


// Wait for Cordova to load
    document.addEventListener("deviceready", onDeviceReady, false);

// Cordova is ready
//
function onDeviceReady() {
    uuidValue= device.uuid;
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(populateDBConstat, errorCB, successCBConstat);
    db.transaction(populateDBVideo, errorCB, successCBVideo);
    db.transaction(populateDBAgent, function(tx,result){console.log(tx,result)}, function(tx,result){successCBAgent(tx,result)});
    db.transaction(populateDBAdr, function(tx,result){console.log(tx,result)}, function(tx,result){successCBAdr(tx,result)});

}



    // Populate the database
        //

		function deleteDB(tx){
			tx.executeSql('DROP TABLE IF EXISTS DEMO');
		}

		function populateDBConstat(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (constat_id INTEGER PRIMARY KEY AUTOINCREMENT,user_id,device_id,a_nom,a_adresse,a_telephone1,a_telephone2,b_date,b_heure,b_description,c_endroit,c_adresse,c_description,e_details,e_suite,e_detailsSuite,lat,lon,note,sync)');
		}

        // Query the database
        //
        function queryDB(tx) {
            tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
        }

        function searchQueryDB(tx) {
            tx.executeSql("SELECT * FROM DEMO where description like ('%"+ document.getElementById("nociv").value + "%')",
                    [], querySuccess, errorCB);


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
					+ '<td data-title="dossier_id">'+results.rows.item(i).dossier_id +'</td>'
                	+ '<td data-title="a_nom">'+results.rows.item(i).a_nom +'</td>'
					+ '<td data-title="a_adresse">'+results.rows.item(i).a_adresse +'</td>'
                	+ '<td data-title="a_telephone1">'+results.rows.item(i).a_telephone1 +'</td>'
                	+ '<td data-title="a_telephone2">'+results.rows.item(i).a_telephone2 +'</td>'
					+ '<td data-title="b_date">'+results.rows.item(i).b_date +'</td>'
					+ '<td data-title="b_heure">'+results.rows.item(i).b_heure +'</td>'
                	+ '<td data-title="b_description">'+results.rows.item(i).b_description +'</td>'
                	+ '<td data-title="c_endroit">'+results.rows.item(i).c_endroit +'</td>'
                	+ '<td data-title="c_adresse">'+results.rows.item(i).c_adresse +'</td>'
                	+ '<td data-title="c_description">'+results.rows.item(i).c_description +'</td>'
               	 	+ '<td data-title="e_details">'+results.rows.item(i).e_details +'</td>'
                	+ '<td data-title="e_suite">'+results.rows.item(i).e_suite +'</td>'
                	+ '<td data-title="e_detailsSuite">'+results.rows.item(i).e_detailsSuite +'</td>'
                	+ '<td data-title="lat">'+results.rows.item(i).lat +'</td>'
               	 	+ '<td data-title="lon">'+results.rows.item(i).lon +'</td>'
                	+ '<td data-title="note">'+results.rows.item(i).note +'</td>'
					+ '<td><button type="button" data-toggle="modal" data-target="#exampleModal">Modifier</button></td>'+
				'</tr>'
				);
			}
		}




        //Delete query
        function deleteRow(tx) {
          tx.executeSql('DELETE FROM DEMO WHERE id = ' + currentRow, [], queryDB, errorCB);
        }

        // Transaction error callback
        //
        function errorCB(err) {
            console.log(err);
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

				if ($('#radio-1').is(':checked') || $('#radio-2').is(':checked') || $('#radio-3').is(':checked')){
						descInfraction = $("input:checked").val();
					}
				else if ($('#radio-4').is(':checked')){
                    descInfraction = document.getElementById("descInfraction").value;
                }
			var endroit = document.getElementById("endroitTxt").value;
			var adresse = document.getElementById("adresseTxt_c").value;
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

            tx.executeSql('INSERT INTO DEMO (user_id,device_id,a_nom,a_adresse,a_telephone1,a_telephone2,b_date,b_heure,b_description,c_endroit,c_adresse,c_description,e_details,e_suite,e_detailsSuite,lat,lon,note) VALUES ("'+ matricule +'","'+ uuidValue +'","'+ nom +'","'+adresse_a+'","'+tel1+'","'+tel2+'","'+ newdate +'","'+newheure+'","'+descInfraction+'","'+endroit+'","'+adresse+'","'+decriptionLieux+'","'+faits+'","'+suite+'","'+faits2+'","'+ position.coords.latitude +'","'+ position.coords.longitude +'","'+ note +'")');
			//effacer les valeurs entrées
				$('#nomTxt').val('');
			$('#adresseCor').val('');
			$('#telRes').val('');
            $('#telTra').val('');
            $('#descInfraction').val('');
            $('#endroitTxt').val('');
            $('#adresse-Txt_c').val('');
            $('#descLieux').val('');
            $('#faitTxt').val('');
            $('#faitTxt2').val('');
            $('#noteTxt').val('');
            $('input[type=radio]').prop('checked',false);



            //Retour à l'accordéon initial
            $( "#accordion" ).accordion(
                {active:1}
            );


		}



		function goInsert(position) {
            validA();
            //validateForm();

            //////SI RETOURNE FALSE WHATTT ???????
            // if (validateForm() === false) {
            //     alert('Des champs obligatoires ne sont pas remplis')
            // }
            // else {

                db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
                db.transaction(function (tx) {
                        insertDB(tx, position);
                    }
                    , errorCB, successCBConstat);
        }
        function goSearch() {
            db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
            db.transaction(searchQueryDB, errorCB);
        }

		//Supprimer le contenu de la BD

		function deleteBaseD() {
			db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
            db.transaction(deleteDB, errorCB);
			$('cf').empty();
			db.transaction(onDeviceReady, errorCB);
        }

        function goDelete() {
             db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
             db.transaction(deleteRow, errorCB);
             document.getElementById('qrpopup').style.display='none';
        }

	/////////////////////////////
	//////geolocalisation////////
	/////////////////////////////
	// function onSuccess(position) {
    //
    // };

    //onError Callback receives a PositionError object

    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }

    // function getPosition(){
		// navigator.geolocation.getCurrentPosition(onSuccess, onError);
		//
    // }


	//Trouver la position et l'intégrer dans la BD lors de l'enregistrement
	function enregistre(){
		navigator.geolocation.getCurrentPosition(goInsert, onError);
	};



////////////////////adresse//////////////////



	
