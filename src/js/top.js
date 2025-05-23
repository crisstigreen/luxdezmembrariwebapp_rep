
window.topHtmlLoaded = fetch('../top.html')
    .then(response => response.text())
    .then(data => {
     
        document.body.insertAdjacentHTML('afterbegin', data);

        return new Promise(resolve => {
        
            requestAnimationFrame(() => {
          
                 var userId = sessionStorage.getItem('userId');
            
            if(userId == null)
            {
                document.getElementById('link-Admin').style.display = 'none';
                //document.getElementById('userOrdersMenu').style.display = 'none';
            }
            else
            {
                GetUser(userId).then(user => {                
                    var username = sessionStorage.getItem('username');

                    const userAuth = document.getElementById('user_auth');
                    const img = userAuth.querySelector('img');  
                    const dropdownMenu = document.querySelector('.dropdown-menu');

                    document.getElementById('contul-meu').style.display ='none';

                    if(user.roleID == 2){ //user                
                        document.getElementById('link-Admin').style.display = 'none';
                    
                     
                    }
                 
                     userAuth.style.display='flex';
                     const usernameText = document.createTextNode(user.username + ' ');
                     userAuth.insertBefore(usernameText, img);

                    // document.getElementById("userName").innerText = "User: " + username;
                    // document.getElementById("userId").innerText = userId;  
                    
                    
                    userAuth.addEventListener('click', function(event) {
                    event.preventDefault(); 
                    dropdownMenu.classList.toggle('show');
                    event.stopPropagation();
                    });

                    
                    document.addEventListener('click', function(event) {
                    if (!dropdownMenu.contains(event.target) && !userAuth.contains(event.target)) {
                        dropdownMenu.classList.remove('show');
                    }
                    });

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

              
                resolve();
            });
        });
    }).catch(error => {
        console.error('Eroare la încărcarea top.html:', error);
    });



// document.addEventListener("DOMContentLoaded", function () {
//     //debugger;   
//     // Load top area
//     fetch('../top.html')
//         .then(response => response.text())
//         .then(data => {
           
//           document.body.insertAdjacentHTML('afterbegin', data);

//             var userId = sessionStorage.getItem('userId');
            
//             if(userId == null)
//             {
//                 // document.getElementById('adminMenu').style.display = 'none';
//                 // document.getElementById('userOrdersMenu').style.display = 'none';
//             }
//             else
//             {
//                 GetUser(userId).then(user => {                
//                     var username = sessionStorage.getItem('username');

//                     // if(user.roleID == 2){ //user                
//                     //     document.getElementById('adminMenu').style.display = 'none';
//                     // }
                    
//                     // document.getElementById("userName").innerText = "User: " + username;
//                     // document.getElementById("userId").innerText = userId;                                      

//                     //debugger;
//                     var username = document.getElementById("tb_user");
//                     if(username){
//                         username.value = user.username;
//                     }
//                     var firstname = document.getElementById("tb_firstname");
//                     if(firstname){
//                         firstname.value = user.firstName;
//                     }
//                     var lastname = document.getElementById("tb_lastname");
//                     if(lastname){
//                         lastname.value = user.lastName;
//                     }
//                     var phone = document.getElementById("tb_phone");
//                     if(phone){
//                         phone.value = user.phoneNumber;
//                     }
//                     var email = document.getElementById("tb_email");
//                     if(email){
//                         email.value = user.email;
//                     }
                    

//                 }).catch(error => {
//                     console.error(error);
//                 });
//             }
         


//             //menu cristi
//             //debugger;            
//             // const mainMenu = document.getElementById('main-menu');
//             // const hamburgerMenu = document.getElementById('hamburger-menu');
//             // const hamburgerMenuContainer = document.getElementById('hamburger-menu-container');
//             // const toggleButton = document.querySelector('.site-menu-toggle.js-menu-toggle');
//             // // Verify that elements are correctly selected
//             // if (!mainMenu || !hamburgerMenu || !toggleButton || !hamburgerMenuContainer) {
//             //     console.error('One or more elements could not be found in the DOM');
//             //     return;
//             // }
//             // // Copy menu items from the main menu to the hamburger menu
//             // function copyMenuItems() {
//             //     hamburgerMenu.innerHTML = mainMenu.innerHTML;
//             // }
//             // // Toggle the display of the hamburger menu
//             // function toggleHamburgerMenu() {
//             //     if (hamburgerMenuContainer.classList.contains('active')) {
//             //         hamburgerMenuContainer.classList.remove('active');
//             //     } else {
//             //         hamburgerMenuContainer.classList.add('active');
//             //     }
//             // }
//             // // Initialize
//             // copyMenuItems();
//             // // Event listener for the toggle button
//             // toggleButton.addEventListener('click', function (e) {
//             //     e.preventDefault();
//             //     toggleHamburgerMenu();
//             // });






          
//         });        
// });

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
    document.getElementById('contul-meu').style.display ='flex';
    document.getElementById('user_auth').style.display ='none';
    const menu = document.querySelector('.dropdown-menu');
     menu.classList.remove('show');
}


// Funcție pentru gestionarea evenimentului pageshow
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        window.location.reload();
    }
});
