//Fichier pour la gestion de la table des vidéos

var fichier = null;
var idFormu = null;

//Création de la table vidéo
function populateDBVideo(tx) {
	tx.executeSql('CREATE TABLE IF NOT EXISTS videos (matricule, constat_id INTEGER, id_video INTEGER PRIMARY KEY AUTOINCREMENT, nom, path, videoSync INTEGER, FOREIGN KEY(constat_id) REFERENCES constats(constat_id))');
}

// Lancer la requête pour sélectionner tout dans la table
function successCBVideo() {
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(function(tx){
		tx.executeSql('SELECT * FROM videos', [], querySuccessVideo, errorCB);
	}, errorCB);
}

//dessiner BD  /////TEMPORAIRE POUR LA PROGRAMMATION
function querySuccessVideo(tx, results) {
	var table02 = $('#tbl1 tbody');
	table02.html('');
	var len = results.rows.length;
	for (var i = 0; i < len; i++) {
		table02.append(
		'<tr>'
			+ '<td data-title="matricule" data-desc="matricule" class="hidden">'+results.rows.item(i).matricule +'</td>'
			+ '<td data-title="constat_id" data-desc="constat_id" class="hidden">'+results.rows.item(i).constat_id +'</td>'
			+ '<td data-title="Numéro du vidéo" data-desc="id_video">'+results.rows.item(i).id_video +'</td>'
            + '<td data-title="Nom du vidéo" data-desc="nom">'+results.rows.item(i).nom +'</td>'
			+ '<td data-title="path" data-desc="path" class="hidden">'+results.rows.item(i).path +'</td>'
            + '<td data-title="videoSync" data-desc="videoSync" class="hidden">'+results.rows.item(i).videoSync +'</td>'+
		'</tr>'
		);
	}
}
$('button[name="btnDropTableVideos"]').on('click',function(){
//Drop la table video,
	db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
	db.transaction(function(tx){
		tx.executeSql('DROP TABLE IF EXISTS videos',[],function(){
			$('#cf1').empty();
			onDeviceReady();
		});
	}, errorCB);
});




//Lancer la requête d'insertion
function insertVideoDB(filePath) {

    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(function(tx){
		//Fetch le dernier ID du constat
			tx.executeSql('SELECT MAX(constat_id) as constat_id FROM constats', [], function(tx,results) {
				var nomVideo = $('#nomVideo');
				tx.executeSql('INSERT INTO videos (matricule,constat_id,nom,path,videoSync) VALUES (?,?,?,?,?)', [$("#matAgent").val(), results.rows.item(0).constat_id, nomVideo.val(), filePath,0]);
				nomVideo.val('');
			});
        },
		errorCB,
		successCBVideo
	);
}

//Ouvrir la librairie des vidéos
	function getVideo() {
		var options = { quality: 80 };
		options["sourceType"] = 0 | 2; 
		options["mediaType"] = 1;
		options["destinationType"] = 2;
		//options["duration"] = 100000;
		navigator.camera.getPicture(onVideoSuccess, onFail, options);
	}

function copieVideoStockageInterne(sourceFileURI){
	var nomVideo = $('#nomVideo').val();
	console.log('fichier temporaire: ', sourceFileURI);
	console.log('destination: ',cordova.file.dataDirectory);
}
 //function onVideoSuccess(fileuri, mediaFiles) {
	// var nomVid = $('#nomVideo').val();
	// console.log(fileuri);
	// console.log(cordova.file.dataDirectory);
	// window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
	// window.requestFileSystem(1, 0,function (fs) {
	//	fs.root.getFile(nomVid+".mov" , { create: true, exclusive: false }, function (fileEntry) {//
	//		//alert('fileEntry is file? ' + fileEntry.isFile.toString());
	//		console.log(JSON.stringify(fileEntry));
	//		var oReq = new XMLHttpRequest();
	//		// Make sure you add the domain name to the Content-Security-Policy <meta> element.
	//		oReq.open("GET", fileuri, true);
	//		// Define how you want the XHR data to come back
	//		//oReq.responseType = "blob";
	//		oReq.responseText = "arrayBuffer";
	//		oReq.onload = function (oEvent) {
	//			var blob = oReq.response; // Note: not oReq.responseText
	//			console.log('response ',oReq.response);
	//			console.log('event ' ,oEvent);
	//			if (blob) {
	//				// Create a URL based on the blob, and set an <img> tag's src to it.
	//				//var url = window.URL.createObjectURL(blob);
	//				//document.getElementById('bot-img').src = url;
	//				//// Or read the data with a FileReader
	//				var reader = new FileReader();
	//				reader.addEventListener("loadend", function() {
	//					// reader.result contains the contents of blob as text
	//					alert("done");
	//					console.log(reader);
	//				});
	//				reader.readAsText(blob);
	//				console.log('blob:');
	//				console.log(blob);
	//				console.log('apres blob');
 //
	//			} else alert('we didnt get an XHR response!');
	//		};
	//		console.log('oreq:');
	//		oReq.send();
	//		console.log(oReq.response);
	//		console.log('apres oreq');
	//	}, function (err) {console.log('err:'); console.error(JSON.stringify(err)); });
	//}, function (err) { console.error('error getting persistent fs! ' + err); });
 //
	// //goInsert2(filePath);
 //}


//Envoyer la vidéo dans un nouveau répertoire
	function onVideoSuccess(fileURI, mediaFiles) {
		var nomVid = $('#nomVideo').val();
		var filePath = cordova.file.documentsDirectory +nomVid+".mov";
		var ft = new FileTransfer();
            ft.download(
				fileURI,
                filePath,
                function(entry){
                    //alert("file copy success");
					//alert(JSON.stringify(entry));
                },
                function(error){
                    alert(JSON.stringify(error));
                }
            );
//Lancer la requête d'insertion dans la table vidéo
		insertVideoDB(filePath);
	}


//Callback d'erreur de l'ouverture de la librairie des vidéos
	function onFail(err) {
		alert("Impossible d'ouvrir la sélection des videos. Erreur #"+err.code);
	}








