//(function(){
    // Initialize Firebase
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
            document.getElementById("signoutButton").style.visibility = "show"
        } else{
            document.getElementById("signoutButton").style.visibility = "hidden"
        }
    })

    var db = firebase.firestore();
    const outputHeader = document.querySelector("#addProduct");
    const inputProductName = document.querySelector("#productName");
    const inputProductPrice = document.querySelector("#productPrice");
    const inputProductRawPrice = document.querySelector("#productRawPrice");

    saveButton.addEventListener("click", function(){
        const SaveProductName = inputProductName.value;
        const SaveProductPrice = inputProductPrice.value;
        const SaveProductRawPrice = inputProductRawPrice.value;
        db.collection("Products").add({
            ProductName: SaveProductName,
            ProductPrice: SaveProductPrice,
            ProductRawPrice: SaveProductRawPrice
        })
        .then(function(docRef){
            console.log("Product saved!", docRef.id);
        })
        .catch(function(error){
            console.log("Got an error: ", error);
            }); 
    });

//})
