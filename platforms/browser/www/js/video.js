var fichier = null;
var idFormu = null;
	//Table vidéo
		
		function populateDBVideo(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS VIDEO (matricule, constat_id INTEGER, id_video INTEGER PRIMARY KEY AUTOINCREMENT, nom, path, FOREIGN KEY(constat_id) REFERENCES DEMO(constat_id))');
        }
		 
		 //Cordova ready
    //    function onDeviceReady2() {
    //        var db = window.openDatabase("Database1", "1.0", "Cordova Demo", 200000);
    //        db.transaction(populateDB2, errorCB2, successCB2);     
	//	}
		
		//dessiner BD
		function querySuccessVideo(tx, results) {
		var table02 = $('#tbl1 tbody');
		table02.html('');
		var len = results.rows.length;
			for (var i = 0; i < len; i++) {
				table02.append(
				'<tr>'
					+ '<td data-title="matricule">'+results.rows.item(i).matricule +'</td>'
					+ '<td data-title="constat_id">'+results.rows.item(i).constat_id +'</td>'
					+ '<td data-title="id_video">'+results.rows.item(i).id_video +'</td>'
                    + '<td data-title="nom">'+results.rows.item(i).nom +'</td>'
					+ '<td data-title="path">'+results.rows.item(i).path +'</td>'+
				'</tr>'
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
        function queryDBVideo(tx) {
            tx.executeSql('SELECT * FROM VIDEO', [], querySuccessVideo, errorCB);
        }
		
		// Transaction success callback
        //
        function successCBVideo() {

            db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
            db.transaction(queryDBVideo, errorCB);
        }
		
        // // Transaction error callback
        // //
        // function errorCBVideo(err) {
        //     alert("Error processing SQL: "+err.code);
        // }
		
		
		//Insert query

		function insertDB2(tx) {
			var matricule = document.getElementById("matAgent").value;
			var nomV = $('#nomVideo').val();
            tx.executeSql('INSERT INTO VIDEO (matricule,constat_id,nom,path) VALUES ("'+ matricule +'","'+ idFormu +'","'+nomV+'","'+ fichier +'")');
            $('#nomVideo').val('');
		}



	//trouver valeur du dernier id du formulaire
	function idInfo(tx) {
			tx.executeSql('SELECT constat_id FROM DEMO WHERE constat_id = (SELECT MAX(constat_id) FROM DEMO)', [], querySuccess3, errorCB);
		}

    // Query the success callback
    //
    function querySuccess3(tx, results) {
        var len = results.rows.length;
        for (var i=0; i<len; i++){
        	idFormu = results.rows.item(i).constat_id;
		}
    }

	//insertion dans la BD

		function goInsert2() {
			db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
			db.transaction(function(tx){
				idInfo(tx);
			}
			, errorCB,goInsert3);

		
		}
		
		
		function goInsert3() {
			db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
			db.transaction(function(tx){
				insertDB2(tx, null, fichier);
				
			}
			, errorCB, successCBVideo);
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

function videoName(){
    $(document).on('show.bs.modal', "#videoModal", function (event) {
        $(document).ready(function () {

        })
    })
}


function videoTranscodeSuccess(result) {
    // result is the path to the transcoded video on the device
    console.log('videoTranscodeSuccess, result: ' + result);
}

function videoTranscodeError(err) {
    console.log('videoTranscodeError, err: ' + err);
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
	






