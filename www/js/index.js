// This is the main javascript source for old Timey Wimey Stuff
var photos = [];

loadAllPhotos();
hideAllViews();

populateEditList();
populateList();
$('#showall').show();

function loadAllPhotos() {
	if(localStorage["photos"] != null) {
		photos = JSON.parse(localStorage["photos"]);
	}
}

function makePhotoEntry() {
	// var imageData = $('#camera-photo').attr('src').replace("data:image/jpeg;base64,", "");
	var imageData = $('#camera-photo').attr('src');
	var imagePath = $('#image-path').html();
	var longitude = $('#longitude').html();
	var latitude = $('#latitude').html();
	var description = $('#description').val();

	var photoEntry = {
		"imageData" : imageData,
		"imagePath": imagePath,
		"longitude" : longitude,
		"latitude" : latitude,
		"description" : description
	};

	photos.push(photoEntry);
}

function saveAllPhotos() {
	localStorage.clear();
	localStorage["photos"] = JSON.stringify(photos);
	if(navigator.notification) {
		navigator.notification.alert("Photo has been saved", null, "Success!", "OK");
	} else {
		alert("Photo has been saved");
	}
}

function saveAllPhotosAfterEdit () {
	localStorage.clear();
	localStorage["photos"] = JSON.stringify(photos);
	if (navigator.notification) {
		navigator.notification.alert("Changes have been saved", null, "Success!", "OK");
	} else {
		alert("Changes have been saved");
	}
}

$('button.save').click(function() {
	clearNewView();
	makePhotoEntry();
	saveAllPhotos();
	populateList();
	populateEditList();
});

function hideAllViews() {
	$('#showall').hide();
	$('#camera').hide();
	$('#edit').hide();
}

$('li.viewlink').click(function () {
	hideAllViews();
	if ($(this).html() == "Home") {
		clearFullView();
		$('#showall').show();
	} else if ($(this).html() == "Capture") {
		$('#camera').show();
	} else {
		clearEditView();
		$('#edit').show();
	}
});

$('#edit ul').on('click', 'li', function () {
	populateEditView($(this).attr('index'));
});

function populateEditList () {
	$('#edit ul').children().remove();
	for (var i=0; i<photos.length; i++) {
		var newRow = '<li index="' + i + '">';
		newRow += '<img class="thumbnail" src="file:///mnt/sdcard' + photos[i]["imagePath"] + '" />';
		newRow += '</li>';
		$('#edit ul').append(newRow);
	}
}

function populateEditView (index) {
	var photoToEdit = photos[index];

	$("#camera-photo-edit").attr('src', 'file:///mnt/sdcard' + photoToEdit["imagePath"]);
	$("#image-path-edit").html(photoToEdit["imagePath"]);
	$("#longitude-edit").val(photoToEdit["longitude"]);
	$("#latitude-edit").val(photoToEdit["latitude"]);
	$("#description-edit").val(photoToEdit["description"]);
	$("#index-edit").html(index);
}

function clearEditView () {
	$("#camera-photo-edit").attr('src', '');
	$("#image-path-edit").html('');
	$("#longitude-edit").val('');
	$("#latitude-edit").val('');
	$("#description-edit").val('');
	$("#index-edit").html('');	
}

function clearFullView () {
	$("#camera-photo-view").attr('src', '');
	$("#image-path-view").html('');
	$("#longitude-view").html('');
	$("#latitude-view").html('');
	$("#description-view").html('');
	$("#index-view").html('');	
}

function clearNewView () {
	$("#camera-photo").attr('src', '');
	$("#image-path").html('');
	$("#longitude").html('');
	$("#latitude").html('');
	$("#description").val('');
	$("#index").html('');	
}

$('#showall ul').on('click', 'li', function () {
	populateView($(this).attr('index'));
});

function populateList () {
	$('#showall ul').children().remove();
	for (var i=0; i<photos.length; i++) {
		var newRow = '<li index="' + i + '">';
		newRow += '<img class="thumbnail" src="file:///mnt/sdcard' + photos[i]["imagePath"] + '" />';
		newRow += '</li>';
		$('#showall ul').append(newRow);
	}
}

function populateView (index) {
	var photoToView = photos[index];

	$("#camera-photo-view").attr('src', 'file:///mnt/sdcard' + photoToView["imagePath"]);
	$("#image-path-view").html(photoToView["imagePath"]);
	$("#longitude-view").html(photoToView["longitude"]);
	$("#latitude-view").html(photoToView["latitude"]);
	$("#description-view").html(photoToView["description"]);
	$("#index-view").html(index);
}

$("button.save-edit").click(function () {
	var imageData = $('#camera-photo-edit').attr('src');
	var imagePath = $('#image-path-edit').html();
	var longitude = $('#longitude-edit').val();
	var latitude = $('#latitude-edit').val();
	var description = $('#description-edit').val();
	var index = $('#index-edit').html();

	photos[index]["imageData"] = imageData;
	photos[index]["imagePath"] = imagePath;
	photos[index]["longitude"] = longitude;
	photos[index]["latitude"] = latitude;
	photos[index]["description"] = description;

	saveAllPhotosAfterEdit();
});

function saveAllPhotosAfterEdit () {
	localStorage.clear();
	localStorage["photos"] = JSON.stringify(photos);
	if (navigator.notification) {
		navigator.notification.alert("Changes have been saved", null, "Success!", "OK");
	} else {
		alert("Changes have been saved");
	}
}

$('button.camera-control').click(function () {
    // navigator is PhoneGap access to hardware
    if (navigator.camera) {
        
        var options = {
            quality: 60,
            //destinationType: Camera.DestinationType.DATA_URL,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: 1,
            encodingType: 0
        };
        
        navigator.camera.getPicture(getPhoto, null, options);
        navigator.geolocation.getCurrentPosition(getPosition, null, {enableHighAccuracy: true});
    }
});

function getPosition (position){
	var longitude = position.coords.longitude;
	var latitude = position.coords.latitude;
	
	$('#longitude').html('Long:' + longitude);
	$('#latitude').html('Lat:'+ latitude);
}

function getPhoto(imageURI){
	$('#camera-photo').attr('src', imageURI);
	window.resolveLocalFileSystemURI(imageURI, resolveOnSuccess, resolveOnError);
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