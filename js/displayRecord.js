var db = firebase.firestore();
var d = new Date().toDateString()
document.getElementById("startDate").value = "2010-01-01";
document.getElementById("endDate").valueAsDate = new Date();

function paginateTable() {
    $("#tableRecord").DataTable();
}

function generateTable(){
    var startDate = new Date($("#startDate").val());
    var endDate = new Date($("#endDate").val());
// This function generates the list of products and put into a table form
$("#tbodyID").empty();
db.collection("SalesRecord").where("Date", ">=", startDate).where("Date", "<=", endDate).orderBy("Date")
.get()
.then(function(querySnapshot){
        var SalesRecordIDarray = {};
        var IDcounterForEachRecord=0;
        var content = "";   
        querySnapshot.forEach (function(doc){

            SalesRecordIDarray[IDcounterForEachRecord]=doc.id;//mapping the index number to ID
            // var date = Date(doc.data().Date.toDate());
            // date = date(yy mm dd);
            content += '<tr id="' + IDcounterForEachRecord + '">';
            // content += '<td>' + doc.id + '</td>';
            content += '<td>' + doc.data().Date.toDate().toDateString() + '</td>';
            // content += '<td>' + doc.data().Date.toDate().getTime() + '</td>';
            content += '<td>' + doc.data().Date.toDate().getHours() + 'h: '+ doc.data().Date.toDate().getMinutes() + 'm: '+ doc.data().Date.toDate().getSeconds() + "s" +'</td>';
            content += '<td>' + doc.data().TotalPrice.toFixed(2) + '</td>';
            content += '<td>' + '<Button class="deleteRecord btn btn-outline-danger">Delete</Button>' + '</td>';
            content += '</tr>';
            IDcounterForEachRecord++;
    });

    setTimeout(paginateTable, 100);

    $(document).on("click", ".deleteRecord", function(){
    if (confirm("Proceed to Delete: click OK")) {
        console.log("deleted button clicked");//works
        var getrowIndex = $(this).closest('tr').attr('id');
        console.log(getrowIndex);//works
        var getSRID = SalesRecordIDarray[getrowIndex];
        console.log(getSRID);//works
        $(this).closest('tr').remove();

        //Delete Sales detail of the Sales Record
        var SDRef = db.collection("SalesRecord").doc(getSRID);
        SDRef.get().then(function(doc){
            var getSDID = doc.data().IDs;
            console.log(getSDID);
            getSDID.forEach(function(id, ){
                db.collection("SalesDetails").doc(id).delete().then(function() {
                    console.log("Sales Detail successfully deleted!");
                    
                }).catch(function(error) {
                    console.error("Error removing document: ", error);
                });

            })

            //now i have to delete the document with getPID from the database
            db.collection("SalesRecord").doc(getSRID).delete().then(function() {
                console.log("Document successfully deleted!");
                
            }).catch(function(error) {
                console.error("Error removing document: ", error);
            });
        })
        
    } else {
        // Do nothing
    }
    })
    //then triger a function that will delete the entire <tbody> and then reload it
    $('#tableRecord').append(content);
})//end of db query
}//end of function generateTable

$(document).on("click", "#searchDate", function(){
    generateTable();
})