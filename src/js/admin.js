
//**********  PAGE LOAD ********************************************************************* */
//**********  PAGE LOAD ********************************************************************* */

document.addEventListener("DOMContentLoaded", function () {
    fetch('menu.html')
        .then(response => response.text())
        .then(data => {
            //debugger;
            if(document.getElementById('menu-placeholder')){
                document.getElementById('menu-placeholder').innerHTML = data;
            }            
        });
                 
});

//**********  GET ********************************************************************* */
//**********  GET ********************************************************************* */

function login() {
    if (validareLogin()) {
        loginUser();
    }
}
function loginUser() {
    debugger;
    var userName = document.getElementById("tb_user").value;
    var pass = document.getElementById("tb_pass").value;
    const user = {
        Username: userName,
        Password: pass
    };

    const url = `${API_BASE_URL}/Users/login`;
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        debugger;
        if (!response.ok) {
            // Dacă răspunsul nu este OK (de exemplu 403 sau 400)
            return response.json().then(data => {
                let errorMessage = 'A apărut o eroare în timpul autentificării.';
                
                // Verificăm statusul și mesajul primit
                if (data && data.message) {
                    errorMessage = data.message; // Extragem mesajul din răspuns
                }
                
                // Afișăm mesajul de eroare corespunzător
                Swal.fire(
                    'Eroare!',
                    errorMessage,
                    'error'
                );
                //throw new Error(errorMessage); // Oprim execuția ulterioară
            });
        }
        
        // Dacă răspunsul este OK, continuăm cu procesarea JSON-ului
        return response.json(); // Procesăm răspunsul JSON dacă este ok
    })
    .then(data => {
        debugger;
        if (data) {
            debugger;
            var userId = data[0]; // Obține UserId din array-ul returnat
            var username = data[1]; // Obține Username din array-ul returnat

            sessionStorage.setItem('userId', userId);
            sessionStorage.setItem('username', username);

            window.location.href = '../index.html';
        }
    })
    .catch(error => {
        debugger;
        console.error('Error:', error);
        // În cazul în care sunt erori neașteptate
        Swal.fire(
            'Eroare!',
            'A apărut o eroare în timpul autentificării.',
            'error'
        );
    });
}

//**********  POST ********************************************************************* */
//**********  POST ********************************************************************* */

function register() {    
    window.location.href = 'register.html'; //relative to domain
}

function registerUser() {    
    debugger;
    if (validareRegister() == false) {
        return;
    }   
             
    var userName = document.getElementById("tb_user").value;    
    var pass = document.getElementById("tb_pass").value;
    var email = document.getElementById("tb_email").value;                                                                                
    const user = {

        Username: userName,       
        PasswordHash: pass,  
        Email: email   
    };
    insertUser(user);          
}


function insertUser(user){
    const url = `${API_BASE_URL}/Users`;
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        debugger;
        if (!response.ok) {
            throw new Error('Eroare la înregistrarea anvelopei');
        }
        showInsertSuccessMessage();
        document.getElementById('sent_message').innerText = 'Un email a fost trimis la adresa introdusa. Va rugam sa verificati casuta de email.';
        document.getElementById('tb_user').value = "";    
        document.getElementById('tb_pass').value = "";    
        document.getElementById('tb_email').value = "";    
        return response.json();
    })              
}


async function sendResetPassword(event) {
    debugger;
    const resendButton = document.getElementById('resend_button');
    resendButton.style.display = 'none';

    // Previne comportamentul implicit al butonului
    if (event) event.preventDefault();

    if (validareResetPass() == false) {
        return;
    }

    // Generare cod de resetare
    const resetCode = generateResetCode();
    console.log("Generated reset code: " + resetCode); // Doar pentru verificare, eliminati in productie

    // Afisare mesaj si timer
    document.getElementById('sent_message').innerText = 'Un email a fost trimis la adresa introdusa. Va rugam sa verificati casuta de email.';

    var email = document.getElementById("tb_email").value;
    const code = {
        code: resetCode,
        Email: email,
        Active: true               
    };
    //db
    const url = `${API_BASE_URL}/UsersCodes`;
    var x = await insert(code, url);  
    localStorage.setItem('codeId', x.id);
    localStorage.setItem('resetCode', resetCode);
    localStorage.setItem('email', email);
    debugger;
    startTimer(180);     
}


