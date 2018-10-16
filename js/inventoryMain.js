var database = firebase.firestore();

document.getElementById("Edit").disabled=true;
document.getElementById("DeleteProduct").disabled=true;

//This function generates the list of products and put into a table form
database.collection("Products")
.get()
.then(function(querySnapshot){     
    var content = "";   
    querySnapshot.forEach (function(doc){
        content += '<tr>';
        // content += '<td>' + doc.get + '</td>'
        content += '<td>' + doc.data().PName + '</td>';
        content += '<td>' + doc.data().Category + '</td>';
        content += '<td>' + doc.data().Raw_Price + '</td>';
        content += '<td>' + doc.data().Sales_Price + '</td>';
        content += '<td>' + '<Button>Edit</Button><Button>Delete</Button>' + '</td>';
        content += '</tr>';
})
$('#table').append(content);
})

//function to highligt row when clicked
$(document).ready(
setTimeout(function(){
    $("#table tr").click(function() {
        var selected = $(this).hasClass("highlight");
        $("#table tr").removeClass("highlight");
        if(!selected)
                $(this).addClass("highlight");
    });
}, 3000));