var db = firebase.firestore();

//This function generates the list of products and put into a table form
db.collection("Products")
.get()
.then(function(querySnapshot){
        var productIDarray = {};
        var IDcounterForEachProduct=0;
        var content = "";   
        querySnapshot.forEach (function(doc){
            productIDarray[IDcounterForEachProduct]=doc.id;//mapping the index number to ID
            content += '<tr id="' + IDcounterForEachProduct + '">';
            content += '<td>' + doc.data().PName + '</td>';
            content += '<td>' + doc.data().Category + '</td>';
            content += '<td>' + doc.data().Raw_Price + '</td>';
            content += '<td>' + doc.data().Sales_Price + '</td>';
            content += '<td>' + '<Button class="editProduct btn btn-outline-dark">Edit</Button><Button class="deleteProduct btn btn-outline-danger">Delete</Button>' + '</td>';
            content += '</tr>';
            IDcounterForEachProduct++;
    });

    $(document).on("click", ".deleteProduct", function(){
        console.log("deleted button clicked");//works
        var getrowIndex = $(this).closest('tr').attr('id');
        console.log(getrowIndex);//works
        var getPID = productIDarray[getrowIndex];
        console.log(getPID);//works
        $(this).closest('tr').remove();

        //now i have to delete the document with getPID from the database
        db.collection("Products").doc(getPID).delete().then(function() {
            console.log("Document successfully deleted!");
            
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
        //then triger a function that will delete the entire <tbody> and then reload it

    })
    $('#table').append(content);

    $(document).on("click",".editProduct", function(){
        console.log("Edit button pressed");
        var getrowIndex2 = $(this).closest('tr').attr('id');
        var getPID2 = productIDarray[getrowIndex2];
        localStorage.setItem("PID", getPID2);
        window.location.href ="EditProduct.html";
    })
})