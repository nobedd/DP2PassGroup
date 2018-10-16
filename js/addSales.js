//TODO PRICE LOGIC

$(document).ready(function(){
    var db = firebase.firestore();
    var map = {};
    var totalPrice;
    
    //Populate Map for ProductName : SellingPrice
    db.collection("Products")
    .get()
    .then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
            map[doc.data().PName] = doc.data().Sales_Price;
        })
    })

    //Get products for dropdown
    function getProductNames(i){
        if (i === undefined)
            i = "";

        db.collection("Products")
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
    //For the first row 
    getProductNames(0);


    //Click function for add button
    var i = 0;
    $('#add').click(function(){
        i++;
        var content = "";
        content += '<tr><td> ' + (i+1) + '</td>'
        content += '<td><select id="dropdownDetails' + i + '"><option value="0">Choose a product to add</option></select></td>'
        content += '<td><input type="number" id="inputDetailsQuantity' + i + '"/></td>';
        content += '<td><button id="remove" class="btn btn-danger remove">Remove</button></td></tr>';
        $('#dynamic_SalesDetailsField').append(content);
        getProductNames(i);
    });

    $(document).on('click', '.remove', function(){
        $(this).closest('tr').remove();
    });


    //Click function for save sales button
    saveSales.addEventListener("click", function(){
        var SaveSalesDetailsID = [];
        var SaveDetails = [];
        var i = 0;

        for(i = 0; i < 10; i++){
            if($("#dropdownDetails" + i +" option:selected").text() != "")
                SaveDetails.push({Name: $("#dropdownDetails" + i +" option:selected").text(), Quantity: document.querySelector("#inputDetailsQuantity" + i).value});
        }

        SaveDetails.forEach(function(details, index){
            

            db.collection("SalesDetails").add({
                ProductName: details.Name,
                Quantity: details.Quantity
            })
            .then(function(docRef){
                console.log("SD success!", docRef.id);
                SaveSalesDetailsID.push(docRef.id);

                if(index == SaveDetails.length-1){
                    db.collection("SalesRecord").add({
                        IDs: SaveSalesDetailsID
                    })
                    .then(function(docRef){
                        console.log("SR success!", docRef.id)
                    })
                    .catch(function(error){
                        console.log("error: ", error)
                    });
                }
            })
            .catch(function(error){
                console.log("error: ", error);
            });        
        });   
    });

})
    