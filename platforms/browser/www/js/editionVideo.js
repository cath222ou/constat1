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
            + '<button type="button" onclick="removeVideo('+results.rows.item(i).id_video+','+i+')" class="btn btn-default btn1" style="background-color:#ff0000; border-color:#b30000">Supprimer</button></td>'+
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
    navigator.camera.getPicture(onVideoSuccess, onFail, options);
}

function onVideoSuccess(fileuriEdit) {
    fichierEdit = fileuriEdit;
    modifVideo();
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
function modifVideo(){
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(videoModification, errorCB);
}

function videoModification(tx){
    var vid = $("#idvideo").val();
    console.log(vid);
    nomVideo = $('#idvideo').val();
    tx.executeSql('UPDATE VIDEO SET nom ='+nomVideo+', path ='+fichierEdit+' WHERE id_video='+vid, [], errorCB)

}