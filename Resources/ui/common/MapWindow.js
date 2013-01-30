

function MapWindow(client){
	

	var self = Ti.UI.createWindow({
		title : "Map",
		backgroundColor : "white"
	});
	
	
	
	var mapView = Ti.Map.createView({
		mapType: Ti.Map.STANDARD_TYPE,
		region:{
			latitude:40.0, longitude:130, latitudeDelta:0.05, longitudeDelta:0.05},
            animate:true,
            regionFit:true,
            userLocation:true
	    });
	self.add(mapView);
	
	var veilPhoto = function(photoUrl){
		Ti.API.debug("ImageURL=" + photoUrl);
		var veil = Ti.UI.createView({
			top:0,
			left:0,
			right:0,
			bottom:0,
			backgroundColor:"black",
			opacity:0.4
		});
		
		var ind = Ti.UI.createActivityIndicator({
				top : "40%",
				left : "45%",
				width : 100,
				height:100
			});;
		var osname = Ti.Platform.osname;
		if(osname == "iphone" || osname == "ipad"){
		    ind.style = Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN;
		}

		
		var image = Ti.UI.createImageView({
			image:photoUrl,
			top : "5%",
			left: "5%",
			right: "5%",
			height:"90%" 
		});
		self.add(veil);
		self.add(ind);
		self.add(image);
		
		veil.addEventListener("click",function(){
			Ti.API.debug("Clicked ");
			self.remove(veil);
			self.remove(image);
			self.remove(ind);
		});
		image.addEventListener("click",function(){
			Ti.API.debug("Clicked ");
			self.remove(veil);
			self.remove(image);
			self.remove(ind);
			
		});
		
		return veil;
	}
	
	mapView.addEventListener("click",function(e){
		Ti.API.debug("Annotation clicked?" + e.annotation);
		var pin = e.annotation;
		if(pin != null){
		    veilPhoto("http://de24.digitalasia.chubu.ac.jp/photo-gather/images/uploaded/" + pin.photo.resourceKey);
		}
	});
	
	
	var updateMapPhotos = function(){
		var lat = mapView.region.latitude;
		var lon = mapView.region.longitude;
	    client.getPhotosNearBy(lat,lon,function(photos){
	    	Ti.API.debug("Find " + photos.length + " photos");
	    	mapView.removeAllAnnotations();
	    	for( var i in photos){
	    		var photo = photos[i];
	    		var pin = Titanium.Map.createAnnotation({
	    			latitude: photo.latitude,
	    			longitude:photo.longitude,
	    			title:photo.place,
	    			subtitle:photo.comment,
	    			pincolor:Titanium.Map.ANNOTATION_GREEN,
	    			photo:photo
	    		});
	    		mapView.addAnnotation(pin);
	    		
	    		/*pin.addEventListener("click",function(e){
	    			
	    			var pin = e.annotation;
	    			Ti.API.debug("Click photo " + pin.photo.id + ":" + pin.photo.resouceKey);
	    			veilPhoto(pin.photo.resourceKey);
	    		});*/
	    	}
	    });
	}
	self.addEventListener("open",function(){
		
		Titanium.Geolocation.getCurrentPosition(function(e) {
			if (!e.success) {
				alert("This device is not support GPS.");
				return;
			}

			Ti.API.debug("Current pos = " + e.coords.latitude + "," + e.coords.longitude + ")");

			var r = mapView.region;
			var newR = {
				latitude : e.coords.latitude,
				longitude : e.coords.longitude,
				latitudeDelta : r.latitudeDelta,
				longitudeDelta : r.longitudeDelta
			};
			mapView.region = newR;

			updateMapPhotos();

		});

		});

	
	
	
	
	return self;
	
	
}

module.exports = MapWindow;
