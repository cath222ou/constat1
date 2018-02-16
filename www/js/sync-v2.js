//fichier pour les synchronisation des constats vers le serveur


//progressbar des constat
$('#progressbar').progressbar({
    max: 100,
    value: 0
});

$('#downloadButton').on('click',function(){
    $('#synchronisation').modal('show');
    syncConstat();
});
//Synchronisation des constats
function syncConstat() {
    //Vider l'information contenu dans les divisions de succès et d'échec
    $('#succesSync').empty();
    $('#echecSync').empty();
    //Lancer la requête de sélection
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(function(tx){
        tx.executeSql('SELECT * FROM constats WHERE sync=?', [0], function (tx, results) {
                //S'il y a une connexion internet
                if (navigator.onLine === true) {
                    uploadConstat(results)
                }
                //Sinon message d'erreur
                else {
                    alert('Impossible de synchroniser les constats: Aucune connectivité');
                }
            },
            errorCB)
    }, errorCB);
};

//Synchroniser les constats
function uploadConstat(results) {
    //Mettre progressbar à 0, de couleur bleu et un titre Synchronisation en cours
    $('#progressbar').css({width: 0});
    $('#progressbar').css("background", "dodgerblue");
    $('#h6Constat').text('Constat (Synchronisation en cours)');

    //Boucle pour les fonctions de nombre de vidéo par constat et pour pousser les données vers le serveur
    var len = results.rows.length;
    //Créer une liste avec la même quantité que la quantité de constat (len)
    var constatCompletees = new Array(len);
    for (var i=0; i<len; i++){
        //Donner la valeur 0 à chaque élément de la liste
        constatCompletees[i] = 0;
    }

    for (var i = 0; i <  results.rows.length; i++) {
        //TODO: je crois qu'on devrait appeler la fonction nombreVideo lorsqu'on ajout un vidéo ou qu'on edit un vidéo plutôt que dans la synchro
        //var promise = nombreVideo(results,i);
        //promise.done(
        //    //console.log(results.rows.item(i).nbrVideo)
        //    //$('#progressbar').css({width:(i / results.rows.length) * 100 + '%'})
        //    ////alert('i '+i);
        //    //alert('done');

            postConstat(results, i,  results.rows.length, constatCompletees);
        //);
    }
    //Si la connexion internet est disponible
    if (navigator.onLine === true) {
     //   uploadVideoSucces();
    }
    else{
        alert('Impossible de synchroniser les vidéos: Aucune connectivité');
    }
}

//Faire une requête afin d'obtenir le nombre de vidéo par constat
function nombreVideo(results, i) {
    var constatID = results.rows.item(i).constat_id;
    var nombre = 0;
    //Lancer la requête pour compter le nombre de vidéo
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(function (tx, results) {
        tx.executeSql('SELECT COUNT(*) AS nbrVideo FROM videos WHERE constat_id = ?' ,[results.rows.item(0).constat],
            function (tx, resultat) {
                nombre = resultat.rows.item(0).nbrVideo;
                //Lancer la requête de mise à jour
                tx.executeSql('UPDATE constats SET nbrVideo="'+ nombre + '"WHERE constat_id =' + constatID)

            }, errorCB)})
};


