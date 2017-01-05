angular.module('pushService', ['ionic', 'saveTokenService'])
    .service('pushService', function($ionicPlatform, $ionicPopup, saveTokenService, $rootScope) {
        var pushNotification = function() {
            $ionicPlatform.ready(function() {
                // After the platform is ready and our plugins are available
                //Intialize push service
                var push = PushNotification.init({
                    android: {
                        //senderId of your project on FCM
                        senderID: "1013726003853"
                    },
                    ios: {
                        //Whether you allow alert, badge/ alert/ sound
                        alert: "true",
                        badge: "true",
                        sound: "true"
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
                    saveTokenService.register(data.registrationId);
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

                        if (data.additionalData.id !== pastPushSavedID) {
                            window.localStorage.setItem("pastPushSavedID", data.additionalData.id);
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
