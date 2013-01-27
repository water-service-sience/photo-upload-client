

function SettingWindow(client){
	
	
	
	var self = Ti.UI.createWindow({
		title : "Setting",
		backgroundColor : "white"
	});
	
	self.onLogout = function(){};
	
	var logoutButton = Ti.UI.createButton({
		title : "Logout",
		top:150,
		left:100,
		width:100,
		height:30
	});
	logoutButton.addEventListener("click",function(){
		client.logout();
		self.onLogout();
	});
	
	self.add(logoutButton);
	
	
	return self;
	
	
	
}


module.exports = SettingWindow;
