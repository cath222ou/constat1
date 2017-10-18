var x = '';
var y = '';
var db = null;
var currentRow;
 // gestion des tabs
	$( "#tabs" ).tabs({
	active: 0
	});

	$( function() {
		$( "#tabs" ).tabs();
	} );
	
	//accordeon
	$( function() {
		$( "#accordion" ).accordion(
		{active: 0});
	} );

	
	  // Wait for Cordova to load
        //
        document.addEventListener("deviceready", onDeviceReady, false);

       
        // Populate the database
        //
        
		function deleteDB(tx){
			tx.executeSql('DROP TABLE IF EXISTS DEMO');
		}
		
		function populateDB(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (matricule, id INTEGER PRIMARY KEY AUTOINCREMENT,dateValue,adresse,description,latitude,longitude,idmobile)');
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
				'<tr data-toggle="modal" data-target="#exampleModal">'
					+ '<td data-title="matricule" id="matricule">'+results.rows.item(i).matricule +'</td>'
					+ '<td data-title="id">'+results.rows.item(i).id +'</td>'
					+ '<td data-title="dateValue">'+results.rows.item(i).dateValue +'</td>'
					+ '<td data-title="adresse">'+results.rows.item(i).adresse +'</td>'
					+ '<td data-title="description">'+results.rows.item(i).description +'</td>'
					+ '<td data-title="latitude">'+results.rows.item(i).latitude +'</td>'
					+ '<td data-title="longitude">'+results.rows.item(i).longitude +'</td>'
					+ '<td data-title="idmobile">'+results.rows.item(i).idmobile +'</td>'+
				'</tr>'
				);
			}
		}
		
	// Édition de la BD
		$('#exampleModal').modal({show:false}).
			on('show.bs.modal', function (event) {
				var row = $(event.relatedTarget).closest('tr');
				var modal = $(this);
				modal.find('.modal-title').text('Édition du constat' + row.find('td[data-title="matricule"]').html() +"-"+ row.find('td[data-title="id"]').html());
				modal.find('#noCivEdit').val(row.find('td[data-title="adresse"]').html());
		});



        //Delete query
        function deleteRow(tx) {
          tx.executeSql('DELETE FROM DEMO WHERE id = ' + currentRow, [], queryDB, errorCB);
        }

        // Transaction error callback
        //
        function errorCB(err) {
            alert("Error processing SQL: "+err.code);
        }

        // Transaction success callback
        //
        function successCB() {
            db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
            db.transaction(queryDB, errorCB);
        }

         // Cordova is ready
        //
        function onDeviceReady() {
            db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
            db.transaction(populateDB, errorCB, successCB);
			db.transaction(populateDB2, errorCB, successCB2);
			return device.uuid;  
				
		}


		//Insert query
        //
		function insertDB(tx, position) {
			var newdate = moment().format('DD MMMM YYYY, h:mm:ss a');
			var adresse = document.getElementById("nociv").value+", "+document.getElementById("rue").value+", "+document.getElementById("ville").value;
			var desc = document.getElementById("descTxt").value;
			var uuid = onDeviceReady();
			var matricule = document.getElementById("mat").value;
            tx.executeSql('INSERT INTO DEMO (matricule,dateValue,adresse,description,latitude,longitude,idmobile) VALUES ("'+ matricule +'","'+ newdate +'","'+ adresse +'","'+ desc +'","'+ position.coords.latitude +'","'+ position.coords.longitude +'","'+ uuid +'")');
			$('#nociv').val('');
			$('#rue').val('');
			$('#descTxt').val('');
		}

		function goInsert(position) {
            db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
            db.transaction(function(tx){
				insertDB(tx, position);
			}
			, errorCB, successCB);
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

        function editRow(tx) {
            tx.executeSql('UPDATE DEMO SET adresse ="'+document.getElementById("adresseTxt").value+
                    '", description= "'+document.getElementById("descriptionTxt").value+ '" WHERE id = '
                    + currentRow, [], queryDB, errorCB);
        }
		
        function goEdit() {
            db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
            db.transaction(editRow, errorCB);
        }
		
	/////////////////////////////	
	//////geolocalisation////////
	/////////////////////////////
	function onSuccess(position) {

    };

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }

	function getPosition(){
		navigator.geolocation.getCurrentPosition(onSuccess, onError);
		
	}

		
	//Trouver la position et l'intégrer dans la BD lors de l'enregistrement	
	function enregistre(){
		navigator.geolocation.getCurrentPosition(goInsert, onError);
	};	
	
	
	
////////////////////adresse//////////////////



	
