
//Création de la table agent
function populateDBAgent(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS AGENT (user_id INTEGER PRIMARY KEY, matricule, nom)');
}

//Lancer la requête de sélection de tout dans la table agent
function successCBAgent(tx,result,uuidApp1) {
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(function(tx,result,uuidApp1){queryDBAgent(tx,result,uuidApp1)}, errorCB);
}

//Sélectionner tout dans la table agent
function queryDBAgent(tx,result,uuidApp1){
    tx.executeSql('SELECT * FROM AGENT', [],function(tx,result,uuidApp1){querySuccessAgent(tx,result,uuidApp1)}, errorCB)

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
                    db.transaction(function (tx){insertDBAgent(tx, changes)}, errorCB);
                   },
            error: function (model, response) {
                console.log(model);
                alert(JSON.stringify(model));
                //alert(response.responseText);
            }
        })


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
    $(resultat).each(function(key,value){
        tx.executeSql('INSERT OR REPLACE INTO AGENT (user_id,matricule,nom) VALUES ('+value.id +',"'+ value.matricule +'","'+ value.nom +'")');
    });
    $('#matriculeMenu').val('');
    //Ajouter les numéros d'agent dans le sélecteur
    $(resultat).each(function(key,value) {
        $('#matriculeMenu').append('<option value="' + value.id + '">' + value.matricule + '</option>');
    });


}

//Lancer la requête de suppression de la table Agent
function deleteBaseDAgent() {
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(deleteDBAgent, errorCB);
    //db.transaction(populateDBAgent, errorCB);
}

//Suppression des la table agent
function deleteDBAgent(tx){
    tx.executeSql('DROP TABLE IF EXISTS AGENT');
}


