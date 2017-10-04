    var onSuccess = function(position) {
        $('#lat').val(position.coords.latitude);
		$('#long').val(position.coords.longitude);
    };

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }

	
	function getPosition(){
		navigator.geolocation.getCurrentPosition(onSuccess, onError);
	}