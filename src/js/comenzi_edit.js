
//**********  PAGE LOAD ********************************************************************* */
//**********  PAGE LOAD ********************************************************************* */

document.addEventListener('DOMContentLoaded', async  () => {
    await populateResponsabilDropdown(); 
    await fetchAndPopulateOrderData(); 
    fetchAndPopulateTable();
    fetchAndPopulateTableHistory();
});

var orderItems = [];


//**********  GET ********************************************************************* */
//**********  GET ********************************************************************* */

function fetchAndPopulateTableHistory() {
    const orderId = getQueryParam('id');
    if (!orderId) return;
    const url = `${API_BASE_URL}/OrdersHistory/GetOrdersHistory?OrderId=${orderId}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Eroare la obținerea datelor');
            }
            return response.json();
        })
        .then(data => {
            populateTableHistory(data);
            populateLastReg(data);
        })
        .catch(error => {
            console.error('Eroare:', error);
            document.getElementById('rezultate-istoric').innerText = 'A apărut o eroare la căutarea istoricului.';
        });
}




function populateLastReg(data){    
    debugger;
    if(data.length > 0){    
        document.getElementById("tb_ultimaModifData").value = data[data.length - 1].modifiedAt;
        document.getElementById("tb_ultimaModif").value = data[data.length - 1].operation;
        document.getElementById("tb_ultimaModifEmail").value = data[data.length - 1].email;
        document.getElementById("tb_ultimaModifId").value = data[data.length - 1].userName;
    }
}

function populateTableHistory(data) {
    return new Promise((resolve, reject) => {
        const rezultateTable = document.getElementById('rezultate-istoric');
        rezultateTable.innerHTML = ''; // Resetează tabela
        debugger;
        data.forEach(com => {
            const comRow = `
                <tr data-id="${com.id}">
                    <td>${com.orderId}</td>
                    <td>${com.operation}</td>                    
                    <td>${com.createdAt}</td>
                    <td>${com.userName}</td>
                    <td>${com.email}</td>
                    <td>${com.modifiedAt}</td>                                                                                                                      
                </tr>
            `;
            rezultateTable.innerHTML += comRow;
        });

        // Adaugă eveniment pentru butoanele de editare
        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', function (event) {
                event.preventDefault(); // Previne comportamentul implicit
                event.stopPropagation();
                const id = this.getAttribute('data-id');
                editItem(id); // Apelează funcția pentru a obține detaliile
            });
        });

        resolve();
    });
}


function fetchAndPopulateTable() {
    const orderId = getQueryParam('id');
    if (!orderId) return;
    const url = `${API_BASE_URL}/Orders/GetItemsByOrderId?OrderId=${orderId}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Eroare la obținerea datelor');
            }
            return response.json();
        })
        .then(data => {
            populateTable(data).then(() => {
                updateOrderItemsArrayFromTable();
            });
        })
        .catch(error => {
            console.error('Eroare:', error);
            document.getElementById('rezultate-tabel').innerText = 'A apărut o eroare la căutarea mașinilor.';
        });
}

function populateTable(data) {
    return new Promise((resolve, reject) => {
        const rezultateTable = document.getElementById('rezultate-tabel');
        rezultateTable.innerHTML = ''; // Resetează tabela

        data.forEach(com => {
            const comRow = `
                <tr data-id="${com.orderItemID}">
                    <td>${com.orderItemID}</td>
                    <td>${com.orderID}</td>
                    <td>${com.masina}</td>
                    <td>${com.piesaAuto}</td>
                    <td>${com.articolServiciu}</td>
                    <td>${com.quantity}</td>
                    <td>${com.unitPrice}</td>                         
                    <td>${com.discount}</td>    
                    <td>${com.pretFaraTVA}</td>    
                    <td>${com.vat}</td>    
                    <td>${com.total}</td>     
                    <td>
                        <button class="edit-button" data-id="${com.orderItemID}"><i class="fas fa-edit" style="font-size:14px"></i></button>
                    </td>                                                                  
                </tr>
            `;
            rezultateTable.innerHTML += comRow;
        });

        // Adaugă eveniment pentru butoanele de editare
        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', function (event) {
                event.preventDefault(); // Previne comportamentul implicit
                event.stopPropagation();
                const id = this.getAttribute('data-id');
                editItem(id); // Apelează funcția pentru a obține detaliile
            });
        });

        resolve();
    });
}


