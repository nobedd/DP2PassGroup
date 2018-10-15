var db = firebase.firestore();

db.collection("Products")
.get()
.then(function(querySnapshot){     
    var content = "";
    querySnapshot.forEach (function(doc){
        content += '<tr>';
        content += '<td>' + doc.data().PName + '</td>';
        content += '<td>' + doc.data().Category + '</td>';
        content += '<td>' + doc.data().Raw_Price + '</td>';
        content += '<td>' + doc.data().Sales_Price + '</td>';
        content += '<td>' + '<Button>Edit</Button><Button>Delete</Button>' + '</td>';
        content += '</tr>';
})
$('#table').append(content);
})