//Connexion au serveur pour envoyer les constats vers le serveur
function postConstat(results, i, len, constatCompletees) {
    //Si la connection internet est disponible
    if (navigator.onLine === true) {
        var constat_id = results.rows.item(i).constat_id;
            var nbrVideo;
            console.log('cid: '+constat_id);
           // var deferred = $.Deferred();
            db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
            db.transaction(function (tx) {
                tx.executeSql('SELECT constat_id ,COUNT(*) AS nbrVideo FROM videos WHERE constat_id = ?' ,[constat_id],
                    function (tx, resultat) {
                        console.log('nbrVideo '+nbrVideo);
                        nbrVideo = resultat.rows.item(0).nbrVideo;
                    });
                tx.executeSql('UPDATE constats SET nbrVideo=? WHERE constat_id =?',[nbrVideo,constat_id],function(){
                    console.log('update nbr '+nbrVideo);
                    alert('after: '+nbrVideo);
                    $.ajax({
                        url: 'http://constats.ville.valdor.qc.ca/api/v1/sync/constat',
                        method: 'post',
                        data: {uuid: uuidValue, constat: results.rows.item(i), nbrVideo: nbrVideo},
                        constatID: constat_id,
                        //Si la connexion au serveur est un succès
                        success: function (constatID) {
                            var idConstat = this.constatID;
                            //Si le serveur envoi un succès
                            if (constatID.status === 'success') {
                                //Réinitialiser la variable du nombre de constat synchronisé à 0
                                var nbConstatCompletees = 0;
                                var len = constatCompletees.length;
                                //Selon la position dans la liste, changer la valeur 0 par 1
                                constatCompletees[i] = 1;
                                //Faire la somme des éléments de la liste pour connaitre à quel nombre de constat nous sommes rendu pour la synchronisation
                                for (var j = 0; j < len; j++){
                                    nbConstatCompletees += constatCompletees[j];
                                }
                                //Augmenter la valeur de la progressbar en fonction du nombre de constat poussé vers le serveur
                                $('#progressbar').css({width: (nbConstatCompletees / len) * 100 + '%'});
                                $('#progerssLabelConstat').text('Constat: ' + nbConstatCompletees + '/' + len);
                                $('#succesSync').append('Constat: ' + idConstat + '<br/>');
                                //Si le nombre de constat poussé est égale au nombre de constat total
                                if (nbConstatCompletees === len) {
                                    //ajouter Synchornisation complétée à la progressbar
                                    $('#progerssLabelConstat').text("Synchronisation complétée");
                                    $('#h6Constat').text('Constat');
                                }

                                db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
                                db.transaction(function (tx, results) {
                                    //Modifier le champ sync de 0 vers 1
                                    tx.executeSql('UPDATE constats SET sync= ? WHERE constat_id=?' , [1,idConstat], function(){console.log('Constat '+idConstat+ ' correctement synchronisé.');}, errorCB)
                                },errorCB);
                            }
                            //Si le serveur envoi un message d'erreur
                            else {
                                //la progressbar devient rouge et contient un message d'échec
                                $('#progressbar').css("background", "red");
                                $('#progerssLabelConstat').text('Échec');
                                $('#echecSync').append('Constat: ' + idConstat+'<br/>');
                            }
                        },
                        //Si la connextion au serveur est un échec

                        error: function (error) {
                            //la progressbar devient rouge et contient un message d'échec
                            //var idConstat = this.constatID;
                            //alert('Échec de la synchronisation');
                            console.error('Erreur postConstat:' + JSON.stringify(error));
                            $('#echecSync').append('Constat: ' + this.constatID+'<br/>');
                            $('#progressbar').css("background", "red");
                            $('#progerssLabelConstat').text('Échec');
                        }
                    })
                });
            });
        }
    //Si la connexion internet n'est pas disponible, envoyé un message d'erreur
    else {
        alert('Impossible de synchroniser les constats: Aucune connectivité');
    }
};

//Requête de sélection de tous les vidéos dans la table video
function uploadVideoSucces() {
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(function (tx, results) {
        tx.executeSql('SELECT * FROM videos WHERE videoSync = ? ', [0],
            function (tx, results) {
                if (navigator.onLine === true) {
                    //Lancer la fonction
                    uploadVideo(tx, results);
                }
                else {
                    alert('Impossible de synchroniser les vidéos: Aucune connectivité');
                }
            }, errorCB),
            errorCB
    });
};

