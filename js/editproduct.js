var db = firebase.firestore();

var ProductID = localStorage.getItem("PID");
localStorage.clear();
document.getElementById("textID").innerHTML = ProductID;

var docRefName = db.collection("Products").doc(ProductID);
Pname = docRefName.get();
// var productRawPrice=db.collection("Products").doc(ProductID).PName;
// var productSalePrice=db.collection("Products").doc(ProductID).PName;
// var productCategory=db.collection("Products").doc(ProductID).PName;



$(document).on("click","#showPID", function(){
    alert("The product name is" + productName);
})

