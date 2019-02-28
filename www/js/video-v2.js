//Fichier pour la gestion de la table des vidéos

var fichier = null;
var idFormu = null;

//Création de la table vidéo
function populateDBVideo(tx) {
	tx.executeSql('CREATE TABLE IF NOT EXISTS videos (matricule, constat_id INTEGER, id_video INTEGER PRIMARY KEY AUTOINCREMENT, nom, path, videoSync INTEGER,dossier_id, FOREIGN KEY(constat_id) REFERENCES constats(constat_id))');
}

// Lancer la requête pour sélectionner tout dans la table
function getVideosNonSync() {
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(function(tx){
		tx.executeSql('SELECT * FROM videos WHERE videoSync = ?', [0], afficherTableVideo, errorCB);
	}, errorCB);
}

//dessiner BD  /////TEMPORAIRE POUR LA PROGRAMMATION
function afficherTableVideo(tx, results) {
	var table02 = $('#tbl1 tbody');
	table02.html('');
	var len = results.rows.length;
	for (var i = 0; i < len; i++) {
		table02.append(
		'<tr>'
			+ '<td data-title="matricule" data-desc="matricule" class="hidden">'+results.rows.item(i).matricule +'</td>'
			+ '<td data-title="constat_id" data-desc="constat_id" class="hidden">'+results.rows.item(i).constat_id +'</td>'
			+ '<td data-title="dossier_id" data-desc="dossier_id" class="hidden">'+results.rows.item(i).dossier_id +'</td>'
			+ '<td data-title="Numéro du vidéo" data-desc="id_video">'+results.rows.item(i).id_video +'</td>'
            + '<td data-title="Nom du vidéo" data-desc="nom">'+results.rows.item(i).nom +'</td>'
			+ '<td data-title="path" data-desc="path" class="">'+results.rows.item(i).path +'</td>'
            + '<td data-title="videoSync" data-desc="videoSync" class="hidden">'+results.rows.item(i).videoSync +'</td>'+
		'</tr>'
		);
	}
}

// $('button[name="btnDropTableVideos"]').on('click',function(){
// //Drop la table video,
// 	db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
// 	db.transaction(function(tx){
// 		tx.executeSql('DROP TABLE IF EXISTS videos',[],function(){
// 			console.log('Table videos droppée');
// 			$('#cf1').empty();
// 			onDeviceReady();
// 		});
// 	}, errorCB);
// });

// $('#enrVideo').on('click',function(){
// 	getVideo();
// });


///TODO:: à mettre lors de l'ajout/edition/suppression de video et lors de la creation d'un constat mettre le # en suffix pour éviter les noms identiques de vidéo
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
			function(){ deferred.resolve()},//Succès, on est heureux et on continue!
			function(error){deferred.reject(error)}); //Échec de l'update du nombre de video, on retourne le message d'erreur
	}
		,deferred.reject()//Erreur lors de la transaction, on reject même si le reject du executeSql devrait avoir eu lieu...
	);
	return deferred.promise();
}



//Lancer la requête d'insertion
function insertVideoDB(nameVideo) {
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(function(tx){
		//Fetch le dernier ID du constat
			tx.executeSql('SELECT MAX(constat_id) as constat_id FROM constats', [], function(tx,results) {
				var nomVideo = $('#nomVideo'); //J'ai changé nomVideo.val() par nameVideo dans tx.excuteSQL
				tx.executeSql('INSERT INTO videos (matricule,constat_id,nom,path,videoSync) VALUES (?,?,?,?,?)', [$("#matAgent").val(), results.rows.item(0).constat_id, nomVideo.val(), nameVideo,0],function(tx,results){
					//On ajout un item qui permet de voir sous le bouton "Joindre un video", les videos en lien avec le constat. Ça permet aussi de supprimer le/les videos non désiré immédiatement.
					//alert('fp sql:'+filePath);
					$('#listeVideo').append('<li class="list-group-item" data-vid="'+results.insertId+'">'+nomVideo.val()+'&nbsp;&nbsp;&nbsp;&nbsp;<span><i class="fa fa-remove">&nbsp;&nbsp;&nbsp;</i></span></li>');
					nomVideo.val('');
				});
			});
        },
		errorCB,
		getVideosNonSync()
	);
}