// Synchronisation des vidéos en lien avec le constat synchronisé
function uploadVideo(tx,results) {
    var len = results.rows.length;
    $('#h6Video').text(len +' vidéos à synchroniser.');
    $('#progressBlock').hide();
    $('#progress').attr('max',len).val(0);
    $('div[id^="progressBlock-"]').remove();
    for (var i=0; i < len; i++) {
        //Si la connexion internet est disponible
        if (navigator.onLine === true){
            $('#progressBlock').clone().attr('id','progressBlock-'+i).insertAfter('[id^=progressBlock]:last').show();
            function postVideo(sqlRow,key){
                var path = sqlRow.rows.item(key).path;
                var nom = sqlRow.rows.item(key).nom + ".mov";
                $('#progressBlock-'+key+' p.nomVideo span').text(nom);
                window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
                    console.log('file system open : ' + fs.name);
                    fs.root.getFile(nom, { create: true, exclusive: false }, function (fileEntry) {
                        fileEntry.file(function (file) {
                            //var r = new Resumable({
                            //    target : 'http://constats.ville.valdor.qc.ca/api/v1/sync/video',
                            //    query:{uuid:uuidValue,constat_id:6},
                            //    maxChunkRetries: 3,
                            //    maxFiles: 1,
                            //    testChunks:false,
                            //    prioritizeFirstAndLastChunk: true,
                            //    simultaneousUploads: 1,
                            //    chunkSize: 2 * 1024 * 1024,
                            //    method:'octet',
                            //    fileParameterName:'file',
                            //    throttleProgressCallbacks:1
                            //});
                            //if(!r.support) alert('Your browser does not support this feature'); //TODO: do better error handling
                            //r.addFile(file);
                            //
                            //r.on('fileAdded', function(file, event){
                            //    console.log('fileAdded');
                            //    console.log(file.fileName + " " + file.size + " ch: " + file.chunks);
                            //    //if(file.size > 0) r.upload();
                            //});
                            //r.on('filesAdded',function(files,event){
                            //    //console.log('filesAdded');
                            //    //console.log(files.length);
                            //    if(files.length >0)r.upload();
                            //});
                            //r.on('uploadStart',function(){
                            //    console.log('upstart ');
                            //});
                            //r.on('fileSuccess', function (file, message) {
                            //    // Reflect that the file upload has completed
                            //    console.log('success R ' + message);
                            //    //$('.resumable-file-' + file.uniqueIdentifier + ' .resumable-file-progress').html('(completed)');
                            //});
                            //
                            //r.on('fileError', function (file, message) {
                            //    console.log('fileError R ' + message);
                            //    alert(JSON.stringify(message));
                            //    // Reflect that the file upload has resulted in error
                            //    // $('.resumable-file-' + file.uniqueIdentifier + ' .resumable-file-progress').html('(file could not be uploaded: ' + message + ')');
                            //});
                            //
                            //r.on('fileProgress', function (file) {
                            //    //console.log('FP');
                            //    console.log(Math.floor(file.progress()*100));
                            //    // Handle progress for both the file and the overall upload
                            //    console.log(Math.floor(r.progress() * 100));
                            //    //console.log(r.getSize());
                            //});
                            ////r.on('progress',function(){
                            ////    // Handle progress for both the file and the overall upload
                            ////    //console.log('P')
                            ////    console.log(Math.floor(r.progress()*100));
                            ////    //console.log(r.getSize());
                            ////});
                            //r.on('complete',function(){
                            //    console.log('complete')
                            //});
                            ////r.on('error',function(message, file){
                            ////    console.log('error');
                            ////    alert(JSON.stringify(message,null,4));
                            ////});

                            //Simple upload via XHR, ne supporte pas le resume.
                            var reader = new FileReader();
                            reader.onloadend = function(event) {
                                var blob = new Blob([new Uint8Array(this.result)],{type:'video/quicktime'});
                                var oReq = new XMLHttpRequest();
                                var fd = new FormData();
                                var start_time = new Date().getTime();
                                var progressBarMain = $('#progressBlock-'+key+' progress');
                               // var hashmd5 = SparkMD5.ArrayBuffer.hash(blob,false);

                                fd.append('file',blob);
                                fd.append('uuid',uuidValue);
                                fd.append('format','.mov');
                                fd.append('fileName',nom);//Requis car le nom de fichier reçu par le serveur est blob si on n'inscrit pas le nom en paramètre.
                                fd.append('constat_id',sqlRow.rows.item(key).constat_id);
                                fd.append('video_id',sqlRow.rows.item(key).id_video);
                                fd.append('fileSize',blob.size);//Au fin de comparaison avec le fichier reçu par le serveur
                                //fd.append('md5sum',hashmd5);
                                oReq.responseType = 'json';//Pour bien interpréter la réponse du serveur Laravel
                                oReq.open("POST", "http://constats.ville.valdor.qc.ca/api/v1/sync/video", true);
                                oReq.setRequestHeader('Connection','close');//Semble requis pour IIS, en théorie ça indique au serveur de fermer la connection après le transfert pour ne pas laisser de session ouverte.
                                oReq.onload = function (oEvent) {
                                    var currentProgressBar = $('#progressBlock-'+key);
                                    if(oReq.response.status == "success"){
                                        var progress = $('#progress');
                                        progress.val(progress.val() + 1);
                                        currentProgressBar.find('.detailsTransfert').fadeOut('slow');
                                        currentProgressBar.find('.nomVideo i').removeClass('fa-spinner fa-pulse fa-fw').addClass('fa-check');
                                        // Fichier correctement envoyé!

                                        //Modifier le champ videoSync de 0 vers 1
                                        db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
                                        db.transaction(function(tx){
                                            tx.executeSql('UPDATE videos SET videoSync = ? WHERE id_video = ?', [1,sqlRow.rows.item(key).id_video],getVideosNonSync,errorCB);
                                        },errorCB);

                                    }
                                    else{
                                        currentProgressBar.find('.detailsTransfert').fadeOut('slow');
                                        currentProgressBar.find('.innerBlock').css('background-color','red');
                                        currentProgressBar.find('.nomVideo i').removeClass('fa-spinner fa-pulse fa-fw').addClass('fa-warning');
                                        //Oups.. un erreur
                                    }
                                };
                                oReq.upload.onprogress = function(e){
                                    if (e.lengthComputable) {
                                        var currentProgressBar = $('#progressBlock-'+key);
                                        progressBarMain.val((e.loaded / e.total) * 100);
                                        progressBarMain.text(progressBarMain.val());
                                        var seconds_elapsed =   ( new Date().getTime() - start_time )/1000;
                                        var bytes_per_second =  seconds_elapsed ? e.loaded / seconds_elapsed : 0 ;
                                        var Kbytes_per_second = (bytes_per_second / 1000).toFixed(0);
                                        var remaining_bytes =   e.total - e.loaded;
                                        var seconds_remaining = seconds_elapsed ? (remaining_bytes / bytes_per_second).toFixed(0) : 'calculating' ;
                                        currentProgressBar.find('.recievedValue' ).html( '' ).append(  formatBytes(e.loaded) + ' / ' );
                                        currentProgressBar.find('.totalValue' ).html( '' ).append(  formatBytes(e.total)  );
                                        currentProgressBar.find('.timeRemaining' ).html( '' ).append( seconds_remaining + ' secondes restantes' );
                                        currentProgressBar.find('.kbPerSec').html('').append(Kbytes_per_second + ' kb/s');
                                        currentProgressBar.find('.timeTotal').html('').append(seconds_elapsed.toFixed(0) + ' secondes total')
                                    }
                                };
                                oReq.send(fd);
                            };
                            reader.readAsArrayBuffer(file);
                        }, function (err) { console.error('error getting fileentry file!' + err); });
                    }, function (err) { console.error('error getting file! ' + err); });
                }, function (err) { console.error('error getting persistent fs! ' + err); });
            }
            postVideo(results, i);
        }
        //Si la connexion internet n'est pas disponible, message d'erreur
        else {
            alert('Impossible de synchroniser les vidéos: Aucune connectivité');
        }
    }
}
//Fonction trouvé sur StackOverflow pour afficher les bons formats de données
function formatBytes(a,b){if(0==a)return"0 Bytes";var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f]}

