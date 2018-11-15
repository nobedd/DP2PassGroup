    var config = {
        apiKey: "AIzaSyAd_KsL66EQmcNGlecBSYBOJMieoxi5Qyk",
        authDomain: "dp2passgroup.firebaseapp.com",
        databaseURL: "https://dp2passgroup.firebaseio.com",
        projectId: "dp2passgroup",
        storageBucket: "dp2passgroup.appspot.com",
        messagingSenderId: "1032158016281"
    };
    firebase.initializeApp(config);

    const firestore = firebase.firestore();
    const settings = {/* your settings... */ timestampsInSnapshots: true};
    firestore.settings(settings);
  

    LogButton.addEventListener("click", function(){
            firebase.auth().signOut();
            window.location.replace("login.html");
    });

    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            console.log("you have signed in")
            //get user information
            var uid;
            uid = user.uid;
            console.log("User ID: " + uid);
            
            if (user.email == "adminexample@example.com") {    //if the user is the manager
                var content ='<div class="sidenav"><ul class="nav flex-column nav-pills"><h5 class="sidebar-heading px-3 py-3"><span>Sales Management</span></h5><li class="nav-item"><a class="nav-link text-white" href="AddSales.html"><i class="fas fa-file-medical mr-3"></i><span class="font-weight-bold">Add New Sales</span></a></li><li class="nav-item"><a class="nav-link text-white" href="DisplayRecord.html"><i class="fas fa-file-invoice mr-3"></i>Manage Sales Record</a></li></ul><ul class="nav flex-column nav-pills"><h5 class="sidebar-heading mt-5 px-3 py-3"><span>Inventory Management</span></h5><li class="nav-item"><a class="nav-link text-white" href="AddProduct.html"><i class="fas fa-folder-plus mr-3"></i>Add New Product</a></li><li class="nav-item"><a class="nav-link text-white" href="inventoryMain.html"><i class="fas fa-archive mr-3"></i>Manage Inventory</a></li></ul><ul class="nav flex-column nav-pills"><h5 class="sidebar-heading mt-5 px-3 py-3"><span>Reports & Analytics</span></h5><li class="nav-item"><a class="nav-link text-white" href="Generate_Report.html"><i class="fas fa-file-invoice mr-3"></i>Generate Report</a></li><li class="nav-item"><a class="nav-link text-white" href="Generate_Forecast.html"><i class="fas fa-file-contract mr-3"></i>Generate Analytics</a></li></ul></div>';
                document.getElementById("LogButton").innerHTML="Manager Log Out"
                $('#navigationSide').append(content);
            }
            if(user.email !="adminexample@example.com"){  //if the user is the staff or not manager
                var content ='<div class="sidenav"><ul class="nav flex-column nav-pills"><h5 class="sidebar-heading px-3 py-3"><span>Sales Management</span></h5><li class="nav-item"><a class="nav-link text-white" href="AddSales.html"><i class="fas fa-file-medical mr-3"></i><span class="font-weight-bold">Add New Sales</span></a></li><li class="nav-item"><a class="nav-link text-white" href="DisplayRecord.html"><i class="fas fa-file-invoice mr-3"></i>Manage Sales Record</a></li></ul><ul class="nav flex-column nav-pills"><h5 class="sidebar-heading mt-5 px-3 py-3"><span>Inventory Management</span></h5><li class="nav-item"><a class="nav-link text-white" href="AddProduct.html"><i class="fas fa-folder-plus mr-3"></i>Add New Product</a></li><li class="nav-item"><a class="nav-link text-white" href="inventoryMain.html"><i class="fas fa-archive mr-3"></i>Manage Inventory</a></li></ul></div>'
                document.getElementById("LogButton").innerHTML="Staff Log Out"
                $('#navigationSide').append(content);
            }

            if(user != null){
                console.log("Currently signed in as: " + user.email);
                
              }
        } else {
            console.log("Signed off");
            window.location.replace("login.html")
        }
    })
