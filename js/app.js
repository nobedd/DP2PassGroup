//(function(){
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

    var AccountBool;

    LogButton.addEventListener("click", function(){
        if (!AccountBool){
            firebase.auth().signInAnonymously();
            LogButton.innerText = "Log Out";
            AccountBool = true
        }
        else{
            firebase.auth().signOut();
            LogButton.innerText = "Log In";
            AccountBool = false
        }
    });

    firebase.auth().onAuthStateChanged(function(user){
        console.log(user);
        if(user){
            console.log("you have signed in")
            // document.getElementById("signoutButton").style.visibility = "visible"
            AccountBool = true
        } else{
            console.log("you have signed off");
            // document.getElementById("signoutButton").style.visibility = "hidden"
            AccountBool = false
        }
    })
//})
