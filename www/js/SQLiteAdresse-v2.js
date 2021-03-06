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
    }, errorCB);
}



//connexion on serveur
function querySuccessAdr(tx,result) {
    if (navigator.onLine === true){
        $.ajax({
            //xhr: function() {
            //    var xhr = new window.XMLHttpRequest();
            //
            //    // Upload progress
            //    xhr.upload.addEventListener("progress", function(evt){
            //        if (evt.lengthComputable) {
            //            var percentComplete = (evt.loaded / evt.total)*100;
            //            //Do something with upload progress
            //            $(".progress-bar").css("width", percentComplete + "%").text(percentComplete + " %");
            //            }
            //    }, false);
            //
            //    // Download progress
            //    xhr.addEventListener("progress", function(evt){
            //        if (evt.lengthComputable) {
            //            var percentComplete = (evt.loaded / evt.total)*100;
            //            // Do something with download progress
            //            $(".progress-bar").css("width", percentComplete + "%").text(percentComplete + " %");
            //
            //        }
            //    }, false);
            //
            //    return xhr;
            //},

            //aller chercher les informations sur le serveur pour les adresses
            url: 'http://constats.ville.valdor.qc.ca/api/v1/sync/adresses',
            method: 'get',
            data: {uuid: uuidValue},
            success: function (changes) {
                db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
                //lancer la requête d'insertion des informations dans la table adresse
                db.transaction(function (tx){insertDBAdr(tx,changes);}, errorCB);
            },
            error: function (model, response) {
                console.log(model);
                toastr['error'](reponse.responseText);

                // alert(response.responseText);
            }
        });
     }

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
    $(resultat).each(function(key,value){
        tx.executeSql('INSERT OR REPLACE INTO adresses (adresse_id,nocivique,adresse) VALUES (?,?,?)',[value.MATRICULE,value.NOCIVIQUE,value.ADRESSE]);
    });
    //resultat = $.parseJSON(changes); 21/03/2018
    //ajouter les information dans la variable adresseResult
    //adresseResult.push(resultat); 21/03/2018
}

//Lancer la requête de suppression de la table adresse
function deleteBaseDAdr() {
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(function(tx){
        tx.executeSql('DROP TABLE IF EXISTS adresses');
    }, errorCB);
    //db.transaction(populateDBAdr, errorCB);
}



// function verifMonth(matricule){
//
//     db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
//     db.transaction(function(tx){
//         //var  nocivique =;
//         //Sélectionner les nom de rue ayant un numéro civique égale à la valeur entrée dans le champ texte
//         tx.executeSql('SELECT * FROM constatsMonth WHERE adresse_id = ? ',[matricule],function (tx,results){
//             inMonth(results);
//         }, errorCB)
//     }, errorCB);
//
// }
//
// function inMonth(results){
//
//     if(results.rows.length > 0){
//         toastr['error']('Un constat a été émis à cette adresse dans les 30 derniers jours')
//         nouvConstat();
//     }
// }

//Dialogue pour le message d'avertissement qu'un constat a déjà été émis à cette adresse dans les 30 derniers jours
// $( function() {
//     $( "#dialog-confirm" ).dialog({
//         autoOpen: false,
//         resizable: false,
//         height: "auto",
//         width: 400,
//         modal: true,
//         buttons: {
//             "Ok": function() {
//                 nouvConstat();
//                 $( this ).dialog( "close" );
//             }
//         }
//     });
// } );

//Vérifier si le constat a été émis dans les 30 derniers jours
function verifTrenteDernierJour(tx, results){
    // var infractionEnCours = $('.radio-input:radio:checked').val(); //COMMENTAIRE si pas besoin
    // if (infractionEnCours == null || infractionEnCours == undefined){ //COMMENTAIRE si pas besoin
    //     toastr["warning"]('Veuillez sélectionner une infraction avant d\'entrer une adresse.'); //COMMENTAIRE si pas besoin
    //     $('#noCivTxt_c').val('').attr('data-matricule',''); //COMMENTAIRE si pas besoin
    //     $('#rueTxt_c').val(''); //COMMENTAIRE si pas besoin
    // } //COMMENTAIRE si pas besoin
    // else { //COMMENTAIRE si pas besoin
    console.log('début fn vérifier 30 jours');
    console.log(results.rows.length);
        for (i = 0; i < results.rows.length; i++) {
            var dateConstat = moment(results.rows.item(i).b_date, "DD/MM/YYYY");
            // var infractionPrecedente = results.rows.item(i).b_description; //COMMENTAIRE si pas besoin
            //Vérifier si la date du constat date de 30 jours ou moins
            if (moment().diff(dateConstat, 'days') < 31) { //COMMENTAIRE si pas besoin (Pour la 2e condition)
                // $("#dialog-confirm").dialog("open");
                toastr.options = {
                    "closeButton": true,
                    "debug": false,
                    "newestOnTop": false,
                    "progressBar": true,
                    "positionClass": "toast-bottom-right",
                    "preventDuplicates": false,
                    "onclick": null,
                    "showDuration": "300",
                    "hideDuration": "1000",
                    "timeOut": 0,
                    "extendedTimeOut": 0,
                    "showEasing": "swing",
                    "hideEasing": "linear",
                    "showMethod": "fadeIn",
                    "hideMethod": "fadeOut",
                    "tapToDismiss": false
                }
                toastr['warning']('Un constat a été émis à cette adresse dans les 30 derniers jours.');
            }
        }
        console.log('fin fn vérifier 30 jours');
    // } //COMMENTAIRE si pas besoin
}

