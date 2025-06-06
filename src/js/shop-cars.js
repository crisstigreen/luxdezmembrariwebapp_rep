//**********  PAGE LOAD ********************************************************************* */
//**********  PAGE LOAD ********************************************************************* */
//**********  PAGE LOAD ********************************************************************* */
//**********  PAGE LOAD ********************************************************************* */
let currentPage = 1;
let totalPages = 1;
let pageSize = 24; // Valoarea implicită
let orderTerm = 'DESC'; // Implicit
let searchTerm = ''; // Variabilă pentru a stoca termenul de căutare
let marca = "";
let model = "";
let generatie = "";



// Apelează funcția pentru a popula checkbox-urile pentru mărci când pagina se încarcă

document.addEventListener('DOMContentLoaded', function() {
    const containerMarca = document.getElementById('checkboxContainerMarca');
    getCarsForDropdown(function(cars) {
        populateCheckboxesMarca(cars, containerMarca);
    });
});



document.addEventListener('DOMContentLoaded', async  () => {
    debugger;    
    document.getElementById('prev-page').addEventListener('click', () => changePage(-1));
    document.getElementById('next-page').addEventListener('click', () => changePage(1));    
    
    carsApiCall(populateShopGrid);

       
});


//Solicita piese auto din dezmembrare nelistate

 //POPULATE GRID
 function populateShopGrid(data){
    const rezultateDiv = document.getElementById('rezultate');
    rezultateDiv.innerHTML = '';
    debugger;
    data.masiniReg.forEach(masina => {
       
        const imageSrc = masina.imagini[0] ? `${API_BASE_URL_IMG}/uploads/` + masina.imagini[0] : 'images/placeholder.jpg';

        const piesaHTML = `
        <div class="col-sm-6 col-lg-4 mb-4" data-aos="fade-up">
            <div style="height: 500px" class="block-4 border d-flex flex-column">
                <figure class="block-4-image">
                    <a href="shop-singlecar.html?id=${masina.id}">
                        <img src="${imageSrc}" style='width: 100%; height: 165px; object-fit: contain;object-position: center;' alt="Image placeholder" alt="Image placeholder" class="img-fluid">
                    </a>
                </figure>
                <div class="block-4-text padding10 flex-grow-1">
                    <h6 style="font-weight: bold;">
                        <a href="shop-singlecar.html?id=${masina.id}">${masina.nume}</a>
                    </h6>
                    <p class="mb-0">Numar identificare vehicul: ${masina.id}</p>
                    <p class="mb-0">Cod motor: ${masina.codMotor}</p>
                    <p class="mb-0">Combustibil: ${masina.combustibil}</p>
                    <p class="mb-0">An fabricatie: ${masina.an}</p>
                    <p class="mb-0">Capacitate cilindrica: ${masina.capacitCil}</p>
                    ${masina.putereCP ? `<p class="mb-0">Putere[CP]: ${masina.putereCP}</p>` : ''}
                    <div class="mt-auto d-flex justify-content-between align-items-center button-container">
                        <button class="btn btn-warning btn-sm" type="button" onclick="veziPiese(${masina.id},${masina.totalPiese})">
                            ${masina.totalPiese > 0 ? `Vezi ${masina.totalPiese} piese` : 'Solicita piese auto din </br> dezmembrare nelistate'}
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
    
    
    
    
         rezultateDiv.innerHTML += piesaHTML;

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



    //Swal.close();

     // Întârzierea închiderii loader-ului
     setTimeout(() => {
        Swal.close(); // Închide loader-ul
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 200); // Rămâne deschis pentru 1000 ms (1 secundă)


}

//**********  CAUTARE ********************************************************************* */
//**********  CAUTARE ********************************************************************* */
//**********  CAUTARE ********************************************************************* */
//**********  CAUTARE ********************************************************************* */

document.getElementById('cautaBtn').addEventListener('click', () => {
    debugger;
    searchTerm = document.getElementById('tb_cauta').value.trim();
    currentPage = 1; // Resetăm la prima pagină

    const selMarca = document.getElementById("ddd_cars");
    selMarca.value = "";
    const selModel = document.getElementById("ddd_models");
    selModel.value = "";
    const selGeneratie = document.getElementById("ddd_generatii");
    selGeneratie.value = "";

    carsApiCall(populateShopGrid);
       
});
document.getElementById('tb_cauta').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchTerm = event.target.value.trim();
        currentPage = 1; // Resetăm la prima pagină

        const selMarca = document.getElementById("ddd_cars");
        selMarca.value = "";
        const selModel = document.getElementById("ddd_models");
        selModel.value = "";
        const selGeneratie = document.getElementById("ddd_generatii");
        selGeneratie.value = "";
    

        carsApiCall(populateShopGrid);
    }
});



 // Funcția API GET DATE pentru a căuta piese după Marca, Model și Generatie
 function pieseApiCallFields(marca, model, generatie, currentPage, pageSize, orderTerm) {
    debugger;    
    if(marca == ""){model = ""; generatie = "";}
    if(model == ""){generatie = "";}
    searchTerm = marca;
    searchTerm += ' ' + model;
    searchTerm += ' ' + generatie;
    const url = `${API_BASE_URL}/CarsRegister/searchMasiniReg?SearchTerm=${encodeURIComponent(searchTerm)}&PageNumber=${encodeURIComponent(currentPage)}&PageSize=${encodeURIComponent(pageSize)}&OrderBy=${encodeURIComponent(orderTerm)}`;
    
    // Afișează loaderul
    Swal.fire({
        title: 'Loading...',
        text: 'Please wait while we fetch the data.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Eroare la obținerea datelor');
            }
            return response.json();
        })
        .then(data => {
            debugger;
            Swal.close(); // Ascunde loaderul la succes
            return data; // Returnează datele primite de la API
        })
        .catch(error => {
            console.error('Eroare:', error);
            Swal.close(); // Ascunde loaderul la eroare
            document.getElementById('rezultate-tabel').innerText = 'A apărut o eroare la căutarea pieselor.';
        });
    }
 

//**********  PAGINATION ********************************************************************* */
//**********  PAGINATION ********************************************************************* */
//**********  PAGINATION ********************************************************************* */
//**********  PAGINATION ********************************************************************* */

function updatePaginationControls() {
    document.getElementById('page-info').innerText = `Page ${currentPage} of ${totalPages}`;
    document.getElementById('prev-page').disabled = currentPage <= 1;
    document.getElementById('next-page').disabled = currentPage >= totalPages;
}
function changePage(delta) {
   debugger;
    if ((delta === -1 && currentPage > 1) || (delta === 1 && currentPage < totalPages)) {
        currentPage += delta;
        
        carsApiCall(populateShopGrid);
      
        
        
                 
    }
}
function changePageSize() {
    pageSize = parseInt(document.getElementById('page-size').value);
    currentPage = 1; // Resetăm la prima pagină
    carsApiCall(populateShopGrid);

}
function changeOrderBy() {
    debugger;
    orderTerm = document.getElementById('order_term').value;  
    carsApiCall(populateShopGrid);

}

//**********  EVENTS ********************************************************************* */
//**********  EVENTS ********************************************************************* */
//**********  EVENTS ********************************************************************* */
//**********  EVENTS ********************************************************************* */

function  veziPiese(id,totalPiese){   
    debugger; 
    if (id) {
        const url = totalPiese > 0 ? `shop.html?id=${id}` : `shop-singlecar.html?id=${id}`;
        window.open(url, '_self');
    } else {

    }
}

//logica

document.addEventListener('DOMContentLoaded', function () {
    debugger;
    const filtreBtn = document.getElementById('filtreBtn');
    const filterSidebar = document.getElementById('filterSidebar');
    const closeFilters = document.getElementById('closeFilters');
    const filtrare = document.getElementById('filtrare');

    // Functia pentru a copia filtrele in meniul lateral
    function copyFiltersToSidebar() {
        const checkboxContainerMarca = document.getElementById('checkboxContainerMarca');
        const checkboxContainerModel = document.getElementById('checkboxContainerModel');
        const checkboxContainerGeneratie = document.getElementById('checkboxContainerGeneratie');
        
        // Găsim div-urile specifice din filterSidebar
        const checkboxContainerMarcaSidebar = document.getElementById('checkboxContainerMarcaSidebar');
        const checkboxContainerModelSidebar = document.getElementById('checkboxContainerModelSidebar');
        const checkboxContainerGeneratieSidebar = document.getElementById('checkboxContainerGeneratieSidebar');

        // Golim div-urile laterale înainte de a copia conținutul
     /*    checkboxContainerMarcaSidebar.innerHTML = '';
        checkboxContainerModelSidebar.innerHTML = '';
        checkboxContainerGeneratieSidebar.innerHTML = ''; */


         // Copiem conținutul din div-urile de filtre în div-urile specifice din sidebar
         checkboxContainerMarcaSidebar.appendChild(checkboxContainerMarca.cloneNode(true));
         checkboxContainerModelSidebar.appendChild(checkboxContainerModel.cloneNode(true));
         checkboxContainerGeneratieSidebar.appendChild(checkboxContainerGeneratie.cloneNode(true));

        // Reatașăm evenimentele de filtrare la checkbox-urile copiate
        attachFilterEvents(filterSidebar);
    }
    function attachFilterEvents(container) {
        // Găsim toate checkbox-urile din meniul lateral
        const checkboxes = container.querySelectorAll('input[type="checkbox"]');

        // Adăugăm evenimentul 'change' pentru fiecare checkbox
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function () {
                // Codul tău de filtrare va fi aici
                // Exemplu:
                console.log(`Filtrare activată pentru: ${checkbox.name}`);
                // Adaugă funcționalitatea de filtrare

                //!!!  aici trebuie
                handleMarcaChange(this, container);
            });
        });
    }

    filtreBtn.addEventListener('click', function () {
        debugger;
        copyFiltersToSidebar(); // Copiem filtrele în lateral
        filterSidebar.style.display = 'block';
        filtreBtn.style.display = 'none';  // Ascundem butonul "Filtre"
        closeFilters.style.display = 'block';
    });

    // Închidem meniul lateral de filtre
    closeFilters.addEventListener('click', function () {
        filterSidebar.style.display = 'none';
        filtreBtn.style.display = 'block';  // Afișăm din nou butonul "Filtre"
        closeFilters.style.display = 'none';
    });
});



