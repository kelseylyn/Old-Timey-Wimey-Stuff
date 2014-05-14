// This is the main javascript source for old Timey Wimey Stuff

$('button.camera-control').click(function(){
	//navigator is PhoneGap access to hardware
	if(navigator.camera){
		var options={
		quality:60,
		destinationType: Camera.DestinationType.DATA_URL,
		sourceType:1,
		encodingType: 0
		};
	
		navigator.camera.getPicture(getPhoto, null, options);
		navigator.geolocation.getCurrentPosition(getPosition,null,{enableHighAccuracy: true});
	}

});

function getPhoto(data){
	$('#camera-photo').attr('src',"data:image/jpeg;base64," + data);
}
function getPosition (position){
	var longitude = position.coords.longitude;
	var latitude = position.coords.latitude;
	
	$('#longitude').html('Long:' + longitude);
	$('#latitude').html('Lat:'+ latitude);
}

