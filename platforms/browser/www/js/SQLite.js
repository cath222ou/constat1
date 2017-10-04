// gestion des tabs
	$( "#tabs" ).tabs({
	active: 1
	});

	$( function() {
		$( "#tabs" ).tabs();
	} );

	
	  // Wait for Cordova to load
        //
        document.addEventListener("deviceready", onDeviceReady, false);

        var currentRow;
        // Populate the database
        //
        
		function deleteDB(tx){
			tx.executeSql('DROP TABLE IF EXISTS DEMO');
		}
		
		function populateDB(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id INTEGER PRIMARY KEY AUTOINCREMENT,dateValue,adresse,description,latitude,longitude,idmobile)');
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
		var tblText="";
		var table01 = $('#tbl tbody');
			table01.html('');
			var len = results.rows.length;
			for (var i = 0; i < len; i++) {
				var tmpArgs = results.rows.item(i).id + ",'"
					+ results.rows.item(i).dateValue + "','"
					+ results.rows.item(i).adresse + "','"
					+ results.rows.item(i).description +"'";
					+ results.rows.item(i).latitude +"'";
					+ results.rows.item(i).longitude +"'";
					+ results.rows.item(i).uuid +"'";
				tblText +='<tr onclick="goPopup('+ tmpArgs + ');">'
					+ '<td data-title="id">'+results.rows.item(i).id +'</td>'
					+ '<td data-title="Date">'+results.rows.item(i).dateValue +'</td>'
					+ '<td data-title="Adresse">'+results.rows.item(i).adresse +'</td>'
					+ '<td data-title="Description">'+results.rows.item(i).description +'</td>'
					+ '<td data-title="Latitude">'+results.rows.item(i).latitude +'</td>'
					+ '<td data-title="Longitude">'+results.rows.item(i).longitude +'</td>'
					+ '<td data-title="Uuid">'+results.rows.item(i).idmobile +'</td></tr>';
				table01.append(tblText);
			}
		}

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
            var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
            db.transaction(queryDB, errorCB);
        }

         // Cordova is ready
        //
        function onDeviceReady() {
            var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
            db.transaction(populateDB, errorCB, successCB);
        }

        //Insert query
        //
			document.addEventListener("deviceready", onDeviceReady, false);
			function onDeviceReady() {
			console.log(device.uuid);
			return device.uuid
			}


		function insertDB(tx) {
			var newdate = moment().format('DD MMMM YYYY, h:mm:ss a');
			var adresse = document.getElementById("nociv").value+", "+document.getElementById("rue").value+", "+document.getElementById("ville").value;
			var desc = document.getElementById("descTxt").value;
			var lat = document.getElementById("posLat").value;
			var lon = document.getElementById("posLong").value;
			var uuid = onDeviceReady();

            tx.executeSql('INSERT INTO DEMO (dateValue,adresse,description,latitude,longitude,idmobile) VALUES ("'+ newdate +'","'+ adresse +'","'+ desc +'","'+ lat +'","'+ lon +'","'+ uuid +'")');
			$('#nociv').val('');
			$('#rue').val('');
			$('#descTxt').val('');
			$('#posLat').val('');
			$('#posLong').val('');
		}

        function goInsert() {
            var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
            db.transaction(insertDB, errorCB, successCB);
		}

        function goSearch() {
            var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
            db.transaction(searchQueryDB, errorCB);
        }
		
		//Supprimer le contenu de la BD
		function deleteBD() {
            var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
            db.transaction(deleteDB, errorCB);
			db.transaction(populateDB, errorCB);
			$('table').empty();
			
        }

        function goDelete() {
             var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
             db.transaction(deleteRow, errorCB);
             document.getElementById('qrpopup').style.display='none';
        }

        //Show the popup after tapping a row in table
        //
        function goPopup(row,rowname,rownum) {
            currentRow=row;
            document.getElementById("qrpopup").style.display="block";
            document.getElementById("editNameBox").value = rowname;
            document.getElementById("editNumberBox").value = rownum;
        }

        function editRow(tx) {
            tx.executeSql('UPDATE DEMO SET adresse ="'+document.getElementById("editNameBox").value+
                    '", description= "'+document.getElementById("editNumberBox").value+ '" WHERE id = '
                    + currentRow, [], queryDB, errorCB);
        }
        function goEdit() {
            var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
            db.transaction(editRow, errorCB);
            document.getElementById('qrpopup').style.display='none';
        }
		
		
	
		
	

			

		