function updateOrderItemsArrayFromTable() {
    debugger;
    orderItems = [];
    const tableRows = document.querySelectorAll('#rezultate-tabel tr');
    tableRows.forEach(row => {
        const orderItem = {
            orderItemID: row.querySelector('td:nth-child(1)').textContent,
            orderId: row.querySelector('td:nth-child(2)').textContent,
            masina: row.querySelector('td:nth-child(3)').textContent,
            piesaAuto: row.querySelector('td:nth-child(4)').textContent,
            articolServiciu: row.querySelector('td:nth-child(5)').textContent,
            quantity: row.querySelector('td:nth-child(6)').textContent,
            unitPrice: row.querySelector('td:nth-child(7)').textContent,
            discount: row.querySelector('td:nth-child(8)').textContent,
            pretFaraTVA: row.querySelector('td:nth-child(9)').textContent,
            vat: row.querySelector('td:nth-child(10)').textContent,
            total: row.querySelector('td:nth-child(11)').textContent // Am corectat și indexul pentru total
        };
        orderItems.push(orderItem);
    });
}



function updateTableFromOrderItems() {
    const rezultateTable = document.getElementById('rezultate-tabel');
    rezultateTable.innerHTML = ''; // Resetează tabela

    orderItems.forEach(item => {
        const comRow = `
            <tr data-id="${item.orderItemID}">
                <td>${item.orderItemID}</td>
                <td>${item.orderID}</td>
                <td>${item.masina}</td>
                <td>${item.piesaAuto}</td>
                <td>${item.articolServiciu}</td>
                <td>${item.quantity}</td>                                
                <td>${item.unitPrice}</td>
                <td>${item.discount}</td>
                <td>${item.pretFaraTVA}</td>                               
                <td>${item.vat}</td>
                <td>${item.total}</td>
                <td>
                    <button class="edit-button" data-id="${item.orderItemID}"><i class="fas fa-edit" style="font-size:14px"></i></button>
                </td>
            </tr>
        `;
        rezultateTable.innerHTML += comRow;
    });

    // Adaugă eveniment pentru butoanele de editare
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault(); // Previne comportamentul implicit
            event.stopPropagation();
            const id = this.getAttribute('data-id');
            editItem(id); // Apelează funcția pentru a obține detaliile
        });
    });
}


function editItem(id) {
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');
    popupMessage.textContent = `Editare articol cu ID: ${id}`;
    popup.style.display = 'block';

    // Eveniment pentru închiderea popup-ului
    const closeButton = document.getElementById('close-popup');
    closeButton.addEventListener('click', function() {
        popup.style.display = 'none';
    });

    // Parcurge rândurile tabelului și găsește rândul cu ID-ul corespunzător
    const tableRows = document.querySelectorAll('#rezultate-tabel tr');
    debugger;
    tableRows.forEach(row => {
        const rowId = row.getAttribute('data-id');
        if (rowId == id) {   
            document.getElementById('tb_masinaEdit').value = row.querySelector('td:nth-child(3)').textContent;    //masina            
            document.getElementById('tb_piesaEdit').value = row.querySelector('td:nth-child(4)').textContent;     //piesa
            document.getElementById('tb_articolEdit').value = row.querySelector('td:nth-child(5)').textContent;   //articol
            document.getElementById('tb_cantitateEdit').value = row.querySelector('td:nth-child(6)').textContent; //cantitate
            document.getElementById('tb_pretEdit').value = row.querySelector('td:nth-child(7)').textContent;      //pret
            document.getElementById('tb_discountEdit').value = row.querySelector('td:nth-child(8)').textContent;  //discount
            document.getElementById('tb_pretFaraTVA').value = row.querySelector('td:nth-child(9)').textContent;  //pret fara tva
            document.getElementById('tb_vat').value = row.querySelector('td:nth-child(10)').textContent;          //vat   
            document.getElementById('tb_total').value = row.querySelector('td:nth-child(11)').textContent;          //vat   
        }
    });

    // Adaugă ID-ul articolului la butonul de salvare pentru a fi folosit mai târziu
    const saveButton = document.getElementById('bt_salveazaPiesa');
    saveButton.setAttribute('data-id', id);
}

