//Fichier pour la gestion de la table des adresses

var adresseResult = [];
var nomRueResult = [];

//Création de la table adresse
function populateDBAdr(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS adresses (adresse_id PRIMARY KEY, nocivique INTEGER, adresse)');
}

// Lancer la requête de sélection de tout dans la table adresse
function successCBAdr(tx,result) {
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(function(tx,result){queryDBAdr(tx,result)}, errorCB);
}

//Sélectionner tout dans la table adresse
function queryDBAdr(tx,result){
    tx.executeSql('SELECT * FROM adresses', [],function(tx,result){
        querySuccessAdr(tx,result)
    }, errorCB)
}



//connexion on serveur
function querySuccessAdr(tx,result) {
    //if (result.rows.length===0){
        $.ajax({
            xhr: function() {
                var xhr = new window.XMLHttpRequest();

                // Upload progress
                xhr.upload.addEventListener("progress", function(evt){
                    if (evt.lengthComputable) {
                        var percentComplete = (evt.loaded / evt.total)*100;
                        //Do something with upload progress
                        $(".progress-bar").css("width", percentComplete + "%").text(percentComplete + " %");
                        }
                }, false);

                // Download progress
                xhr.addEventListener("progress", function(evt){
                    if (evt.lengthComputable) {
                        var percentComplete = (evt.loaded / evt.total)*100;
                        // Do something with download progress
                        $(".progress-bar").css("width", percentComplete + "%").text(percentComplete + " %");

                    }
                }, false);

                return xhr;
            },

            //aller chercher les informations sur le serveur pour les adresses
            url: 'http://constats.ville.valdor.qc.ca/api/v1/sync/adresses',
            method: 'get',
            data: {uuid: uuidValue},
            success: function (changes) {
                db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
                //lancer la requête d'insertion des informations dans la table adresse
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

//Insertion des informations sur les adresses du serveur dans la table adresse
function insertDBAdr(tx,changes){
    var resultat = $.parseJSON(changes);
    $(resultat).each(function(key,value){///TODO:: paramétrisation
        tx.executeSql('INSERT OR REPLACE INTO adresses (adresse_id,nocivique,adresse) VALUES ("'+ value.MATRICULE +'","'+ value.NOCIVIQUE +'","'+ value.ADRESSE +'")');
    });
    resultat = $.parseJSON(changes);
    //ajouter les information dans la variable adresseResult
    adresseResult.push(resultat);



}

//Lancer la requête de suppression de la table adresse
function deleteBaseDAdr() {
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(function(tx){
        tx.executeSql('DROP TABLE IF EXISTS adresses');
    }, errorCB);
    //db.transaction(populateDBAdr, errorCB);
}

//Suppression de la table adresse
function deleteDBAdr(tx){

}


//Lancer la requête de sélection
function selectNoCiv(){
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(function(tx){
        //var  nocivique =;
        //Sélectionner les nom de rue ayant un numéro civique égale à la valeur entrée dans le champ texte
        tx.executeSql('SELECT * FROM adresses WHERE nocivique = ? ',[$('#noCivTxt_c').val()],function(tx,results){
            nomRueSelect(results);
        }, function(err){console.log('err tx selectNoCiv');})
    }, function(err){console.log(JSON.stringify(err))});
}




//Autocomplète des adresses
function nomRueSelect(results){
    nomRueResult = [];
    var len = results.rows.length;
    //Ajouter les noms de rues et matricule à la variable nomRueResults
    for (var i = 0; i < len; i++) {
        nomRueResult.push({value: results.rows.item(i).adresse_id, label: results.rows.item(i).adresse});
    }
    // Autocomplete Jquery
    $("#rueTxt_c").autocomplete({
        source: nomRueResult,
        minLength: 2,
        select: function(event, ui) {
            event.preventDefault();
            var inputRue = $('#rueTxt_c');
            //label
            inputRue.val(ui.item.label);
            //valeur des label
            inputRue.data("matricule",ui.item.value);
        },
        open: function(event, ui) {//Fix pour iOS car on doit appuyer 2 fois sur le choix
            if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
                $('.ui-autocomplete').off('menufocus hover mouseover mouseenter');
            }
        }
    });
}



//Lancer la requête de sélection pour l'édition
function selectNoCivEdit(){
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(
        tx.executeSql('SELECT * FROM adresses WHERE nocivique= ?',[$('#noCivTxtEdit_c').val()],function(tx, results){
            nomRueSelectEdit(tx, results)
        }, errorCB)
        , errorCB);
}

//Sélectionner les nom de rue ayant un numéro civique égale à la valeur entrée dans le champ texte pour l'édition
function selectNoCivSuccessEdit(tx, results){

}

//Autocomplète des adresses pour l'édition
function nomRueSelectEdit(tx, results){
    nomRueResult = [];
    var len = results.rows.length;
    //Ajouter les noms de rues et matricule à la variable nomRueResults
    for (var i = 0; i < len; i++) {
        nomRueResult.push({value: results.rows.item(i).adresse_id, label: results.rows.item(i).adresse});
    }
    // Autocomplete Jquery
    $("#rueTxtEdit_c").autocomplete({
        source: nomRueResult,
        minLength: 2,
        select: function(event, ui) {
            event.preventDefault();
            //label
            $("#rueTxtEdit_c").val(ui.item.label);
            //valeur des label
            $('#rueTxtEdit_c').data("matricule",ui.item.value);
        }
    });
}