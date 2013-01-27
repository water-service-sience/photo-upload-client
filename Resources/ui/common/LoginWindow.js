

function LoginWindow(api){
	
	
	var self = Ti.UI.createWindow({
		title : "Login",
		backgroundColor : "white"
	});
	
	self.add(Ti.UI.createLabel({
		text:"Username",
		top:10,
		left:5,
        width: 'auto', height: 'auto'
	}));
	var username = Ti.UI.createTextField({
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		top:10,
		left:90,
		width:100,
		height:25
		
	});
	self.add(username);
	
	self.add(Ti.UI.createLabel({
		text:"Password",
		top:40,
		left:5,
        width: 'auto', height: 'auto'
	}));
	var password = Ti.UI.createTextField({
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		top:40,
		left:90,
		width:100,height:25
	});
	self.add(password);
	
	var loginButton = Ti.UI.createButton({
		top:70,
		right:20,
		title:"Login",
        width: 'auto', height: 'auto'
	});
	
	self.add(loginButton);
	
	loginButton.addEventListener("click",function(){
		Ti.API.info(api.url + " : " + username.text);
		api.login(nickname.value,password.value,self.onLogin);
	});
	
	
	
	return self;
	
	
	
}


module.exports = LoginWindow;