function salveazaPiesa() {
    
    const id = document.getElementById('bt_salveazaPiesa').getAttribute('data-id');

    const tableRows = document.querySelectorAll('#rezultate-tabel tr');
    tableRows.forEach(row => {
        const rowId = row.getAttribute('data-id');
        if (rowId == id) {
            row.querySelector('td:nth-child(3)').textContent = document.getElementById('tb_masinaEdit').value;
            row.querySelector('td:nth-child(4)').textContent = document.getElementById('tb_piesaEdit').value;
            row.querySelector('td:nth-child(5)').textContent = document.getElementById('tb_articolEdit').value;            
            row.querySelector('td:nth-child(6)').textContent = document.getElementById('tb_cantitateEdit').value;
            row.querySelector('td:nth-child(7)').textContent = document.getElementById('tb_pretEdit').value;
            row.querySelector('td:nth-child(8)').textContent = document.getElementById('tb_discountEdit').value;
            row.querySelector('td:nth-child(9)').textContent = document.getElementById('tb_pretFaraTVA').value;
            row.querySelector('td:nth-child(10)').textContent = document.getElementById('tb_vat').value;
            row.querySelector('td:nth-child(11)').textContent = document.getElementById('tb_total').value;
        }
    });


    debugger;
    updateOrderItemsArrayFromTable();


    //updateTableFromOrderItems();


    document.getElementById('popup').style.display = 'none';
}

async function fetchAndPopulateOrderData() {
    const orderId = getQueryParam('id');
    if (!orderId) return;

    try {        
        const response = await fetch(`${API_BASE_URL}/Orders/GetById?OrderId=${orderId}`);
        if (!response.ok) {
            throw new Error('Eroare la obținerea datelor');
        }

        const data = await response.json();
        
        populateFields(data);
                                               
    } catch (error) {
        console.error('Eroare:', error);
        alert('A apărut o eroare la obținerea datelor mașinii.');
    }
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function populateResponsabilDropdown() {
    debugger;
    const url = `${API_BASE_URL}/Users/light`;    
    
    return fetch(url) // Returnează promisiunea
        .then(response => {
            if (!response.ok) {
                throw new Error('Eroare la obținerea datelor de utilizatori');
            }
            return response.json();
        })
        .then(data => {
            const responsabilDropdown = document.getElementById('ddd_responsabil');
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.userId;
                option.text = item.username;
                responsabilDropdown.add(option);
                //debugger;
            });
        })
        .catch(error => {
            console.error('Eroare:', error);
            document.getElementById('ddd_responsabil').innerText = 'A apărut o eroare la încărcarea datelor de utilizatori.';
        });
}

