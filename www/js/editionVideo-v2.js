//Fichier pour l'édition des vidéos dans l'édition des formulaires


//dessiner la table des vidéo POUR LA PROGRAMMATION
function querySuccessVideoEdit(tx, results) {
    var table02 = $('#tblVideoEdit tbody');
    table02.html('');
    for (var i = 0; i < results.rows.length; i++) {
        table02.append(
            '<tr id="'+i+'">'
            + '<td data-title="matricule" data-desc="matricule" class="hidden">'+results.rows.item(i).matricule +'</td>'
            + '<td data-title="constat_id" data-desc="constat_id" class="hidden">'+results.rows.item(i).constat_id +'</td>'
            + '<td data-title="Numéro de la vidéo" data-desc="id_video">'+results.rows.item(i).id_video +'</td>'
            + '<td data-title="Nom de la vidéo" data-desc="nom">'+results.rows.item(i).nom +'</td>'
            + '<td data-title="path" data-desc="path" class="hidden">'+results.rows.item(i).path +'</td>'
            + '<td><button onclick="getVideoEdit()" type="button" data-videoid="'+results.rows.item(i).id_video+'">Modifier</button>'
            // + '<td><button type="button" data-toggle="modal" data-target="#videoModalEdit" data-videoid="'+results.rows.item(i).id_video+'">Modifier</button>'
            + '<button type="button" onclick="removeVideo('+results.rows.item(i).id_video+','+i+')" class="btn btn-default btn1 btn-rouge">Supprimer</button></td>'+
            //+ '<td><button type="button"  onClick="uploadVideoSucces('+results.rows.item(i).id_video+','+i+')">Synchronisation</button></td>'+
            '</tr>'
        );
    }
}

//Lancer une requête à la BD
function videoConstat(){
        db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
        db.transaction(function(tx){
            tx.executeSql('SELECT * FROM videos WHERE constat_id = ?', [constat], querySuccessVideoEdit, errorCB)
        },
            errorCB);
}

//Lancer la requête pour la suppression
function removeVideo(idVideo,i){
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(function(tx) {
        tx.executeSql('DELETE FROM videos WHERE id_video = ?', [idVideo],null, errorCB);
        $("#"+ i ).empty();
    }, errorCB);
}

//Ouvrir la librairie des vidéos
// function getVideoEdit() {
//     var options = { quality: 80 };
//     options["sourceType"] = 0 | 2;
//     options["mediaType"] = 1;
//     options["destinationType"] = 2;
//     navigator.camera.getPicture(onVideoSuccessEdit, onFail, options);
// }

//Ouverture du modal pour donner un nom à la vidéo prise
function showModalNomVideoEdit(fileURI){
    console.log('fileURI: ' + fileURI);
    //affiche le modal pour la sélection du nom du video et utilise le nom de rue comme base,
    $('#videoModalAjout').modal('show').on('shown.bs.modal',function(){
    }).on('hide.bs.modal',function(event){
        if($('#nomVideoEdit').val() =="" && fileURI.length < 1){
            alert('Vous devez inscrire un nom de video');
            $('#nomVideoEdit').focus();
            return false;
        }
        else if(fileURI.length > 0){
            var fileName = $('#nomVideoEdit').val()+'.mov';

            insertVideo(fileName);

            fileURI = '';
        }
    });
    $('#nomVideoAjout').val("");
    modifVideo(fileURI);
}


// Si l'enregistrement de la vidéo à fonctionner, ouvrir le modal
var captureSuccessAjout = function(mediaFiles) {
    var i, path, len;
    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
        //Chemin d'accès vers la vidéo
        path = mediaFiles[i].fullPath;
        //Ouvrir le modal pour donner une nom à la vidéo
        showModalNomVideoEdit(path)
        // do something interesting with the file
    }
};

//Débuter l'enregistrement de la vidéo lorsque l'on clique sur le bouton Joindre une vidéo
function getVideoEdit() {
    navigator.device.capture.captureVideo(captureSuccessAjout, captureError, {limit: 1});
};







//Copier le vidéo sélectionné dans un nouveau répertoire
// function onVideoSuccessEdit(fileURI) {
//     //fichierEdit = fileuriEdit;
//     //Le nom de la vidéo est celui entrer dans le champ texte
//     var nomVideo = $('#nomVideoEdit').val();
//     //var sourceFilePath = fileuriEdit;
//     //Le nouveau path de la vidéo
//     var filePath = cordova.file.documentsDirectory +nomVideo+".mov";
//     var ft = new FileTransfer();
//     ft.download(
//         fileURI,
//         filePath,
//         function(entry){
//             console.log('Video déplacer du cache correctement ', JSON.stringify(entry));
//         },
//         function(error){
//             alert("La copie de la vidéo n'a pas été effectuée");
//             console.log('Erreur lors de la copie vidéo ', JSON.stringify(error));
//         }
//     );
//     //Lancer la fonction pour modifier le path de la vidéo dans la table
//     modifVideo(filePath);
// }

