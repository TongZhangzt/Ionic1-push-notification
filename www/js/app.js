// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $ionicPopup, saveTokenService) {
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

        //Register this device
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
            saveTokenService.register(data.registrationId);
            console.log(window.localStorage.getItem('registrationId'));
        });

        push.on('notification', function(data) {
            console.log('message', data.message);
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

        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
        .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
    })

    // Each tab has its own nav history stack:

    .state('tab.dash', {
        url: '/dash',
        views: {
            'tab-dash': {
                templateUrl: 'templates/tab-dash.html',
                controller: 'DashCtrl'
            }
        }
    })

    .state('tab.chats', {
            url: '/chats',
            views: {
                'tab-chats': {
                    templateUrl: 'templates/tab-chats.html',
                    controller: 'ChatsCtrl'
                }
            }
        })
        .state('tab.chat-detail', {
            url: '/chats/:chatId',
            views: {
                'tab-chats': {
                    templateUrl: 'templates/chat-detail.html',
                    controller: 'ChatDetailCtrl'
                }
            }
        })

    .state('tab.account', {
        url: '/account',
        views: {
            'tab-account': {
                templateUrl: 'templates/tab-account.html',
                controller: 'AccountCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/dash');

});