async function getCustomerByIdSync(Id) {
    //debugger;
    const url = `${API_BASE_URL}/Customer/${encodeURIComponent(Id)}`;
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

//populeaza celelalte campurile
async function populateFields(data) {
    document.getElementById('custId').value = data[0].customerID || '';
    document.getElementById('data_comanda').value = data[0].dataComanda || '';
    document.getElementById('tb_numeContact').value = data[0].numeContact || '';   
    const timeParts = data[0].oraComanda.split(':');
    const hours = timeParts[0];
    const minutes = timeParts[1];
    const timeValue = `${hours}:${minutes}`;
    const timeInput = document.getElementById('time_comanda');
    timeInput.value = timeValue;   
    debugger;       
    await setSelectedText('ddd_status', data[0].status);   
    if (data[0].status === "Comenzi pierdute/anulate"){        
        document.getElementById('lb_comandaAnulata').style.display = 'block';
    }
    else{
        document.getElementById('lb_comandaAnulata').style.display = 'none';
    }

    await setSelectedText('ddd_metodaPlata', data[0].metodaPlata);    
    await setSelectedText('ddd_livrare', data[0].metodaLivrare);      
    if(data[0].responsabil != null){ setSelectedValue('ddd_responsabil', data[0].responsabil.toString()); }    
    document.getElementById('tb_telefon').value = data[0].telefon || '';   
    document.getElementById('tb_email').value = data[0].email || '';       
    await setSelectedText('ddd_FacturaSC', data[0].facturaSC == true ? 'Da' : 'Nu' );       
    document.getElementById('tb_NumeSC').value = data[0].numeSC || ''; 
    document.getElementById('tb_CUI').value = data[0].cui || ''; 
    document.getElementById('tb_j').value = data[0].regComJ || ''; 
    document.getElementById('tb_adresaSC').value = data[0].adresaSC || ''; 
    document.getElementById('tb_adresaLivrare').value = data[0].adresa || ''; 
    document.getElementById('tb_mesaj').value = data[0].mesajComanda || ''; 

    document.getElementById('tb_valFaraTVA').value = data[0].valoareFaraTVA || ''; 
    document.getElementById('tb_valTVA').value = data[0].valoareTVA || ''; 
    document.getElementById('tb_valoareTotala').value = data[0].valoareTotala || ''; 
    setCheckboxByValue(data[0].preluareComanda);
   
}

function getPreluareComanda() {
    const checkboxes = document.querySelectorAll('.preluareDiv input[type="checkbox"]');
    let selectedText = null;
    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            selectedText = checkbox.parentElement.textContent.trim();
        }
    });
    return selectedText;
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


