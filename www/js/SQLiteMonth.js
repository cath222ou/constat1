//Création de la table constats
function populateDBConstatMonth(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS constatsMonth (constat_id INTEGER PRIMARY KEY,b_date,adresse_id)');
}

// Lancer la requête de sélection de tout dans la table adresse
function successCBMonth(tx,result) {
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(function(tx,result){queryDBMonth(tx,result)}, errorCB);
}
//Sélectionner tout dans la table adresse
function queryDBMonth(tx,result){
    tx.executeSql('SELECT * FROM adresses', [],function(tx,result){
        querySuccessMonth(tx,result);
    }, errorCB);
}

//connexion on serveur
function querySuccessMonth(tx,result) {
    if (navigator.onLine === true){
        $.ajax({

            //aller chercher les informations sur le serveur pour les adresses
            url: 'http://constats.ville.valdor.qc.ca/api/v1/sync/month',
            method: 'get',
            data: {uuid: uuidValue},
            success: function (changes) {
                db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
                //lancer la requête d'insertion des informations dans la table adresse
                db.transaction(function (tx){insertDBMonth(tx,changes)}, errorCB);
            },
            error: function (model, response) {
                console.log(model);
                toastr['error'](response.responseText);
                // alert(response.responseText);
            }
        });
    }
}

//Insertion des informations sur les adresses du serveur dans la table adresse
function insertDBMonth(tx,changes){
    var resultat = $.parseJSON(changes);
    $(resultat).each(function(key,value){
        tx.executeSql('INSERT OR REPLACE INTO constatsMonth (constat_id,b_date,adresse_id) VALUES (?,?,?)',[value.CONSTAT_ID,value.DATE,value.ADRESSE_ID]);
    });
}

