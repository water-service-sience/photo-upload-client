

function createAPIClient(){
	
	var dbName = "userdata";
	var AccessKeyHeader = "PU-AccessKey";
	
	var execQuery = function(queries){
		
	    var db = Titanium.Database.open(dbName);
	    var rows = null;
	    for(var i = 0;i < queries.length ; i+= 1){
	    	var q = queries[i];
	    	try{
	    	    rows = db.execute(q);
	    	}catch(e){
	    		Ti.API.error("DB error" + e);
	    	}
	    }
	    var values = null;
	    if(rows != null){
	    	values = {};
	    	if(rows.getRowCount() > 0){
		    	do{
		    		values[rows.fieldByName("k")] = rows.fieldByName("v");
	    	    }while(rows.next());
	    	}
	    }
	    db.close();
	    return values;
	};
	
	
	Ti.API.info("Create table");
	execQuery(['CREATE TABLE IF NOT EXISTS KVS (k TEXT,v TEXT);']);
	var allRows = execQuery(["select * from KVS;"]);
	Ti.API.debug("All rows:" + allRows);
	
	var writeDb = function(key , value ){
		execQuery([
			"delete from KVS where k = '" + key + "';",
			"insert into KVS VALUES ('" + key + "','" + value + "');",
		
		]);
	};
	var readDb = function(key){
		var rows = execQuery(["select * from KVS where k = '" + key + "';"]);
		Ti.API.debug(rows);
		if(rows){
			return rows[key];
		}else{
			return null;
		}
	};
	
	
	
	var client = {
		accessKey : "",
		//url : "http://localhost:8080/",
		url : "http://de24.digitalasia.chubu.ac.jp/photo-gather/",
		onSuccessToLogin : function(){},
		onFailToLogin : function(){},
		isLogin : function() {
			if (client.accessKey && client.accessKey.length > 0)
				return true;
			else
				return false;
		}, 
		createUser : function(nickname,callback){
			var url = client.url + "api/user/create";
			var c = Ti.Network.createHTTPClient({
				onload : function(e) {
					var ak = this.responseText;
					Ti.API.info("Success to create user" + ak);
					var d = JSON.parse(ak);
					var accessKey = d.accessKey;
					
					writeDb("accessKey", accessKey);
					client.accessKey = accessKey;
					callback(true);
				},
				onerror : function(e) {
					Ti.API.error("Fail to create user:" + e.source.status);
					callback(false);
				}
			});
			c.open("POST", url);
			c.setRequestHeader("Content-Type","text/json");
			// can't send body. Why?
			/*c.send({
				nickname : nickname,
				hoge :"hoge"
			});*/
			c.send(JSON.stringify({
				nickname : nickname
			}
			));
		},
		login : function(username, password,callback) {
			var c = Ti.Network.createHTTPClient({
				onload : function(e) {
					var ak = this.responseText;
					Ti.API.info("Success to login" + ak);
					var d = JSON.parse(ak);
					var accessKey = d.accessKey;
					
					writeDb("accessKey", accessKey);
					client.accessKey = accessKey;
					callback(true);
				},
				onerror : function(e) {
					Ti.API.error("Fail to login:" + e.error);
					alert("Fail to login");
					callback(false);
				}
			});
			var url = client.url + "api/login?username=" + username + "&password=" + password;
			c.open("GET", url);
			c.send();
		}, 
		logout: function(){
			execQuery(["delete from KVS;"]);
		},
		upload :function(image,callback) {
			var c = Ti.Network.createHTTPClient({
				onload : function(e) {

					Ti.API.info("Success to upload photo");
					
					var ak = this.responseText;
					var d = JSON.parse(ak);
					callback(d.photoId);
				},
				onerror : function(e) {
					Ti.API.debug("Fail to upload photo:" + e.error);
					alert("Fail to upload photo");
					callback(null);
				}
			});
			var url = client.url + "api/upload";
			c.open("POST", url);
			Ti.API.debug("AccessKey = " + client.accessKey);
			c.setRequestHeader(AccessKeyHeader,client.accessKey);
			c.send({
				image : image,
				accessKey : client.accessKey
			});
			

		},
		editPhotoInfo:function(photoId,params,callback){
			
			var url = client.url + "api/photo/edit/" + photoId;
			var c = Ti.Network.createHTTPClient({
				onload : function(e) {
					Ti.API.info("Success to edit photo data");
					var ak = this.responseText;
					var d = JSON.parse(ak);
					callback(true);
				},
				onerror : function(e) {
				    Ti.API.info("Fail to get self uploaded photos." + e);
				    callback(false);
				}
			});
			c.open("POST", url);
			
			c.setRequestHeader("Content-Type","text/json");
			c.setRequestHeader(AccessKeyHeader,client.accessKey);
			c.send(JSON.stringify(params));
		},
		getSelfUploadPhotos : function(callback){
			
			var url = client.url + "api/photo/uploaded";
			var c = Ti.Network.createHTTPClient({
				onload : function(e) {
					var ak = this.responseText;
					Ti.API.info("Success to get self uploaded photos");
					var d = JSON.parse(ak);
					callback(d);
				},
				onerror : function(e) {
				    Ti.API.info("Fail to get self uploaded photos." + e);
				    callback(null);
				}
			});
			c.open("GET", url);
			
			c.setRequestHeader(AccessKeyHeader,client.accessKey);
			c.send();
			
		},
		getPhotosNearBy : function(lat,lon,callback) {
			
			
			var url = client.url + "api/photo/near?lat=" + lat + "&lon=" + lon;
			var c = Ti.Network.createHTTPClient({
				onload : function(e) {
					var ak = this.responseText;
					Ti.API.info("Success to get self near photos");
					var d = JSON.parse(ak);
					callback(d);
				},
				onerror : function(e) {
				    Ti.API.info("Fail to get self near photos." + e);
				    callback(null);
				}
			});
			c.open("GET", url);
			
			c.setRequestHeader(AccessKeyHeader,client.accessKey);
			c.send();
		}
		
	};

	
	// Login with local data.
	
	var ak = readDb("accessKey");
	if(ak){
		Ti.API.info("Already logged in");
		client.accessKey = ak;
	}else{
		client.accessKey = null;
	}
	
	
	
	return client;

}

module.exports.client = createAPIClient();


