//Server settings for android push notifications with node-gcm

// Load modules
var express = require('express');
var gcm = require('node-gcm');

// The apiKey of your project on FCM
var app = express();
var apiKey = "AAAA7AbHQo0:APA91bGkqtyOZiYJKMKGQepD_4cWG5tUgbqZRGqAjipCqc3kTTkLDobbIsVpdlhT4cQ3yMzdRlitLPwyK0biTO_4YLQhFdEXoL97YXHhLpNDPNe4-KiUkNxQC0iMfciORhGPdV1y-xfri_gbXjJznWCKzpqS7wt-ng";


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
    var message = new gcm.Message();

    //the number of times to retry sending the message if it fails
    var retry_times = 4;

    //Define the message
    //The title will be shown in the notification center
    message.addData('title', 'Hello, World');

    message.addData('message', 'This is a notification that will be displayed ASAP.');

    //Add action buttons, set the foreground property to true the app will be brought to the front
    //if foreground is false then the callback is run without the app being brought to the foreground.
    message.addData('actions', [
        { "icon": "accept", "title": "Accept", "callback": "window.accept", "foreground": true },
        { "icon": "reject", "title": "Reject", "callback": "window.reject", "foreground": false },
    ]);

    //Set content-available = 1, the on('notification') event handler will be called
    //even app running in background or closed
    message.addData('content-available', '1');

    //Give every message a unique id
    message.addData('id', Math.random());

    //priority can be: -2: minimum, -1: low, 0: default , 1: high, 2: maximum priority.
    //Set priority will inform the user on the screen even though in the background or close the app.
    //This priority value determines where the push notification will be put in the notification shade.
    message.addData('priority', 1);

    message.addData('style', 'inbox');
    message.addData('summaryText', 'There are %n% notifications');

    //Here get the devices from your database into an array
    //var deviceID = "dX24xnORlQ8:APA91bG4M-81_0k06MHSK5nD5QyPX46yKC-XgB26fwU-RJudSX1Eh9FqW0EoHc0BoeRZ7KVRUdVFtO9fq3JONiZtn880NTDIulvVJraBDx8Cyx2v-CM0pW-mrBTV8Pq2jGnTTdvcczx7";
    var deviceID = "fAdLEoSduZc:APA91bFMcfSREvSsRUnCaDk7lt6RlRWSTpaeqvRyMp8AnScrdBAxeWThVctAhbyDIQde_e84XhuJ9b7P2r67M0aayssJM2iMdqsChDvrcdR1shv3_d37IpYm1IsLr9nKlq7qBW1iRCg1";
    service.send(message, { registrationTokens: [deviceID] }, retry_times, function(err, response) {
        if (err)
            console.error(err);
        else
            console.log(response);
    });
});
