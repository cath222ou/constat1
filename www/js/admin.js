$('#tabs-6ID').on('click', function(){
    $('#tabs-6ID').addClass('hidden');
    $('#loginAdminModal').modal('show');
    $('input[type="text"]').val('');
});

function verifAdminMP() {
    var password = $('#password').val();
    $('loginAdminModal').modal('hide')

    $.ajax({

        url: 'http://constats.ville.valdor.qc.ca/auth',
        method: 'post',
        data: {pwd: password},
        success: function (response) {
            if (response.code == 200) {
                getConstatsAdmin();
                $('#tabs-6ID').removeClass('hidden');
            }
            else{
                alert('Mot de passe invalide')
            }
        },
        error: function (model, response) {
            console.log(model);
            alert(response.responseText);
        }
    });
}


$("#idAdmin").prop("readonly", true);


//Création de la table demo pour visualisation dans l'application
function afficherTableAdmin(tx, results) {
    var table01 = $('#tblAdmin tbody');
    $('#tblAdmin').removeClass('hidden');
    table01.html('');
    var len = results.rows.length;
    for (var i = 0; i < len; i++) {
        table01.append(
            '<tr>'
            + '<td data-title="Numéro du constat" data-desc="constat_id" class="hidden">'+results.rows.item(i).constat_id +'</td>'
            + '<td data-title="user_id" data-desc="user_id" >'+results.rows.item(i).user_id +'</td>'
            + '<td data-title="device_id" data-desc="device_id" class="hidden">'+results.rows.item(i).device_id +'</td>'
            + '<td data-title="a_nom" data-desc="a_nom" class="hidden">'+results.rows.item(i).a_nom +'</td>'
            + '<td data-title="a_adresse" data-desc="a_adresse" class="hidden">'+results.rows.item(i).a_adresse +'</td>'
            + '<td data-title="a_telephone1" data-desc="a_telephone1" class="hidden">'+results.rows.item(i).a_telephone1 +'</td>'
            + '<td data-title="a_telephone2" data-desc="a_telephone2" class="hidden">'+results.rows.item(i).a_telephone2 +'</td>'
            + '<td data-title="b_date" data-desc="b_date" class="hidden">'+results.rows.item(i).b_date +'</td>'
            + '<td data-title="b_heure" data-desc="b_heure" class="hidden">'+results.rows.item(i).b_heure +'</td>'
            + '<td data-title="b_description" data-desc="b_description" class="hidden">'+results.rows.item(i).b_description +'</td>'
            + '<td data-title="b_description_autre" data-desc="b_description_autre" class="hidden">'+results.rows.item(i).b_description_autre +'</td>'
            + '<td data-title="c_endroit" data-desc="c_endroit" class="hidden">'+results.rows.item(i).c_endroit +'</td>'
            + '<td data-title="Numéro civique" data-desc="c_nociv">'+results.rows.item(i).c_nociv +'</td>'
            + '<td data-title="Nom de la rue"  data-desc="c_rue">'+results.rows.item(i).c_rue +'</td>'
            + '<td data-title="adresse_id" data-desc="adresse_id" class="hidden">'+results.rows.item(i).adresse_id +'</td>'
            + '<td data-title="c_description" data-desc="c_description" class="hidden">'+results.rows.item(i).c_description +'</td>'
            + '<td data-title="e_details" data-desc="e_details" class="hidden">'+results.rows.item(i).e_details +'</td>'
            + '<td data-title="e_suite" data-desc="e_suite" class="hidden">'+results.rows.item(i).e_suite +'</td>'
            + '<td data-title="e_detailsSuite" data-desc="e_detailsSuite" class="hidden">'+results.rows.item(i).e_detailsSuite +'</td>'
            + '<td data-title="lat" data-desc="lat" class="hidden">'+results.rows.item(i).lat +'</td>'
            + '<td data-title="lon" data-desc="lon" class="hidden">'+results.rows.item(i).lon +'</td>'
            + '<td data-title="note" data-desc="note" class="hidden">'+results.rows.item(i).note +'</td>'
            + '<td data-title="sync" data-desc="sync" >'+results.rows.item(i).sync +'</td>'
            + '<td><button id="editAdmin" type="button" data-toggle="modal" data-target="#constatModalEditAdmin">Modifier</button>'+
            //+ '<button type="button" class="btn1" onClick="syncConstat()">Synchronisation</button></td>'+
            '</tr>'
        );
    }
}

//Callback d'erreur générique
function errorCB(something) {
    if (typeof something == 'object') {
        something = JSON.stringify(something);
    }
    console.log(something);
}

// Lancer la requête de sélection de tous dans la table demo
function getConstatsAdmin(tx) {
    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(function(tx){
        tx.executeSql('SELECT * FROM constats', [], afficherTableAdmin, errorCB);
        // tx.executeSql('SELECT * FROM constats', [], afficherTableConstats, errorCB);
    }, errorCB);
}

//Lancer la requête pour raffraichir la table dans Constats à synchroniser lorsque l'on clique sur cet tabs
// $('#tabs-6ID').click(function() {
//     getConstatsAdmin()
// });


function filtreConstat(){
    var matricule = $('#rueTxtAdmin').data("matricule");

    db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
    db.transaction(function(tx){
        tx.executeSql('SELECT * FROM constats WHERE adresse_id=?', [matricule], afficherTableAdmin, errorCB);
        // tx.executeSql('SELECT * FROM constats', [], afficherTableConstats, errorCB);
    }, errorCB);

    $('#filtreAdminModal').modal('hide');
    $('input[type="text"]').val('');
}



$('#constatModalEditAdmin').on('show.bs.modal', function (event) {

    var row = $(event.relatedTarget).closest('tr');
    var modal = $(this);
    modal.find('.modal-title').text('Édition du constat: '+row.find('td[data-desc="c_nociv"]').html()+', '+row.find('td[data-desc="c_rue"]').html());
    $('#idAdmin').val(row.find('td[data-desc="constat_id"]').html());
    $('#userIdAdmin').val(row.find('td[data-desc="user_id"]').html());
    $('#etatAdmin').val(row.find('td[data-desc="sync"]').html());

});

function goEditAdmin() {
    var matricule = $('userIdAdmin').val();
    var etat = $('#etatAdmin').val();

    if((matricule == "" || matricule == null || matricule == " ")&&(etat == "" || etat == null || etat == " " )){
        alert('Les champs ne peuvent être vide')
    }
    else {
        db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
        db.transaction(editRowAdmin, errorCB, getConstatsAdmin);
    }
}

function editRowAdmin(tx) {
    var constatID = $('#idAdmin').val();
    var userID = $("#userIdAdmin").val();
    var etat = $("#etatAdmin").val();

    tx.executeSql('UPDATE constats SET user_id="' + userID +
        '", sync ="' + etat +
        '" WHERE constat_id =' +constatID, [], errorCB);

    $('#constatModalEditAdmin').modal('hide');
}
