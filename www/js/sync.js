//fichier pour les synchronisation des constats vers le serveur


//progressbar des constat
$('#progressbar').progressbar({
    max: 100,
    value: 0
});

//Synchronisation des constats
function syncConstat() {
    //Vider l'information contenu dans les divisions de succès et d'échec
    $('#succesSync').empty();
    $('#echecSync').empty();
    //Lancer la requête de sélection
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(syncConstatSucces, errorCB);
};

//Sélectionner les constats qui ne sont pas déjà synchronisés (sync = 0)
function syncConstatSucces(tx) {
    tx.executeSql('SELECT * FROM DEMO WHERE sync=' + 0, [], function (tx, results) {
        //S'il y a une connexion internet
            if (navigator.onLine === true) {
                //lancer la fonction
                uploadConstat(tx, results)
            }
            //Sinon message d'erreur
            else {
                alert('Impossible de synchroniser les constats: Aucune connectivité');
            }
        },
        errorCB)
};


//Synchroniser les constats
function uploadConstat(tx,results) {
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
    };

    for (var i = 0; i < len; i++) {
        nombreVideo(results, i);
        postConstat(results, i, len, constatCompletees);
    }
    //Si la connexion internet est disponible
    if (navigator.onLine === true) {
        //lancer la fonction
        uploadVideoSucces();
    }
    //Sinon message d'erreur
    else{
        alert('Impossible de synchroniser les vidéos: Aucune connectivité');
    }
};

//Faire une requête afin d'obtenir le nombre de vidéo par constat
function nombreVideo(results, i) {
    var constatID = results.rows.item(i).constat_id;
    var nombre = 0;
    //Lancer la requête pour compter le nombre de vidéo
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(function (tx, results) {
        tx.executeSql('SELECT constat_id, COUNT(*) AS nbrVideo FROM VIDEO WHERE constat_id = ' + constatID, [],
            function (tx, resultat) {
            nombre = resultat.rows.item(0).nbrVideo;
            //Lancer la requête de mise à jour
                updateNbrVideo(nombre, constatID);
            }, errorCB)})
};

//Mettre à jour la table demo afin d'insérer le nombre de vidéo par constat
function updateNbrVideo(nombre,constatID){
    db.transaction(function (tx, resultat2) {
        tx.executeSql('UPDATE DEMO SET nbrVideo="'+ nombre + '"WHERE constat_id =' + constatID),errorCB})
}

//Connexion au serveur pour envoyer les constats vers le serveur
function postConstat(results, i, len, constatCompletees) {
            //Si la connection internet est disponible
            if (navigator.onLine === true) {
                $.ajax({
                   // url: 'http://10.208.1.137/api/v1/sync/constat',
                    url: 'http://constats.ville.valdor.qc.ca/api/v1/sync/constat',
                    method: 'post',
                    data: {uuid: uuidValue, constat: results.rows.item(i), nbrVideo: results.rows.item(i).nbrVideo},
                    constatID: results.rows.item(i).constat_id,
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
                                tx.executeSql('UPDATE DEMO SET sync=' + 1 + ' WHERE constat_id=' + idConstat, [], queryDB, errorCB),
                                     errorCB
                             });
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

                    error: function (model, response, constatID) {
                        //la progressbar devient rouge et contient un message d'échec
                        var idConstat = this.constatID;
                        alert('Échec de la synchronisation');
                        $('#echecSync').append('Constat: ' + idConstat+'<br/>');
                        $('#progressbar').css("background", "red");
                        $('#progerssLabelConstat').text('Échec');
                    }
                })
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
        tx.executeSql('SELECT * FROM VIDEO WHERE videosync=' + 0, [],
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

    //Créer une liste avec la même quantité que la quantité de constat (len)
    var videoCompletees = new Array(len);
    for (var i=0; i<len; i++){
        //Donner la valeur 0 à chaque élément de la liste
        videoCompletees[i] = 0;
    };

    for (var i=0; i < len; i++) {
        //Si la connexion internet est disponible
        if (navigator.onLine === true){
            //lancer la requête d'envoi des vidéos vers le serveur
            postVideo(tx, results, i, videoCompletees);
        }
        //Si la connexion internet n'est pas disponible, message d'erreur
        else {
            alert('Impossible de synchroniser les vidéos: Aucune connectivité');
        }
    };
};

//Connexion au serveur pour pousser les vidéos vers le serveur
function postVideo(tx,results,i, videoCompletees){
    //Mettre la progressbar des vidéos à 0 et de couleur bleu
    $('#h6Video').text('Vidéo (Synchronisation en cours)');
    $('#progressbarVideo').css({width: 0 + '%'});
    $('#progressbarVideo').css("background", "dodgerblue");

    var ft = new FileTransfer();
    var path = results.rows.item(i).path;
    var options = new FileUploadOptions();
    options.mimeType = "video/quicktime";
    options.fileName = results.rows.item(i).nom + ".mov";
    options.chunkedMode = false;
    options.headers = {Connection: "close"};
    var params = {};
    params.uuid = uuidValue;
    params.format = ".mov";
    params.constat_id = results.rows.item(i).constat_id;
    params.video_id = results.rows.item(i).id_video;
    options.params = params;
   // ft.upload(path, "http://10.208.1.137/api/v1/sync/video",
    ft.upload(path, "http://constats.ville.valdor.qc.ca/api/v1/sync/video",
    //Si la connexion au serveur est un succès
    function (results) {
        //Si le serveur envoi un succès
        if ($.parseJSON(results.response).status === 'success') {
            //Réinitialiser la variable du nombre de vidéo synchronisé à 0
            var nbVideoCompletees = 0;
            var len = videoCompletees.length;
            //Selon la position dans la liste, changer la valeur 0 par 1
            videoCompletees[i] = 1;
            for (var j = 0; j < len; j++){
                //Faire la somme des éléments de la liste pour connaitre à quel nombre de vidéo nous sommes rendu pour la synchronisation
                nbVideoCompletees += videoCompletees[j];
            }

            //augmenter la progressbar en fonction du nombre de vidéo poussé vers le serveur
            $('#succesSync').append('Vidéo: ' + params.video_id +'<br/>');
            $('#progressbarVideo').css({width: (nbVideoCompletees/len) * 100 + '%'});
            $('#progressLabelVideo').text('Vidéo: '+ nbVideoCompletees +'/' + len);

            //S'il y a autant de vidéo poussé vers le serveur que de vidéo au total
            if (nbVideoCompletees === len){
                //message de synchronisation complétée dans la progressbar
                $('#progressLabelVideo').text('Synchronisation complétée');
                $('#h6Video').text('Vidéo');

            }

            //Modifier le champ videoSync de 0 vers 1
             db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
             db.transaction(function(tx){
                 tx.executeSql('UPDATE VIDEO SET videoSync='+1+' WHERE id_video='+ params.video_id, [],queryDBVideo, errorCB),
             errorCB});
            console.log(result.bytesSent + ' bytes sent');
        }
        //Si le serveur envoi un message d'erreur, mettre la progressbar en rouge avec un message d'erreur
        else {
            $('#progressbarVideo').css("background", "red");
            $('#progressLabelVideo').text('Échec');
            $('#echecSync').append('Vidéo = ' + params.video_id + '<br/>');
        }
    },
    //Si la connexion au serveur est un échec, mettre la progressbar en rouge avec un message d'erreur
    function (error) {
        console.log(error);
        $('#progressbarVideo').css("background", "red");
        $('#progressLabelVideo').text('Échec');
        alert(JSON.stringify(error));
        alert('Erreur de sync video_id = ' + params.video_id);
    },
    options)
    };