
//**********  PAGE LOAD ********************************************************************* */
//**********  PAGE LOAD ********************************************************************* */


document.addEventListener('DOMContentLoaded', async function() {
    //debugger;
    await GetTVA();
    populateOrderTable();    
});
var customerID = 0;
var address = "";
var orderItems = [];
let totalSum = 0;
let pretFaraTVA = 0;
var vat = 0;

//**********  GET ********************************************************************* */
//**********  GET ********************************************************************* */


//functii de populare campuri
async function GetPretFaraTVA(pret) {
    const url = `${API_BASE_URL}/InfoCars/PretFaraTva?pretCuTVA=${encodeURIComponent(pret)}`;
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Eroare la obținerea articolelor din coș');
            }
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            document.getElementById('rezultate-tabel').innerText = 'A apărut o eroare la obținerea articolelor din coș.';
            throw error;
        });
}


//functii de populare campuri
async function GetTVA() {    
    const url = `${API_BASE_URL}/InfoCars/GetTVA`;
    
    try {
        const response = await fetch(url); // Așteaptă răspunsul
        if (!response.ok) {
            throw new Error('Eroare la obținerea datelor de TVA');
        }
        const data = await response.json(); // Așteaptă conversia în JSON
        vat = data[0].rata; // Presupunem că rata TVA este pe primul element
    } catch (error) {
        console.error('Eroare:', error);
        document.getElementById('ddd_combustibil').innerText = 'A apărut o eroare la încărcarea datelor de combustibil.';
    }
}


//populate grid
function populateOrderTable() {
    debugger;
    const items = getCartItems(); // Assuming getCartItems() returns the current items in the cart
    const tableBody = document.querySelector('.site-block-order-table tbody');
    tableBody.innerHTML = ''; // Clear existing content
        
    items.forEach(item => {
        const row = document.createElement('tr');

        const imgSrc = item.imageUrl ? item.imageUrl : 'images/placeholder.jpg';

        row.innerHTML = `            
            <td>
                <img src="${item.imagini}" alt="${item.name}" class="img-thumbnail" style="height: 100px;">
            </td>
            <td class='checkoutProd'>
                ${item.quantity} <strong class="mx-2">x</strong> ${item.name}
            </td>
            
            <td class='checkoutProd'>${item.pretTotal.toFixed(2)} RON</td>
        `;
        tableBody.appendChild(row);
        //debugger;

        orderItems.push({
            orderID: 0, 
            productType: "piesa", 
            productID: item.id, 
            quantity: item.quantity,
            unitPrice: item.pretTotal / item.quantity, //pret fara tva
            totalPrice: item.pretTotal,
            masina: item.masina,
            piesaAuto: item.name,
            articolServiciu: item.name + " " + item.masina,
            vat: vat 
        });

        totalSum += item.pretTotal;
    });

    // Add total row
    const totalRow = document.createElement('tr');
    totalRow.innerHTML = `
        <td></td>
        <td class="text-black font-weight-bold checkoutTotal"><strong>Total</strong></td>
        <td class="text-black font-weight-bold checkoutTotal"><strong>${totalSum.toFixed(2)} RON</strong></td>
    `;
    tableBody.appendChild(totalRow);    
}

