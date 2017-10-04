    //geolocalisation
	
	var onSuccess = function(position) {
        $('#posLat').val(position.coords.latitude);
		$('#posLong').val(position.coords.longitude);
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
	
	
	//Information sur l'appareil
	
	document.addEventListener("deviceready", onDeviceReady, false);
	
	function onDeviceReady() {
		console.log(device.uuid);
		var uuid = device.uuid
	}