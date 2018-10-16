//(function(){
    var db = firebase.firestore();

    const inputProductName = document.querySelector("#productName");
    const inputProductPrice = document.querySelector("#productPrice");
    const inputProductRawPrice = document.querySelector("#productRawPrice");
    const inputProductCategory = document.querySelector("#productCategory");

    saveProductButton.addEventListener("click", function(){
        const SaveProductName = inputProductName.value;
        const SaveProductPrice = inputProductPrice.value;
        const SaveProductRawPrice = inputProductRawPrice.value;
        const SaveProductCategory = inputProductCategory.value;
        db.collection("Products").add({
            PName: SaveProductName,
            Sales_Price: SaveProductPrice,
            Raw_Price: SaveProductRawPrice,
            Category: SaveProductCategory,
            archive: false
        })
        .then(function(docRef){
            console.log("Product saved!", docRef.id);
        })
        .catch(function(error){
            console.log("Got an error: ", error);
        }); 
    });
    var productIDs = [];
    db.collection("Products")
        .get()
        .then(function(querySnapshot){     
            var content = "";
            querySnapshot.forEach (function(doc){
                content += '<td>' + doc.data().PName + '</td>';
                content += '<td>' + doc.data().Category + '</td>';
                content += '<td>' + doc.data().Raw_Price + '</td>';
                content += '<td>' + doc.data().Sales_Price + '</td>';
                content += '<td>' + '<Button>Edit</Button>' + '</td>';
                content += '</tr>';
        })
        $('#table').append(content);
    })
    
    const inputCategoryName = document.querySelector("#categoryName") 
    saveCategoryButton.addEventListener("click", function(){
        const SaveCategoryName = inputCategoryName.value;
        db.collection("Categories").add({
            Category: SaveCategoryName
        })
        .then(function(docRef){
            console.log("Category saved!", docRef.id);
        })
        .catch(function(error){
            console.log("Got and eror: ", error);
        });
    });


//});
