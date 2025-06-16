
//load event 
document.addEventListener('DOMContentLoaded', () => {
    updateResultsTable();

    document.getElementById('prev-page').addEventListener('click', () => changePage(-1));
    document.getElementById('next-page').addEventListener('click', () => changePage(1));
    document.getElementById('page-size').addEventListener('change', () => changePageSize());
    document.getElementById('order_term').addEventListener('change', () => changeOrderBy());

    fetch('/admin/menu.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('menu-placeholder').innerHTML = data;
        });
});


let currentPage = 1;
let totalPages = 1;
let pageSize = 100; // Valoarea implicită
let orderTerm = 'ASC'; // Implicit


let searchTerm = ''; // Variabilă pentru a stoca termenul de căutare


function updateResultsTable() {
    
    const url = `${API_BASE_URL}/Anvelope/searchAnvelope?SearchTerm=${encodeURIComponent(searchTerm)}&PageNumber=${encodeURIComponent(currentPage)}&PageSize=${encodeURIComponent(pageSize)}&OrderBy=${encodeURIComponent(orderTerm)}`;

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
            const rezultateTable = document.getElementById('rezultate-tabel');
            rezultateTable.innerHTML = ''; // Resetează tabela
            debugger;
            data.anvelope.forEach(anvelopa => {
                const anvelopaRow = `
                    <tr data-id="${anvelopa.id}">
                        <td>${anvelopa.id}</td>
                        <td>${anvelopa.tipProdus}</td>
                        <td>${anvelopa.stare}</td>
                        <td>${anvelopa.sezon || ''}</td>
                        <td>${anvelopa.dimensiuni || ''}</td>
                        <td>${anvelopa.cod || ''}</td>
                        <td>${anvelopa.detalii || ''}</td>
                        <td>${anvelopa.producator}</td>
                        <td>${anvelopa.madeIn}</td>
                        <td>${anvelopa.dot}</td>
                        <td>${anvelopa.locatie}</td>
                        <td>${anvelopa.skU_Id}</td>                                                                        
                        <td>${anvelopa.pret || ''}</td>
                        <td>${anvelopa.discount || ''}</td>
                        <td>${anvelopa.stoc || ''}</td>
                        <td>${anvelopa.vandut || ''}</td>
                        <td>${anvelopa.vizibilitate || ''}</td>
                        <td>
                            <button class="edit-button" data-id="${anvelopa.id}"><i class="fas fa-edit" style="font-size:14px"></i></button>
                        </td>
                    </tr>
                `;
                rezultateTable.innerHTML += anvelopaRow;
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
            document.getElementById('rezultate-tabel').innerText = 'A apărut o eroare la căutarea anvelopelor.';
        });
}


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

function changeOrderBy() {
    debugger;
    orderTerm = document.getElementById('order_term').value;    
    updateResultsTable();
}

//buton adauga
document.getElementById('adaugaBtn').addEventListener('click', function () {        
    const url = `anvelope_add.html`;
    window.open(url, '_blank');
});



async function get_details(id) {
    debugger;    
    if (id) {

        const url = `anvelope_add.html?id=${id}`;
        window.open(url, '_blank');

    } else {
        
    }
}










