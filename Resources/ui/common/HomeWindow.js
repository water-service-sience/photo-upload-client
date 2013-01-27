

function HomeWindow(client){
	

	var self = Ti.UI.createWindow({
		title : "My photos",
		backgroundColor : "white"
	});
	
	var tableData = [{title:"a"},{title:"b"}];
	
	var tableView = Ti.UI.createTableView({
		bottom:30,
		data : tableData
	});
	
	self.add(tableView);
	
	var updateButton = Ti.UI.createButton({
		title : "Refresh",
		bottom:2,
		height:25,
		width:100,
		left:20
	})
	self.add(updateButton);
	updateButton.addEventListener("click",function(e){
		Ti.API.debug("Click!!!");
		self.updateData();
	});
	
	
	
	self.updateData = function(){
		
		client.getSelfUploadPhotos(function(photos){
			if(photos == null){
				alert("Fail to get photos");
			}else{
				tableData = [];
				for( i in photos){
					var p = photos[i];
					
					var captured = new Date();
					captured.setTime(p.captured);
					tableData.push({
						title : p.place + " captured:" + captured
					});
				}
				Ti.API.debug(tableData);
				tableView.data = tableData;
			}
		})
	};
	
	
	
	
	return self;
	
	
}

module.exports = HomeWindow;
