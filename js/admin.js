
firebase.auth().onAuthStateChanged(function(user){
    if(user){
        if (user.uid != "vAHtbuIEkXZHmJTLlBBao5lZnjf2"){
            document.getElementById("entBody").style.display = "none";
            console.log("User is not admin");
            alert("You do not have permission to access this page");
            window.location.replace("AddSales.html")
        }
        console.log("User is admin")
    } else {
        console.log("Signed off");
        window.location.replace("login.html")
    }
})

