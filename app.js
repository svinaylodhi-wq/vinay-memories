// ==========================================
// FIREBASE CONFIGURATION
// ==========================================

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);

const database = firebase.database();


// ==========================================
// GET TRACKING ID FROM URL
// Example:
// index.html?id=VINAY123
// ==========================================

const urlParams = new URLSearchParams(window.location.search);

let trackingId = urlParams.get("id");


// If no ID exists, create a random demo ID
if (!trackingId) {

    trackingId =
        "MEMORY-" +
        Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

}


// ==========================================
// ELEMENTS
// ==========================================

const shareBtn =
    document.getElementById("shareBtn");

const stopBtn =
    document.getElementById("stopBtn");

const status =
    document.getElementById("status");


// ==========================================
// LOCATION WATCH
// ==========================================

let watchId = null;


// ==========================================
// START LOCATION SHARING
// ==========================================

shareBtn.addEventListener("click", function () {

    if (!navigator.geolocation) {

        status.innerText =
            "GPS is not supported on this device.";

        return;
    }


    status.innerText =
        "Requesting location permission...";


    watchId =
        navigator.geolocation.watchPosition(

            function (position) {

                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;

                const accuracy =
                    position.coords.accuracy;


                const data = {

                    latitude: latitude,

                    longitude: longitude,

                    accuracy: accuracy,

                    updatedAt:
                        firebase.database.ServerValue.TIMESTAMP,

                    sharing: true
                };


                // Save location
                database
                    .ref("locations/" + trackingId)
                    .set(data);


                status.innerText =
                    "🟢 Location sharing is ON";


                console.log(
                    "Latitude:",
                    latitude
                );

                console.log(
                    "Longitude:",
                    longitude
                );
            },


            function (error) {

                console.log(error);

                status.innerText =
                    "❌ Location permission was not granted.";
            },


            {
                enableHighAccuracy: true,

                maximumAge: 5000,

                timeout: 15000
            }
        );

});


// ==========================================
// STOP SHARING
// ==========================================

stopBtn.addEventListener("click", function () {

    if (watchId !== null) {

        navigator.geolocation.clearWatch(
            watchId
        );

        watchId = null;
    }


    database
        .ref("locations/" + trackingId)
        .update({

            sharing: false,

            stoppedAt:
                firebase.database.ServerValue.TIMESTAMP
        });


    status.innerText =
        "🔴 Location sharing is OFF";
});