//get customer by email
async function getCustomerByEmailSync(email) {
    //debugger;
    const url = `${API_BASE_URL}/CustomerVerif/email/${encodeURIComponent(email)}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Client negasit');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        document.getElementById('rezultate-tabel').innerText = 'A apărut o eroare.';
        throw error;
    }
}

//validari
function verificare(){
    //debugger;
    verif = true;
    var nume = document.getElementById("tb_nume");
    var prenume = document.getElementById("tb_prenume");
    var adresa = document.getElementById("tb_adresa");
    var email = document.getElementById("tb_email");
    var phone = document.getElementById("tb_telefon");
    

    
    if(nume.value == ""){
        verif = false;
        verifRed(nume.id);
    }    
    else if(prenume.value == ""){
        verif = false;
        verifRed(prenume.id);
    }  
    else if(adresa.value == ""){
        verif = false;
        verifRed(adresa.id);
    } 
    else if(email.value == ""){
        verif = false;
        verifRed(email.id);
    }   
    else if(phone.value == ""){
        verif = false;
        verifRed(phone.id);
    }          


    
    return verif;
}

//Get Cart items from local storage
function getCartItems() {
    let items = localStorage.getItem('cartItems');
    if (items) {
        return JSON.parse(items);
    } else {
        return [];
    }
}



//**********  POST ********************************************************************* */
//**********  POST ********************************************************************* */


function registerOrder() {
    debugger;    
        if(verificare() == false){
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }
    insertCustomerAndOrder();

             
}

async function insertCustomerAndOrder() {
    debugger;
    var firstName = document.getElementById('tb_nume').value;
    var lastName = document.getElementById('tb_prenume').value;
    var phone = document.getElementById('tb_telefon').value;
    var email = document.getElementById('tb_email').value;    
    var address = document.getElementById('tb_adresa').value;


    var facturaSC = document.getElementById('cb_facturaSC').checked;
    var numeSC = document.getElementById('tb_numeSC').value;
    var cui = document.getElementById('tb_cui').value;
    var regComJ = document.getElementById('tb_regComJ').value;
    var adresaSC = document.getElementById('tb_adresaSC').value;


    try {
        var exists = await getCustomerByEmailSync(email);

        if (exists == -1) {
            const newCustomer = {
                numeContact: firstName + " " + lastName,
                telefon: phone,
                email: email,
                adresa: address,  
                facturaSC: facturaSC,
                numeSC: numeSC,
                cui: cui,
                regComJ: regComJ,
                adresaSC: adresaSC,                
                createdAt: new Date().toISOString(), // Folosește data curentă
                updatedAt: new Date().toISOString(), // Folosește data curentă   
                userId: sessionStorage.getItem('userId')                             
            };

            const url = `${API_BASE_URL}/Customer`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCustomer)
            });

            if (!response.ok) {
                throw new Error('Eroare la înregistrarea clientului');
            }

            const data = await response.json();
            console.log('Clientul a fost înregistrat cu succes:', data);
            debugger;
            customerID = data.customerID;
            insertOrder(customerID, -1);
        } else {
            insertOrder(exists, -1);
        }
    } catch (error) {
        console.error('A apărut o eroare:', error);
        // Poți adăuga o funcție pentru a arăta un mesaj de eroare
        showErrorMessage(error.message);
    }
}
async function insertOrder(customerID, id) {
    debugger;
    var address = document.getElementById('tb_adresa').value;
    var facturaSC = document.getElementById('cb_facturaSC').checked;
    var detaliiComanda = document.getElementById('tb_detalii').value;
    var x = await GetPretFaraTVA(totalSum);
    pretFaraTVA = x.pretFaraTVA;

    const newOrder = {
        customerID: customerID,
        orderDate: new Date().toISOString(), // Folosește data curentă        
        totalAmount: totalSum,
        status: "Nou local",
        shippingAddress: address,
        billingAddress: address,
        metodaPlata: document.querySelector('input[name="plata"]:checked').value,
        metodaLivrare: document.querySelector('input[name="livrare"]:checked').value,
        facturaSC: facturaSC,
        mesajComanda: detaliiComanda,
        valoareFaraTVA: pretFaraTVA,
        valoareTVA: vat,
        orderItems        
    };

    try {

        const url = `${API_BASE_URL}/Orders`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newOrder)
        });

        if (!response.ok) {
            throw new Error(`Eroare la crearea comenzii: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Comanda a fost creată cu succes:', data);
        localStorage.clear(); 
        window.location='thankyou.html';          
    } catch (error) {
        console.error('A apărut o eroare:', error);        
        showErrorMessage(error.message);
        throw error;
    }
}


//**********  PUT ********************************************************************* */
//**********  PUT ********************************************************************* */

function updateOrder(id, order){

    debugger;
    const url = `${API_BASE_URL}/Piese/${id}`;

    // Adaugă id-ul în obiectul carData pentru a se potrivi cu cerințele API-ului
    piesa.Id = id;

    // Trimite cererea PUT către API
    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(piesa)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Eroare la actualizarea mașinii');
        }        
        return response.text(); // API-ul returnează NoContent, deci nu va fi JSON
    })
    .then(result => {
        debugger;
        showUpdateSuccessMessage();    
    })  
}


function updateStocPiesa(id, cantitate) {
    debugger;
    const url = `${API_BASE_URL}/Piese/UpdateStoc/${id}`;

    // Obiectul de cerere care conține cantitatea de scăzut din stoc
    const requestData = cantitate;

    // Trimite cererea PUT către API
    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.text().then(text => ({ ok: response.ok, text })))
    .then(({ ok, text }) => {
        if (ok) {
            showUpdateSuccessMessage();
        } else {
            showErrorMessage(text);
        }
    })
    .catch(error => {
        console.error('Eroare:', error);
        showErrorMessage('A apărut o eroare la actualizarea stocului piesei.');
    });
}


//**********  OTHER ********************************************************************* */
//**********  OTHER ********************************************************************* */


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

function showUpdateSuccessMessage() {
        localStorage.clear(); 
        window.location='shop.html';
      window.location='thankyou.html';     
}

function showErrorMessage(message) {
    alert('A apărut o eroare: ' + message);
}
