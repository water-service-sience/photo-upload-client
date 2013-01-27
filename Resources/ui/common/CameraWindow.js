

function CameraWindow(client){
	

	var self = Ti.UI.createWindow({
		title : "Camera",
		backgroundColor : "white"
	});
	
	var uploadButton = Ti.UI.createButton({
		title:"Use this image",
		bottom:5,
		left : 10
	});
	
	var PhotoUploadWindow = require("ui/common/PhotoUploadWindow")
	
	uploadButton.addEventListener("click", function(){
		
		var uploadWindow = new PhotoUploadWindow(client,imageView.image);
		uploadWindow.open();
		
		
		/*client.upload(imageView.image,function(){
			Ti.API.info("Done upload photo");
			self.onClose();
		});*/
	});
	
	var reCaptureButton = Ti.UI.createButton({
		title:"Recapture",
		bottom:5,
		right : 10
	});
	
	reCaptureButton.addEventListener("click", function(){
		self.startCamera();
	});
	
	var imageView = Ti.UI.createImageView({
		image : null,
		width : self.width,
		height : self.height
	});
	self.add(imageView);
	self.add(uploadButton);
	self.add(reCaptureButton);

	
	self.startCamera =function(){
		Titanium.Media.showCamera({

			success : function(event) {
				Ti.API.debug("picture was taken");
				imageView.image = event.media;
			},
			cancel : function() {
				if(self.onClosed){
					self.onClosed();
				}
				
			},
			error : function(error) {
				var a = Titanium.UI.createAlertDialog({
					title : 'Camera'
				});
				if (error.code == Titanium.Media.NO_CAMERA) {
					a.setMessage('No camera');
				    a.show();
					
					Titanium.Media.openPhotoGallery({
						success:function(e) {
							imageView.image = e.media;
						}
					});
				} else {
					a.setMessage('Unexpected error: ' + error.code);
					
					if(self.onClosed){
						self.onClosed();
					}
				}
			},
			//overlay : overlay,
       	    saveToPhotoGallery:false,
			mediaTypes : Ti.Media.MEDIA_TYPE_PHOTO,
		});

	}; 

	
	return self;
	
	
}

module.exports = CameraWindow;
