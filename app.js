// ==========================================
// VINAY MEMORIES - FIREBASE LOCATION DEMO
// ==========================================

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAZj0FHYJJoYfrvERWkp7HIB9YxxtU5Xyk",

    authDomain: "vinay-memories.firebaseapp.com",

    databaseURL:
        "https://vinay-memories-default-rtdb.firebaseio.com",

    projectId: "vinay-memories",

    storageBucket:
        "vinay-memories.firebasestorage.app",

    messagingSenderId: "224250798294",

    appId:
        "1:224250798294:web:92550f85dc8e09e9f8e977"
};


// ==========================================
// START FIREBASE
// ==========================================

firebase.initializeApp(firebaseConfig);

const database = firebase.database();


// ==========================================
// GET DEMO ID FROM URL
// Example:
// ?id=VINAY123
// ==========================================

const urlParams =
    new URLSearchParams(window.location.search);

let trackingId =
    urlParams.get("id");


// If ID is not provided, create one
if (!trackingId) {

    trackingId =
        "MEMORY-" +
        Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();
}


// ==========================================
// PAGE ELEMENTS
// ==========================================

const shareBtn =
    document.getElementById("shareBtn");

const stopBtn =
    document.getElementById("stopBtn");

const status =
    document.getElementById("status");


// ==========================================
// LOCATION WATCH ID
// ==========================================

let watchId = null;


// ==========================================
// SHARE LOCATION
// ==========================================

shareBtn.addEventListener("click", function () {

    // Prevent multiple watches
    if (watchId !== null) {

        status.innerText =
            "🟢 Location sharing is already ON";

        return;
    }


    // Check browser GPS support
    if (!navigator.geolocation) {

        status.innerText =
            "❌ GPS is not supported on this device.";

        return;
    }


    status.innerText =
        "📍 Requesting location permission...";


    // Browser asks user for permission
    watchId =
        navigator.geolocation.watchPosition(

            function (position) {

                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;

                const accuracy =
                    position.coords.accuracy;


                // Data sent to Firebase
                const locationData = {

                    latitude: latitude,

                    longitude: longitude,

                    accuracy: accuracy,

                    sharing: true,

                    updatedAt:
                        firebase.database
                            .ServerValue.TIMESTAMP
                };


                // Save location
                database
                    .ref("locations/" + trackingId)
                    .set(locationData)

                    .then(function () {

                        status.innerText =
                            "🟢 Location sharing is ON";

                    })

                    .catch(function (error) {

                        console.error(error);

                        status.innerText =
                            "❌ Firebase database error.";
                    });


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

                console.error(
                    "Location Error:",
                    error
                );


                if (error.code === 1) {

                    status.innerText =
                        "❌ Location permission denied.";

                } else if (error.code === 2) {

                    status.innerText =
                        "❌ Location unavailable.";

                } else if (error.code === 3) {

                    status.innerText =
                        "❌ Location request timed out.";

                } else {

                    status.innerText =
                        "❌ Unable to get location.";
                }


                watchId = null;
            },


            {
                enableHighAccuracy: true,

                maximumAge: 5000,

                timeout: 15000
            }
        );

});


// ==========================================
// STOP LOCATION SHARING
// ==========================================

stopBtn.addEventListener("click", function () {

    // Stop browser GPS watch
    if (watchId !== null) {

        navigator.geolocation.clearWatch(
            watchId
        );

        watchId = null;
    }


    // Tell Firebase sharing has stopped
    database
        .ref("locations/" + trackingId)
        .update({

            sharing: false,

            stoppedAt:
                firebase.database
                    .ServerValue.TIMESTAMP

        })

        .then(function () {

            status.innerText =
                "🔴 Location sharing is OFF";

        })

        .catch(function (error) {

            console.error(error);

            status.innerText =
                "Location stopped, but database update failed.";
        });

});
