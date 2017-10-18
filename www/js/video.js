var fichier = null;
var idFormu = null;
	//Table vidéo
		
		function populateDB2(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS VIDEO (matricule, id_form, id_video INTEGER PRIMARY KEY AUTOINCREMENT,path, FOREIGN KEY(id_form) REFERENCES DEMO(id))');
        }
		 
		 //Cordova ready
    //    function onDeviceReady2() {
    //        var db = window.openDatabase("Database1", "1.0", "Cordova Demo", 200000);
    //        db.transaction(populateDB2, errorCB2, successCB2);     
	//	}
		
		//dessiner BD
		function querySuccess2(tx, results) {
		var table02 = $('#tbl1 tbody');
		table02.html('');
		var len = results.rows.length;
			for (var i = 0; i < len; i++) {
				table02.append(
				'<tr onclick="goPopup('
					+ results.rows.item(i).matricule + ",'"
					+ results.rows.item(i).id_form + "','"
					+ results.rows.item(i).id_video + "','"
					+ results.rows.item(i).path +"')"+'";>'
					+ '<td data-title="matricule">'+results.rows.item(i).matricule +'</td>'
					+ '<td data-title="id_form">'+results.rows.item(i).id_form +'</td>'
					+ '<td data-title="id_video">'+results.rows.item(i).id_video +'</td>'
					+ '<td data-title="path">'+results.rows.item(i).path +'</td></tr>'
				);
			}
		} 
		
		//Supprimer BD
		function deleteBaseBD2() {
            db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
            db.transaction(deleteDB2, errorCB);
			$('#cf1').empty();
			db.transaction(onDeviceReady, errorCB);
		}
		//drop table	
		function deleteDB2(tx){
			tx.executeSql('DROP TABLE IF EXISTS VIDEO');
		}
		
		// Query the database
        //
        function queryDB2(tx) {
            tx.executeSql('SELECT * FROM VIDEO', [], querySuccess2, errorCB);
        }
		
		// Transaction success callback
        //
        function successCB2() {
            db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
            db.transaction(queryDB2, errorCB);
        }
		
		// Transaction error callback
        //
        function errorCB2(err) {
            alert("Error processing SQL: "+err.code);
        }
		
		
		//Insert query

		function insertDB2(tx, idForm, fichier) { //
			idForm = "allo"
			//console.log(fichier);
			var matricule = document.getElementById("mat").value;
            tx.executeSql('INSERT INTO VIDEO (matricule,id_form,path) VALUES ("'+ matricule +'","'+ idFormu +'","'+ fichier +'")');
		}



	//trouver valeur du dernier id du formulaire
	function idInfo(tx) {
			tx.executeSql('SELECT id FROM DEMO WHERE id = (SELECT MAX(id) FROM DEMO)', [], querySuccess3, errorCB);
		}

    // Query the success callback
    //
    function querySuccess3(tx, results) {
        var len = results.rows.length;
        for (var i=0; i<len; i++){
            console.log(" ID = " + results.rows.item(i).id);
        idFormu = results.rows.item(i).id
		}
		
    }

	//insertion dans la BD

		function goInsert2() {
			db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
			db.transaction(function(tx){
				idInfo(tx);
			}
			, errorCB, successCB2);	
			goInsert3();
		
		}
		
		
		function goInsert3() {
			db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
			db.transaction(function(tx){
				insertDB2(tx, null, fichier);
				
			}
			, errorCB, successCB2);	
			console.log(fichier);
		}
		

//Sélection d'une vidéo	
	function getVideo() {
		var options = { quality: 80 };
		options["sourceType"] = 0 | 2; 
		options["mediaType"] = 1;
		options["destinationType"] = 2;
		navigator.camera.getPicture(onVideoSuccess, onFail, options);   
	}
	
	
	function onVideoSuccess(fileuri) {
		fichier = fileuri;
		goInsert2();
	}

	
	function onFail(err) {
		console.log("onFail");
	}	

	// Upload files to server
//	function uploadFile(mediaFile) {
//		var ft = new FileTransfer(),
//			path = mediaFile.fullPath,
//			name = mediaFile.name;
//	
//		ft.upload(path,
//			"http://my.domain.com/upload.php",
//			function(result) {
//				console.log('Upload success: ' + result.responseCode);
//				console.log(result.bytesSent + ' bytes sent');
//			},
//			function(error) {
//				console.log('Error uploading file ' + path + ': ' + error.code);
//			},
//			{ fileName: name });   
//	}
	






