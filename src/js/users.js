document.addEventListener('DOMContentLoaded', () => {
    updateResultsTable();
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
    debugger;
    const url = `${API_BASE_URL}/Users/full`;
    
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

            data.forEach(com => {
                debugger;                
                const comRow = `
                    <tr data-id="${com.userId}">
                        <td>${com.userId}</td>
                        <td>${com.username}</td>
                        <td>${com.email}</td>
                        <td>${com.isActive}</td>                         
                        <td>${com.isEmailConfirmed}</td>       
                        <td>${com.lastLoginDate}</td>     
                        <td>${com.lastPasswordChangeDate}</td>     
                        <td>${com.lockoutEndDate}</td>                      
                                                                                        
                        <td>
                            <button class="edit-button" data-id="${com.userId}"><i class="fas fa-edit" style="font-size:14px"></i></button>
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
                    get_details(id); // Apelează funcția pentru a obține detaliile
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


function updatePaginationControls() {
    document.getElementById('page-info').innerText = `Page ${currentPage} of ${totalPages}`;
    document.getElementById('prev-page').disabled = currentPage <= 1;
    document.getElementById('next-page').disabled = currentPage >= totalPages;
}

function changePage(delta) {
    if ((delta === -1 && currentPage > 1) || (delta === 1 && currentPage < totalPages)) {
        currentPage += delta;
        updateResultsTable();
       // window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function changePageSize() {
    pageSize = parseInt(document.getElementById('page-size').value);
    currentPage = 1; // Resetăm la prima pagină
    updateResultsTable();
}

function changeOrderBy() {
    debugger;
    orderTerm = document.getElementById('order_term').value;    
    updateResultsTable();
}


//**********  cautare ********************************************************************* */

let searchTerm = ''; // Variabilă pentru a stoca termenul de căutare


document.getElementById('cautaBtn').addEventListener('click', () => {
    debugger;
    searchTerm = document.getElementById('tb_cauta').value.trim();
    currentPage = 1; // Resetăm la prima pagină
    updateResultsTable(); // Apelează funcția de căutare
});


document.getElementById('tb_cauta').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchTerm = event.target.value.trim();
        currentPage = 1; // Resetăm la prima pagină
        updateResultsTable(); // Apelează funcția de căutare
    }
});



async function get_details(id) {
    debugger;    
    if (id) {

        const url = `users_edit.html?id=${id}`;
        window.open(url, '_blank');                
    } else {
        //document.getElementById('detaliiPiesa').innerText = 'Piesa nu a fost găsită.';
    }
}


//buton cauta
document.getElementById('adaugaBtn').addEventListener('click', function () {        
    const url = `users_edit.html`;
    window.open(url, '_blank');
});