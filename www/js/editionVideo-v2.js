//Fichier pour l'édition des vidéos dans l'édition des formulaires

//Variable utiliser pour créer le nom des vidéos ajoutés
var nbrVideoEdit;

//dessiner la table des vidéo POUR LA PROGRAMMATION
function querySuccessVideoEdit(tx, results) {
    nbrVideoEdit = 0;
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
            + '<td><button class="buttonEditVideo" type="button" data-videoid="'+results.rows.item(i).id_video+'" data-name="'+results.rows.item(i).nom+'" data-event="modifier">Modifier</button>'
            // + '<td><button type="button" data-toggle="modal" data-target="#videoModalEdit" data-videoid="'+results.rows.item(i).id_video+'">Modifier</button>'
            + '<button type="button" data-videoid="'+results.rows.item(i).id_video+'" data-i="'+i+'" class="btn btn-default btn1 btn-rouge buttonEditVideo" data-event="supprimer">Supprimer</button></td>'+
            //+ '<td><button type="button"  onClick="uploadVideoSucces('+results.rows.item(i).id_video+','+i+')">Synchronisation</button></td>'+
            '</tr>'
        );
    }

    //Pour le nom de la vidéo (si plus d'une vidéo)
    for (var i = results.rows.length-1; i < results.rows.length; i++) {
        var myString = results.rows.item(i).nom  ;
        var result = myString.match(/\((.*)\)/);
        if (result == null || result == 0) {
            nbrVideoEdit = 0+1;
        }
        else {
            nbrVideoEdit = parseInt(result[1])+1;
        }
    }
}

//Évènement pour les boutons de la table d'édition des vidéos
$(document).on('click', '.buttonEditVideo',function(){
        var btn = $(this);
        var event = btn.attr('data-event');
        var video_id = btn.attr('data-videoid');
        var video_nom = btn.attr('data-name');
        var i = btn.attr('data-i');

        if (event == "modifier"){

            getVideoEdit(video_id,video_nom)
        }
        else if (event == "supprimer"){
            removeVideo(video_id, i)
        }
});

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
        tx.executeSql('DELETE FROM videos WHERE id_video = ?', [idVideo],videoConstat, errorCB);
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

            // insertVideo(nameVideo);
            modifVideo(nameVideo);

        }
        nameVideo = '';
    });
    $('#nomVideoAjout').val("");
}


// Si l'enregistrement de la vidéo à fonctionner, ouvrir le modal
var captureSuccessAjout = function(mediaFiles) {
    var i, path, len, nameVideo, requete;
    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
        //Chemin d'accès vers la vidéo
        path ='file://'+ mediaFiles[i].fullPath;
        nameVideo = mediaFiles[i].name;
        requete = 'edition';

        //Aller chercher la vidéo prise, puis lancer la fonction de déplacement de la vidéo
        window.resolveLocalFileSystemURI(path, function(entry){
            resolveOnSuccess(entry,requete,nameVideo)}, resOnError
        );
    }
};

//Débuter l'enregistrement de la vidéo lorsque l'on clique sur le bouton Joindre une vidéo
function getVideoEdit(idVid,videoNom) {
         $("#idvideo").val(idVid);
        $('#nomVideoEdit').val(videoNom);
    navigator.device.capture.captureVideo(captureSuccessAjout, captureError, {limit: 1});
};


//Lancer la requête pour modifier la vidéo relié au formulaire
function modifVideo(filePath){
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(function(tx){
        //videoModification(tx, filePath)
        var idVideo = $("#idvideo").val();
        var nomVideo = $('#nomVideoEdit').val();
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
        var nomRue;
        if($('#noCivTxtEdit_c').val() !== '' && $('#rueTxtEdit_c').val() !== ''){
            nomRue = $('#noCivTxtEdit_c').val() + ' ' + $('#rueTxtEdit_c').val();
        }
        else{
            nomRue = '';
        }
        if(nbrVideoEdit >0)
            nomRue += '('+nbrVideoEdit+')';

        $('#nomVideoAjout').val(nomRue);

    }).on('hide.bs.modal',function(event){
        if($('#nomVideoAjout').val()=="" && nameVideo.length < 1){
            alert('Vous devez inscrire un nom de video');
            $('#nomVideoAjout').focus();
            return false;
        }
        else if(nameVideo.length > 0){
            // var fileName = $('#nomVideoAjout').val()+'.mov';
            nbrVideoEdit = 0;
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
        var nameVideo = mediaFiles[i].name;
        var requete = "ajout" ;
        window.resolveLocalFileSystemURI(path, function(entry){
            resolveOnSuccess(entry,requete,nameVideo)}, resOnError);

        //Ouvrir le modal pour donner une nom à la vidéo
        // showModalNomVideoAjout(path)
        // do something interesting with the file

    }
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