//Ouvrir la librairie des vidéos
// function getVideo() {
// 		var options = { quality: 80};
// 		options["sourceType"] = 0 | 2 ;//PHOTOLIBRARY
// 		options["mediaType"] = 1; //CAMERA
// 		options["destinationType"] = 1; //NATIVE_URI = 2, FILE_URI = 1
// 		//options["duration"] = 100000;
// 		navigator.camera.getPicture(showModalNomVideo, onFail, options);
// 	}

//Ouverture du modal pour donner un nom à la vidéo prise
function showModalNomVideo(nameVideo){
    console.log('fileURI: ' + nameVideo);
    //affiche le modal pour la sélection du nom du video et utilise le nom de rue comme base,
    $('#videoModal').modal('show').on('shown.bs.modal',function(){
        var nbrvideo = $('#listeVideo li').length;
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
        if(nbrvideo >0)
            nomRue += '('+nbrvideo+')';

        $('#nomVideo').val(nomRue);

    }).on('hide.bs.modal',function(event){
        if($('#nomVideo').val()=="" && nameVideo.length < 1){
            alert('Vous devez inscrire un nom de video');
            $('#nomVideo').focus();
            return false;
        }
        else if(nameVideo.length > 0){
            // var fileName = $('#nomVideo').val()+'.mov';
            // var fileName = $('#nomVideo').val();
            // var fileName=fileURI;
			insertVideoDB(nameVideo);
            nameVideo = '';
        }
    });
    $('#nomVideo').val("")
}

//Variable du nom de la vidéo, utilisé pour le déplacement de la vidéo
// var nameVideo;

//Succès de la prise de vidéo
var captureSuccess = function(mediaFiles) {
    var i, path, len;
    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
        //Chemin d'accès vers la vidéo
        path = 'file://'+mediaFiles[i].fullPath;
        //Nom de la vidéo dans le fichier par défaut
        var nameVideo = mediaFiles[i].name;
        //nom requete
		var requete = 'insertion';
        //Aller chercher la vidéo prise, puis lancer la fonction de déplacement de la vidéo
        window.resolveLocalFileSystemURI(path, function(entry){
        	resolveOnSuccess(entry,requete,nameVideo)}, resOnError
        );
    }
};

// capture error callback
var captureError = function(error) {
    if (error.code == '3' ){
        navigator.notification.alert('', null, 'Enregistrement annulé');
    }
    else {
        navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
    }
};

//Débuter l'enregistrement de la vidéo lorsque l'on clique sur le bouton Joindre une vidéo
$('#enrVideo').on('click',function() {
    navigator.device.capture.captureVideo(captureSuccess, captureError, {limit: 1});
});

//fonction pour déplacer le vidéo vers une fichier PERSISTANT au lieu de TEMPORARY
function resolveOnSuccess(entry,requete,nameVideo){
	console.log('type de requete: '+requete);
    var newFileName = nameVideo;
    var myFolderApp="";
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) {
            //The folder is created if doesn't exist
            fileSys.root.getDirectory(myFolderApp,
                {create:true, exclusive: false},
                function(directory) {
                    entry.moveTo(directory, newFileName,  function(entry){successMove(entry,requete,nameVideo)}, resOnError);
                },
                resOnError);
        },
        resOnError);

}
//Succès du déplacement de la vidéo
function successMove(entry,requete,nameVideo) {
	if (requete == "insertion" ){
        showModalNomVideo(nameVideo);
    }
    else if (requete == "ajout"){
        showModalNomVideoAjout(nameVideo);
	}
    else if (requete == "edition"){
        showModalNomVideoEdit(nameVideo);
    }
}

//Erreur du déplacement de la vidéo
function resOnError(error) {
    alert(error.code);
}







