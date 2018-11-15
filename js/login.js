firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
      // User is signed in.
      console.log(user.email + " signed in");
      if (user.email =="adminexample@example.com"){
        window.location.replace("Generate_Forecast.html");
      } else {
        window.location.replace("AddSales.html");
      }
      
      //   document.getElementById("user_div").style.display = "block";
      //   document.getElementById("login_div").style.display = "none";  
      //   var user = firebase.auth().currentUser;

      if (user != null) {

          // var email_id = user.email;
          // document.getElementById("user_para").innerHTML = "Welcome User : " + email_id;
          console.log("Welcome " + user.email);
      }

  } else {
      // No user is signed in.
      console.log("Not signed in")
      //   document.getElementById("user_div").style.display = "none";
      //   document.getElementById("login_div").style.display = "block";

  }
});

//this function is in the login page
$(document).on("click", "#SignInbtn", function () {
  var userEmail = document.getElementById("email").value;
  var userPass = document.getElementById("pwd").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;

      window.alert("Error : " + errorMessage);

  });
})
