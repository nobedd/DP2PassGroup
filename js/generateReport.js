$(document).ready(function(){
    var db = firebase.firestore();
    var ProductList = [];

    $("#startDate").val(moment().format('YYYY-MM-DD'));
    $("#radioPeriodDaily").prop('checked', true);
    $("#endDate").val(moment(new Date($("#startDate").val()), 'YYYY-MM-DD').add(1, 'days').format('YYYY-MM-DD')).prop('disabled', true);


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
                //Report Summary table
                if(index == ProductList.length-1){
                    var dateRange = moment(new Date($("#startDate").val()), 'YYYY-MM-DD').format('YYYY-MM-DD') + " - " + moment(new Date($("#endDate").val()), 'YYYY-MM-DD').format('YYYY-MM-DD');
                    var totalGrossPercentage = totalGrossMargin / totalRevenue * 100;
                    $("#dateRange").text(dateRange);
                    $("#totalQuantity").text(totalQuantity); 
                    $("#totalRevenue").text((totalRevenue).toFixed(2)); 
                    $("#totalGrossMargin").text((totalGrossMargin).toFixed(2)); 
                    $("#totalGrossPercentage").text((totalGrossPercentage).toFixed(2));
                }
            }).catch(function(error){
                alert(error);
            })     
        })

    })  
});


$(document).on("change", ".radioPeriod, #startDate", function(){
    var startDate = new Date($("#startDate").val());
    var daily = moment(startDate, 'YYYY-MM-DD').add(1, 'days').format('YYYY-MM-DD');       
    var weekly = moment(startDate, 'YYYY-MM-DD').add(1, 'weeks').format('YYYY-MM-DD');
    var monthly = moment(startDate, 'YYYY-MM-DD').add(1, 'months').format('YYYY-MM-DD');
    var yearly = moment(startDate, 'YYYY-MM-DD').add(1, 'years').format('YYYY-MM-DD');

    if ($("#radioPeriodCustom").is(":checked"))
        $("#endDate").prop('disabled', false);
    else if($("#radioPeriodDaily").is(":checked"))
        $("#endDate").val(daily).prop('disabled', true);
    else if($("#radioPeriodWeekly").is(":checked"))
        $("#endDate").val(weekly).prop('disabled', true);
    else if($("#radioPeriodMonthly").is(":checked"))
        $("#endDate").val(monthly).prop('disabled', true);
    else if($("#radioPeriodYearly").is(":checked"))
        $("#endDate").val(yearly).prop('disabled', true);
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