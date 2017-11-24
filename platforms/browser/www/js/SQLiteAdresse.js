var adresseResult = [];

//table agent
function populateDBAdr(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS ADRESSE (matricule PRIMARY KEY, adresse)');
}

function errorCB1(){
    console.log('oan');
}

// Transaction success callback

function successCBAdr(tx,result,uuidApp1) {
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(function(tx,result,uuidApp1){queryDBAdr(tx,result,uuidApp1)}, errorCB);
}


function queryDBAdr(tx,result,uuidApp1){
    tx.executeSql('SELECT * FROM ADRESSE', [],function(tx,result,uuidApp1){querySuccessAdr(tx,result,uuidApp1)}, errorCB)
}



//connexion on serveur
function querySuccessAdr(tx,result) {
    if (result.rows.length===0){
        $.ajax({
            url: 'http://constats.dev/api/v1/sync/adresses',
            method: 'get',
            data: {uuid: uuidApp1},
            success: function (changes) {
                db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
                db.transaction(function (tx){insertDBAdr(tx,changes)}, errorCB);
            },
            error: function (model, response) {
                console.log(model);
                alert(response.responseText);
            }
        })
    }
    else {
        $.ajax({
            url: 'http://constats.dev/api/v1/sync/adresses',
            method: 'get',
            data: {uuid: uuidApp1},
            success: function (changes) {
                resultat = $.parseJSON(changes);
                 $(resultat).each(function (key, value) {
                     adresseResult.push(value.ADRESSE);
                 });
            },
            error: function (model, response) {
                console.log(model);
                alert(response.responseText);
            }
        })
    }
}

//Insertion
function insertDBAdr(tx,changes){
    var resultat = $.parseJSON(changes);
    $(resultat).each(function(key,value){
        tx.executeSql('INSERT INTO ADRESSE (matricule,adresse) VALUES ("'+ value.MATRICULE +'","'+ value.ADRESSE +'")');
    });

}

//Suppression BD Agent
function deleteBaseDAdr() {
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(deleteDBAdr, errorCB);
    //db.transaction(populateDBAdr, errorCB);
}

function deleteDBAdr(tx){
    tx.executeSql('DROP TABLE IF EXISTS ADRESSE');
}