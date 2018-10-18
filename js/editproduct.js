var db = firebase.firestore();

var ProductID = localStorage.getItem("PID");
var ProductName;
var ProductSalePrice;
var ProductRawprice;
//var productCategory;localStorage.clear();
//document.getElementById("textID").innerHTML = ProductID;

db.collection("Products").doc(ProductID)
    .get()
    .then(function(doc){
        ProductName = doc.data().PName;
        document.getElementById("textID").innerHTML = ProductID;
    })
    .catch(function(error){
        alert("Hey ERROR", error);
});

$(document).on("click","#showPID", function(){
    alert("The product name is" + ProductName);
})

