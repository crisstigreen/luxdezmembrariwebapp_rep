document.addEventListener('DOMContentLoaded', () => {
    //updateResultsTable();
    fetchOrders();
    document.getElementById('prev-page').addEventListener('click', () => changePage(-1));
    document.getElementById('next-page').addEventListener('click', () => changePage(1));
    document.getElementById('page-size').addEventListener('change', () => changePageSize());
    document.getElementById('order_term').addEventListener('change', () => changeOrderBy());
});

let currentPage = 1;
let totalPages = 1;
let pageSize = 100; // Valoarea implicită
let orderTerm = 'ASC'; // Implicit


function updateResultsTable() {
    //debugger;
    var userId = sessionStorage.getItem('userId');
    const url = `${API_BASE_URL}/Orders/searchByUserId?SearchTerm=${encodeURIComponent(searchTerm)}&PageNumber=${encodeURIComponent(currentPage)}&PageSize=${encodeURIComponent(pageSize)}&UserId=${userId}&OrderBy=${encodeURIComponent(orderTerm)}`;
    
    // Afișează loaderul
    Swal.fire({
        title: 'Loading...',
        text: 'Please wait while we fetch the data.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Eroare la obținerea datelor');
            }
            return response.json();
        })
        .then(data => {
            debugger;
            const rezultateTable = document.getElementById('rezultate-tabel');
            rezultateTable.innerHTML = ''; // Resetează tabela

            data.comenzi.forEach(com => {
                const articoleFormatted = com.articole.replace(/, /g, '<br>');
                const totalAmountFormatted = com.totalAmount.replace(/, /g, '<br>');
                debugger;
                const comRow = `
                    <tr data-id="${com.orderID}">

                        <td>${com.orderID}</td>
                        <td>${com.orderDate}</td>
                        <td>${com.status}</td>
                        <td>${com.numeContact}</td>                         
                        <td>${com.email}</td>                        
                        <td>${articoleFormatted}</td>
                        <td>${totalAmountFormatted}</td>
                        <td>${com.quantity}</td>                        
                        <td>
                            <button class="edit-button" data-id="${com.orderID}"><i class="fas fa-edit" style="font-size:14px"></i></button>
                        </td>
                    </tr>
                `;
                rezultateTable.innerHTML += comRow;
            });

            totalPages = data.totalPages; // Actualizează totalPages 
            updatePaginationControls(); // Actualizează controalele de paginare

            // Adaugă eveniment pentru butoanele de editare
            document.querySelectorAll('.edit-button').forEach(button => {
                button.addEventListener('click', function (event) {
                    event.stopPropagation();
                    const id = this.getAttribute('data-id');
                   // get_details(id); // Apelează funcția pentru a obține detaliile
                });
            });

            // Întârzierea închiderii loader-ului
            setTimeout(() => {
                Swal.close(); // Închide loader-ul
            }, 200); // Rămâne deschis pentru 200 ms

        })
        .catch(error => {
            console.error('Eroare:', error);
            document.getElementById('rezultate-tabel').innerText = 'A apărut o eroare la căutarea mașinilor.';
        });
}

//new
async function fetchOrders() {
    try {
        debugger;
        var userId = sessionStorage.getItem('userId');
        const response = await fetch(`${API_BASE_URL}/Orders/searchByUserId?SearchTerm=${encodeURIComponent(searchTerm)}&PageNumber=${encodeURIComponent(currentPage)}&PageSize=${encodeURIComponent(pageSize)}&UserId=${userId}&OrderBy=${encodeURIComponent(orderTerm)}`); // Schimbă cu URL-ul tău
        const orders = await response.json();
        populateOrders(orders.comenzi);
    } catch (error) {
        console.error('Eroare la preluarea comenzilor:', error);
    }
}


