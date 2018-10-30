$(document).ready(function(){
    var db = firebase.firestore();
    var ProductList = [];
    
    $("#radioPeriodDaily").prop('checked', true);

    $(document).on("change", ".radioPeriod, #startDate", function(){
        var startDate = new Date($("#startDate").val());
        var daily = (startDate.getFullYear() + "-" + (startDate.getMonth()+1) + "-" + (startDate.getDate()+1));
        var monthly = (startDate.getFullYear() + "-" + (startDate.getMonth()+1) + "-" + (startDate.getDate()+7));
        var weekly = (startDate.getFullYear() + "-" + (startDate.getMonth()+2) + "-" + startDate.getDate());
        var yearly =((startDate.getFullYear()+1) + "-" + (startDate.getMonth()+1) + "-" + startDate.getDate());

        if ($("#radioPeriodCustom").is(":checked"))
            $("#endDate").attr("min", "").attr("max", "").prop('disabled', false);
        else if($("#radioPeriodDaily").is(":checked"))
            $("#endDate").attr("min", daily).attr("max", daily).val(daily).prop('disabled', true);
        else if($("#radioPeriodWeekly").is(":checked"))
            $("#endDate").attr("min", monthly).attr("max", monthly).val(monthly).prop('disabled', true);
        else if($("#radioPeriodMonthly").is(":checked"))
            $("#endDate").attr("min", weekly).attr("max", weekly).val(weekly).prop('disabled', true);
        else if($("#radioPeriodYearly").is(":checked"))
            $("#endDate").attr("min", yearly).attr("max", yearly).val(yearly).prop('disabled', true);
    })

    db.collection("Products").orderBy("PName", "asc")
    .get()
    .then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
            ProductList.push(doc.data());
        })
    })

    $('#generateTableButton').click(function(){
        var totalQuantity=0, totalRevenue=0, totalGrossMargin=0;
        var startDate = new Date($("#startDate").val());
        var endDate = new Date($("#endDate").val());

        $("#tbodyID").empty();
        
        ProductList.forEach(function(ProductDetails, index){
            db.collection("SalesDetails").where("ProductName", "==", ProductDetails.PName).where("Date", ">", startDate).where("Date", "<", endDate)
            .get()
            .then(function(querySnapshot){
                var quantitySold=0, revenue=0, grossMargin=0;
                var content = "";
                //get quantity sold of current item
                querySnapshot.forEach(function(doc){
                    quantitySold += doc.data().Quantity;
                })

                //table tbody
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
                    content += '<td>' + (revenue).toFixed(2) + '</td>';
                    content += '<td>' + (grossMargin).toFixed(2) + '</td>';
                    content += '</tr>';
    
                    $('#table').append(content);
                }
                //Report Summary tfoot
                if(index == ProductList.length-1){
                    $("#totalQuantity").text(totalQuantity); 
                    $("#totalRevenue").text((totalRevenue).toFixed(2)); 
                    $("#totalGrossMargin").text((totalGrossMargin).toFixed(2)); 
                }
            }).catch(function(error){
                alert(error);
            })     
        })

    })

    $('#exportTableButton').click(function(){
        if($("#table tbody").is(":empty")){
            alert("Table is empty, please generate the table first");
        }
        else{
            $("#table").first().table2csv();
            $('#table').table2csv('download', options)
        }
        
    })
    
    
});