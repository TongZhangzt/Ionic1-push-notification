//Server settings for android push notifications with node-gcm

// Load modules
var express = require('express');
var gcm = require('node-gcm');

// The apiKey of your project on FCM
var app = express();
//var apiKey = "AAAAjo8JDg0:APA91bEkbzZbEgR7eXY1jKgmJZhoW3GaNmRYf5yICNQQEOcaHxZuYtOKLNSK98T9aFAiUpkLUukldgsYDPBvVcEWEabVnQeKyBGWWM-O7yrrufGe2N-40x4I07WLvveL8O3dzDAKKKM7";
var apiKey = "AAAA7qUjTrg:APA91bFW2oVQ1mE9u2ANPjFy8IfkMWVGrHs0f1b1Umd_K1DDfng9h0e0hRQih8mLaXCPvu35xHBq9recmJ1EGJiCk7o2qwdN2n3FYPwHr21_p4iP2z1mgZGDdZo-uFLGrRxpqXM5L_tRvudTQJTxxH2IpQC0VquYPQ";

//Set up the server
var server = app.listen(3000, function() {
    console.log('server is just fine!');
});

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Define the basic route
app.get('/', function(req, res) {
    res.send("This is basic route");
});

app.post('/register', function(req, res) {
    var device_token;
    device_token = req.body.device_token;
    console.log('device token received');
    console.log(device_token);
    res.send('ok');
});

app.get('/push', function(req, res) {
    //Initialize the service
    var service = new gcm.Sender(apiKey);
    //the number of times to retry sending the message if it fails
    var retry_times = 4;

    /***** Define the message for Android Devices   *****/
    var message_Android = new gcm.Message();
    //The title will be shown in the notification center
    message_Android.addData('title', 'Hello, World');

    message_Android.addData('message', 'This is a notification that will be displayed ASAP.');

    //Add action buttons, set the foreground property to true the app will be brought to the front
    //if foreground is false then the callback is run without the app being brought to the foreground.
    message_Android.addData('actions', [
        { "icon": "accept", "title": "Accept", "callback": "window.accept", "foreground": true },
        { "icon": "reject", "title": "Reject", "callback": "window.reject", "foreground": false },
    ]);

    //Set content-available = 1, the on('notification') event handler will be called
    //even app running in background or closed
    message_Android.addData('content-available', '1');

    //Give every message a unique id
    message_Android.addData('notId', Math.ceil(Math.random() * 100));

    //priority can be: -2: minimum, -1: low, 0: default , 1: high, 2: maximum priority.
    //Set priority will inform the user on the screen even though in the background or close the app.
    //This priority value determines where the push notification will be put in the notification shade.
    message_Android.addData('priority', 1);

/*    message_Android.addData('style', 'inbox');
    message_Android.addData('summaryText', 'There are %n% notifications');*/

    message_Android.addData('data', { 'type': 'New Medicine', 'id': 1112 });


    /***** Define the message for IOS Devices   *****/
    var message_IOS = new gcm.Message({
        'contentAvailable': true,
        priority: 'high',
        'notification': {
            title: "Hello, World",
            body: 'This is a notification that will be displayed ASAP.',
            'click-action': 'invite'
        },

        //Add additional data to the payload
        data: {
            'type': 'New Medicine',
            'data': 1112,
            notId: Math.random() * 100,
        }
    });

    //Here get the devices from your database into an array
    var deviceID_Android = "dtyJyXoiCtA:APA91bEKcjfjoabbWrIoS6WFRiuakuoa6GtM8-YOt0kI9cJDiKFnE8jAOfdOrMMBir6gE7QA_6k1VJjTREXE5BGL9QhBt0bQWtNXiMP0FXB_ox3gBcZXR3SKED7DBqI5I05XqCvJg1s8";
    //var deviceID_Android = "m3kHS4BnrF0:APA91bGDRjNibKqDkMooSmaQlO2xVTE3D1FvmNzqttO6l_yeLCQwztRv3FY-R92T3En-3TdwH403c_4Dr7qMPL-l6PAG10-_E7pOkUhGgZXOImuYbvl29mDcwZI-WIwzUGpQUUTIzaf3";

    var deviceID_IOS = "lAEBqtmXiJU:APA91bE5SNa3xk0lUe8nqthVAO807fhuJ4fpRW5DwfRV1E10fxofsH29lbpYiZtwPDbORhPC4JOATsUZlm0Q4NyibHoppk2D-OlQkCBQVjbV6n9XBUyaACsuczvTg0FejRo3Bx3q-Bix";
    //var deviceID_IOS = "mLYhmb1KWIE:APA91bER0pcw_u5jVs619n1O_LrUpqwkC0zWf7CnuCwnWGL-g8nSPXuzJgDzirYWJbCItaEoWN8aXMy_xLl0ZFLHS5g8JfqqWjsx5XOnoM7W3cMy_8sVZcU9mzi6oGnreeGQ665udiv4";

    /**** Send Notifications to Android devices   *****/
/*        service.send(message_Android, { registrationTokens: [deviceID_Android] }, retry_times, function(err, response) {
            if (err)
                console.error(err);
            else
                console.log(response);
        });*/

    /**** Send Notifications to IOS devices   *****/
    service.send(message_IOS, { registrationTokens: [deviceID_IOS] }, retry_times, function(err, response) {
        if (err)
            console.error(err);
        else
            console.log(response);
    });
});
