var fichier = null;
var idFormu = null;

		//Table vidéo
		
		function populateDBVideo(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS VIDEO (matricule, constat_id INTEGER, id_video INTEGER PRIMARY KEY AUTOINCREMENT, nom, path, videoSync INTEGER, FOREIGN KEY(constat_id) REFERENCES DEMO(constat_id))');
        }

		
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
					+ '<td data-title="path">'+results.rows.item(i).path +'</td>'
                    + '<td data-title="videoSync">'+results.rows.item(i).videoSync +'</td>'+
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

		
		//Insert query

		function insertDB2(tx, filePath) {
			var matricule = document.getElementById("matAgent").value;
			var nomV = $('#nomVideo').val();
			//console.log(fichier);
            tx.executeSql('INSERT INTO VIDEO (matricule,constat_id,nom,path,videoSync) VALUES ("'+ matricule +'","'+ idFormu +'","'+nomV+'","'+ filePath +'","'+0+'")');
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

		function goInsert2(filePath) {

			db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
			db.transaction(function(tx){
				idInfo(tx);
			}
			, errorCB,function(){goInsert3(filePath)});
		}
		
		
		function goInsert3(filePath) {

			db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
			db.transaction(function(tx){
				insertDB2(tx, filePath);
				
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
	
	
	function onVideoSuccess(fileuri, mediaFiles) {
        //var taille = mediaFiles[0].size;
        //console.log('alo',taille);
		fichier = fileuri;
		var nomVid = $('#nomVideo').val();
		var sourceFilePath = fichier;
		var filePath = cordova.file.documentsDirectory +nomVid+".mov";
		var ft = new FileTransfer();
            ft.download(
                sourceFilePath,
                filePath,
                function(entry){
                    alert("file copy success");
					//alert(JSON.stringify(entry));
                },
                function(error){
                    alert(JSON.stringify(error));
                }
            );

        goInsert2(filePath);
	}



	function onFail(err) {
		console.log("onFail");
	}








