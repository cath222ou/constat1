//table agent
function populateDBAgent(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS AGENT (id INTEGER PRIMARY KEY AUTOINCREMENT, matricule, nom)');
}



// Transaction success callback
//
function successCBAgent(tx,result,uuidApp1) {
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(function(tx,result,uuidApp1){queryDBAgent(tx,result,uuidApp1)}, errorCB);
}



function queryDBAgent(tx,result,matAgent1,uuidApp1){
    tx.executeSql('SELECT * FROM AGENT', [],function(tx,result,uuidApp1){querySuccessAgent(tx,result,uuidApp1)}, errorCB)
}



//Remplir la table agent
function querySuccessAgent(tx,result,uuidApp1) {
    console.log(tx,result);
    console.log(matAgent1, uuidApp1);
    $.ajax({
        url: 'http://constats.dev/api/v1/sync/users',
        method:'get',
        data: {mmatricule:matricule,uuid:uuid},
        success:function (changes) {
            console.log(changes);
        },
        error: function(model, response) {
            console.log(model);
            alert(response.responseText);
        }
    });

}