//Add masina
function registerCar() {    
    debugger;

     //debugger;
     if(verificare() == false){
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    var marca = document.getElementById("ddd_cars");
    var marcaText= marca.options[marca.selectedIndex].text;
    var model = document.getElementById("ddd_models");
    var modelText= model.options[model.selectedIndex].text;
    var gener = document.getElementById("ddd_generatii");
    var generText= gener.options[gener.selectedIndex].text;
    var numeCar = marcaText + ' ' + modelText + ' ' + generText;
    var combustibil = document.getElementById("ddd_combustibil");
    var combustibilText= combustibil.options[combustibil.selectedIndex].text;    
    var tractiune = document.getElementById("ddd_Tractiune");
    var tractiuneText= tractiune.options[tractiune.selectedIndex].text;    
    var tipCutie = document.getElementById("ddd_tipCutie");
    var tipCutieText= tipCutie.options[tipCutie.selectedIndex].text;
    var nrOrdine = parseInt(document.getElementById('tb_nrOrdine').value, 10);
    var an = parseInt(document.getElementById('tb_an').value, 10)  || -1;    
    var skU_ID = document.getElementById('tb_sku').value; 
    var discount = document.getElementById('tb_discount').value  || -1;
    var nrPiese = parseInt(document.getElementById('tb_nrPiese').value, 10)  || -1;
    var utl = document.getElementById('tb_utl').value;
    var km = document.getElementById('tb_km').value  || -1;

    var detalii = document.getElementById('tb_detalii').value;
    var codMotor = document.getElementById('tb_codMotor').value;
    var vin = document.getElementById('tb_vin').value;
    var capCil = document.getElementById('tb_capCil').value  || -1;
    

    var putere = document.getElementById('tb_putere').value  || -1;
    var nrLocuri = document.getElementById('tb_nrLocuri').value  || -1;
    var nrUsi = document.getElementById('tb_nrUsi').value  || -1;
    var alteDetalii = document.getElementById('tb_alteDetalii').value;

    var culoare = document.getElementById("ddd_culoare");
    var culoareText= culoare.options[culoare.selectedIndex].text; 

    var nrViteze = document.getElementById('tb_nrViteze').value  || -1;
    

     //tipVizibil
     var vizibil= document.getElementById("ddd_vizibil");
     var vizibilText= vizibil.options[vizibil.selectedIndex].text;

    const carData = {
        nume: numeCar,
        nrOrdine: nrOrdine,
        an: an,
        km: km,
        combustibil: combustibilText,
        tractiune: tractiuneText,
        transmisie: tipCutieText,
        skU_ID: skU_ID,        
        nrPiese: nrPiese,
        vizibilitate: vizibilText,        
        status: "",
        images: "",
        autovit: "",
        utl: utl,
        detalii: detalii,
        codMotor: codMotor,
        vin: vin,
        capacitCil: capCil,
        putere: putere,
        nrLocuri: nrLocuri,
        nrUsi: nrUsi,
        alteDetaliiTrans: alteDetalii,
        culoare: culoareText,
        discount: discount,
        nrViteze: nrViteze

    };
    debugger;
    const carId = getQueryParam('id');
    if(carId != null){
        updateCar(carId, carData)        
    }  
    else{
        insertCar(carData);    
    }
        
}




//**********  PUT ********************************************************************* */
//**********  PUT ********************************************************************* */

async function updateOrder() {          
    debugger;

        // Confirmarea ștergerii
        Swal.fire({
            title: 'Ești sigur?',
            text: 'Aceasta comanda va fi salvata!',
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Da, salveaza.'
        }).then((result) => {
            if (result.isConfirmed) {                           

                    var responsabil = document.getElementById("ddd_responsabil");
                    var responsabilText= responsabil.options[responsabil.selectedIndex].text;
                        
                    if(responsabilText == "-----"){
                        verif = false;
                        verifRed(responsabil.id);
                        return;
                    }  
                    
                    const orderId = getQueryParam('id');
                    var facturaSC = document.getElementById('ddd_FacturaSC').value == "Da" ? true : false;

                    //iau datele de customer
                    var numeContact = document.getElementById('tb_numeContact').value;
                    var phone = document.getElementById('tb_telefon').value;
                    var email = document.getElementById('tb_email').value;    
                    var address = document.getElementById('tb_adresaLivrare').value;
                    var facturaSC = facturaSC;
                    var numeSC = document.getElementById('tb_NumeSC').value;
                    var cui = document.getElementById('tb_CUI').value;
                    var regComJ = document.getElementById('tb_j').value;
                    var adresaSC = document.getElementById('tb_adresaSC').value;
                    
                    var custId = document.getElementById('custId').value;
                    //var exists = await getCustomerByIdSync(custId);

                    try {
                        const newCustomer = {
                            customerID : custId,
                            numeContact: numeContact,
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
                        };

                        const url = `${API_BASE_URL}/Customer/${custId}`;

                        // Trimite cererea PUT către API
                            fetch(url, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(newCustomer)
                            })                       
                            .then(result => {
                                //debugger;
                                const data = result.json();                        
                                customerID = document.getElementById('custId').value;
                                updateOrderFunc(customerID, orderId);
                                postOrderHistory(orderId);                                                               
                            })  
                        
                            
                                

                            
                    } catch (error) {
                        console.error('A apărut o eroare:', error);
                        // Poți adăuga o funcție pentru a arăta un mesaj de eroare
                        showErrorMessage(error.message);
                    }

    
    
        }
    });

}

async function updateOrderFunc(customerID, orderId) {
    debugger;
    var address = document.getElementById('tb_adresaLivrare').value;
    var facturaSC = document.getElementById('ddd_FacturaSC').value == "Da" ?  true : false;
    var detaliiComanda = document.getElementById('tb_mesaj').value;
    var status = document.getElementById("ddd_status");
    var statusText= status.options[status.selectedIndex].text;

    var OrderItems = [];

    
    for (let i = 0; i < orderItems.length; i++) {       
        const orderItem = {
            OrderItemID: orderItems[i].orderItemID,
            ProductType: "Piesa auto",
            ProductID: -1,
            Quantity: orderItems[i].quantity,
            UnitPrice: orderItems[i].unitPrice,
            TotalPrice: orderItems[i].total,
            Masina: orderItems[i].masina,
            PiesaAuto: orderItems[i].piesaAuto,
            Discount: orderItems[i].discount == "null" ? null : 0,
            VAT: orderItems[i].vat,
            ArticolServiciu: orderItems[i].articolServiciu
        };
        OrderItems.push(orderItem);
    }
    
              
    const orderToUpdate = {
        OrderId : orderId,
        customerID: customerID,       
        totalAmount: document.getElementById("tb_valoareTotala").value,
        status: statusText,
        shippingAddress: address,
        billingAddress: address,
        responsabil: document.getElementById('ddd_responsabil').value,
        metodaPlata: document.getElementById('ddd_metodaPlata').value,
        metodaLivrare: document.getElementById('ddd_livrare').value,
        facturaSC: facturaSC,
        mesajComanda: detaliiComanda,
        valoareFaraTVA: document.getElementById("tb_valoareTotala").value,
        valoareTVA: 19,
        preluareComanda: getPreluareComanda(),
        OrderItems        
    };
           
    updateOrderDefault(orderToUpdate);
}