//Récupérer les constats qui ont été émis à cette adresse
function validerConstatMemeAdresse(matriculeRole){
   setTimeout(function(){
           db = window.openDatabase("Database", "1.0", "Cordova Demo", 500000);
           db.transaction(function(tx){
                       tx.executeSql('SELECT * FROM constats WHERE adresse_id=?', [matriculeRole], verifTrenteDernierJour, errorCB);
               }, errorCB,function(){console.log('validation constat deja emis ok');}
           );
           },600);
}

$('#rueTxt_c').on('click',function(event){
   event.preventDefault();
    // $('#rueTxt_c').data("matricule");
    $('#rueTxt_c').data("matricule",null);
    var nociv = $('#noCivTxt_c').val();
    setTimeout(function(){
        db = window.openDatabase("Database", "1.0", "Cordova Demo", 500000);
        db.transaction(function(tx){
            //Sélectionner les nom de rue ayant un numéro civique égale à la valeur entrée dans le champ texte
            setTimeout(nomRueSelect(tx,nociv),500);
        }, errorCB,function(){console.log('transaction ok');});

    },500);
});
$('#rueTxtAdmin').on('click',function(event){
    event.preventDefault();
    // $('#rueTxtAdmin').data("matricule");
    $('#rueTxtAdmin').data("matricule",null);
    var nociv = $('#noCivTxtAdmin').val();
    setTimeout(function(){
        db = window.openDatabase("Database", "1.0", "Cordova Demo", 500000);
        db.transaction(function(tx){
            //Sélectionner les nom de rue ayant un numéro civique égale à la valeur entrée dans le champ texte
            setTimeout(nomRueSelect(tx,nociv),500);
        }, errorCB,function(){console.log('transaction ok');});

    },500);
});
$('#rueTxt_c').focusout(function(){
    var inputRue = $('#rueTxt_c');
    console.log('avant valider constat meme adresse');
    validerConstatMemeAdresse(inputRue.data("matricule"));
});

//Autocomplète des adresses
function nomRueSelect(tx,nociv){
    console.log('début fn nomRueSelect');
    tx.executeSql('SELECT * FROM adresses WHERE nocivique = ? ',[nociv],function(tx,results){
        var nomRueResult = [];
        var len = results.rows.length;
        //Ajouter les noms de rues et matricule à la variable nomRueResults
        // $(results).each(function(key, value){
        //     nomRueResult.push({value: value.adresse_id, label: value.adresse});
        // });
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
            // change: function (event, ui) {
            //     if (ui.item === null) {
            //         alert(inputRue.data())
            //         inputRue.data("matricule",null);
            //     }
            // },
            open: function(event, ui) {//Fix pour iOS car on doit appuyer 2 fois sur le choix
                if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
                    $('.ui-autocomplete').off('menufocus hover mouseover mouseenter');
                }
            }
        });

        // Autocomplete Jquery
        $("#rueTxtAdmin").autocomplete({
            source: nomRueResult,
            minLength: 2,
            select: function(event, ui) {
                event.preventDefault();
                var inputRue = $('#rueTxtAdmin');
                //label
                inputRue.val(ui.item.label);
                //valeur des label
                inputRue.data("matricule",ui.item.value);
            },
            // change: function (event, ui) {
            //     if (ui.item === null) {
            //         alert(inputRue.data())
            //         inputRue.data("matricule",null);
            //     }
            // },
            open: function(event, ui) {//Fix pour iOS car on doit appuyer 2 fois sur le choix
                if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
                    $('.ui-autocomplete').off('menufocus hover mouseover mouseenter');
                }
            }
        });
        console.log('fin fn nomRueSelect');
    },errorCB());
}




//Lancer la requête de sélection pour l'édition
function selectNoCivEdit(){
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(
        tx.executeSql('SELECT * FROM adresses WHERE nocivique= ?',[$('#noCivTxtEdit_c').val()],function(tx, results){
            nomRueSelectEdit(tx, results);
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