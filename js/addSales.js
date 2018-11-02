$(document).ready(function(){
    var db = firebase.firestore();
    var mapPrice = {};
    var mapCategory = {};
    var totalPrice;
    var formTableRowCount = 0;

    //Populate Map for ProductName : SellingPrice
    db.collection("Products").orderBy("PName","asc")
    .get()
    .then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
            mapPrice[doc.data().PName] = doc.data().Sales_Price;
            mapCategory[doc.data().PName] = doc.data().Category;
        })
    })

    //Populate select dropdown with products function
    function populateSelectDropdownWithProducts(i){
        if (i === undefined)
            i = "";

        db.collection("Products").orderBy("PName","asc")
        .get()
        .then(function(querySnapshot){     
            var content = "";
            var value = 1;
            querySnapshot.forEach (function(doc){
                content += "<option value='" + value + "'>" + doc.data().PName + "</option>";
                value++;
        })
        $('#dropdownDetails' + i).append(content);
        })
    }
    //Populate the first row in view
    populateSelectDropdownWithProducts(0);


    //Click function for add button
    var i = 0;
    $('#add').click(function(){
        i++;
        var content = ""; 
        content += '<tr id="' + i + '">'
        content += '<td class="onChangeUpdatePrice"><select id="dropdownDetails' + i + '" class="custom-select" required><option value="">Select a product to add</option></select></td>'
        content += '<td class="onChangeUpdatePrice"><input type="number" id="inputDetailsQuantity' + i + '" class="form-control" placeholder="Enter quantity" min="1" required /></td>';
        content += '<td class="unitPrice" id="unitPrice' + i + '"></td>';
        content += '<td class="totalUnitPrice" id="totalUnitPrice' + i + '"></td>';
        content += '<td><button id="remove" class="btn btn-outline-danger remove">Remove</button></td></tr>';
        $('#dynamic_SalesDetailsField').append(content);
        populateSelectDropdownWithProducts(i);
        
        //add button is disabled when its clicked 15 times
        formTableRowCount++;
        if(formTableRowCount == 15)
            $("#add").attr('disabled','disabled');
    });
    
    //Remove function for remove button
    $(document).on('click', '.remove', function(){
        $(this).closest('tr').remove();
    });

    //Update price logic, listens to all onChangeUpdatePrice class
    $(document).on('change', '.onChangeUpdatePrice', function(){
        var rowID = $(this).closest('tr').attr('id');
        var selectedOptionsDropdown = $("#dropdownDetails" + rowID +" option:selected").text();
        var quantity = document.querySelector("#inputDetailsQuantity" + rowID).value;
        var unitPrice = parseFloat(mapPrice[selectedOptionsDropdown]);
        var totalUnitPrice = unitPrice * quantity;
        
        $(this).siblings(".unitPrice").text(unitPrice);
        $(this).siblings(".totalUnitPrice").text(totalUnitPrice);

        totalPrice = 0;
        $(".totalUnitPrice").each(function(){
            totalPrice += parseFloat($(this).text());
        })
        $("#totalPrice").text(totalPrice);  
    });

    //onSubmit function
    $("#addSalesForm").submit(function(event){
        var CurrentDropdownSelect = "";
        var SaveSalesDetailsID = [];
        var SaveDetails = [];
        //Delete this afterwards and uncomment the bottom one
        var SaveDate = new Date($("#salesDate").val());
        //var SaveDate = new Date();

        var rowID = 0;
        for(rowID = 0; rowID < formTableRowCount+1; rowID++){ 
            CurrentDropdownSelect = $("#dropdownDetails" + rowID +" option:selected").text();
            if(CurrentDropdownSelect != ""){
                SaveDetails.push({
                    name: CurrentDropdownSelect, 
                    category: mapCategory[CurrentDropdownSelect],
                    quantity: parseInt($("#inputDetailsQuantity" + rowID).val()), 
                    unitPrice: parseFloat($("#unitPrice" + rowID).text()), 
                    totalUnitPrice: parseFloat($("#totalUnitPrice" + rowID).text())
                });
            }       
        }

        SaveDetails.forEach(function(details, index){
            db.collection("SalesDetails").add({
                ProductName: details.name,
                ProductCategory: details.category,
                Quantity: details.quantity,
                UnitPrice: details.unitPrice,
                TotalUnitPrice: details.totalUnitPrice,
                Date: SaveDate

            })
            .then(function(docRef){
                console.log("SD success!", docRef.id);
                SaveSalesDetailsID.push(docRef.id);

                if(index == SaveDetails.length-1){
                    db.collection("SalesRecord").add({
                        IDs: SaveSalesDetailsID,
                        TotalPrice: totalPrice,
                        Date: SaveDate
                    })
                    .then(function(docRef){
                        console.log("SR success!", docRef.id)
                    })
                    .catch(function(error){
                        console.log("SR error: ", error)
                    });
                }
            })
            .catch(function(error){
                console.log("SD error: ", error);
            });   

        });   
    });

})
    