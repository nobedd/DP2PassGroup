$(document).ready(function(){
    db = firebase.firestore();
    
    var barChartProduct;
    var pieChartProduct;
    var barChartMonths;

    var productsDataArray = [];
    var topFiveProducts = {};
    var productData = {};
    var allMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    $("#startDate").val(moment().format('YYYY-MM-DD'));
    $("#radioPeriodYearly").prop('checked', true);
    $("#endDate").val(moment(new Date($("#startDate").val()), 'YYYY-MM-DD').add(1, 'year').format('YYYY-MM-DD')).prop('disabled', true);

     //Populate select dropdown with products function
    function populateSelectDropdownWithProducts(){
        db.collection("Products").orderBy("PName","asc")
        .get()
        .then(function(querySnapshot){     
            var content = "";
            var value = 1;
            querySnapshot.forEach (function(doc){
                content += "<option value='" + value + "'>" + doc.data().PName + "</option>";
                value++;
        })
        $('#dropdownDetails').append(content);
        })
    }
    //Populate the first row in view
    populateSelectDropdownWithProducts();

    $("#generateGraphProductButton").click(function(){
        var productPromise = [];
        var product = $("#dropdownDetails option:selected").text();

        for(var i = 0; i<allMonths.length; i++){
            productPromise.push(db.collection("SalesDetails").where("ProductName", "==", product).where("DateMonth", "==", allMonths[i]).get());
        }
        Promise.all(productPromise)
        .then(function(productPromise){
            var monthlySales = [];
            var totalSales = 0;

            productPromise.forEach(function(querySnapshot){
                var salesCount = 0;
                querySnapshot.forEach(function(doc){
                    salesCount += doc.data().Quantity;
                })
                monthlySales.push(salesCount);                
            })
            monthlySales.forEach(function(sales){
                totalSales += sales;
            })

            productData = {product, monthlySales, totalSales};
            console.log(productData);
            barChartProduct();
        })
        .catch(function(error){
            console.log(error);
        })
    })

    $("#addDatasetsProductButton").click(function(){
        var productPromise = [];
        var product = $("#dropdownDetails option:selected").text();

        for(var i = 0; i<allMonths.length; i++){
            productPromise.push(db.collection("SalesDetails").where("ProductName", "==", product).where("DateMonth", "==", allMonths[i]).get());
        }
        Promise.all(productPromise)
        .then(function(productPromise){
            var monthlySales = [];
            var totalSales = 0;

            productPromise.forEach(function(querySnapshot){
                var salesCount = 0;
                querySnapshot.forEach(function(doc){
                    salesCount += doc.data().Quantity;
                })
                monthlySales.push(salesCount);                
            })
            monthlySales.forEach(function(sales){
                totalSales += sales;
            })

            productData = {product, monthlySales, totalSales};
            console.log(productData);
            var x = Math.floor(Math.random() * 256);
            var y = Math.floor(Math.random() * 256);
            var z = Math.floor(Math.random() * 256);
            var bgColor = "rgba(" + x + "," + y + "," + z + ")";
            var newDataset = {
                label: productData.product,
                fill: false,
                data: productData.monthlySales,
                borderColor: bgColor,
            }
            barChartProduct.data.datasets.push(newDataset);
            barChartProduct.update();

        })
        .catch(function(error){
            console.log(error);
        })
    })

    $("#removeDatasetsProductButton").click(function(){
        barChartProduct.data.datasets.pop();
        barChartProduct.update();
    })

    $("#generateGraphYearButton").click(function(){
        productsDataArray = [];

        db.collection("Products").orderBy("PName", "asc")
        .get()
        .then(function(querySnapshot){
            var products = [];
            querySnapshot.forEach(function(doc){
                products.push(doc.data().PName)
            })

            return Promise.all(products);
        })
        .then(function(products){            
            products.forEach(function(product, index){     
                var productPromise = [];

                for(var i = 0; i<allMonths.length; i++){
                    productPromise.push(db.collection("SalesDetails").where("ProductName", "==", product).where("DateMonth", "==", allMonths[i]).get());
                }
        
                Promise.all(productPromise)
                .then(function(productPromise){  
                    //console.log(productPromise)
                    var monthlySales = [];  
                    var totalSales = 0;      
                    productPromise.forEach(function(querySnapshot){
                        var salesCount = 0;
                        querySnapshot.forEach(function(doc){
                            salesCount += doc.data().Quantity;
                        })
                        monthlySales.push(salesCount);                
                    })

                    monthlySales.forEach(function(sales){
                        totalSales += sales;
                    })
                    productsDataArray.push({product, monthlySales, totalSales});

                    if(index == (products.length - 1)){
                        productsDataArray.sort(function(a,b){
                            return b.totalSales - a.totalSales;
                        });
                        topFiveProducts = productsDataArray.slice(0, 5);
                        topFiveProducts.forEach(function(product){
                            product.monthlySales.forEach(function(sales, index, salesArray){
                               if(salesArray[index] == 0){
                                    salesArray[index] = Number.NaN;
                               }
                            })
                        })
                        console.log(productsDataArray);
                        console.log(topFiveProducts);
                        barChartMonths();
                        pieChartProduct();              
                    }
                              
                })
                .catch(function(error){
                    console.log(error)
                });

            })  
        })
    });

    function barChartProduct(){
        var ctx = $("#chart1");
        barChartProduct = new Chart(ctx, {
           type: 'line',

           data: {
                labels: ["January","February","March","April","May","June","July","August","September","October","November","December"],
                datasets: [{
                    label: productData.product,
                    fill: false,
                    data: productData.monthlySales,
                    borderColor: 'rgba(255,99,132,1)',
                }]
           },

           options: {
            responsive: true,
            title: {
                display: true,
                text: "Product trendline" 
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Month'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Value'
                    }
                }]
            }
        }
       });
    }


    function pieChartProduct(){
        var ctx = $("#chart1");
        var labels = [];
        var data = [];
        topFiveProducts.forEach(function(product){
            labels.push(product.product);
            data.push(product.totalSales)
        })
        pieChartProduct = new Chart(ctx, {
           type: 'pie',
           data: {
               labels: labels,
               datasets: [{
                   label: 'Item Sold',
                   data: data,
                   backgroundColor: [
                       'rgba(255, 99, 132, 0.2)',
                       'rgba(54, 162, 235, 0.2)',
                       'rgba(255, 206, 86, 0.2)',
                       'rgba(75, 192, 192, 0.2)',
                       'rgba(153, 102, 255, 0.2)',
                       'rgba(255, 159, 64, 0.2)'
                   ],
                   borderColor: [
                       'rgba(255,99,132,1)',
                       'rgba(54, 162, 235, 1)',
                       'rgba(255, 206, 86, 1)',
                       'rgba(75, 192, 192, 1)',
                       'rgba(153, 102, 255, 1)',
                       'rgba(255, 159, 64, 1)'
                   ],
                   borderWidth: 1
               }]
           },
           options: {
               
           }
       });
    }



    function barChartMonths(){
        var ctx = $("#chart2");
        barChartMonths = new Chart(ctx, {
           type: 'line',

           data: {
                labels: ["January","February","March","April","May","June","July","August","September","October","November","December"],
                datasets: [{
                    label: topFiveProducts[0].product,
                    fill: false,
                    data: topFiveProducts[0].monthlySales,
                    borderColor: 'rgba(255,99,132,1)',

                }, {
                    label: topFiveProducts[1].product,
                    fill: false,
                    data: topFiveProducts[1].monthlySales,
                    borderColor: 'rgba(54, 162, 235, 1)',

                }, {
                    label: topFiveProducts[2].product,
                    fill: false,
                    data: topFiveProducts[2].monthlySales,
                    borderColor: 'rgba(255, 206, 86, 1)',

                }, {
                    label: topFiveProducts[3].product,
                    fill: false,
                    data: topFiveProducts[3].monthlySales,
                    borderColor: 'rgba(75, 192, 192, 1)',

                },{
                    label: topFiveProducts[4].product,
                    fill: false,
                    data: topFiveProducts[4].monthlySales,
                    borderColor: 'rgba(153, 102, 255, 1)',
                }]
           },

           options: {
            responsive: true,
            title: {
                display: true,
                text: 'Top 5 products sold trendline'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Month'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Value'
                    }
                }]
            }
        }
       });
    }
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

