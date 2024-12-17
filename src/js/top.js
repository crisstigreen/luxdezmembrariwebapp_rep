document.addEventListener("DOMContentLoaded", function () {
    //debugger;   
    // Load top area
    fetch('../top.html')
        .then(response => response.text())
        .then(data => {
           
            document.getElementById('top-placeholder').innerHTML = data;

            var userId = sessionStorage.getItem('userId');
            
            if(userId == null)
            {
                document.getElementById('adminMenu').style.display = 'none';
                document.getElementById('userOrdersMenu').style.display = 'none';
            }
            else
            {
                GetUser(userId).then(user => {                
                    var username = sessionStorage.getItem('username');

                    if(user.roleID == 2){ //user                
                        document.getElementById('adminMenu').style.display = 'none';
                    }
                    
                    document.getElementById("userName").innerText = "User: " + username;
                    document.getElementById("userId").innerText = userId;                                      

                    //debugger;
                    var username = document.getElementById("tb_user");
                    if(username){
                        username.value = user.username;
                    }
                    var firstname = document.getElementById("tb_firstname");
                    if(firstname){
                        firstname.value = user.firstName;
                    }
                    var lastname = document.getElementById("tb_lastname");
                    if(lastname){
                        lastname.value = user.lastName;
                    }
                    var phone = document.getElementById("tb_phone");
                    if(phone){
                        phone.value = user.phoneNumber;
                    }
                    var email = document.getElementById("tb_email");
                    if(email){
                        email.value = user.email;
                    }
                    

                }).catch(error => {
                    console.error(error);
                });
            }
         
            
          
        });        
});

async function GetUser(userId){
    //debugger;
    const link = `${API_BASE_URL}/Users/async/${userId}`;
    var user = await get(link);
    return user;
}

function logout(){
    debugger;
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('username');
}


// Funcție pentru gestionarea evenimentului pageshow
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        window.location.reload();
    }
});