async function postOrderHistory(orderId) {
    debugger;    
    var status = document.getElementById("ddd_status");
    var statusText= status.options[status.selectedIndex].text;
    const orderHistory = {
        orderId : orderId,
        operation: statusText,
        userId: sessionStorage.getItem('userId'),
        userName: sessionStorage.getItem('username'),
        email: ""
    };

    try {
        const url = `${API_BASE_URL}/OrdersHistory`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderHistory),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Eroare: ${errorData}`);
        }       
        debugger; 
        showUpdateSuccessMessage();
        await populateResponsabilDropdown(); 
        await fetchAndPopulateOrderData(); 
        fetchAndPopulateTable();
        fetchAndPopulateTableHistory(); 
    } catch (error) {
        console.error("A apărut o eroare la actualizarea comenzii:", error);
        alert("A apărut o eroare la actualizarea comenzii: " + error.message);
    }
}

async function updateOrderDefault(order) {
    try {
        const url = `${API_BASE_URL}/Orders/updateOrder`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(order),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Eroare: ${errorData}`);
        }        
        showUpdateSuccessMessage();
        await populateResponsabilDropdown(); 
        await fetchAndPopulateOrderData(); 
        fetchAndPopulateTable();
    } catch (error) {
        console.error("A apărut o eroare la actualizarea comenzii:", error);
        alert("A apărut o eroare la actualizarea comenzii: " + error.message);
    }
}




//**********  OTHER ********************************************************************* */
//**********  OTHER ********************************************************************* */

/* tabs */
function openTab(evt, tabName) {
    debugger;
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

//checkbox olx stuff
function toggleCheckbox(checkbox) {
    const checkboxes = document.querySelectorAll('.preluareDiv input[type="checkbox"]');
    
    // Dacă checkbox-ul apăsat devine checked
    if (checkbox.checked) {
        // Debifează toate celelalte checkbox-uri
        checkboxes.forEach((cb) => {
            if (cb !== checkbox) {
                cb.checked = false;
            }
        });
    } else {
        // Dacă checkbox-ul apăsat devine unchecked, debifează toate checkbox-urile
        checkboxes.forEach((cb) => {
            cb.checked = false;
        });
    }
}


async function setSelectedText(selectId, value) {  
    //debugger;
    const selectElement = document.getElementById(selectId);
    const options = selectElement.options;

    for (let i = 0; i < options.length; i++) {
        if (options[i].text === value) {
            selectElement.selectedIndex = i;
            break;
        }
    }
} 

async function setSelectedValue(selectId, value) {    
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
    //debugger;
    verif = true;
    var marca = document.getElementById("ddd_cars");
    var marcaText= marca.options[marca.selectedIndex].text;
    var model = document.getElementById("ddd_models");
    var modelText= model.options[model.selectedIndex].text;
    var gener = document.getElementById("ddd_generatii");
    var generText= gener.options[gener.selectedIndex].text;

    
    if(marcaText == "Marca"){
        verif = false;
        verifRed(marca.id);
    }    
    else if(modelText == "Model"){
        verif = false;
        verifRed(model.id);
    }  
    else if(generText == "Generație"){
        verif = false;
        verifRed(gener.id);
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