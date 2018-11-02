//(function(){
    var db = firebase.firestore();

    const inputProductName = document.querySelector("#productName");
    const inputProductPrice = document.querySelector("#productPrice");
    const inputProductRawPrice = document.querySelector("#productRawPrice");

    //Populate 2 select dropdown with products function
    function populateSelectDropdownCategory(){
        db.collection("Categories").orderBy("Category","asc")
        .get()
        .then(function(querySnapshot){
            var IDcounterForEachProduct="";
            var content = "";
            querySnapshot.forEach (function(doc){
                IDcounterForEachProduct=doc.id;
                content += "<option value='" + IDcounterForEachProduct + "'>" + doc.data().Category + "</option>";
            })
            $('#dropdownCategory').empty(content);
            $('#dropdownCategory').append(content);
            $('#categoryDeleteDrop').empty(content);
            $('#categoryDeleteDrop').append(content);
        })
    }
    //Populate the first row in view
    populateSelectDropdownCategory();

    //Button to Save the products
    saveProductButton.addEventListener("click", function(){
        const SaveProductName = inputProductName.value;
        const SaveProductPrice = inputProductPrice.value;
        const SaveProductRawPrice = inputProductRawPrice.value;
        var selectedCategory = $("#dropdownCategory option:selected").text()

        db.collection("Products").add({
            PName: SaveProductName,
            Sales_Price: SaveProductPrice,
            Raw_Price: SaveProductRawPrice,
            Category: selectedCategory,
            archive: false
        })
        .then(function(docRef){
            console.log("Product saved!", docRef.id);
        })
        .catch(function(error){
            console.log("Got an error: ", error);
        }); 
    });

    const inputCategoryName = document.querySelector("#categoryName")
    saveCategoryButton.addEventListener("click", function(){
        const SaveCategoryName = inputCategoryName.value;
        inputCategoryName.value='';
        if(SaveCategoryName=='NIL'||SaveCategoryName=='nil' ||SaveCategoryName=='Nil'){
            alert("Cannot add a category named NIL")
        }else{
            db.collection("Categories").add({
                Category: SaveCategoryName
            })
            .then(function(docRef){
                console.log("Category saved!", docRef.id);
                document.getElementById('categoryName').value='';
                populateSelectDropdownCategory();//repopulate the list
            })
            .catch(function(error){
                console.log("Got and eror: ", error);
            });
        }
    });

    $(document).on("click","#testbtn", function(){
        alert("testbutton")
    })
/////////////////////////////////////////////////////////////////////////////////////////////
//Functionality to disable delete button is NIL is selected
$("#categoryDeleteDrop").change(function(){
    console.log("category changed")
    var selectedID = $("#categoryDeleteDrop option:selected").val()
    if(selectedID=='WQxMI5w2TVYh9xXP0ivH'){
        $('#buttonDeleteCategory').prop('disabled', true);
        $("#buttonDeleteCategory").html('This category cannot be deleted');
    }else{
        $('#buttonDeleteCategory').prop('disabled', false);
        $('#buttonDeleteCategory').html('Delete Category')
    }
})

//Delete category functionality
buttonDeleteCategory.addEventListener("click", function(){
//WQxMI5w2TVYh9xXP0ivH
    var selectedDeleteID = $("#categoryDeleteDrop option:selected").val()
    var selectedDeleteText = $("#categoryDeleteDrop option:selected").text()
    // console.log(selectedDeleteID)
    // console.log(selectedDeleteText)
    //delete from the database:
    db.collection("Categories").doc(selectedDeleteID).delete().then(function() {
        console.log("Category"+ selectedDeleteText+"successfully deleted!");
        populateSelectDropdownCategory();//repopulate the list

        var batch = db.batch();
        var allmatching = db.collection("SalesDetails").where('ProductCategory','==',selectedDeleteText);
        batch.update(allmatching, {"ProductCategory": "NIL"});//update the rest of the docs

    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });

    //Update all products that have that category into NIL

});

// Below is just to display the table
// var productIDs = [];
// db.collection("Products")
//     .get()
//     .then(function(querySnapshot){     
//         var content = "";
//         querySnapshot.forEach (function(doc){
//             content += '<tr>';
//             content += '<td>' + doc.data().PName + '</td>';
//             content += '<td>' + doc.data().Category + '</td>';
//             content += '<td>' + doc.data().Raw_Price + '</td>';
//             content += '<td>' + doc.data().Sales_Price + '</td>';
//             // content += '<td>' + '<Button>Edit</Button>' + '</td>';
//             content += '</tr>';
//     })
//     $('#table').append(content);
// })