function populateOrders(orders) {
    const orderContainer = document.getElementById('orderContainer');
    orderContainer.innerHTML = ''; // Resetează div
    orders.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.className = 'order';

        // Zona pentru articole și totalAmount
        const orderDetailsDiv = document.createElement('div');
        orderDetailsDiv.className = 'order-details';
        const orderTitle = document.createElement('h5');
        const orderLink = document.createElement('a');
        orderLink.href = `order-details.html?orderId=${order.orderID}`;
        orderLink.target = '_blank';
        orderLink.textContent = order.articole;
        orderTitle.appendChild(orderLink);
        orderDetailsDiv.appendChild(orderTitle);
        
        // Zona pentru Cantitate
        const orderQuantity = document.createElement('p');
        const boldQuantityLabel = document.createElement('strong');
        boldQuantityLabel.textContent = 'Cantitate: ';
        const quantityValue = document.createElement('span');
        quantityValue.textContent = order.quantity;  // Valorile vor fi îngroșate și verzi
        orderQuantity.appendChild(boldQuantityLabel);
        orderQuantity.appendChild(quantityValue);
        orderDetailsDiv.appendChild(orderQuantity);

        // Zona pentru orderDate și totalAmount
        const orderInfoDiv = document.createElement('div');
        orderInfoDiv.className = 'order-info';

        // Crearea pentru Data comenzii
        const orderDate = document.createElement('p');
        const date = new Date(order.orderDate);
        const datePart = date.toLocaleDateString('ro-RO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const timePart = date.toLocaleTimeString('ro-RO', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        const boldOrderDateLabel = document.createElement('strong');
        boldOrderDateLabel.textContent = 'Data comenzii: ';
        const orderDateText = document.createElement('span');
        orderDateText.textContent = `${datePart} : ${timePart}`; // Valorile vor fi îngroșate și verzi
        orderDate.appendChild(boldOrderDateLabel);
        orderDate.appendChild(orderDateText);
        orderInfoDiv.appendChild(orderDate);

        // Crearea pentru Total
        const orderAmount = document.createElement('p');
        const boldOrderAmountLabel = document.createElement('strong');
        boldOrderAmountLabel.textContent = 'Total: ';
        const orderAmountText = document.createElement('span');
        orderAmountText.textContent = `${order.totalAmount} lei`; // Valorile vor fi îngroșate și verzi
        orderAmount.appendChild(boldOrderAmountLabel);
        orderAmount.appendChild(orderAmountText);
        orderInfoDiv.appendChild(orderAmount);

        // Adaugă div-urile create la containerul principal
        orderDiv.appendChild(orderDetailsDiv);
        orderDiv.appendChild(orderInfoDiv);
        orderContainer.appendChild(orderDiv);
    });
}












function updatePaginationControls() {
    document.getElementById('page-info').innerText = `Page ${currentPage} of ${totalPages}`;
    document.getElementById('prev-page').disabled = currentPage <= 1;
    document.getElementById('next-page').disabled = currentPage >= totalPages;
}

function changePage(delta) {
    if ((delta === -1 && currentPage > 1) || (delta === 1 && currentPage < totalPages)) {
        currentPage += delta;
        //updateResultsTable();
        fetchOrders();
       // window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function changePageSize() {
    debugger;
    pageSize = parseInt(document.getElementById('page-size').value);
    currentPage = 1; // Resetăm la prima pagină
    //updateResultsTable();
    fetchOrders();
}

function changeOrderBy() {
    debugger;
    orderTerm = document.getElementById('order_term').value;    
    //updateResultsTable();
    fetchOrders();
}


//**********  cautare ********************************************************************* */

let searchTerm = ''; // Variabilă pentru a stoca termenul de căutare


document.getElementById('cautaBtn').addEventListener('click', () => {
    debugger;
    searchTerm = document.getElementById('tb_cauta').value.trim();
    currentPage = 1; // Resetăm la prima pagină
    //updateResultsTable(); // Apelează funcția de căutare
    fetchOrders();
});


document.getElementById('tb_cauta').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchTerm = event.target.value.trim();
        currentPage = 1; // Resetăm la prima pagină
        //updateResultsTable(); // Apelează funcția de căutare
        fetchOrders();
    }
});



async function get_details(id) {
    debugger;    
    if (id) {

        const url = `comenzi_edit.html?id=${id}`;
        window.open(url, '_blank');                
    } else {
        //document.getElementById('detaliiPiesa').innerText = 'Piesa nu a fost găsită.';
    }
}


