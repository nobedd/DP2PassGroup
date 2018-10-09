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

    loginButton.addEventListener("click", function(){
        firebase.auth().signInAnonymously();
    });

    signoutButton.addEventListener("click", function(){
        firebase.auth().signOut();
    })

    firebase.auth().onAuthStateChanged(function(user){
        console.log(user);
        if(user){
            console.log("you have signed in")
            document.getElementById("signoutButton").style.visibility = "visible"
        } else{
            console.log("you have signed off");
            document.getElementById("signoutButton").style.visibility = "hidden"
        }
    })
//})
