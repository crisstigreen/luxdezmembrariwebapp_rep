document.addEventListener('DOMContentLoaded', () => {
    debugger;
    carsApiCall(updateResultsTable);

    document.getElementById('prev-page').addEventListener('click', () => changePage(-1));
    document.getElementById('next-page').addEventListener('click', () => changePage(1));
    document.getElementById('page-size').addEventListener('change', () => changePageSize());
    document.getElementById('order_term').addEventListener('change', () => changeOrderBy());
});




function updateResultsTable(data) {
    debugger;
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
                <td>
                    <button class="delete-button" data-id="${car.id}"><i class="fas fa-remove" style="font-size:14px"></i></button>
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

            // Adaugă eveniment pentru butoanele de delete
    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', function (event) {
            event.stopPropagation();
            const id = this.getAttribute('data-id');
            const link = `${API_BASE_URL}/CarsRegister/` + id;  
            Swal.fire({
            title: 'Sunteți sigur?',
            text: 'Această acțiune va șterge elementul definitiv.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Da, șterge!',
            cancelButtonText: 'Anulează',
            reverseButtons: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        debugger;                                                                     
                         del(id, link).then(() => {
                            showDeleteSuccessMessage();
                            //initializePage();
                            carsApiCall(updateResultsTable);
                        }).catch((error) => {
                            console.error('Eroare la ștergere:', error);
                            Swal.fire('Eroare!', 'A apărut o eroare la ștergere.', 'error');
                        });    



                    }
                });
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
        carsApiCall(updateResultsTable);
       // window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function changePageSize() {
    pageSize = parseInt(document.getElementById('page-size').value);
    currentPage = 1; // Resetăm la prima pagină
    carsApiCall(updateResultsTable);
}

function changeOrderBy() {
    debugger;
    orderTerm = document.getElementById('order_term').value;        
    carsApiCall(updateResultsTable);    
}


//**********  cautare ********************************************************************* */



document.getElementById('cautaBtn').addEventListener('click', () => {
    debugger;
    searchTerm = document.getElementById('tb_cauta').value.trim();
    currentPage = 1; // Resetăm la prima pagină
    carsApiCall(updateResultsTable); 
});


document.getElementById('tb_cauta').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchTerm = event.target.value.trim();
        currentPage = 1; // Resetăm la prima pagină
        carsApiCall(updateResultsTable); 
    }
});



async function get_details(id) {
    debugger;    
    if (id) {

        const url = `masini_add.html?id=${id}`;
        window.location = url;
      
    } else {
        //document.getElementById('detaliiPiesa').innerText = 'Piesa nu a fost găsită.';
    }
}


//buton cauta
document.getElementById('adaugaBtn').addEventListener('click', function () {        
    const url = `masini_add.html`;
    window.location = url;
});


document.getElementById('exportBtn').addEventListener('click', async () => {
    debugger; 

       // Afișează loaderul
       Swal.fire({
        title: 'Loading...',
        text: 'Please wait while we fetch the data.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });


    const tip = document.getElementById('export_type').value;     
    const link = `${API_BASE_URL}/CarsRegister/export?tip=${tip}`;

    // Apelează funcția pentru descărcare
    await downloadFile(link);

    Swal.close(); 

});

async function downloadFile(link) {
    try {
        const response = await fetch(link, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Creează un Blob din răspuns
        const blob = await response.blob();

        // Creează un link temporar pentru descărcare
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        // Setează numele fișierului descărcat
        const contentDisposition = response.headers.get('Content-Disposition');
        const filename = contentDisposition
            ? contentDisposition.split('filename=')[1]?.replace(/["']/g, '') || 'file'
            : 'file';
        a.download = filename;

        // Adaugă linkul temporar în DOM și declanșează descărcarea
        document.body.appendChild(a);
        a.click();

        // Curăță resursele temporare
        a.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('A apărut o eroare la descărcarea fișierului:', error);
    }
}
