function ApplicationTabGroup(Window) {
	//create module instance
	var self = Ti.UI.createTabGroup();
	
	var CameraWindow = require("ui/common/CameraWindow");
	var HomeWindow = require("ui/common/HomeWindow");
	var CreateUserWindow = require("ui/common/CreateUserWindow");
	var SettingWindow = require("ui/common/SettingWindow");
	var MapWindow = require("ui/common/MapWindow");
	
	var api = require("ui/common/APIClient");
	var client = api.client;
	
	//create app tabs
	var homeWindow = new HomeWindow(client);//new LoginWindow(client),//new Window(L('home')),
    var win2 = new CameraWindow(client);//new Window(L('settings'));
    var settingWindow = new SettingWindow(client);
	var mapWindow = new MapWindow(client);
		

	
	var tab1 = Ti.UI.createTab({
		title: L('home'),
		icon: '/images/KS_nav_ui.png',
		window: homeWindow
	});
	homeWindow.containingTab = tab1;
	
	var tab2 = Ti.UI.createTab({
		title: L('camera'),
		icon: '/images/KS_nav_views.png',
		window: win2
	});
	win2.containingTab = tab2;
	win2.onClosed = function(){
		self.setActiveTab(0);
	};
	
	tab2.addEventListener("focus",function(e){
		if(e.tab == tab2){
		    win2.startCamera();
		}
	});
	var tab3 = Ti.UI.createTab({
		title : L("map"),
		icon:'/images/KS_nav_views.png',
		window:mapWindow
	});
	mapWindow.containingTab = tab3;
	
	
	var tab4 = Ti.UI.createTab({
		title : L("setting"),
		icon:'/images/KS_nav_views.png',
		window:settingWindow
	});
	settingWindow.containingTab = tab4;
	
	self.addTab(tab1);
	self.addTab(tab2);
	self.addTab(tab3);
	self.addTab(tab4);
	
	
	var showModalLoginWindow = function(){
		var loginWindow = new CreateUserWindow(client);
		loginWindow.onLogin = function(success){
			if(success){
			    loginWindow.close();
			    homeWindow.updateData();	
			}else{
				alert("Fail to create user");
			}
		};
		
	    loginWindow.open({
			modal: true,
			modalTransitionStyle: Titanium.UI.iPhone.MODAL_TRANSITION_STYLE_FLIP_HORIZONTAL
		});
	};
	
	if(!client.isLogin()){
		self.addEventListener("open",function(){
			showModalLoginWindow();
		});
	}else{
		homeWindow.updateData();
	}
	
	settingWindow.onLogout = function(){
		Ti.API.debug("Logout");
		showModalLoginWindow();
	};
	
	
	return self;
};

module.exports = ApplicationTabGroup;
