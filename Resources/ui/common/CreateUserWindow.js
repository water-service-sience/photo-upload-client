

function CreateUserWindow(api){
	
	
	var self = Ti.UI.createWindow({
		title : "Create user",
		backgroundColor : "white"
	});
	
	self.add(Ti.UI.createLabel({
		text:"Nickname",
		top:10,
		left:5,
        width: 'auto', height: 'auto'
	}));
	var nickname = Ti.UI.createTextField({
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		top:10,
		left:90,
		width:100,
		height:25
		
	});
	self.add(nickname);
	
	var createUserButton = Ti.UI.createButton({
		top:70,
		right:20,
		title:"Create",
        width: 'auto', height: 'auto'
	});
	
	self.add(createUserButton);
	
	createUserButton.addEventListener("click",function(){
		Ti.API.info(api.url + " create user");
		api.createUser(nickname.value,self.onLogin);
	});
	
	
	
	return self;
	
	
	
}


module.exports = CreateUserWindow;
