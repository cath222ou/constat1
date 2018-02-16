
//Création de la table agent
function populateDBAgent(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS agents (user_id INTEGER PRIMARY KEY, matricule, nom)');
}

//Lancer la requête de sélection de tout dans la table agent
function successCBAgent(tx,result) {
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(function(tx){
        tx.executeSql('SELECT * FROM agents', [],function(tx,result){
            querySuccessAgent(tx,result)
        }, errorCB)
    }, errorCB);
}

//connexion on serveur
function querySuccessAgent(tx,result) {
    //if (result.rows.length===0){
    //Aller chercher les informations des agents sur le serveur
        $.ajax({
            url: 'http://constats.ville.valdor.qc.ca/api/v1/sync/users',
            method: 'get',
            data: {uuid: uuidValue},
            success: function (changes) {
                //Lancer la requête d'insertion
                    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
                    db.transaction(function (tx){
                        insertDBAgent(tx, changes)
                    }, errorCB);
                   },
            error: function (error) {
                console.log(error);
                alert(JSON.stringify(error));
                //alert(response.responseText);
            }
        });
    //}
    // else {
    //     $.ajax({
    //         url: 'http://constats.ville.valdor.qc.ca/api/v1/sync/users',
    //         method: 'get',
    //         data: {uuid: uuidApp1},
    //         success: function (changes) {
    //             $('#matriculeMenu').val('');
    //             resultat = $.parseJSON(changes);
    //             $(resultat).each(function(key,value){
    //                 //agentResult = value.matricule;
    //                 //console.log(value);
    //                     $('#matriculeMenu').append( '<option value="'+value.id+'">'+value.matricule+'</option>' );
    //
    //             })
    //         },
    //         error: function (model, response) {
    //             console.log(model);
    //             alert(JSON.stringify(model));
    //             //alert(response.responseText);
    //         }
}

//Insertion des informations des agents sur le serveur dans la table agent
function insertDBAgent(tx,changes){
    var resultat = $.parseJSON(changes);
    var matriculeMenu =$('#matriculeMenu');
    matriculeMenu.val('');
    $(resultat).each(function(key,value){
        tx.executeSql('INSERT OR REPLACE INTO agents (user_id,matricule,nom) VALUES (?,?,?)',[value.id,value.matricule,value.nom]);
        matriculeMenu.append('<option value="' + value.id + '">' + value.matricule + '</option>');
    });
}

//Lancer la requête de suppression de la table Agent
function deleteBaseDAgent() {
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(function(tx){
        tx.executeSql('DROP TABLE IF EXISTS agents')
    }, errorCB);
}



