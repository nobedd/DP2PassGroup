var db = firebase.firestore();
var ProductID = localStorage.getItem("PID");
var SelectedProduct = {};

//Populate select dropdown with products function
function populateSelectDropdownCategory(){
    db.collection("Categories")
    .get()
    .then(function(querySnapshot){     
        var content = "";
        var value = 1;
        querySnapshot.forEach (function(doc){
            content += "<option value='" + value + "'>" + doc.data().Category + "</option>";
            value++;
        })
        $('#dropdownCategory').append(content);
    })
}
//Populate the first row in view
populateSelectDropdownCategory();

//Getting value from the database and setting it into the input fields 
db.collection("Products").doc(ProductID)
    .get()
    .then(function(doc){
        SelectedProduct = doc.data();
        document.getElementById("productName").value = SelectedProduct.PName;
        document.getElementById("productRawPrice").value = SelectedProduct.Raw_Price;
        document.getElementById("productPrice").value = SelectedProduct.Sales_Price;
        $('#dropdownCategory option').map(function () { //function to match the category
            if ($(this).text() == SelectedProduct.Category) return this;
        }).attr('selected', 'selected'); 

    })
    .catch(function(error){
        alert("Hey ERROR", error);
});
//END OF :Getting value from the database and setting it into the input fields 

//ON "SAVE CHANGES" click, update the database with current 
$(document).on("click","#SaveButton", function(){
    var newName = document.getElementById("productName").value;
    var newRawPrice = document.getElementById("productRawPrice").value;
    var newSalePrice = document.getElementById("productPrice").value;
    //getting category text takes 2 lines
    var indexChosen=document.getElementById("dropdownCategory");
    var newSelectedCategory = indexChosen.options[indexChosen.selectedIndex].text;

    //query that updates based on the variables above
    db.collection("Products").doc(ProductID)
    .update({
        PName:''+newName+'',
        Raw_Price: newRawPrice,
        Sales_Price: newSalePrice,
        Category: newSelectedCategory
    })
    .then(function(doc){
        window.location.href ="inventoryMain.html";
    })
    .catch(function(error){
        alert("Pname could not be updated", error);
    });
})//END OF FUNCTION

// this button will simple go back to inventoryMain
$(document).on("click","#discardChanges", function(){
    window.location.href ="inventoryMain.html";
})

// this button will delete the item and go back to inventoryMain
$(document).on("click","#deleteUnderEdit", function(){
    if (confirm("Delete Product?\nClick OK to proceed")) {
        db.collection("Products").doc(ProductID).delete().then(function() {
            alert("Item succesfully deleted")
            window.location.href ="inventoryMain.html";
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
    } else {
        // Do nothing!
    }
})

// This button is for testing purpose
$(document).on("click","#showPID", function(){
    // var indexChosen=document.getElementById("dropdownCategory");
    // var newSelectedCategory = indexChosen.options[indexChosen.selectedIndex].text;
    // alert(newSelectedCategory);
    alert(ProductID)
})