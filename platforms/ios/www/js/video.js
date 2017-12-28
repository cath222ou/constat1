//Fichier pour la gestion de la table des vidéos

var fichier = null;
var idFormu = null;

//Création de la table vidéo
function populateDBVideo(tx) {
	tx.executeSql('CREATE TABLE IF NOT EXISTS VIDEO (matricule, constat_id INTEGER, id_video INTEGER PRIMARY KEY AUTOINCREMENT, nom, path, videoSync INTEGER, FOREIGN KEY(constat_id) REFERENCES DEMO(constat_id))');
}

// Lancer la requête pour sélectionner tout dans la table
function successCBVideo() {
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(queryDBVideo, errorCB);
}

// Sélectionner tout dans la table vidéo
function queryDBVideo(tx) {
    tx.executeSql('SELECT * FROM VIDEO', [], querySuccessVideo, errorCB);
}

		
//dessiner BD  /////TEMPORAIRE POUR LA PROGRAMMATION
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
		
//Supprimer BD ///TEMPORAIRE
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


//Lancer la requête d'insertion dans la table vidéo
function goInsert2(filePath) {
	db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
	db.transaction(function(tx){
	    //Lancer la requête pour avoir le dernier numéro de constat_id
		idInfo(tx);
	}, errorCB,function(){goInsert3(filePath)});
}

//trouver valeur du dernier constat_id du formulaire
function idInfo(tx) {
    tx.executeSql('SELECT constat_id FROM DEMO WHERE constat_id = (SELECT MAX(constat_id) FROM DEMO)', [], querySuccess3, errorCB);
}

// Donner à la variable idFormu la valeur du dernier constat
function querySuccess3(tx, results) {
    var len = results.rows.length;
    for (var i=0; i<len; i++){
        idFormu = results.rows.item(i).constat_id;
    }
}

//Lancer la requête d'insertion
function goInsert3(filePath) {
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(function(tx){
        //Lancer la requête d'insertion
        insertDB2(tx, filePath);
        }
			, errorCB, successCBVideo);
}

//Insérer les données dans la table Vidéo
function insertDB2(tx, filePath) {
    //ID selon le matricule de l'agent
    var matricule = document.getElementById("matAgent").value;
    //Nom de la vidéo choisi par l'utilisateur
    var nomV = $('#nomVideo').val();
    tx.executeSql('INSERT INTO VIDEO (matricule,constat_id,nom,path,videoSync) VALUES ("' + matricule + '","' + idFormu + '","' + nomV + '","' + filePath + '","' + 0 + '")');
    //Vider le champs texte du nom de la vidéo
    $('#nomVideo').val('');
}

		

//Ouvrir la librairie des vidéos
	function getVideo() {
		var options = { quality: 80 };
		options["sourceType"] = 0 | 2; 
		options["mediaType"] = 1;
		options["destinationType"] = 2;
		options["duration"] = 100000;
		navigator.camera.getPicture(onVideoSuccess, onFail, options);
	}





//  function onVideoSuccess(fileuri, mediaFiles) {
//
// 	fichier = fileuri;
// 	var nomVid = $('#nomVideo').val();
// 	var sourceFilePath = fichier;
// 	var filePath = cordova.file.documentsDirectory +nomVid+".mov";
//      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
//          alert('file system open: ' + fs.name);
//          fs.root.getFile(filePath, { create: true, exclusive: false }, function (fileEntry) {
//              alert('fileEntry is file? ' + fileEntry.isFile.toString());
//              var oReq = new XMLHttpRequest();
//              // Make sure you add the domain name to the Content-Security-Policy <meta> element.
//              oReq.open("GET", sourceFilePath, true);
//              oReq.send(null);
//          }, function (err) { alert('error getting file! ' + JSON.parse(err))});
//      }, function (err) { alert('error getting persistent fs! ' + JSON.parse(err))});
//
//
//    goInsert2(filePath);
// }


//Envoyer la vidéo dans un nouveau répertoire
	function onVideoSuccess(fileuri, mediaFiles) {

		fichier = fileuri;
		var nomVid = $('#nomVideo').val();
		var sourceFilePath = fichier;
		var filePath = cordova.file.documentsDirectory +nomVid+".mov";
		var ft = new FileTransfer();
            ft.download(
                sourceFilePath,
                filePath,
                function(entry){
                  //  alert("file copy success");
					//alert(JSON.stringify(entry));
                },
                function(error){
                    alert(JSON.stringify(error));
                }
            );
//Lancer la requête d'insertion dans la table vidéo
        goInsert2(filePath);
	}


//Callback d'erreur de l'ouverture de la librairie des vidéos
	function onFail(err) {
		console.log("onFail");
	}








