
//Synchronisation des constats

function syncConstat(){
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(syncConstatSucces, errorCB);
}

//Sélectionner les constats qui ne sont pas déjà synchronisés
function syncConstatSucces(tx){
    tx.executeSql('SELECT * FROM DEMO WHERE sync='+0, [], function(tx, results){
        console.log(results);
        if (navigator.onLine === true){
        uploadConstat(tx,results)
        }
        else {
            alert('Impossible de synchroniser les constats: Aucune connectivité');
        }},
        errorCB)
};


//Synchroniser les constats
function uploadConstat(tx,results) {
    var len = results.rows.length;
    for (var i=0; i < len; i++) {
        if (navigator.onLine === true){
            $.ajax({
                url: 'http://constats.ville.valdor.qc.ca/api/v1/sync/constat',
                method: 'post',
                data: {uuid: uuidApp1, constat: results.rows.item(i)},
                constatID: results.rows.item(i).constat_id,
                success: function (constatID) {
                    var idConstat = this.constatID;
                        alert('Synchronisation réussie du constat= '+idConstat);
                        //Sélectionner les vidéos en lien avec le constat qui ne sont pas déjà synchronisées et le synchroniser
                        db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
                        db.transaction(function(tx){
                            tx.executeSql('SELECT * FROM VIDEO WHERE videosync='+0+' AND constat_id = '+ idConstat, [], function(){
                                    if (navigator.onLine === true) {
                                        uploadVideo()
                                    }
                                    else {
                                        alert('Impossible de synchroniser les vidéos: Aucune connectivité');
                                    }
                                    }, errorCB),
                        errorCB});
                        //Modifier le champ sync de 0 vers 1
                        db.transaction(function(tx){
                            tx.executeSql('UPDATE DEMO SET sync="'+1+'" WHERE constat_id='+ idConstat, [], errorCB),
                        errorCB});
                },
                error: function (model, response) {
                    console.log(model);
                    alert('Échec de la synchronisation');
                    alert(response.responseText);
                }
            })
            }
        else {
            alert('Impossible de synchroniser les constats: Aucune connectivité');
        }
    }
}


// Synchronisation des vidéos en lien avec le constat synchronisé
function uploadVideo(tx,results) {
    var len = results.rows.length;
    var ft = new FileTransfer();

    //Barre de progression
    ft.onprogress = function(progressEvent) {
        console.log(progressEvent);
    };
        if (progressEvent.lengthComputable) {
            loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
        } else {
            loadingStatus.increment();
        }


        for (var i=0; i < len; i++) {
            if (navigator.onLine === true){
                //var ft = new FileTransfer();
                var path = results.rows.item(i).path;
                var options = new FileUploadOptions();
                options.mimeType = "video/quicktime";
                options.fileName = results.rows.item(i).nom + ".mov";
                options.chunkedMode = true;
                var params = {};
                params.uuid = uuidApp1;
                params.format = ".mov";
                params.constat_id = results.rows.item(i).constat_id;
                params.video_id = results.rows.item(i).id_video;
                options.params = params;


                ft.upload(path, "http://constats.ville.valdor.qc.ca/api/v1/sync/video",

                    function (results) {

                    alert('Synchronisation réussie de la vidéo = '+params.video_id);
                    //Modifier le champ videoSync de 0 vers 1
                    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
                    db.transaction(function(tx){
                        tx.executeSql('UPDATE VIDEO SET videoSync="'+1+'" WHERE id_video='+ params.video_id, [], errorCB),
                            errorCB});
                    console.log(result.bytesSent + ' bytes sent');
                },
                function (error) {

                    console.log(error);
                    alert(params.constat_id);
                    alert('Échec de la synchronisation de la vidéo= '+params.video_id);
                },
                options);
        }
        else{
            alert('Impossible de synchroniser les vidéos: Aucune connectivité');
            }
        }
}


//Synchronisation constat individuel

function syncConstatIndividuelle(id_Constat,i){
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(function(tx){syncConstatIndSucces(tx, id_Constat, i)}, errorCB);
}

function syncConstatIndSucces(tx, id_Constat, i){
    tx.executeSql('SELECT * FROM DEMO WHERE sync='+0+' constat_id=' + id_Constat, [], function(){
        if (navigator.onLine === true) {
            uploadConstatInd()
        }
        else {
            alert('Impossible de synchroniser les constats: Aucune connectivité');
        }}, errorCB)
};



function uploadConstatInd(tx,results) {
    var len = results.rows.length;
    for (var i=0; i < len; i++) {
        if (navigator.onLine === true){
            $.ajax({
                url: 'http://constats.ville.valdor.qc.ca/api/v1/sync/constat',
                method: 'post',
                data: {uuid: uuidApp1, constat: results.rows.item(i)},
                constatID: results.rows.item(i).constat_id,
                success: function (constatID) {
                    var idConstat = this.constatID;
                    alert('Synchronisation réussie du constat= '+idConstat);
                    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
                    db.transaction(function(tx) {
                        tx.executeSql('SELECT * FROM VIDEO WHERE constat_id = ' + idConstat, [], function () {
                                if (navigator.onLine === true) {
                                    uploadVideo()
                                }
                                else {
                                    alert('Impossible de synchroniser les constats: Aucune connectivité')
                                }
                            },
                            errorCB)
                    },
                    errorCB)
                },
                error: function (model, response) {
                    console.log(model);
                    alert('Échec de la synchronisation');
                }
            })
        }
        else{
            alert('Impossible de synchroniser les constats: Aucune connectivité');
        }
    }
}

//Synchronisation vidéo individuelle

function syncVideoIndividuelle(id_Video,i){
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(function(tx){syncVideoIndSucces(tx, id_Video, i)}, errorCB);
}

function syncVideoIndSucces(tx, id_Video, i){
    tx.executeSql('SELECT * FROM VIDEO WHERE id_video=' + id_Video, [], function() {
            if (navigator.onLine === true) {
                uploadVideoInd()
            }
            else {
                alert('Impossible de synchroniser les vidéos: Aucune connectivité');
            }
        }
        , errorCB)
}





function uploadVideoInd(tx,results) {
    var len = results.rows.length;
    for (var i=0; i < len; i++) {
        if (navigator.onLine === true){
            $.ajax({
                url: 'http://constats.ville.valdor.qc.ca/api/v1/sync/constat',
                method: 'post',
                data: {uuid: uuidApp1, constat: results.rows.item(i)},
                videoID: results.rows.item(i).id_video,
                success: function (videoID) {
                    var videoID = this.videoID;
                    alert('Synchronisation réussie du vidéo= '+videoID);
                },
                error: function (model, response, videoID) {
                    var videoID = this.videoID;
                    alert('Échec de la synchronisation de la vidéo= '+videoID);
                }
            })
        }
        else{
            alert('Impossible de synchroniser les vidéos: Aucune connectivité');
        }
    }
}