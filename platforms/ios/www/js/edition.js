var currentRow;

       

		
	// Édition de la BD
		$('#exampleModal').modal({show:false}).
			on('show.bs.modal', function (event) {
				var row = $(event.relatedTarget).closest('tr');
				var modal = $(this);
				var dateComplete = row.find('td[data-title="b_date"]');
				console.log(dateComplete);
				//var anneeAA = dateComplete.substr(dateComplete.length - 2);
            	//console.log(dateComplete);
				modal.find('.modal-title').text('Édition du constat' +' '+ row.find('td[data-title="user_id"]').html() +"-"+ row.find('td[data-title="id"]').html());
				modal.find('#noCivEdit').val(row.find('td[data-title="adresse"]').html());
		});




        // Transaction error callback
        //
        function errorCB(err) {
            toastr['error']('Error processing SQL: '+err.code);

            // alert("Error processing SQL: "+err.code);
        }

        // Transaction success callback
        //
        function successCB() {
            db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
            db.transaction(queryDB, errorCB);
        }



        function editRow(tx) {
            tx.executeSql('UPDATE DEMO SET adresse ="'+document.getElementById("adresseTxt").value+
                    '", description= "'+document.getElementById("descriptionTxt").value+ '" WHERE id = '
                    + currentRow, [], queryDB, errorCB);
        }
		
        function goEdit() {
            db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
            db.transaction(editRow, errorCB);
        }


	