//Lancer la requête pour modifier la vidéo relié au formulaire
function modifVideo(filePath){
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(function(tx){
        //videoModification(tx, filePath)
        var idVideo = $("#idvideo").val();
        alert('idVideo:'+idVideo);
        var nomVideo = $('#nomVideoEdit').val();
        tx.executeSql('UPDATE videos SET nom = ?, path = ? WHERE id_video = ?', [nomVideo,filePath,idVideo],null, errorCB);
        //Lancer la fonction pour raffraichir la visualisation de la table vidéo
        videoConstat();
        $('#nomVideo').val('');
    }, errorCB);
}


//////////////////////////////////////////////////AJOUT VIDÉO///////////////////////////////////////

//Ouverture du modal pour donner un nom à la vidéo prise
function showModalNomVideoAjout(fileURI){
    console.log('fileURI: ' + fileURI);
    //affiche le modal pour la sélection du nom du video et utilise le nom de rue comme base,
    $('#videoModalAjout').modal('show').on('shown.bs.modal',function(){
    }).on('hide.bs.modal',function(event){
        if($('#nomVideoAjout').val()=="" && fileURI.length < 1){
            alert('Vous devez inscrire un nom de video');
            $('#nomVideoAjout').focus();
            return false;
        }
        else if(fileURI.length > 0){
            var fileName = $('#nomVideoAjout').val()+'.mov';

            insertVideo(fileName);

            fileURI = '';
        }
    });
    $('#nomVideoAjout').val("");
}
//
// $('#EnrVideoAjout').click(function() {
//     videoConstat()
// });




/////////////////////////////////////test/////////////////////
// Si l'enregistrement de la vidéo à fonctionner, ouvrir le modal
var captureSuccessEdit = function(mediaFiles) {
    var i, path, len;
    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
        //Chemin d'accès vers la vidéo
        path = mediaFiles[i].fullPath;
        //Ouvrir le modal pour donner une nom à la vidéo
        showModalNomVideoAjout(path)
        // do something interesting with the file
    }
};

// capture error callback
var captureError = function(error) {
    navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
};

//Débuter l'enregistrement de la vidéo lorsque l'on clique sur le bouton Joindre une vidéo
function getVideoAjout() {
    navigator.device.capture.captureVideo(captureSuccessEdit, captureError, {limit: 1});
};

//////////////////////////////////////////////////////////////////////////////////


//Ajout de vidéo au constat
//Ouverture de la librairie de vidéo
// function getVideoAjout() {
//     var options = { quality: 80 };
//     options["sourceType"] = 0 | 2;
//     options["mediaType"] = 1;
//     options["destinationType"] = 2;
//     navigator.camera.getPicture(onVideoSuccessAjout, onFail, options);
// }

//Copier la vidéo dans un nouveau répertoire
function onVideoSuccessAjout(fileURIAjout) {
    var nomVid = $('#nomVideoAjout').val();
    var filePath = cordova.file.documentsDirectory +nomVid+".mov";
    var ft = new FileTransfer();
    ft.download(
        fileURIAjout,
        filePath,
        function(entry){
            // Succès!
        },
        function(error){
            alert(JSON.stringify(error));
        }
    );
    //Lancer la fonction pour insérer la vidéo dans la table
    insertVideo(filePath);
}

//Lancer la requête pour insérer la vidéo dans la table
function insertVideo(filePath){
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(function(tx){
            tx.executeSql('INSERT INTO videos (matricule,constat_id,nom,path, videoSync) VALUES (?,?,?,?,?)',[$('#matAgent').val(),$("#idCache").val(),$('#nomVideoAjout').val(),filePath,0],function(success){console.log(success);},function(err){console.log(JSON.stringify(err));});
            $('#nomVideoAjout').val('');
        }
        , errorCB, videoConstat); //getVideosNonSync);
}


//modal
$(document).on('show.bs.modal','#videoModalEdit', function (event) {
    var button = $(event.relatedTarget) ;
    var idVid = button.data('videoid');
    alert(idVid);
    $("#idvideo").val(idVid);
});

//Supprime le video qui est dans la liste sous le bouton "Joindre une video" dans l'onglet Formulaire
$(document).on('click touchstart','#listeVideo span',function(){//Le event touchstart est requis pour le ipad car il ne semble pas supporter le simple event Click ...
    var idVideo = $(this).closest('li').data('vid');
    removeVideo(idVideo);
    $('#listeVideo').find($(this).closest('li')).fadeOut('slow');
});

