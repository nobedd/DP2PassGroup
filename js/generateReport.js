$(document).ready(function(){
    var db = firebase.firestore();
    var ProductsList = [];
    var startDate;
    var endDate

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

    $(document).on("change", "#startDate", function(){
        startDate = new Date($(this).val());
    })

    $(document).on("change", "#endDate", function(){
        endDate = new Date($(this).val());
    })

    $('#generateTableButton').click(function(){

        db.collection("Products").orderBy("PName", "asc")
        .get()
        .then(function(querySnapshot){
            var totalQuantity=0, totalRevenue=0, totalGrossMargin=0;
            querySnapshot.forEach(function(doc){
                ProductsList.push(doc.data());
            })
    
            ProductsList.forEach(function(ProductDetails, index){
                // console.log(ProductDetails);
                db.collection("SalesDetails").where("ProductName", "==", ProductDetails.PName).where("Date", ">=", startDate).where("Date", "<=", endDate)
                .get()
                .then(function(querySnapshot){
                    var quantitySold=0, revenue=0, grossMargin=0;
                    var content = "";
                    querySnapshot.forEach(function(doc){
                        quantitySold += doc.data().Quantity;
                    })
                    if(quantitySold != 0){
                        revenue = ProductDetails.Sales_Price * quantitySold;
                        grossMargin = revenue - (ProductDetails.Raw_Price * quantitySold);
                        totalQuantity += quantitySold;
                        totalRevenue += revenue;
                        totalGrossMargin += grossMargin;
                        content += '<tr>';
                        content += '<td>' + ProductDetails.PName + '</td>';
                        content += '<td>' + ProductDetails.Category + '</td>';
                        content += '<td>' + ProductDetails.Sales_Price + '</td>';
                        content += '<td>' + quantitySold + '</td>';
                        content += '<td>' + revenue + '</td>';
                        content += '<td>' + grossMargin + '</td>';
                        content += '</tr>';
        
                        $('#table').append(content);
                    }
                    if(index == ProductsList.length-1){
                        $("#totalQuantity").text(totalQuantity); 
                        $("#totalRevenue").text(totalRevenue); 
                        $("#totalGrossMargin").text(totalGrossMargin); 
                    }
                }).catch(function(error){
                    alert(error);
                })     
            })
        })


    })
    
    
});