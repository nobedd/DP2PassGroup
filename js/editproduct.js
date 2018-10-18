var db = firebase.firestore();

var ProductID = localStorage.getItem("PID");
var ProductName;
var ProductSalePrice;
var ProductRawprice;
var productCategory;
// localStorage.clear();
//document.getElementById("textID").innerHTML = ProductID;

//Populate select dropdown with products function
function populateSelectDropdownCategory(i){
    if (i === undefined)
        i = "";

    db.collection("Categories")
    .get()
    .then(function(querySnapshot){     
        var content = "";
        var value = 1;
        querySnapshot.forEach (function(doc){
            content += "<option value='" + value + "'>" + doc.data().Category + "</option>";
            value++;
    })
    $('#dropdownCategory' + i).append(content);
    })
}
//Populate the first row in view
populateSelectDropdownCategory(0);


//Getting value from the database and setting it into the input fields 
db.collection("Products").doc(ProductID)
    .get()
    .then(function(doc){
        ProductName = doc.data().PName;
        document.getElementById("productName").value = ProductName;
    })
    .catch(function(error){
        alert("Hey ERROR", error);
});

db.collection("Products").doc(ProductID)
    .get()
    .then(function(doc){
        ProductRawprice = doc.data().Raw_Price;
        document.getElementById("productRawPrice").value = ProductRawprice;
    })
    .catch(function(error){
        alert("Hey ERROR", error);
});

db.collection("Products").doc(ProductID)
    .get()
    .then(function(doc){
        ProductSalePrice = doc.data().Sales_Price;
        document.getElementById("productPrice").value = ProductSalePrice;
    })
    .catch(function(error){
        alert("Hey ERROR", error);
});

db.collection("Products").doc(ProductID)
    .get()
    .then(function(doc){
        productCategory = doc.data().Category;

        $('#dropdownCategory0 option').map(function () {
        if ($(this).text() == productCategory) return this;
        }).attr('selected', 'selected'); 

    })
    .catch(function(error){
        alert("Hey ERROR", error);
});//END OF :Getting value from the database and setting it into the input fields 



//ON "SAVE CHANGES" click, update the database with current 
$(document).on("click","#saveChangeButton", function(){
    var newName = document.getElementById("productName").value;
    var newRawPrice = document.getElementById("productRawPrice").value;
    var newSalePrice = document.getElementById("productPrice").value;

    db.collection("Products").doc(ProductID)
    .update({
        PName:''+newName+'',
        Raw_Price: newRawPrice,
        Sales_Price: newSalePrice
    })
    .then(function(doc){
        console.log("Updated successfully")
    })
    .catch(function(error){
        alert("Pname could not be updated", error);
    });
})


$(document).on("click","#showPID", function(){
    alert("The product ID is: " + ProductID);
})