async function saveNewPassword(event) {  
    var loader = document.getElementById("loader");
    loader.style.display = "block";    

    let isValid = true;
    if (event) event.preventDefault();
    debugger;
    const code = document.getElementById('tb_code').value.trim();
    
    document.getElementById('code_error').innerText = '';
    // Validate code
    if (code.length !== 6) {
        document.getElementById('code_error').innerText = 'Codul trebuie să conțină 6 caractere.';
        verifRed('tb_code');
        isValid = false;
    }

   

    if(!isValid){
        return;
    }
     // verificare code

  
          
    let existingcode = await getExistingCode(code);
        
    if(existingcode == null || existingcode.active == false){
        verifRed('tb_code');
        document.getElementById('code_error').innerText = 'Codul este invalid sau a expirat.';
        loader.style.display = "none";  
        return;
    }
            
     loader.style.display = "none";  
     
    // Validate new pass
    var x = validareNewPass();
    if (x == false) {
        return;
    }      
        
    const email = localStorage.getItem('email');   
    if (email == null){ 
        return;
    }
    var pass = document.getElementById("tb_pass").value;           
    const newPassword = pass;

    updateUserPassword(email, newPassword);

    
}

async function updateUserPassword(email, newPassword) {
    const url = `${API_BASE_URL}/Users/${email}`;
    const data = newPassword;
    
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            console.log("Password updated successfully");
            showUpdateSuccessMessage(); 
            document.getElementById("tb_code").value = "";
            document.getElementById("tb_pass").value = "";
            document.getElementById("tb_repass").value = ""; 
        } else {
            //console.error("Failed to update password:", response.statusText);
            showErrorMessage(response.status);
          
            
        }
    } catch (error) {
        console.error("Error updating password:", error);
        showErrorMessage(error);
    }
}



async function getExistingCode(code) {    
    const link = `${API_BASE_URL}/UsersCodes/${code}`;
    const codeGet = await get(link);

    if (codeGet === null) {
        // Mesaj prietenos pentru codul care nu a fost găsit
        console.log(`Codul ${code} nu a fost găsit sau este inactiv.`);
    } else {
        // Codul a fost găsit și este activ
        console.log(`Codul ${code} a fost găsit:`, codeGet);
    }
    
    return codeGet;
}





//**********  PUT ********************************************************************* */
//**********  PUT ********************************************************************* */
function generateResetCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
function startTimer(duration) {
    let timer = duration, minutes, seconds;
    const timerMessage = document.getElementById('timer_message');
    const resendButton = document.getElementById('resend_button');
    
    const interval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        timerMessage.textContent = "Codul expira in " + minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(interval);
            timerMessage.textContent = "Codul a expirat. Puteti retrimite codul.";
            resendButton.style.display = 'block';

            var email = document.getElementById("tb_email").value;
            let codeId = localStorage.getItem('codeId');
            let resetCode = localStorage.getItem('resetCode');
            const code = {
                Id: codeId,
                code: resetCode,
                Email: email,
                Active: false               
            };
            //db     
            debugger;       
            update(code.Id,code,`${API_BASE_URL}/UsersCodes/${code.Id}`)                         
        }
    }, 1000);
}


//**********  VALIDARI ********************************************************************* */
//**********  VALIDARI ********************************************************************* */

function validareRegister() {
    let isValid = true;

    // Reset error messages
    document.getElementById('user_error').innerText = '';
    document.getElementById('pass_error').innerText = '';
    document.getElementById('email_error').innerText = '';

    // Validare username
    var user = document.getElementById("tb_user").value;
    if (user == "") {
        document.getElementById('user_error').innerText = 'Numele de utilizator nu poate fi gol.';
        isValid = false;
        verifRed('tb_user');
    } else if (user.length < 3) {
        document.getElementById('user_error').innerText = 'Numele de utilizator trebuie să aibă cel puțin 3 caractere.';
        isValid = false;
        verifRed('tb_user');
    }

    // Validare parola
    var pass = document.getElementById("tb_pass").value;
    if (pass == "") {
        document.getElementById('pass_error').innerText = 'Parola nu poate fi goală.';
        isValid = false;
        verifRed('tb_pass');
    } else {
        var passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/;
        if (!passRegex.test(pass)) {
            document.getElementById('pass_error').innerText = 'Parola trebuie să aibă cel puțin 8 caractere, o literă mare, o literă mică, un număr și un caracter special (inclusiv _).';
            isValid = false;
            verifRed('tb_pass');
        }
    }

    // Validare email
    var email = document.getElementById("tb_email").value;
    if (email == "") {
        document.getElementById('email_error').innerText = 'Adresa de email nu poate fi goală.';
        isValid = false;
        verifRed('tb_email');
    } else {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            document.getElementById('email_error').innerText = 'Adresa de email trebuie să fie de format valid (exemplu@domeniu.com).';
            isValid = false;
            verifRed('tb_email');
        }
    }

    return isValid;
}

