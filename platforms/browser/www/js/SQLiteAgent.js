
var agentResult;

//table agent
function populateDBAgent(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS AGENT (user_id INTEGER PRIMARY KEY, matricule, nom)');
}



// Transaction success callback

function successCBAgent(tx,result,uuidApp1) {
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(function(tx,result,uuidApp1){queryDBAgent(tx,result,uuidApp1)}, errorCB);
}


function queryDBAgent(tx,result,uuidApp1){
    tx.executeSql('SELECT * FROM AGENT', [],function(tx,result,uuidApp1){querySuccessAgent(tx,result,uuidApp1)}, errorCB)

}



//connexion on serveur
function querySuccessAgent(tx,result) {
    if (result.rows.length===0){
        $.ajax({
            url: 'http://constats.ville.valdor.qc.ca/api/v1/sync/users',
            method: 'get',
            data: {uuid: uuidApp1},
            success: function (changes) {
                    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
                    db.transaction(function (tx){insertDBAgent(tx, changes)}, function(tx, results){alert(JSON.stringify(tx))});
                },
            error: function (model, response) {
                console.log(model);
                alert(JSON.stringify(model));
                //alert(response.responseText);
            }
        })
    }
    else {
        $.ajax({
            url: 'http://constats.ville.valdor.qc.ca/api/v1/sync/users',
            method: 'get',
            data: {uuid: uuidApp1},
            success: function (changes) {
                $('#matriculeMenu').val('');
                resultat = $.parseJSON(changes);
                $(resultat).each(function(key,value){
                    //agentResult = value.matricule;
                    //console.log(value);
                        $('#matriculeMenu').append( '<option value="'+value.id+'">'+value.matricule+'</option>' );

                })
            },
            error: function (model, response) {
                console.log(model);
                alert(JSON.stringify(model));
                //alert(response.responseText);
            }
        })
    }
}



//Insertion
function insertDBAgent(tx,changes){
    var resultat = $.parseJSON(changes);
    $(resultat).each(function(key,value){
        tx.executeSql('INSERT INTO AGENT (user_id,matricule,nom) VALUES ('+value.id +',"'+ value.matricule +'","'+ value.nom +'")');
    });

}

//Suppression BD Agent
function deleteBaseDAgent() {
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(deleteDBAgent, errorCB);
    //db.transaction(populateDBAgent, errorCB);
}

function deleteDBAgent(tx){
    tx.executeSql('DROP TABLE IF EXISTS AGENT');
}



function test(){
    $.ajax({
        url: 'http://constats.ville.valdor.qc.ca/api/v1/test',
        method: 'get',
        data: {uuid: uuidApp1},
        success: function (changes) {
            alert(JSON.stringify(changes));
            resultat = $.parseJSON(changes);

        },
        error: function (model, response) {
            console.log(model);
            alert(JSON.stringify(model));
            //alert(response.responseText);
        }
    })
}