$("#productExportButton").click(function(){
    $("#chart1").get(0).toBlob(function(blob){
        saveAs(blob, "chart_1.png");
    })
})

$("#yearExport").click(function(){
    $("#chart1").get(0).toBlob(function(blob){
        saveAs(blob, "chart_1.png");
    })
    $("#chart2").get(0).toBlob(function(blob){
        saveAs(blob, "chart_1.png");
    })
})




//GRAVEYARD

// docRefSalesDetails.where("DateMonth", "==", "January")
//                 .get()
//                 .then(function(querySnapshot){  
//                     monthlySales.push(getSalesCount(querySnapshot));

//                     docRefSalesDetails.where("DateMonth", "==", "February")
//                     .get()
//                     .then(function(querySnapshot){
//                         monthlySales.push(getSalesCount(querySnapshot));

//                         docRefSalesDetails.where("DateMonth", "==", "March")
//                         .get()
//                         .then(function(querySnapshot){
//                             monthlySales.push(getSalesCount(querySnapshot));

//                             docRefSalesDetails.where("DateMonth", "==", "April")
//                             .get()
//                             .then(function(querySnapshot){
//                                 monthlySales.push(getSalesCount(querySnapshot));

//                                 docRefSalesDetails.where("DateMonth", "==", "May")
//                                 .get()
//                                 .then(function(querySnapshot){
//                                     monthlySales.push(getSalesCount(querySnapshot));

