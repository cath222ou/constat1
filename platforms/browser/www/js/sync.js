$('#progressbar').progressbar({
    max: 100,
    value: 0
});



//Synchronisation des constats

function syncConstat() {
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(syncConstatSucces, errorCB);
}

//Sélectionner les constats qui ne sont pas déjà synchronisés
function syncConstatSucces(tx){
    tx.executeSql('SELECT * FROM DEMO WHERE sync='+0, [], function(tx, results){
            if (navigator.onLine === true){
                uploadConstat(tx,results)
            }
            else {
                alert('Impossible de synchroniser les constats: Aucune connectivité');
            }},
        errorCB)
}



//Synchroniser les constats
function uploadConstat(tx,results) {
    $('#progressbar').css({width: 0});
    $('#progressbar').css("background", "dodgerblue");
    $('#h6Constat').text('Constat (Synchronisation en cours)');

    var len = results.rows.length;
    for (i = 0; i < len; i++) {

        nombreVideo(results, i);
        postConstat(results, i, len);
    }
    if (navigator.onLine === true) {
        uploadVideoSucces();
    }
    else{
        alert('Impossible de synchroniser les vidéos: Aucune connectivité');
    }
}

function nombreVideo(results, i) {
    var constatID = results.rows.item(i).constat_id;
    var nombre = 0;
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(function (tx, results) {
        tx.executeSql('SELECT constat_id, COUNT(*) AS nbrVideo FROM VIDEO WHERE constat_id = ' + constatID, [],
            function (tx, resultat) {
            nombre = resultat.rows.item(0).nbrVideo;
                tx.executeSql('UPDATE DEMO SET nbrVideo='+ nombre + 'WHERE constat_id =' + constatID, [],
                    function (tx, resultat2) {
                        console.log(resultat2);
                    }, function(){console.log(nombre, constatID)})
            }, errorCB), errorCB
    });
}


function postConstat(results, i, len) {
    var iteration = 0;
   // var uploadValue = 0;
    var nbrVideo = 0;

            if (navigator.onLine === true) {
                $.ajax({
                    url: 'http://10.208.1.137/api/v1/sync/constat',
                    //  url: 'http://constats.ville.valdor.qc.ca/api/v1/sync/constat',
                    method: 'post',
                    data: {uuid: uuidValue, constat: results.rows.item(i), nbrVideo: results.rows.item(i).nbrVideo},
                    constatID: results.rows.item(i).constat_id,
                    success: function (constatID) {
                        var idConstat = this.constatID;
                        iteration = iteration + 1;
                        if (constatID.status === 'success') {
                            //  $('#test').text('Constat: '+ iteration +'/' + len);
                            $('#progressbar').css({width: (iteration / len) * 100 + '%'});
                            $('#progerssLabelConstat').text('Constat: ' + iteration + '/' + len);
                            if (iteration === len) {
                                $('#progerssLabelConstat').text("Synchronisation complétée");
                                $('#h6Constat').text('Constat');
                            }
                            //alert('Synchronisation réussie du constat= ' + idConstat);
                            // db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
                            // db.transaction(function (tx, results) {
                            //Modifier le champ sync de 0 vers 1
                            //     tx.executeSql('UPDATE DEMO SET sync=' + 1 + ' WHERE constat_id=' + idConstat, [], queryDB, errorCB),
                            //         errorCB
                            // });
                        }
                        else {
                            $('#progressbar').css("background", "red");
                            $('#progerssLabelConstat').text('Échec');
                            alert('Échec de la synchronisation du constat= ' + idConstat);
                        }
                    },

                    error: function (model, response) {
                        alert('Échec de la synchronisation');
                        $('#progressbar').css("background", "red");
                        $('#progerssLabelConstat').text('Échec');
                    }
                })
            }
            else {
                alert('Impossible de synchroniser les constats: Aucune connectivité');
            }

}

function uploadVideoSucces() {
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(function (tx, results) {
        tx.executeSql('SELECT * FROM VIDEO WHERE videosync=' + 0, [],
            function (tx, results) {
                if (navigator.onLine === true) {
                    uploadVideo(tx, results);
                }
                else {
                    alert('Impossible de synchroniser les vidéos: Aucune connectivité');
                }
            }, errorCB),
            errorCB
    });
}


// Synchronisation des vidéos en lien avec le constat synchronisé
function uploadVideo(tx,results) {
    var len = results.rows.length;
  //  var ft = new FileTransfer();

    for (var i=0; i < len; i++) {
        if (navigator.onLine === true){
            i = i +1;
            postVideo(tx,results,i,len);
        }
        else {
            alert('Impossible de synchroniser les vidéos: Aucune connectivité');
        }

    }
}
function postVideo(tx,results,i,len){
    $('#h6Video').text('Vidéo (Synchronisation en cours)');
    $('#progressbarVideo').css({width: 0 + '%'});
    $('#progressbarVideo').css("background", "dodgerblue");

    var ft = new FileTransfer();
    var path = results.rows.item(i).path;
    var options = new FileUploadOptions();
    options.mimeType = "video/quicktime";
    options.fileName = results.rows.item(i).nom + ".mov";
    options.chunkedMode = false;
    var params = {};
    params.uuid = uuidValue;
    params.format = ".mov";
    params.constat_id = results.rows.item(i).constat_id;
    params.video_id = results.rows.item(i).id_video;
    options.params = params;
    ft.upload(path, "http://10.208.1.137/api/v1/sync/video",
    //ft.upload(path, "http://constats.ville.valdor.qc.ca/api/v1/sync/video",
        function (results) {
        if ($.parseJSON(results.response).status === 'success') {
           // alert('Synchronisation réussie de la vidéo = ' + params.video_id);
            $('#progressbarVideo').css({width: (i/len) * 100 + '%'});
            $('#progressLabelVideo').text('Vidéo: '+ i +'/' + len);
            if (i === len){
                $('#progressLabelVideo').text('Synchronisation complétée');
                $('#h6Video').text('Vidéo');

            }

            //Modifier le champ videoSync de 0 vers 1
            // db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
            // db.transaction(function(tx){
            //     tx.executeSql('UPDATE VIDEO SET videoSync='+1+' WHERE id_video='+ params.video_id, [],queryDBVideo, errorCB),
            // errorCB});
            console.log(result.bytesSent + ' bytes sent');
        }
        else {
            $('#progressbarVideo').css("background", "red");
            $('#progressLabelVideo').text('Échec');
            alert('Échec de la synchronisation de la vidéo = ' + params.video_id + '(serveur)');
        }
    },
    function (error) {
        console.log(error);
        $('#progressbarVideo').css("background", "red");
        $('#progressLabelVideo').text('Échec');
        //alert(JSON.stringify(error));
        alert('Échec de la synchronisation de la vidéo = ' + params.video_id);
    },
    options)
}
