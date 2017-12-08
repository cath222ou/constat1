var adresseResult = [];
var nomRueResult = [];

//table agent
function populateDBAdr(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS ADRESSE (adresse_id PRIMARY KEY, nocivique INTEGER, adresse)');
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
    //if (result.rows.length===0){
        $.ajax({
            url: 'http://constats.ville.valdor.qc.ca/api/v1/sync/adresses',
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
    // }
    // else {
    //     $.ajax({
    //         url: 'http://constats.ville.valdor.qc.ca/api/v1/sync/adresses',
    //         method: 'get',
    //         data: {uuid: uuidApp1},
    //         success: function (changes) {
    //             resultat = $.parseJSON(changes);
    //             //$(resultat).each(function (key, value) {
    //             adresseResult.push(resultat);
    //
    //         },
    //         error: function (model, response) {
    //             console.log(model);
    //             alert(response.responseText);
    //         }
    //    })
    //}
}

//Insertion
function insertDBAdr(tx,changes){
    var resultat = $.parseJSON(changes);
    $(resultat).each(function(key,value){
        tx.executeSql('INSERT OR REPLACE INTO ADRESSE (adresse_id,nocivique,adresse) VALUES ("'+ value.MATRICULE +'","'+ value.NOCIVIQUE +'","'+ value.ADRESSE +'")');
    });
    resultat = $.parseJSON(changes);
    adresseResult.push(resultat);



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



//Autocomplete d'adresse requête

function selectNoCiv(){
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(selectNoCivSucces, errorCB);
}

function selectNoCivSucces(tx, results){
    tx.executeSql('SELECT * FROM ADRESSE WHERE nocivique='+$('#noCivTxt_c').val(),[],function(tx, results){nomRueSelect(tx, results)}, errorCB)

}

function nomRueSelect(tx, results){
    nomRueResult = [];
    var len = results.rows.length;
    for (var i = 0; i < len; i++) {
        nomRueResult.push({value: results.rows.item(i).adresse_id, label: results.rows.item(i).adresse});
    }
    // Autocomplete Jquery
    $("#rueTxt_c").autocomplete({
        source: nomRueResult,
        minLength: 2,
        select: function(event, ui) {
            event.preventDefault();
            $("#rueTxt_c").val(ui.item.label);
            $('#rueTxt_c').data("matricule",ui.item.value);
        }
    });
}