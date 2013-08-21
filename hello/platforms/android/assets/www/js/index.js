/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var options = {
        orgName:'healthcare', // Your Apigee.com username for App Services
        appName:'doctor', // Your Apigee App Services app name
        buildCurl:true,
        logging:true
    }
var client = new Apigee.Client(options);


var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        
        var pushNotification = window.plugins.pushNotification;		
        pushNotification.register(successHandler, errorHandler,{"senderID":"460281438122","ecb":"onNotificationGCM"});


        
        
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

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
