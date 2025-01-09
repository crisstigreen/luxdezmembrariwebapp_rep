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
         


            //menu cristi
            //debugger;            
            const mainMenu = document.getElementById('main-menu');
            const hamburgerMenu = document.getElementById('hamburger-menu');
            const hamburgerMenuContainer = document.getElementById('hamburger-menu-container');
            const toggleButton = document.querySelector('.site-menu-toggle.js-menu-toggle');
            // Verify that elements are correctly selected
            if (!mainMenu || !hamburgerMenu || !toggleButton || !hamburgerMenuContainer) {
                console.error('One or more elements could not be found in the DOM');
                return;
            }
            // Copy menu items from the main menu to the hamburger menu
            function copyMenuItems() {
                hamburgerMenu.innerHTML = mainMenu.innerHTML;
            }
            // Toggle the display of the hamburger menu
            function toggleHamburgerMenu() {
                if (hamburgerMenuContainer.classList.contains('active')) {
                    hamburgerMenuContainer.classList.remove('active');
                } else {
                    hamburgerMenuContainer.classList.add('active');
                }
            }
            // Initialize
            copyMenuItems();
            // Event listener for the toggle button
            toggleButton.addEventListener('click', function (e) {
                e.preventDefault();
                toggleHamburgerMenu();
            });






          
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
