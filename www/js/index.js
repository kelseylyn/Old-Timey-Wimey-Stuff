// This is the main javascript source for old Timey Wimey Stuff
var photos = [];

loadAllPhotos();
hideAllViews();

displayAllPhotos();
$('#showall').show();

function displayAllPhotos() {
	for(var 1 = 0; i < photos.length; i++) {
		$("#showall ul").append("<li>" + phtos[i]["imagepath"] + "</li>");
	}
}

function loadAllPhotos() {
	if(localStorage["photos"] != null) {
		photos = JSON.parse(localStorage["photos"]);
	}
}

function makePhotoEntry() {
	// var imageData = $('#camera-photo').attr('src').replace("data:image/jpeg;base64,", "");
	var imageData = $('#camera-photo').attr('src');
	var imagePath = $('#image-path').html();
	var longitude = $('#longitude').html().replace('Long: ', ''); //MAY 20
	var latitude = $('#latitude').html().replace('Lat: ', ''); //MAY 20
	var description = $('#description').val();

	var photoEntry = {
		"image" : imageData,
		"imagepath": imagepath,
		"longitude" : longitude,
		"latitude" : latitude,
		"description" : description
	};

	photose.push(photoEntry);
}

function saveAllPhotos() {
	localStorage.clear();
	localStorage["photos"] = JSON.stringigy(photos);
	if(navigator.notification) {
		navigator.notification.alert("Photo has been saved", null, "Success!", "OK");
	}
}

$('button.save').click(function() {
	makePhotoEntry();
	saveAllPhotos();
	$('#showall ul').children().remove();
	displayAllPhotos;
});

function hideAllViews() {
	$('#showall').hide();
	$('#camera').hide();
	$('#edit').hide();
}

$('li.viewlink').click(function() {
	hideAllViews();
	if($(this).html() == "Home") {
		$('#showall').show();
	} else if($(this).html() == "Capture") {
		$('#camera').show();
	} else {
		populateEditView();
		$('#edit').show();
	}
});

function populateEditView() {
	var photoToEdit = photos[WHICH_PHOTO_???];

	$('#camera-photo-edit').attr('src', photoToEdit["imageData"]);
	$('#image-path-edit').html(photoToEdit["imagepath"]);
	$('#longitude-edit').html(photoToEdit["longitude"]);
	$('#latitude-edit').html(photoToEdit["latitude"]);
	$('#description-edit').html(photoToEdit["description"]);
}

$("#save-edit").click(function() {
	var imageData = $('#camera-photo').attr('src');
	var imagePath = $('#image-path').html();
	var longitude = $('#longitude').html() //.replace('Long: ', '');
	var latitude = $('#latitude').html() // .replace('Lat: ', '');
	var description = $('#description').val();

	photoToEdit = photos[WHICH_PHOTO_???]["imageData"] = imageData;
	photoToEdit = photos[WHICH_PHOTO_???]["imagepath"] = imagepath;
	photoToEdit = photos[WHICH_PHOTO_???]["longitude"] = longitude;
	photoToEdit = photos[WHICH_PHOTO_???]["latitude"] = latitude;
	photoToEdit = photos[WHICH_PHOTO_???]["description"] = description;

	saveAllPhotos();
})

$('button.camera-control').click(function(){
	//navigator is PhoneGap access to hardware
	if(navigator.camera) {
		var options = {
		quality: 60,
		destinationType: Camera.DestinationType.FILE_URI,
		sourceType: 1,
		encodingType: 0
		};
	
	navigator.camera.getPicture(getPhoto, null, options);
	navigator.geolocation.getCurrentPosition(getPosition,null,{enableHighAccuracy: true});
	}
});

function getPhoto(imageURI){
	$('#camera-photo').attr('src', imageURI);
	window.resolveLocalFileSystemURI(imageURI, resolveOnSuccess, resolveOnError);
}
function getPosition (position){
	var longitude = position.coords.longitude;
	var latitude = position.coords.latitude;
	
	$('#longitude').html('Long:' + longitude);
	$('#latitude').html('Lat:'+ latitude);
}
function positionError (error) {
	$('#error-output').html(error.message);
}

function resolveOnError(error) {
	// do nothing for now
}

function resolveOnSuccess(entry) {
	var now = new Date();
	var timestamp = now.getTime();
	var photoName = timestamp + ".jpg";
	var photoFolder = "Timey_Wimey_Stuff";

	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
		function(fileSystem) {
			fileSystem.root.getDirectory(photoFolder, {create: true, exclusive: false},
				function(directory) {
					entry.moveTo(directory, photoName, successMove, resolveOnError);
				},
				resolveOnError);
		},
		resolveOnError);
}

function successMove(entry) {
	$('#image-path').html(entry.fullPath);
}