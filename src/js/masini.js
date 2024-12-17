document.addEventListener('DOMContentLoaded', () => {
    //updateResultsTable();

    carsApiCall(updateResultsTable);

    document.getElementById('prev-page').addEventListener('click', () => changePage(-1));
    document.getElementById('next-page').addEventListener('click', () => changePage(1));
    document.getElementById('page-size').addEventListener('change', () => changePageSize());
    document.getElementById('order_term').addEventListener('change', () => changeOrderBy());
});

let currentPage = 1;
let totalPages = 1;
let pageSize = 100; // Valoarea implicită
let orderTerm = 'DESC'; // Implicit


function updateResultsTable(data) {
   
    const rezultateTable = document.getElementById('rezultate-tabel');
    rezultateTable.innerHTML = ''; // Resetează tabela

    data.masiniReg.forEach(car => {
        const carRow = `
            <tr data-id="${car.id}">
                <td>${car.id}</td>
                <td>${car.nume}</td>
                <td>${car.nrOrdine}</td>

                
                <td>${car.an}</td>
                <td>${car.combustibil}</td>
                <td>${car.tractiune}</td>
                <td>${car.transmisie}</td>
            
                
                <td>${car.skU_ID}</td>
                <td>${car.procPtPiese}</td>
                <td>${car.nrPiese}</td>
                <td>${car.vizibilitate}</td>
                <td>${car.status}</td>
                <td>${car.images}</td>
                <td>${car.autovit}</td>
         
                
                <td>
                    <button class="edit-button" data-id="${car.id}"><i class="fas fa-edit" style="font-size:14px"></i></button>
                </td>
            </tr>
        `;
        rezultateTable.innerHTML += carRow;
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
    debugger;
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

        const url = `masini_add.html?id=${id}`;
        window.open(url, '_blank');
      
    } else {
        //document.getElementById('detaliiPiesa').innerText = 'Piesa nu a fost găsită.';
    }
}


//buton cauta
document.getElementById('adaugaBtn').addEventListener('click', function () {        
    const url = `masini_add.html`;
    window.open(url, '_blank');
});