f# Apigee Push Notifications Sample for Android and iOS

---

## DESCRIPTION

This sample shows how to use Push Notifications in your app using Apigee Appservices and Phonegap 3.0


## LICENSE

	The MIT License
	
	Copyright (c) 2012 Adobe Systems, inc.
	portions Copyright (c) 2012 Olivier Louvignes
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.

## Pre-requisites

1) Setup Push Notification configuration in Appservices [Creating Notifiers for apple (APNS) and google(GCM)]

## Steps to Create the Sample

	cordova create hello com.example.hello Helloworld
	cd hello
	cordova platform add android
	cordova platform add ios
	//Refer to Android Quirks below, before proceeding
	cordova plugin add https://github.com/jdhiro/PushPlugin.git
	//We can start using https://github.com/phonegap-build/PushPlugin, once jdhiro pull request is merged

	//The following plugins for notification and console
	cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-dialogs.git
	cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-vibration.git
	cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-console.git

Setup is done, 

Add 
	PushNotification.js, [https://github.com/phonegap-build/PushPlugin/tree/master/www] 
	apigee.min.js [https://github.com/apigee/apigee-javascript-sdk/tree/master/bin]

to 	
	hello/www/js/

Edit hello/www/index.html to include the new scripts

		<script type="text/javascript" src="js/PushNotification.js"></script>
        <script type="text/javascript" src="js/apigee.min.js"></script>

For Android,

/hello/platforms/android/assests/www/js/index.js - updated for Pushnotification

		var options = {
		        orgName:'<org>', // Your Apigee.com username for App Services
		        appName:'<app>', // Your Apigee App Services app name
		        buildCurl:true,
		        logging:true
		    }
		var client = new Apigee.Client(options);


	    onDeviceReady: function() {
	        app.receivedEvent('deviceready');
	        
	        var pushNotification = window.plugins.pushNotification;		
	        pushNotification.register(successHandler, errorHandler,{"senderID":"460281438122","ecb":"onNotificationGCM"});
	    }

		function successHandler(result){
			console.log(JSON.stringify(result));
		}
		function errorHandler (err){
			console.log(err);
		}
		function onNotificationGCM (event){
			console.log(JSON.stringify(event));
			if ( event.event == 'registered'){
				var options = {notifier:'google',deviceToken:event.regid};
				client.registerDevice(options,function(err,res){
					console.log('device registration done');
					console.log(JSON.stringify(res));
					navigator.notification.alert("Device Registered");
				});
			}else if ( event.event == 'message'){
				navigator.notification.alert(event.payload.data);
			}
		}

For iOS,
/hello/platforms/ios/www/js/index.js		
		var options = {
		        orgName:'<org>', // Your Apigee.com username for App Services
		        appName:'<app>', // Your Apigee App Services app name
		        buildCurl:true,
		        logging:true
		    }
		var client = new Apigee.Client(options);		
		onDeviceReady: function() {
		        var pushNotification = window.plugins.pushNotification;
		        pushNotification.register(tokenHandler, errorHandler ,{"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});
    	}

		function successHandler(result){
			console.log(JSON.stringify(result));
		}


		function errorHandler (err){
			console.log(err);
		}

		function tokenHandler(result) {
		    console.log("Device Registration Result =" +  result);
		    
		    var options = {notifier:'apple',deviceToken:result};
		    client.registerDevice(options,function(res){
		                          console.log('device registration done');
		                          console.log(res);
		                          });
		}

		function onNotificationAPN(event){
		    console.log('Event received');
		    console.log(event);
		    if (event.alert) {
		        navigator.notification.alert(event.alert);
		    }
		    if (event.badge) {
		        pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
		    }
		}


Android Quirks

If PushPlugin fails to install with error 
	[Error: Plugin doesn't support this project's Cordova version. Project version: 3.0.0-dev, failed version requirement: >=3.0.0]

Then, edit this file platforms/android/cordova/version to have version 3.0.0 or greater based on your cordova version
		