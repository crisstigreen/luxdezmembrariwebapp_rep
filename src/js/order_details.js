
//**********  PAGE LOAD ********************************************************************* */
//**********  PAGE LOAD ********************************************************************* */

document.addEventListener('DOMContentLoaded', async  () => {
    await fetchAndPopulateOrderData(); 
    fetchAndPopulateTable();
});


//**********  GET ********************************************************************* */
//**********  GET ********************************************************************* */

async function fetchAndPopulateOrderData() {
    //debugger;
    const orderId = getQueryParam('orderId');
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

//populeaza celelalte campurile
async function populateFields(data) {
    debugger;   
    document.getElementById('orderId').textContent = data[0].orderID || '';   
    document.getElementById('orderDate').textContent = data[0].dataComanda || '';  
    document.getElementById('customerName').textContent = data[0].numeContact || '';  
    document.getElementById('deliveryAddress').textContent = data[0].adresa || '';  
    document.getElementById('totalAmount').textContent = data[0].valoareTotala || '';   
}



function fetchAndPopulateTable() {
    const orderId = getQueryParam('orderId');
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


