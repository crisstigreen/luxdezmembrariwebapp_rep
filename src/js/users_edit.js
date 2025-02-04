
//**********  PAGE LOAD ********************************************************************* */
//**********  PAGE LOAD ********************************************************************* */

document.addEventListener('DOMContentLoaded', async  () => {        
    fetchAndPopulateTable();
});

var orderItems = [];


//**********  GET ********************************************************************* */
//**********  GET ********************************************************************* */

function fetchAndPopulateTable() {
    debugger;
    const userId = getQueryParam('id');
    if (!userId) return;
    const url = `${API_BASE_URL}/Users/async/${userId}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Eroare la obținerea datelor');
            }
            return response.json();
        })
        .then(data => {
            //debugger;
            populateFields(data);
        })
        .catch(error => {
            console.error('Eroare:', error);
            document.getElementById('rezultate-tabel').innerText = 'A apărut o eroare la căutarea mașinilor.';
        });
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

async function populateFields(data) {
    debugger;
    document.getElementById('tb_username').value = data.username || '';
    document.getElementById('tb_email').value = data.email || '';
    document.getElementById('tb_pass').value = data.passwordHash || '';  
    document.getElementById('tb_Nume').value = data.firstName || ''; 
    document.getElementById('tb_prenume').value = data.lastName || ''; 
    document.getElementById('tb_phone').value = data.phoneNumber || '';  
    await setSelectedValueToValue('ddd_activ', data.isActive.toString());  
    await setSelectedValueToValue('ddd_emailConfirm', data.isEmailConfirmed.toString());     
    await setSelectedValueToValue('ddd_rol', data.roleID.toString());   
    document.getElementById('data_created').value = data.createdDate;
    document.getElementById('data_lastLog').value = data.lastLoginDate;
    document.getElementById('data_lastPassChanged').value = data.lastPasswordChangeDate;
    document.getElementById('data_lockout').value = data.lockoutEndDate;

}

function setCheckboxByValue(value) {
    const checkboxes = document.querySelectorAll('.preluareDiv input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
        const labelText = checkbox.parentElement.textContent.trim();
        if (labelText === value) {
            checkbox.checked = true;
        } else {
            checkbox.checked = false;
        }
    });
}

//**********  POST ********************************************************************* */
//**********  POST ********************************************************************* */





//**********  PUT ********************************************************************* */
//**********  PUT ********************************************************************* */

async function updateUser() {          

        debugger;
            if(verificare() == false){
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        Swal.fire({
            title: 'Ești sigur?',
            text: 'Acest user va fi salvata!',
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Da, salveaza.'
        }).then((result) => {
            if (result.isConfirmed) {                           
                    debugger;                                    
                    const userId = getQueryParam('id');
                    var username = document.getElementById('tb_username').value;
                    var email = document.getElementById('tb_email').value;
                    var pass = document.getElementById('tb_pass').value;    
                    var nume = document.getElementById('tb_Nume').value;
                    var prenume = document.getElementById('tb_prenume').value;
                    var phone = document.getElementById('tb_phone').value;
                    var activ = document.getElementById("ddd_activ");
                    var activValue= activ.options[activ.selectedIndex].value;
                    var emailConf = document.getElementById("ddd_emailConfirm");
                    var emailConfValue= emailConf.options[emailConf.selectedIndex].value;

                    var rol = document.getElementById("ddd_rol");
                    var rolValue = rol.options[rol.selectedIndex].value;


                    var created = document.getElementById("data_created");
                    var createdText = created.value;
                    var lastLog = document.getElementById("data_lastLog");
                    var lastLogText = lastLog.value;
                    var lastPassChanged = document.getElementById("data_lastPassChanged");
                    var lastPassChangedText = lastPassChanged.value;
                    var lockout = document.getElementById("data_lockout");
                    var lockoutText = lockout.value;
                                                                                               
                    try {

                        
                 /*        const editUser = {
                            userId : userId,
                            username: username,
                            passwordHash: pass,
                            email: email,                         
                            firstName:  nume,
                            lastName: prenume,
                            phoneNumber: phone,
                            createdDate:  createdText,
                            LastLoginDate: lastLogText,
                            isActive: JSON.parse(activValue) ,
                            isEmailConfirmed: JSON.parse(emailConfValue) ,   
                            LastPasswordChangeDate: lastPassChangedText,
                            LockoutEndDate:lockoutText,                        
                            failedLoginAttempts: 2,
                            roleID: rolValue    
                        }; */

                        const editUser = {
                            userId: userId,
                            username: username,
                            passwordHash: pass,
                            email: email,
                            firstName: nume,
                            lastName: prenume,
                            phoneNumber: phone,
                            createdDate: createdText,
                            lastLoginDate: lastLogText,
                            isActive: JSON.parse(activValue),
                            isEmailConfirmed: JSON.parse(emailConfValue),
                            lastPasswordChangeDate: lastPassChangedText,
                            failedLoginAttempts: 2,
                            lockoutEndDate: lockoutText,
                            roleID: rolValue
                        };

                        
                        
                        if(userId != null){
                            const url = `${API_BASE_URL}/UsersEdit/${userId}?roleId=${rolValue}`;                        
                           
                            try {
                                fetch(url, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(editUser)
                                })
                                .then(response => {
                                    if (!response.ok) {
                                        // Dacă răspunsul nu este OK, extragem mesajul de eroare și aruncăm o eroare
                                        return response.text().then(errorMessage => {
                                            throw new Error(errorMessage);
                                        });
                                    }
                                    else{
                                        showUpdateSuccessMessage();
                                    }     
                                })
                                .then(data => {
                                    // Aici gestionăm succesul
                                    showUpdateSuccessMessage();
                                })
                                .catch(error => {
                                    // Gestionăm erorile aruncate în blocul then sau de rețea
                                    showErrorMessage(error.message);
                                });
                            } catch (error) {
                                // Gestionăm orice eroare care s-ar putea întâmpla în afara fetch-ului
                                showErrorMessage(error.message);
                            }                               
                        }
                       
                        
                    
                            
                                

                            
                    } catch (error) {
                        console.error('A apărut o eroare:', error);
                        // Poți adăuga o funcție pentru a arăta un mesaj de eroare
                        showErrorMessage(error.message);
                    }

    
    
        }
    });

}




//**********  OTHER ********************************************************************* */
//**********  OTHER ********************************************************************* */

/* tabs */
function openTab(evt, tabName) {
    //debugger;
    var i, tabcontent, tabbuttons;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tabbuttons = document.getElementsByClassName("tab-button");
    for (i = 0; i < tabbuttons.length; i++) {
        tabbuttons[i].className = tabbuttons[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

document.addEventListener("DOMContentLoaded", function() {
    document.querySelector(".tab-button").click();
});

async function setSelectedValueToValue(selectId, value) {
    const selectElement = document.getElementById(selectId);
    const options = selectElement.options;

    for (let i = 0; i < options.length; i++) {
        if (options[i].value === value) {
            selectElement.selectedIndex = i;
            break;
        }
    }
}  



function verificare(){
    debugger;
    verif = true;
    var activ = document.getElementById("ddd_activ");
    var activText= activ.options[activ.selectedIndex].text;
    var rol = document.getElementById("ddd_rol");
    var rolText= rol.options[rol.selectedIndex].text;
    var emailConfirm = document.getElementById("ddd_emailConfirm");
    var emailConfirmText= emailConfirm.options[emailConfirm.selectedIndex].text;


   
    if(activText == "-----"){
        verif = false;
        verifRed(activ.id);
    }    
    else if(rolText == "-----"){
        verif = false;
        verifRed(rol.id);
    }  
    else if(emailConfirmText == "-----"){
        verif = false;
        verifRed(emailConfirm.id);
    }        

    
    return verif;
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
    debugger;
    var control = document.getElementById(controlId);    
    if (control) {        
        control.classList.remove('red-box-shadow');
    } else {
        console.error('Controlul cu id-ul ' + controlId + ' nu a fost găsit.');
    }
}

function renunta(){
    window.close();
}

function showUpdateSuccessMessage() {
    Swal.fire({
        title: 'Success!',
        text: 'Update operation completed successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
    });
}

function showInsertSuccessMessage() {
    Swal.fire({
        title: 'Success!',
        text: 'Insert operation completed successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
    });
}

function showUpdateSuccessMessage() {
    Swal.fire({
        title: 'Success!',
        text: 'Update operation completed successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
    });
}

function stergePiesa(){  
    const popup = document.getElementById('popup');
    popup.style.display = 'none';                    
}