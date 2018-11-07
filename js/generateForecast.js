$(document).ready(function(){
    db = firebase.firestore();
    var categories = [];
    var categoriesDataMap = {};
    var topFiveCategory = {};

    var products = [];
    var productsDataMap = {};
    var topFiveProducts = {};

    var productsDataArray = [];

    $("#startDate").val(moment().format('YYYY-MM-DD'));
    $("#radioPeriodYearly").prop('checked', true);
    $("#endDate").val(moment(new Date($("#startDate").val()), 'YYYY-MM-DD').add(1, 'year').format('YYYY-MM-DD')).prop('disabled', true);


    $("#generateGraphsButton").click(function(){
        // db.collection("Categories").orderBy("Category", "asc")
        // .get()
        // .then(function(querySnapshot){
        //     var startDate = new Date($("#startDate").val());
        //     var endDate = new Date($("#endDate").val());
    
        //     querySnapshot.forEach(function(doc){
        //         categories.push(doc.data().Category);
        //     })
    
        //     categories.forEach(function(category, index){
        //         var salesCount = 0;
    
        //         db.collection("SalesDetails").where("ProductCategory", "==", category).where("Date", ">", startDate).where("Date", "<", endDate)
        //         .get()
        //         .then(function(querySnapshot){
        //             querySnapshot.forEach(function(doc){
        //                 salesCount += doc.data().Quantity;
        //             })
        //             categoriesDataMap[category] = salesCount;
                    
    
        //             if(index == categories.length - 1){
        //                 topFiveCategory = getTopFive(categoriesDataMap);
        //                 pieChart();
        //             }
        //         })
        //     })
            
        // })
    
        db.collection("Products").orderBy("PName", "asc")
        .get()
        .then(function(querySnapshot){
    
            querySnapshot.forEach(function(doc){
                products.push(doc.data().PName)
            })
    
            products.forEach(function(product, index){
            
                var monthlySales = []; 
                var docRefSalesDetails = db.collection("SalesDetails").where("ProductName", "==", product);

                docRefSalesDetails.where("DateMonth", "==", "January")
                .get()
                .then(function(querySnapshot){  
                    monthlySales.push(getSalesCount(querySnapshot));

                    docRefSalesDetails.where("DateMonth", "==", "February")
                    .get()
                    .then(function(querySnapshot){
                        monthlySales.push(getSalesCount(querySnapshot));

                        docRefSalesDetails.where("DateMonth", "==", "March")
                        .get()
                        .then(function(querySnapshot){
                            monthlySales.push(getSalesCount(querySnapshot));

                            docRefSalesDetails.where("DateMonth", "==", "April")
                            .get()
                            .then(function(querySnapshot){
                                monthlySales.push(getSalesCount(querySnapshot));

                                docRefSalesDetails.where("DateMonth", "==", "May")
                                .get()
                                .then(function(querySnapshot){
                                    monthlySales.push(getSalesCount(querySnapshot));

                                    docRefSalesDetails.where("DateMonth", "==", "June")
                                    .get()  
                                    .then(function(querySnapshot){
                                        monthlySales.push(getSalesCount(querySnapshot));

                                        docRefSalesDetails.where("DateMonth", "==", "June")
                                        .get()
                                        .then(function(){
                                            monthlySales.push(getSalesCount(querySnapshot));

                                            docRefSalesDetails.where("DateMonth", "==", "August")
                                            .get()
                                            .then(function(querySnapshot){
                                                monthlySales.push(getSalesCount(querySnapshot));

                                                docRefSalesDetails.where("DateMonth", "==", "September")
                                                .get()
                                                .then(function(querySnapshot){
                                                    monthlySales.push(getSalesCount(querySnapshot));

                                                    docRefSalesDetails.where("DateMonth", "==", "October")
                                                    .get()
                                                    .then(function(querySnapshot){
                                                        monthlySales.push(getSalesCount(querySnapshot));

                                                        docRefSalesDetails.where("DateMonth", "==", "November")
                                                        .get()
                                                        .then(function(querySnapshot){
                                                            monthlySales.push(getSalesCount(querySnapshot));
                                                            
                                                            docRefSalesDetails.where("DateMonth", "==", "December")
                                                            .get() 
                                                            .then(function(querySnapshot){
                                                                monthlySales.push(getSalesCount(querySnapshot));

                                                                var totalSales = 0;
                                                                monthlySales.forEach(function(sales){
                                                                    totalSales += sales;
                                                                })
                                                                productsDataArray.push({product, monthlySales, totalSales});
                                                                if(index == (products.length - 1)){
                                                                    productsDataArray.sort(function(a,b){
                                                                        return b.totalSales - a.totalSales;
                                                                    });
                                                                    topFiveProducts = productsDataArray.slice(0, 5);
                                                                    
                                                                    console.log(productsDataArray);
                                                                    console.log(topFiveProducts);
                                                                    barChartMonths();
                                                                    pieChartProduct();

                                                                    
                                                                }
                                                            })
                                                        })  
                                                    })                                                   
                                                })    
                                            })    
                                        })    
                                    })
                                })                                
                            })
                        })
                    })           
                })
            })


        })
    });
    
    function getSalesCount(querySnapshot){
        var salesCount = 0;

        querySnapshot.forEach(function(doc){
            salesCount += doc.data().Quantity;
        })
        return salesCount
    }


    function getTopFive(map){
        var props = Object.keys(map).map(function(key) {
            return { key: key, value: this[key] };
        }, map);
        props.sort(function(p1, p2) { return p2.value - p1.value; });
        var topFive = props.slice(0, 5).reduce(function(obj, prop) {
            obj[prop.key] = prop.value;
            return obj;
          }, {});
        return topFive;
    }

    function pieChart(map){
        var ctx = $("#pieChart");
        myChart = new Chart(ctx, {
           type: 'pie',
           data: {
               labels: Object.keys(topFiveCategory),
               datasets: [{
                   label: '# of Votes',
                   data: Object.values(topFiveCategory),
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

    function pieChartProduct(){
        var ctx = $("#pieChartProduct");
        var labels = [];
        var data = [];
        topFiveProducts.forEach(function(product){
            labels.push(product.product);
            data.push(product.totalSales)
        })
        myChart = new Chart(ctx, {
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
        var ctx = $("#barChartMonths");
        myChart = new Chart(ctx, {
           type: 'line',

           data: {
                labels: ["January","February","March","April","May","June","July","August","September","October","November","December"],
                datasets: [{
                    label: topFiveProducts[0].product,
                    fill: false,
                    data: topFiveProducts[0].monthlySales,

                }, {
                    label: topFiveProducts[1].product,
                    fill: false,
                    data: topFiveProducts[1].monthlySales,

                }, {
                    label: topFiveProducts[2].product,
                    fill: false,
                    data: topFiveProducts[2].monthlySales,

                }, {
                    label: topFiveProducts[3].product,
                    fill: false,
                    data: topFiveProducts[3].monthlySales,

                },{
                    label: topFiveProducts[4].product,
                    fill: false,
                    data: topFiveProducts[4].monthlySales,
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

class ProductSales {

    constructor(name, yearlySales){
        this.name = name;
        this.yearlySales = yearlySales;
        console.log("Object created");
    }

    get name(){ return this.name;  }
    get yearlySales(){ return this.yearlySales; }

    GetTotalSales(){
        var totalSales;
        this.yearlySales.forEach(function(sales){
            totalSales += sales
        })
        return totalSales;
    }

    static compare(ProductSalesA, ProductSalesB){
        return ProductSalesA.totalSales - ProductSalesB.totalSales;
    }
}


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