function validareNewPass() { 
    //debugger;

    let isValid = true;

    // Reset errors
    //document.getElementById('code_error').innerText = '';
    document.getElementById('pass_error').innerText = '';
    document.getElementById('repass_error').innerText = '';

    // Get input values
    //const code = document.getElementById('tb_code').value.trim();
    const newPassword = document.getElementById('tb_pass').value.trim();
    const repeatPassword = document.getElementById('tb_repass').value.trim();



    // Validate new password
    if (newPassword.length < 6) {
        document.getElementById('pass_error').innerText = 'Parola trebuie să aibă cel puțin 6 caractere.';
        verifRed('tb_pass');
        isValid = false;
    }
    if (newPassword == "") {
        document.getElementById('pass_error').innerText = 'Parola nu poate fi goală.';
        isValid = false;
        verifRed('tb_pass');
    } else {
        var passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/;
        if (!passRegex.test(newPassword)) {
            document.getElementById('pass_error').innerText = 'Parola trebuie să aibă cel puțin 8 caractere, o literă mare, o literă mică, un număr și un caracter special (inclusiv _).';
            isValid = false;
            verifRed('tb_pass');
        }
    }


    // Validate repeat password
    if (repeatPassword !== newPassword) {
        document.getElementById('repass_error').innerText = 'Parolele nu se potrivesc.';
        verifRed('tb_repass');
        isValid = false;
    }
    if (repeatPassword == "") {
        document.getElementById('repass_error').innerText = 'Parola nu poate fi goală.';
        isValid = false;
        verifRed('tb_repass');
    } else {
        var passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/;
        if (!passRegex.test(repeatPassword)) {
            document.getElementById('repass_error').innerText = 'Parola trebuie să aibă cel puțin 8 caractere, o literă mare, o literă mică, un număr și un caracter special (inclusiv _).';
            isValid = false;
            verifRed('tb_repass');
        }
    }

    return isValid;
}



//**********  OTHER ********************************************************************* */
//**********  OTHER ********************************************************************* */

function loginLink() {
    window.location.href = 'login.html'; //relative to domain
}




function showInsertSuccessMessage() {
    Swal.fire({
        title: 'Success!',
        text: 'Insert operation completed successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
    });
}
function togglePassword() {
    const passwordField = document.getElementById('tb_pass');
    const eyeIcon = document.getElementById('eyepass');

    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        passwordField.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
}
function toggleRePassword() {
    const passwordField = document.getElementById('tb_repass');
    const eyeIcon = document.getElementById('eyerepass');

    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        passwordField.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
}


  
//**********  VALODARI ********************************************************************* */
//**********  VALODARI ********************************************************************* */

function validareLogin() {
    let isValid = true;

    // Reset error messages
    document.getElementById('user_error').innerText = '';
    document.getElementById('pass_error').innerText = '';

    // Validare username
    var user = document.getElementById("tb_user").value;
    if (user == "") {
        document.getElementById('user_error').innerText = 'Numele de utilizator nu poate fi gol.';
        isValid = false;
        verifRed('tb_user');
    } else if (user.length < 3) {
        document.getElementById('user_error').innerText = 'Numele de utilizator trebuie să aibă cel puțin 3 caractere.';
        isValid = false;
        verifRed('tb_user');
    }

    // Validare parola
    var pass = document.getElementById("tb_pass").value;
    if (pass == "") {
        document.getElementById('pass_error').innerText = 'Parola nu poate fi goală.';
        isValid = false;
        verifRed('tb_pass');
    } else {
        var passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/;
        if (!passRegex.test(pass)) {
            document.getElementById('pass_error').innerText = 'Parola trebuie să aibă cel puțin 8 caractere, o literă mare, o literă mică, un număr și un caracter special (inclusiv _).';
            isValid = false;
            verifRed('tb_pass');
        }
    }

    return isValid;
}
function validareResetPass() {
    let isValid = true;
    document.getElementById('email_error').innerText = '';
    
    // Validare email
    var email = document.getElementById("tb_email").value;
    if (email == "") {
        document.getElementById('email_error').innerText = 'Adresa de email nu poate fi goală.';
        isValid = false;
        verifRed('tb_email');
    } else {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            document.getElementById('email_error').innerText = 'Adresa de email trebuie să fie de format valid (exemplu@domeniu.com).';
            isValid = false;
            verifRed('tb_email');
        }
    }

    return isValid;
}
function verifRed(controlId) {
    var control = document.getElementById(controlId);    
    if (control) {        
        control.classList.add('red-box-shadow');
    } else {
        console.error('Controlul cu id-ul ' + controlId + ' nu a fost găsit.');
    }
}
function verifRemoveRed(controlId){
    //debugger;    
    var control = document.getElementById(controlId);    
    if (control) {        
        control.classList.remove('red-box-shadow');
    } else {
        console.error('Controlul cu id-ul ' + controlId + ' nu a fost găsit.');
    }
}







