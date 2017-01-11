angular.module('pushService', ['ionic', 'saveTokenService'])
    .service('pushService', function($ionicPlatform, $ionicPopup, saveTokenService, $rootScope) {
        var pushNotification = function() {
            $ionicPlatform.ready(function() {
                // After the platform is ready and our plugins are available
                //Intialize push service
                var push = PushNotification.init({
                    android: {
                        //senderId of your project on FCM
                        senderID: "1024972771000"
                    },
                    ios: {
                        //senderId of your project on FCM
                        senderID: "1024972771000",
                        //Whether you allow alert, badge/ alert/ sound
                        alert: "true",
                        badge: "true",
                        sound: "true",
                        gcmSandbox: "true",
                        //Define the buttons of notification:
                        categories: {
                            'invite': {
                                'yes': {
                                    'callback': window.accept,
                                    'title': 'Accept',
                                    'foreground': true,
                                    'destructive': false
                                },
                                'no': {
                                    'callback': window.reject,
                                    'title': 'Reject',
                                    'foreground': false,
                                    'destructive': false
                                }
                            }
                        }
                    },
                    windows: {}
                });

                push.on('registration', function(data) {
                    //Get the old RegistrationID of this device
                    var oldRegId = window.localStorage.getItem('registrationId');

                    //Check whether this is a new device or
                    //the RegisterationId of this device changed because reinstalling
                    if (oldRegId !== data.registrationId) {
                        // Save new registrationID to localstorage
                        window.localStorage.setItem('registrationId', data.registrationId);
                        //If Id changed, save new registerationID to the server
                        saveTokenService.register(data.registrationId);
                    }
                    console.log(window.localStorage.getItem('registrationId'));
                })

                push.on('notification', function(data) {
                    console.log('message', data.message);

                    //Broadcast the notification here
                    $rootScope.$broadcast('New Medicine', data.message);

                    //Define the callback function when app is open in the foreground
                    if (data.additionalData.foreground) {
                        /**
                         * This block is reached when a push notification is received when the app is in foreground.
                         */
                        $ionicPopup.show({
                            title: 'Foreground Notification',
                            template: data.message,
                            buttons: [{
                                text: 'Ignore',
                                role: 'cancel'
                            }, {
                                text: 'View',
                                onTap: function() {
                                    //define function when the user click "view"
                                    console.log("View the detail");
                                }
                            }]
                        });
                    } else {
                        //Define the callback function for user clicking on push notification directly
                        //when a push notification is tapped on *AND* the app is in background
                        var pastPushSavedID = window.localStorage.getItem("pastPushSavedID");

                        if (data.additionalData.notID !== pastPushSavedID) {
                            window.localStorage.setItem("pastPushSavedID", data.additionalData.notID);
                            $ionicPopup.show({
                                title: 'Background Notification',
                                template: data.message,
                                buttons: [{
                                    text: 'Ignore',
                                    role: 'cancel'
                                }, {
                                    text: 'View',
                                    onTap: function() {
                                        //define function when the user click "view"
                                        console.log("View the detail");
                                    }
                                }]
                            });
                            console.log("Push notification clicked");
                        }
                    }

                    // Call finish function to let the  OSknow the notification is done
                    push.finish(function() {
                        console.log("processing of push data is finished");
                    }, function() {
                        console.log("something went wrong with push.finish for ID = " + data.additionalData.notId)
                    }, data.additionalData.notId);
                });

                //Define the callback function of action buttons here.
                window.reject = function(data) {
                    alert("Reject Triggred");
                }

                window.accept = function(data) {
                    alert("Accept Triggred");
                }
            });
        };

        return {
            pushNotification: pushNotification
        };
    })

.controller('pushController', ['$scope', 'pushService', function($scope, pushService) {
    $scope.$on('New Medicine', function(event, data) {
        //add a div in index.html to print the data
        $scope
            .test = data;
        console.log('New Message', data);
    });
}]);
