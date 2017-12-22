var fichierEdit;




//dessiner BD
function querySuccessVideoEdit(tx, results) {

    var table02 = $('#tblVideoEdit tbody');
    table02.html('');
    var len = results.rows.length;
    for (var i = 0; i < len; i++) {
        table02.append(
            '<tr id="'+i+'">'
            + '<td data-title="matricule">'+results.rows.item(i).matricule +'</td>'
            + '<td data-title="constat_id">'+results.rows.item(i).constat_id +'</td>'
            + '<td data-title="id_video">'+results.rows.item(i).id_video +'</td>'
            + '<td data-title="nom">'+results.rows.item(i).nom +'</td>'
            + '<td data-title="path">'+results.rows.item(i).path +'</td>'
            + '<td><button type="button" data-toggle="modal" data-target="#videoModalEdit" data-videoid="'+results.rows.item(i).id_video+'">Modifier</button>'
            + '<button type="button" onclick="removeVideo('+results.rows.item(i).id_video+','+i+')" class="btn btn-default btn1" style="background-color:#ff0000; border-color:#b30000">Supprimer</button></td>'
            + '<td><button type="button"  onClick="uploadVideoSucces('+results.rows.item(i).id_video+','+i+')">Synchronisation</button></td>'+
            '</tr>'
        );
    }

}

//Sélectionner les vidéo en lien avec le constat en édition
function videoConstat(){
        db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
        db.transaction(videoIdConstat, errorCB);
}

function videoIdConstat(tx){
    tx.executeSql('SELECT * FROM VIDEO WHERE constat_id = '+ constat, [], querySuccessVideoEdit, errorCB)
}


//Supprimer la vidéo lié au formulaire
function removeVideo(idVideo,i){
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(function(tx){videoSuppression(tx, idVideo, i)}, errorCB);
}

function videoSuppression(tx, idVideo, i){
    tx.executeSql('DELETE FROM VIDEO WHERE id_video = '+ idVideo , [], errorCB);
    $("#"+ i ).empty();
}

function getVideoEdit() {
    var options = { quality: 80 };
    options["sourceType"] = 0 | 2;
    options["mediaType"] = 1;
    options["destinationType"] = 2;
    navigator.camera.getPicture(onVideoSuccessEdit, onFail, options);
}

function onVideoSuccessEdit(fileuriEdit) {
    alert('allo');
    fichierEdit = fileuriEdit;
   // modifVideo();
    var nomVid = $('#nomVideoEdit').val();
    var sourceFilePath = fichierEdit;
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
            alert(JSON.stringify(error));
        }
    );
    modifVideo(filePath);
}

//modal
$(document).on('show.bs.modal','#videoModalEdit', function (event) {
    var button = $(event.relatedTarget) ;// Button that triggered the modal
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var idVid = button.data('videoid');
    $("#idvideo").val(idVid);
})

//Modifier la vidéo relié au formulaire
function modifVideo(filePath){
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(function(tx){videoModification(tx, filePath)}, errorCB);
}

function videoModification(tx, filePath){

    var vid = $("#idvideo").val();
    nomVideo = $('#nomVideoEdit').val();
    tx.executeSql('UPDATE VIDEO SET nom ="'+nomVideo+'", path ="'+filePath+'" WHERE id_video='+vid, [], errorCB);
    videoConstat();
  //  tx.executeSql('SELECT * FROM VIDEO', [],querySuccessVideo, errorCB);
}



//Ajout de vidéo au constat

function getVideoAjout() {
    var options = { quality: 80 };
    options["sourceType"] = 0 | 2;
    options["mediaType"] = 1;
    options["destinationType"] = 2;
    navigator.camera.getPicture(onVideoSuccessAjout, onFail, options);
}

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
            alert("file copy success");
            //alert(JSON.stringify(entry));
        },
        function(error){
            alert(JSON.stringify(error));
        }
    );
    insertVideo(filePath);
}

function insertVideo(filePath){
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(function(tx){
            successCBVideoAdd(tx, filePath);

        }
        , errorCB, successCBVideo);
}
function successCBVideoAdd(tx, filePath){
    var matricule = $('#matAgent').val();
    var nomV = $('#nomVideoAjout').val();
    var idConstat = $("#idCache").val();
    alert(matricule + nomV + idConstat);
    //console.log(fichier);
    tx.executeSql('INSERT INTO VIDEO (matricule,constat_id,nom,path, videoSync) VALUES ("'+ matricule +'","'+ idConstat +'","'+nomV+'","'+ filePath +'","'+0+'")');
    videoConstat();
    $('#nomVideo').val('');

}