var db = firebase.firestore();

//This function generates the list of products and put into a table form
db.collection("Products")
.get()
.then(function(querySnapshot){
    var productIDarray = {};
    var IDcounterForEachProduct=0;
    var content = "";   
    querySnapshot.forEach (function(doc){
        productIDarray[IDcounterForEachProduct]=doc.id;//mapping the index number to ID
        content += '<tr id="' + IDcounterForEachProduct + '">';
        content += '<td>' + "<input type='checkbox' class='checkSelectProduct'/>" + '</td>';
        content += '<td>' + doc.data().PName + '</td>';
        content += '<td>' + doc.data().Category + '</td>';
        content += '<td>' + doc.data().Raw_Price + '</td>';
        content += '<td>' + doc.data().Sales_Price + '</td>';
        content += '<td>' + "<Button class='editProduct btn btn-outline-dark' data-toggle='modal' data-target='#saveChange'>Edit</Button><Button class='deleteProduct btn btn-outline-danger' >Delete</Button>" + '</td>';
        content += '</tr>';
        IDcounterForEachProduct++;

});

        //Check box function
        var checkedlist = [];
        var indexArray = [];

        //Select checkbox individually
        $(document).on("click", ".checkSelectProduct", function(){
            var checked = $(this).is(":checked");
            getIndex = $(this).closest('tr').attr('id');
            
            if(checked){
                console.log(getIndex);
                indexArray.push(getIndex);
                checkedlist.push(productIDarray[getIndex]);
                
            }else{
                indexArray = indexArray.filter(x => x!= getIndex);
                checkedlist = checkedlist.filter(x => x != productIDarray[getIndex]);
            
            }
            console.log(checkedlist);
            
        });

        // Select and deselect all checkboxes
        var getIndex;
        
        $("#selectAllCB").change(function(){

            $(".checkSelectProduct").prop("checked", $(this).prop("checked"));

            if($(this).prop("checked")){
                $(".checkSelectProduct").each(function(){
                    getIndex = $(this).closest('tr').attr('id');
                    console.log(getIndex);
                    indexArray.push(getIndex);
                    checkedlist.push(productIDarray[getIndex]);
                });
            }else{
                indexArray = [];
                checkedlist = [];
            }

            console.log(indexArray);
            console.log(checkedlist);
        });
        
        $(".checkSelectProduct").change(function(){
            if(false == $(this).prop("checked")){
                $("#selectAllCB").prop("checked", false); 
            }
            
            if($(this).length==$(this).length){
                $("#selectAllCB").prop("checked", true);
            }
        });

        //Delete selected product
        $(document).on("click", "#deleteProduct", function(){
            if (confirm("Proceed with Delete: click 'OK'\n")) {
                console.log("deleted button clicked");//works
                //loop to check every checkbox item
                for (var i = 0; i < checkedlist.length; i++){
                    if(indexArray!=null){
                        
                        console.log(indexArray[i]);//works
                        var getPID = productIDarray[indexArray[i]];
                        console.log(getPID);//works
                        $(indexArray[i]).closest('tr').remove();
            
                        //now i have to delete the document with getPID from the database
                        db.collection("Products").doc(getPID).delete().then(function() {
                            console.log("Document successfully deleted!");
                            location.reload();
                        }).catch(function(error) {
                            console.error("Error removing document: ", error);
                        });
                        
                        
                    //then triger a function that will delete the entire <tbody> and then reload it
                    } else {
                    // Do nothing!
                    } 
                }  
            }

            
        });

        $(document).ready(function(){
            $("#table").DataTable(
                {
                    'columnDefs':[
                        {'orderable': false, 'targets' : 0 },
                        {'orderable': true, 'targets' : 1 }
                    ]
                }
            );
        });

        $(document).on("click", ".deleteProduct", function () {
            if (confirm("Proceed with Delete: click 'OK'\n")) {
                console.log("deleted button clicked"); //works
                var getrowIndex = $(this).closest('tr').attr('id');
                console.log(getrowIndex); //works
                var getPID = productIDarray[getrowIndex];
                console.log(getPID); //works
                $(this).closest('tr').remove();

                //now i have to delete the document with getPID from the database
                db.collection("Products").doc(getPID).delete().then(function () {
                    console.log("Document successfully deleted!");

                }).catch(function (error) {
                    console.error("Error removing document: ", error);
                });
                //then triger a function that will delete the entire <tbody> and then reload it
            } else {
                // Do nothing!
            }
        })
        $('#table').append(content);

        //Populate select dropdown with products function
        function populateSelectDropdownCategory() {
            db.collection("Categories")
                .get()
                .then(function (querySnapshot) {
                    var content = "";
                    var value = 1;
                    querySnapshot.forEach(function (doc) {
                        content += "<option value='" + value + "'>" + doc.data().Category + "</option>";
                        value++;
                    })
                    $('#dropdownCategory').empty();
                    $('#dropdownCategory').append(content);
                })
        }
        populateSelectDropdownCategory();
        var ProductID;
        $(document).on("click", ".editProduct", function () {
            var getrowIndex2 = $(this).closest('tr').attr('id');
            ProductID = productIDarray[getrowIndex2]; //assign the productID into getPID2
            //saves the name of the product before update
            db.collection("Products").doc(ProductID).get()
                .then(function (doc) {
                    oldProduct = doc.data();
                    oldPname = oldProduct.PName;
                    console.log(oldPname);
                })

            var SelectedProduct = {};

            //Getting value from the database and setting it into the input fields 
            db.collection("Products").doc(ProductID)
                .get()
                .then(function (doc) {
                    //Populate the first row in view
                    SelectedProduct = doc.data();
                    document.getElementById("productName").value = SelectedProduct.PName;
                    document.getElementById("productRawPrice").value = SelectedProduct.Raw_Price;
                    document.getElementById("productPrice").value = SelectedProduct.Sales_Price;
                    $('#dropdownCategory option').map(function () { //function to match the category
                        if ($(this).text() == SelectedProduct.Category) return this;
                    }).attr('selected', 'selected');

                })
                .catch(function (error) {
                    alert("Hey ERROR", error);
                });
            //END OF :Getting value from the database and setting it into the input fields 
        })

        $(document).on("click", "#SaveButton", function () {
            var newName = document.getElementById("productName").value;
            var newRawPrice = document.getElementById("productRawPrice").value;
            var newSalePrice = document.getElementById("productPrice").value;
            //getting category text takes 2 lines
            var indexChosen = document.getElementById("dropdownCategory");
            var newSelectedCategory = indexChosen.options[indexChosen.selectedIndex].text;

            //query that updates based on the variables above
            db.collection("Products").doc(ProductID)
                .update({
                    PName: '' + newName + '',
                    Raw_Price: newRawPrice,
                    Sales_Price: newSalePrice,
                    Category: newSelectedCategory
                })
                .then(function () {
                    window.location.href = "inventoryMain.html"; //reloads the page after saving
                })
                .catch(function (error) {
                    alert("Pname could not be updated", error);
                });

            //update the collection in SalesDetails table
            db.collection("SalesDetails").where("ProductName", "==", oldPname)
                .get()
                .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        // doc.data() is never undefined for query doc snapshots
                        var productRef = db.collection("SalesDetails").doc(doc.id);

                        return productRef.update({
                            ProductName: '' + newName + '',
                            ProductCategory: newSelectedCategory
                        });
                    });
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error);
                });
        }) //END OF FUNCTION

    })
