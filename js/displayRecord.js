var db = firebase.firestore();

//This function generates the list of products and put into a table form
db.collection("SalesRecord")
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
            content += '<td>' + doc.id + '</td>';
            content += '<td>' + doc.data().Date.toDate() + '</td>';
            content += '<td>' + doc.data().TotalPrice.toFixed(2) + '</td>';
            content += '<td>' + '<Button class="deleteRecord btn btn-outline-danger">Delete</Button>' + '</td>';
            content += '</tr>';
            IDcounterForEachRecord++;
    });

    $(document).on("click", ".deleteRecord", function(){
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



        //then triger a function that will delete the entire <tbody> and then reload it

    })
    $('#tableRecord').append(content);
})