//Connexion au serveur pour pousser les vidéos vers le serveur
//function postVideo(sqlRow,key, videoCompletees){
//    //Mettre la progressbar des vidéos à 0 et de couleur bleu
//    $('#h6Video').text('Vidéo ( Synchronisation en cours )');
//    $('#progressbarVideo').css({width: 0 + '%'});
//    $('#progressbarVideo').css("background", "dodgerblue");
//
//    var path = sqlRow.rows.item(key).path;
//    var nom = sqlRow.rows.item(key).nom + ".mov";
//    console.log('nom '+nom);
//    console.log('path '+path);
//
//    window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
//    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
//        console.log('file system open : ' + fs.name);
//        fs.root.getFile(nom, { create: true, exclusive: false }, function (fileEntry) {
//            fileEntry.file(function (file) {
//                var reader = new FileReader();
//                reader.onloadend = function() {
//                    // Create a blob based on the FileReader "result", which we asked to be retrieved as an ArrayBuffer
//                    var blob = new Blob([new Uint8Array(this.result)], { type: "video/quicktime" });
//                    var oReq = new XMLHttpRequest();
//                    var fd = new FormData();
//                    fd.append('file',blob);
//                    fd.append('uuid',uuidValue);
//                    fd.append('format','.mov');
//                    fd.append('fileName',nom);
//                    fd.append('constat_id',sqlRow.rows.item(key).constat_id);
//                    fd.append('video_id',sqlRow.rows.item(key).id_video);
//                    oReq.open("POST", "http://constats.ville.valdor.qc.ca/api/v1/sync/video", true);
//                    //oReq.open("POST", "http://10.208.1.89/api/v1/sync/video", true);
//                    oReq.setRequestHeader('Connection','close');
//                    //oReq.setRequestHeader('Content-Length',blob.size);
//                    //oReq.setRequestHeader('Content-Type','video/quicktime');
//                    //oReq.setRequestHeader("Accept","application/json");
//                    oReq.onload = function (oEvent) {
//                        console.log('status '+oEvent.status);
//                        console.log('responseText ' + oEvent.responseText);
//                        console.log('done '+ path);
//                        console.log(JSON.stringify(oEvent));
//                        // all done!
//                    };
//                    //$('#progressbarVideo')
//                    var progressBarMain = document.querySelector('progress');
//                    oReq.upload.onprogress = function(e){
//                        if (e.lengthComputable) {
//                            progressBarMain.value = (e.loaded / e.total) * 100;
//                            progressBarMain.textContent = progressBarMain.value;
//                        }
//                    };
//                    // Pass the blob in to XHR's send method
//                    oReq.send(fd);
//                };
//                // Read the file as an ArrayBuffer
//                reader.readAsArrayBuffer(file);
//            }, function (err) { console.error('error getting fileentry file!' + err); });
//        }, function (err) { console.error('error getting file! ' + err); });
//    }, function (err) { console.error('error getting persistent fs! ' + err); });
//    //var ft = new FileTransfer();
//    ////var path = results.rows.item(i).path;
//    //var options = new FileUploadOptions();
//    //options.mimeType = "video/quicktime";
//    //options.fileName = results.rows.item(i).nom + ".mov";
//    //options.chunkedMode = false;
//    //options.headers = {Connection: "close"};
//    //var params = {};
//    //params.uuid = uuidValue;
//    //params.format = ".mov";
//    //params.constat_id = results.rows.item(i).constat_id;
//    //params.video_id = results.rows.item(i).id_video;
//    //options.params = params;
//    ////var formData = new FormData();
//    ////formData.append('uuid',uuidValue);
//    ////formData.append('format','.mov');
//    ////formData.append('constat_id',results.rows.item(i).constat_id);
//    ////formData.append('video_id',results.rows.item(i).id_video);
//    ////formData.append('file',path);
//    ////alert(typeof path );
//    ////$('#fileupload').fileupload('option',{
//    ////    url:'http://constats.ville.valdor.qc.ca/api/v1/sync/video',
//    ////    sequentialUpload: true,
//    ////    paramName:'file'
//    ////},'send',{files:[formData],url:'http://constats.ville.valdor.qc.ca/api/v1/sync/video'})
//    ////    .success(function(result,status){console.log('success upload '+ result)})
//    ////    .error(function(jqxhr,status,error){console.log('errur '+ error)})
//    ////    .complete(function(result,status,jqxhr){console.log('completed')});
//    //ft.upload("http://constats.ville.valdor.qc.ca/api/v1/sync/video", nom,
//    //    //Si la connexion au serveur est un succès
//    //    function (results) {
//    //        console.log(results);
//    //        console.log('upload completed');
//    //        //Si le serveur envoi un succès
//    //        //if ($.parseJSON(results.response).status === 'success') {
//    //        //    //Réinitialiser la variable du nombre de vidéo synchronisé à 0
//    //        //    var nbVideoCompletees = 0;
//    //        //    var len = videoCompletees.length;
//    //        //    //Selon la position dans la liste, changer la valeur 0 par 1
//    //        //    videoCompletees[i] = 1;
//    //        //    for (var j = 0; j < len; j++){
//    //        //        //Faire la somme des éléments de la liste pour connaitre à quel nombre de vidéo nous sommes rendu pour la synchronisation
//    //        //        nbVideoCompletees += videoCompletees[j];
//    //        //    }
//    //        //
//    //        //    //augmenter la progressbar en fonction du nombre de vidéo poussé vers le serveur
//    //        //    $('#succesSync').append('Vidéo: ' + params.video_id +'<br/>');
//    //        //    $('#progressbarVideo').css({width: (nbVideoCompletees/len) * 100 + '%'});
//    //        //    $('#progressLabelVideo').text('Vidéo: '+ nbVideoCompletees +'/' + len);
//    //        //
//    //        //    //S'il y a autant de vidéo poussé vers le serveur que de vidéo au total
//    //        //    if (nbVideoCompletees === len){
//    //        //        //message de synchronisation complétée dans la progressbar
//    //        //        $('#progressLabelVideo').text('Synchronisation complétée');
//    //        //        $('#h6Video').text('Vidéo');
//    //        //
//    //        //    }
//    //        //
//    //        //    //Modifier le champ videoSync de 0 vers 1
//    //        //    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
//    //        //    db.transaction(function(tx){
//    //        //        tx.executeSql('UPDATE videos SET videoSync = ? WHERE id_video = ?', [1,params.video_id],queryDBVideo, errorCB)
//    //        //            },errorCB);
//    //        //    console.log(result.bytesSent + ' bytes sent');
//    //        //}
//    //        ////Si le serveur envoi un message d'erreur, mettre la progressbar en rouge avec un message d'erreur
//    //        //else {
//    //        //    $('#progressbarVideo').css("background", "red");
//    //        //    $('#progressLabelVideo').text('Échec');
//    //        //    $('#echecSync').append('Vidéo = ' + params.video_id + '<br/>');
//    //        //}
//    //    },
//    //    //Si la connexion au serveur est un échec, mettre la progressbar en rouge avec un message d'erreur
//    //    function (error) {
//    //        console.log(error);
//    //        $('#progressbarVideo').css("background", "red");
//    //        $('#progressLabelVideo').text('Échec');
//    //        alert(JSON.stringify(error));
//    //        alert('Erreur de sync video_id = ' + params.video_id);
//    //    },
//    //    options)
//};