//                                     docRefSalesDetails.where("DateMonth", "==", "June")
//                                     .get()  
//                                     .then(function(querySnapshot){
//                                         monthlySales.push(getSalesCount(querySnapshot));

//                                         docRefSalesDetails.where("DateMonth", "==", "June")
//                                         .get()
//                                         .then(function(){
//                                             monthlySales.push(getSalesCount(querySnapshot));

//                                             docRefSalesDetails.where("DateMonth", "==", "August")
//                                             .get()
//                                             .then(function(querySnapshot){
//                                                 monthlySales.push(getSalesCount(querySnapshot));

//                                                 docRefSalesDetails.where("DateMonth", "==", "September")
//                                                 .get()
//                                                 .then(function(querySnapshot){
//                                                     monthlySales.push(getSalesCount(querySnapshot));

//                                                     docRefSalesDetails.where("DateMonth", "==", "October")
//                                                     .get()
//                                                     .then(function(querySnapshot){
//                                                         monthlySales.push(getSalesCount(querySnapshot));

//                                                         docRefSalesDetails.where("DateMonth", "==", "November")
//                                                         .get()
//                                                         .then(function(querySnapshot){
//                                                             monthlySales.push(getSalesCount(querySnapshot));
                                                            
//                                                             docRefSalesDetails.where("DateMonth", "==", "December")
//                                                             .get() 
//                                                             .then(function(querySnapshot){
//                                                                 monthlySales.push(getSalesCount(querySnapshot));

//                                                                 var totalSales = 0;
//                                                                 monthlySales.forEach(function(sales){
//                                                                     totalSales += sales;
//                                                                 })
//                                                                 productsDataArray.push({product, monthlySales, totalSales});
//                                                                 if(index == (products.length - 1)){
//                                                                     productsDataArray.sort(function(a,b){
//                                                                         return b.totalSales - a.totalSales;
//                                                                     });
//                                                                     topFiveProducts = productsDataArray.slice(0, 5);
                                                                    
//                                                                     console.log(productsDataArray);
//                                                                     console.log(topFiveProducts);
//                                                                     barChartMonths();
//                                                                     pieChartProduct();

                                                                    
//                                                                 }
//                                                             })
//                                                         })  
//                                                     })                                                   
//                                                 })    
//                                             })    
//                                         })    
//                                     })
//                                 })                                
//                             })
//                         })
//                     })           
//                 })