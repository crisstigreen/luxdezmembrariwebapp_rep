
//**********  PAGE LOAD ********************************************************************* */
//**********  PAGE LOAD ********************************************************************* */

document.addEventListener('DOMContentLoaded', async  () => {


    populateResponsabilDiv();
    debugger;
    const userList = ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Dani', 'Roxana'];
    generateCheckboxesItems(userList, "containerUsers");
    const statusList = [{name:'Nou local', id: 1}, 
                        {name:'Nou curier', id: 2}, 
                        {name:'Vandut in parc', id: 3},
                        {name:'Plecat pe Sameday', id: 4}, 
                        {name: 'Vandut pe Dragon', id: 5}];
    generateCheckboxesItems(statusList, "containerStatus");
});


//**********  GET ********************************************************************* */
//**********  GET ********************************************************************* */


function populateResponsabilDiv() {
    const url = `${API_BASE_URL}/Users`; // '${API_BASE_URL}/Users';
    
    return fetch(url) // Returnează promisiunea
        .then(response => {
            if (!response.ok) {
                throw new Error('Eroare la obținerea datelor de utilizatori');
            }
            return response.json();
        })
        .then(data => {
            debugger;

            const userList = [];
            data.forEach(item => {
                userList.push({ name: item.username, id: item.userId });                           
             });
            generateCheckboxesItems(userList, "containerUsers");
        })
        .catch(error => {
            console.error('Eroare:', error);
            document.getElementById('ddd_responsabil').innerText = 'A apărut o eroare la încărcarea datelor de utilizatori.';
        });
}


function generateCheckboxesItems(List, containerName) {
    debugger;
    const container = document.getElementById(containerName);
    container.innerHTML = ''; // Clear any existing content

    List.forEach((item) => {
        const checkboxItem = document.createElement('div');
        checkboxItem.className = 'checkbox-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `cb_${item.name}`;
        checkbox.value = item.id; // Set the value to the ID
        checkbox.setAttribute('onchange', 'preluareChange()'); // Adăugăm evenimentul onchange

        const label = document.createElement('label');
        label.htmlFor = `cb_${item.name}`;
        label.appendChild(document.createTextNode(item.name));

        checkboxItem.appendChild(checkbox);
        checkboxItem.appendChild(label);
        container.appendChild(checkboxItem);
    });
}
    

function preluareChange(){    
    debugger;

    afiseaza();


    
}

function getPreluareComandaUsers() {
    const checkboxes = document.querySelectorAll('#containerUsers .checkbox-item input[type="checkbox"]');
    let selectedTexts = [];
    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            selectedTexts.push(checkbox.value);
        }
    });
    return selectedTexts.join(', ');
}

function getPreluareComanda() {
    const checkboxes = document.querySelectorAll('.preluareDiv input[type="checkbox"]');
    let selectedTexts = [];
    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            selectedTexts.push(checkbox.parentElement.textContent.trim());
        }
    });
    return selectedTexts.join(', ');
}


function getStatus() {
    const checkboxes = document.querySelectorAll('#containerStatus .checkbox-item input[type="checkbox"]');
    let selectedTexts = [];
    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            //selectedTexts.push(checkbox.value);
            selectedTexts.push(checkbox.parentElement.textContent.trim());
        }
    });
    return selectedTexts.join(', ');
}



function afiseaza() {
    debugger;
    let preluareComanda = getPreluareComanda(); 
    let responsabil = getPreluareComandaUsers();
    let status = getStatus();
    
    const url = `${API_BASE_URL}/Orders/GetOrdersReport?PreluareComanda=${encodeURIComponent(preluareComanda)}&Responsabil=${encodeURIComponent(responsabil)}&Status=${encodeURIComponent(status)}`;
         
    fetch(url)
        .then(response => {
           
            
            if (!response.ok) {
                throw new Error('Eroare la obținerea datelor');
            }
            return response.json();
        })
        .then(data => {
            debugger;
            populateMainGrid(data);
        })
        .catch(error => {
            console.error('Eroare:', error);
            document.getElementById('rezultate-tabel').innerText = 'A apărut o eroare la căutarea pieselor.';
        });
}

function populateMainGrid(data){
    const rezultateTable = document.getElementById('rezultate-tabel');
    rezultateTable.innerHTML = ''; // Resetează tabela
    data.comenzi.forEach(order => {
        const piesaRow = `
            <tr data-id="${order.rowType}">
                <td>${order.rowType}</td>
                <td>${order.orderDate}</td>
                <td>${order.noulocal}</td>
                <td>${order.noucurier}</td>
                <td>${order.vandutinparc}</td>
                <td>${order.vandutpeDragon}</td>
                <td>${order.plecatpeSameday}</td>  
                <td>${order.total}</td>                               
            </tr>
        `;
        rezultateTable.innerHTML += piesaRow;
    });   
}

function verificaRanduriTabel() {
    const tabelBody = document.getElementById('rezultate-tabel');
    if (tabelBody.children.length > 0) {
        console.log('Tabelul conține rânduri.');
        return true; // Tabelul conține rânduri
    } else {
        console.log('Tabelul nu conține rânduri.');
        return false; // Tabelul nu conține rânduri
    }
}


