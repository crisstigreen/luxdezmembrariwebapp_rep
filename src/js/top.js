
window.topHtmlLoaded = fetch('/top.html')
    .then(response => response.text())
    .then(data => {
        //debugger;
        document.body.insertAdjacentHTML('afterbegin', data);
        //debugger;
        const urlParams = new URLSearchParams(window.location.search);
        var searchTerm = urlParams.get('search');
        if(searchTerm != null){            
            document.getElementById("tb_cauta").value = searchTerm;           
        }

        return new Promise(resolve => {
        
            requestAnimationFrame(() => {
          
                 var userId = sessionStorage.getItem('userId');
            
            if(userId == null)
            {
                //document.getElementById('link-Admin').style.display = 'none';
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
                        //document.getElementById('link-Admin').style.display = 'none';
                    
                     
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
    
document.addEventListener('DOMContentLoaded', async function () {
    await generateDynamicMenu();

    document.getElementById('tb_cauta').addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const searchTerm = document.getElementById('tb_cauta').value.trim();
            currentPage = 1; // Resetăm la prima pagină
            if (window.location.pathname.includes("piese.html")) {
                pieseApiCall(populateMainGrid);
            } else {
                window.location.href = `piese.html?search=${encodeURIComponent(searchTerm)}`;
            }
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
    sessionStorage.removeItem('email');
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




