$(document).ready(function(){
    var db = firebase.firestore();
    var ProductsList = [];

    db.collection("Products").orderBy("PName", "asc")
    .get()
    .then(function(querySnapshot){
        var content = "";
        var value = 0;
        querySnapshot.forEach(function(doc){
            content += "<option value='" + value + "'>" + doc.data().PName + "</option>";
        })
        $('#dropdownProducts').append(content);
    });

    db.collection("Categories").orderBy("Category", "asc")
    .get()
    .then(function(querySnapshot){
        var content = "";
        var value = 0;
        querySnapshot.forEach(function(doc){
            content += "<option value='" + value + "'>" + doc.data().Category + "</option>";
        })
        $('#dropdownCategory').append(content);
    });

    db.collection("Products").orderBy("PName", "asc")
    .get()
    .then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
            ProductsList.push(doc.data());
        })

        ProductsList.forEach(function(ProductDetails){
            // console.log(ProductDetails);
            db.collection("SalesDetails").where("ProductName", "==", ProductDetails.PName) 
            .get()
            .then(function(querySnapshot){
                var quantitySold = 0;
                var revenue = 0;
                var content = "";
                querySnapshot.forEach(function(doc){
                    quantitySold += doc.data().Quantity;
                })
                revenue = ProductDetails.Sales_Price * quantitySold
                content += '<tr>';
                content += '<td>' + ProductDetails.PName + '</td>';
                content += '<td>' + ProductDetails.Category + '</td>';
                content += '<td>' + ProductDetails.Sales_Price + '</td>';
                content += '<td>' + quantitySold + '</td>';
                content += '<td>' + revenue + '</td>';
                content += '</tr>';

                $('#table').append(content);
            })
        })
    })



    
});