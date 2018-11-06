$(document).ready(function(){
    db = firebase.firestore();
    var categories = [];
    var categoriesDataMap = {};
    var topFiveCategory = {};

    var products = [];
    var productsDataMap = {};
    var topFiveProducts = {};

    $("#startDate").val(moment().format('YYYY-MM-DD'));
    $("#radioPeriodDaily").prop('checked', true);
    $("#endDate").val(moment(new Date($("#startDate").val()), 'YYYY-MM-DD').add(1, 'days').format('YYYY-MM-DD')).prop('disabled', true);


    $("#generateGraphsButton").click(function(){
        db.collection("Categories").orderBy("Category", "asc")
        .get()
        .then(function(querySnapshot){
            var startDate = new Date($("#startDate").val());
            var endDate = new Date($("#endDate").val());
    
            querySnapshot.forEach(function(doc){
                categories.push(doc.data().Category);
            })
    
            categories.forEach(function(category, index){
                var salesCount = 0;
    
                db.collection("SalesDetails").where("ProductCategory", "==", category).where("Date", ">", startDate).where("Date", "<", endDate)
                .get()
                .then(function(querySnapshot){
                    querySnapshot.forEach(function(doc){
                        salesCount += doc.data().Quantity;
                    })
                    categoriesDataMap[category] = salesCount;
                    
    
                    if(index == categories.length - 1){
                        topFiveCategory = getTopFive(categoriesDataMap);
                        pieChart();
                    }
                })
            })
            
        })
    
        db.collection("Products").orderBy("PName", "asc")
        .get()
        .then(function(querySnapshot){
            var startDate = new Date($("#startDate").val());
            var endDate = new Date($("#endDate").val());
    
            querySnapshot.forEach(function(doc){
                products.push(doc.data().PName)
            })
    
            products.forEach(function(product, index){
                var salesCount = 0;
    
                db.collection("SalesDetails").where("ProductName", "==", product).where("Date", ">", startDate).where("Date", "<", endDate)
                .get()
                .then(function(querySnapshot){
                    querySnapshot.forEach(function(doc){
                        salesCount += doc.data().Quantity;
                    })
                    productsDataMap[product] = salesCount;
    
                    if(index == products.length - 1){
                        topFiveProducts = getTopFive(productsDataMap);
                        barChart();
                    }
                })
            })
        })
    });
    

    function getTopFive(map){
        var props = Object.keys(map).map(function(key) {
            return { key: key, value: this[key] };
        }, map);
        props.sort(function(p1, p2) { return p2.value - p1.value; });
        var topFive = props.slice(0, 5).reduce(function(obj, prop) {
            obj[prop.key] = prop.value;
            return obj;
          }, {});
        console.log(topFive);
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

    function barChart(){
        var ctx = $("#barChart");
        myChart = new Chart(ctx, {
           type: 'horizontalBar',
           data: {
               labels: Object.keys(topFiveProducts),
               datasets: [{
                   label: '# of Votes',
                   data: Object.values(topFiveProducts),

                   borderWidth: 1
               }]
           },
           options: {
               
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

