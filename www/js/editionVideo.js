//Fichier pour l'édition des vidéos dans l'édition des formulaires

var fichierEdit;

//dessiner la table des vidéo POUR LA PROGRAMMATION
function querySuccessVideoEdit(tx, results) {
    var table02 = $('#tblVideoEdit tbody');
    table02.html('');
    var len = results.rows.length;
    for (var i = 0; i < len; i++) {
        table02.append(
            '<tr id="'+i+'">'
            + '<td data-title="matricule" data-desc="matricule" class="hidden">'+results.rows.item(i).matricule +'</td>'
            + '<td data-title="constat_id" data-desc="constat_id" class="hidden">'+results.rows.item(i).constat_id +'</td>'
            + '<td data-title="Numéro de la vidéo" data-desc="id_video">'+results.rows.item(i).id_video +'</td>'
            + '<td data-title="Nom de la vidéo" data-desc="nom">'+results.rows.item(i).nom +'</td>'
            + '<td data-title="path" data-desc="path" class="hidden">'+results.rows.item(i).path +'</td>'
            + '<td><button type="button" data-toggle="modal" data-target="#videoModalEdit" data-videoid="'+results.rows.item(i).id_video+'">Modifier</button>'
            + '<button type="button" onclick="removeVideo('+results.rows.item(i).id_video+','+i+')" class="btn btn-default btn1 btn-rouge">Supprimer</button></td>'+
            //+ '<td><button type="button"  onClick="uploadVideoSucces('+results.rows.item(i).id_video+','+i+')">Synchronisation</button></td>'+
            '</tr>'
        );
    }
}

//Lancer une requête à la BD
function videoConstat(){
        db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
        db.transaction(videoIdConstat, errorCB);
}
//Sélectionner les vidéo en lien avec le constat en édition
function videoIdConstat(tx){
    tx.executeSql('SELECT * FROM VIDEO WHERE constat_id = '+ constat, [], querySuccessVideoEdit, errorCB)
}


//Lancer la requête pour la suppression
function removeVideo(idVideo,i){
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(function(tx){videoSuppression(tx, idVideo, i)}, errorCB);
}
//Supprimer la vidéo lié au formulaire lorsque l'on clique sur le bouton Supprimer
function videoSuppression(tx, idVideo, i){
    tx.executeSql('DELETE FROM VIDEO WHERE id_video = '+ idVideo , [], errorCB);
    $("#"+ i ).empty();
}

//Ouvrir la librairie des vidéos
function getVideoEdit() {
    var options = { quality: 80 };
    options["sourceType"] = 0 | 2;
    options["mediaType"] = 1;
    options["destinationType"] = 2;
    navigator.camera.getPicture(onVideoSuccessEdit, onFail, options);
}

//Copier le vidéo sélectionné dans un nouveau répertoire
function onVideoSuccessEdit(fileuriEdit) {
    fichierEdit = fileuriEdit;
    //Le nom de la vidéo est celui entrer dans le champ texte
    var nomVid = $('#nomVideoEdit').val();
    var sourceFilePath = fichierEdit;
    //Le nouveau path de la vidéo
    var filePath = cordova.file.documentsDirectory +nomVid+".mov";
    var ft = new FileTransfer();
    ft.download(
        sourceFilePath,
        filePath,
        function(entry){
            //alert("file copy success");
            //alert(JSON.stringify(entry));
        },
        function(error){
            alert("La copie de la vidéo n'a pas été effectuée");
        }
    );
    //Lancer la fonction pour modifier le path de la vidéo dans la table
    modifVideo(filePath);
}

//modal
$(document).on('show.bs.modal','#videoModalEdit', function (event) {
    var button = $(event.relatedTarget) ;
    var idVid = button.data('videoid');
    $("#idvideo").val(idVid);
});

//Lancer la requête pour modifier la vidéo relié au formulaire
function modifVideo(filePath){
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(function(tx){videoModification(tx, filePath)}, errorCB);
}

//modifier la vidéo relié au formulaire
function videoModification(tx, filePath){

    var vid = $("#idvideo").val();
    nomVideo = $('#nomVideoEdit').val();
    tx.executeSql('UPDATE VIDEO SET nom ="'+nomVideo+'", path ="'+filePath+'" WHERE id_video='+vid, [], errorCB);
    //Lancer la fonction pour raffraichir la visualisation de la table vidéo
    videoConstat();
}



//Ajout de vidéo au constat
//Ouverture de la librairie de vidéo
function getVideoAjout() {
    var options = { quality: 80 };
    options["sourceType"] = 0 | 2;
    options["mediaType"] = 1;
    options["destinationType"] = 2;
    navigator.camera.getPicture(onVideoSuccessAjout, onFail, options);
}

//Copier la vidéo dans un nouveau répertoire
function onVideoSuccessAjout(fileuriAjout) {
    fichierAjout = fileuriAjout;
    // modifVideo();
    var nomVid = $('#nomVideoEdit').val();
    var sourceFilePath = fichierAjout;
    var filePath = cordova.file.documentsDirectory +nomVid+".mov";
    var ft = new FileTransfer();
    ft.download(
        sourceFilePath,
        filePath,
        function(entry){
           // alert("file copy success");
            //alert(JSON.stringify(entry));
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
            successCBVideoAdd(tx, filePath);
        }
        , errorCB, successCBVideo);
}

//Insérer la vidéo dans la table vidéo
function successCBVideoAdd(tx, filePath){
    var matricule = $('#matAgent').val();
    var nomV = $('#nomVideoAjout').val();
    var idConstat = $("#idCache").val();
    tx.executeSql('INSERT INTO VIDEO (matricule,constat_id,nom,path, videoSync) VALUES ("'+ matricule +'","'+ idConstat +'","'+nomV+'","'+ filePath +'","'+0+'")');
    //Lancer la fonction pour raffraichier la visualisation de la table vidéo
    videoConstat();
    //Vider le champ texte qui contient le nom de la vidéo
    $('#nomVideo').val('');

}