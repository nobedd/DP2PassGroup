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
    var firestore = firebase.firestore();

    const docRef = firestore.doc("samples/productData");
    const outputHeader = document.querySelector("#addProduct");
    const inputProductName = document.querySelector("#productName");
    const inputProductPrice = document.querySelector("#productPrice");
    const inputProductRawPrice = document.querySelector("#productRawPrice");

    saveButton.addEventListener("click", function(){
        const SaveProductName = inputProductName.value;
        const SaveProductPrice = inputProductPrice.value;
        const SaveProductRawPrice = inputProductRawPrice.value;
        docRef.set({
            ProductName: SaveProductName,
            ProductPrice: SaveProductPrice,
            ProductRawPrice: SaveProductRawPrice,
        }).then(function(){
            console.log("Status saved!");
        }).catch(function(error){
            console.log("Got an error: ", error);
            }); 
    })

//})
