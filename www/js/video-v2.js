//Fichier pour la gestion de la table des vidéos

var fichier = null;
var idFormu = null;


//$(function(){
//	$('#fileupload').fileupload(
//		'option',{
//			url:'http://constats.ville.valdor.qc.ca/api/v1/sync/video',
//			sequentialUpload: true,
//			paramName:'file[]'
//		}
//	);
//});

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

$('#enrVideo').on('click',function(){
	getVideo();
})

function getNbrVideoParConstat(constat_id){
	var deferred = new $.Deferred();
	db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
	db.transaction(function (tx, constat_id) {
		tx.executeSql('SELECT COUNT(*) AS nbrVideo FROM videos WHERE constat_id = ?', [constatID],
			function(result){deferred.resolve(result.rows.item(0).nbrVideo)},//Succès, on retourne le nombre de video
			function(error){deferred.reject(error)});
	});
	return deferred.promise();
}

function setNbrVideoParConstat(constat_id,nbrVideo){
	var deferred = new $.Deferred();
	db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
	db.transaction(function (tx) {
		tx.executeSql('UPDATE constats SET nbrVideo=? WHERE constat_id =?',[nbrVideo,constat_id],
			function(result){ deferred.resolve()},//Succès, on est heureux et on continue!
			function(error){deferred.reject(error)})//Échec de l'update du nombre de video, on retourne le message d'erreur
	}
		,deferred.reject()//Erreur lors de la transaction, on reject même si le reject du executeSql devrait avoir eu lieu...
	);
	return deferred.promise();
}

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
		navigator.camera.getPicture(showModalNomVideo, onFail, options);
	}

function showModalNomVideo(fileURI){
	//affiche le modal pour la sélection du nom du video et utilise le nom de rue comme base,
	$('#videoModal').modal('show').on('shown.bs.modal',function(){
		var nomRue;
		if($('#noCivTxt_c').val() !== '' && $('#rueTxt_c').val() !== ''){
			nomRue = $('#noCivTxt_c').val() + ' ' + $('#rueTxt_c').val();
		}
		else if($('#noCivTxtEdit_c').val() !== '' && $('#rueTxtEdit_c').val() !== ''){
			 nomRue = $('#noCivTxtEdit_c').val() + ' ' + $('#rueTxtEdit_c').val();
		}
		else{
			 nomRue = '';
		}
		$('#nomVideo').val(nomRue);


	}).on('hide.bs.modal',function(event){
		if(!$('#nomVideo').val() && fileURI.length < 1){
			alert('Vous devez inscrire un nom de video');
			$('#nomVideo').focus();
			return false;
		}
		else if(fileURI.length > 0){
			//à la fermeture, on déplace le video dans le répertoire de l'app via FileTransfer, nous devrions le faire via xhr2 éventuellement
			onVideoSuccess(fileURI);
			fileURI = '';
		}

	})
}

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
					//$('#videoThumbnail').fadeIn();
					//$('#video').attr('src',filePath);
					//function capture(){
					//	var canvas = document.getElementById('canvas');
					//	var video = document.getElementById('video');
					//video.preload = 'metadata';
					//	video.src=filePath;
					//	canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
					//}
					//capture();
                },
                function(error){
                    alert(JSON.stringify(error));
                }
            );

//Lancer la requête d'insertion dans la table vidéo
		insertVideoDB(filePath);
	}

//Callback d'erreur de l'ouverture de la librairie des vidéos/est callé si aucun video n'est choisi aussi...
	function onFail(err) {
		alert("Impossible d'ouvrir la sélection des videos. Erreur # "+err.code);
	}








