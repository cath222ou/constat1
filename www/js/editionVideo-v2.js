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
            + '<td><button id="buttonEdit" onclick="getVideoEdit('+results.rows.item(i).id_video+')" type="button" data-videoid="'+results.rows.item(i).id_video+'">Modifier</button>'
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

//Ouverture du modal pour donner un nom à la vidéo prise
function showModalNomVideoEdit(nameVideo){
    console.log('fileURI: ' + nameVideo);
    //affiche le modal pour la sélection du nom du video et utilise le nom de rue comme base,
    $('#videoModalEdit').modal('show').on('shown.bs.modal',function(){
    }).on('hide.bs.modal',function(event){
        if($('#nomVideoEdit').val()=="" && nameVideo.length < 1){
            alert('Vous devez inscrire un nom de video');
            $('#nomVideoEdit').focus();
            return false;
        }
        else if(nameVideo.length > 0){
            // var fileName = $('#nomVideoAjout').val()+'.mov';

            insertVideo(nameVideo);

            nameVideo = '';
        }
        modifVideo(nameVideo);
    });
}


// Si l'enregistrement de la vidéo à fonctionner, ouvrir le modal
var captureSuccessAjout = function(mediaFiles) {
    var i, path, len, nameVideo, requete;
    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
        //Chemin d'accès vers la vidéo
        path ='file://'+ mediaFiles[i].fullPath;
        nameVideo = mediaFiles[i].name;
        requete = 'edition'
        //Ouvrir le modal pour donner une nom à la vidéo
        // showModalNomVideoEdit(path)
        // do something interesting with the file
        //Aller chercher la vidéo prise, puis lancer la fonction de déplacement de la vidéo
        window.resolveLocalFileSystemURI(path, function(entry){
            resolveOnSuccess(entry,requete,nameVideo)}, resOnError
        );
    }
};

//Débuter l'enregistrement de la vidéo lorsque l'on clique sur le bouton Joindre une vidéo
function getVideoEdit(idVid) {
         $("#idvideo").val(idVid);
    navigator.device.capture.captureVideo(captureSuccessAjout, captureError, {limit: 1});
};


//Lancer la requête pour modifier la vidéo relié au formulaire
function modifVideo(filePath){
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(function(tx){
        //videoModification(tx, filePath)
        var idVideo = $("#idvideo").val();
        var nomVideo = $('#nomVideoEdit').val();
        alert('id Video:'+idVideo);
        alert('nom Video:'+nomVideo);
        alert('path:'+filePath);
        tx.executeSql('UPDATE videos SET nom = ?, path = ? WHERE id_video = ?', [nomVideo,filePath,idVideo],null, errorCB);
        //Lancer la fonction pour raffraichir la visualisation de la table vidéo
        videoConstat();
        $('#nomVideoEdit').val('');
    }, errorCB);
}


//////////////////////////////////////////////////AJOUT VIDÉO///////////////////////////////////////

//Ouverture du modal pour donner un nom à la vidéo prise
function showModalNomVideoAjout(nameVideo){
    console.log('fileURI: ' + nameVideo);
    //affiche le modal pour la sélection du nom du video et utilise le nom de rue comme base,
    $('#videoModalAjout').modal('show').on('shown.bs.modal',function(){
    }).on('hide.bs.modal',function(event){
        if($('#nomVideoAjout').val()=="" && nameVideo.length < 1){
            alert('Vous devez inscrire un nom de video');
            $('#nomVideoAjout').focus();
            return false;
        }
        else if(nameVideo.length > 0){
            // var fileName = $('#nomVideoAjout').val()+'.mov';

            insertVideo(nameVideo);

            nameVideo = '';
        }
    });
    $('#nomVideoAjout').val("");
}


// Si l'enregistrement de la vidéo à fonctionner, ouvrir le modal
var captureSuccessEdit = function(mediaFiles) {
    var i, path, len;
    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
        //Chemin d'accès vers la vidéo
        path = 'file://'+mediaFiles[i].fullPath;
        alert(path);
        var nameVideo = mediaFiles[i].name;
        var requete = "ajout" ;
        window.resolveLocalFileSystemURI(path, function(entry){
            resolveOnSuccess(entry,requete,nameVideo)}, resOnError);

        //Ouvrir le modal pour donner une nom à la vidéo
        // showModalNomVideoAjout(path)
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
// $(document).on('show.bs.modal','#videoModalEdit', function (event) {
//     var button = $(event.relatedTarget) ;
//     var idVid = button.data('videoid');
//     alert('idVidedo'+idVid);
//     $("#idvideo").val(idVid);
// });



//Supprime le video qui est dans la liste sous le bouton "Joindre une video" dans l'onglet Formulaire
$(document).on('click touchstart','#listeVideo span',function(){//Le event touchstart est requis pour le ipad car il ne semble pas supporter le simple event Click ...
    var idVideo = $(this).closest('li').data('vid');
    removeVideo(idVideo);
    $('#listeVideo').find($(this).closest('li')).fadeOut('slow');
});

