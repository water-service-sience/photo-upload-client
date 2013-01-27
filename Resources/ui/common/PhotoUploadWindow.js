

function PhotoUploadWindow(client,imageData){
	
    var self = Ti.UI.createWindow({
		title : "Upload",
		backgroundColor : "white"
	});


	// place our picture into our window
	var imageView = Ti.UI.createImageView({
		image : imageData,
		top : 5,
		left:10,
		right:10,
		height : 100
	});
	self.add(imageView);
	
	var editField = Ti.UI.createView({
		width:"100%",
		height:300,
		top:120,
		backgroundColor:"white"
	});
	self.add(editField);
	
	editField.add(Ti.UI.createLabel({
		text :"Place",
		left : 0,
		width :"30%",
		height:30,
		top   :3
	}));
	var placeTextField = Ti.UI.createTextField({
		width:"65%",
		left :"30%",
		height:30,
		top   :3,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	editField.add(placeTextField);
	
	editField.add(Ti.UI.createLabel({
		text :"Comment",
		width :"100%",
		left : 0,
		height:30,
		top   :35
	}));
	var commentTextArea = Ti.UI.createTextArea({
		width:"96%",
		left : "2%",
		top : 65,
		height : 235,
		borderWidth: 1,
		borderColor: '#bbb',
		borderRadius: 5,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	editField.add(commentTextArea);
	
	
	var uploadButton = Ti.UI.createButton({
		title : "Upload",
		bottom : 5,
		width : "40%",
		height:30,
		left : "30%"
	});
	uploadButton.addEventListener("click",function(){
		client.upload(imageData,function(photoId){
			if(photoId != null){
				alert("Success to upload photo");
				client.editPhotoInfo(photoId,{
					place : placeTextField.value,
					comment : commentTextArea.value
				},function(success){
					if(!success){
						alert("Fail to edit photo info.");
					}
				});
				
				self.close();
			}else{
				alert("Fail to upload photo.Please retry.");
			}
		});
	});

    self.add(uploadButton);
	
	return self;
	
	
}

module.exports = PhotoUploadWindow;
