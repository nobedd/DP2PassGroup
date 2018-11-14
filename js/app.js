    var config = {
        apiKey: "AIzaSyAd_KsL66EQmcNGlecBSYBOJMieoxi5Qyk",
        authDomain: "dp2passgroup.firebaseapp.com",
        databaseURL: "https://dp2passgroup.firebaseio.com",
        projectId: "dp2passgroup",
        storageBucket: "dp2passgroup.appspot.com",
        messagingSenderId: "1032158016281"
    };
    firebase.initializeApp(config);

    const firestore = firebase.firestore();
    const settings = {/* your settings... */ timestampsInSnapshots: true};
    firestore.settings(settings);

    LogButton.addEventListener("click", function(){
            firebase.auth().signOut();
            window.location.replace("login.html");
    });

    firebase.auth().onAuthStateChanged(function(user){
        console.log(user.email);
        if(user){
            console.log("you have signed in")
            if(user != null){
                console.log("Currently signed in as: " + user.email);
              }
        } else {
            console.log("Signed off");
        }
    })