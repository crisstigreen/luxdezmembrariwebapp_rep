//**********  PAGE LOAD ********************************************************************* */
//**********  PAGE LOAD ********************************************************************* */
//**********  PAGE LOAD ********************************************************************* */
//**********  PAGE LOAD ********************************************************************* */
let currentPage = 1;
let totalPages = 1;
let pageSize = 12; // Valoarea implicită
let orderTerm = 'DESC'; // Implicit
let searchTerm = ''; // Variabilă pentru a stoca termenul de căutare
let marca = "";
let model = "";
let generatie = "";



// Apelează funcția pentru a popula checkbox-urile pentru mărci când pagina se încarcă


document.addEventListener('DOMContentLoaded', async function () {
    //const containerMarca = document.getElementById('checkboxContainerMarca');
    // getCarsForDropdown(cars => populateCheckboxesMarca(cars, containerMarca));

    document.getElementById('prev-page').addEventListener('click', () => changePage(-1));
    document.getElementById('next-page').addEventListener('click', () => changePage(1));

    await carsApiCall(populateMasiniShopGrid);

    document.querySelectorAll(".block-4-text a, .block-4-image a").forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault(); // Evită încărcarea paginii
            const newUrl = this.getAttribute("href");
            history.pushState(null, "", newUrl);
            loadCarDetails(newUrl);
        });
    });
});




/* function generateCarUrl(masina) {
    let marcaModelGeneratie = masina.nume
        .toLowerCase()       
        .replace(/\s+/g, '-') 
        .replace(/[^a-z0-9\-]/g, ''); 
    return `/${marcaModelGeneratie}-${masina.id}`; 
} */


function generateCarUrl(masina) {
    let marcaModelGeneratie = masina.nume
        .toLowerCase()
        .replace(/\s+/g, '-') 
        .replace(/[^a-z0-9\-]/g, '');
    return `/:${marcaModelGeneratie}-${masina.id}`; 
}
    

 //POPULATE GRID
//POPULATE Masini GRID
function populateMasiniShopGrid(data){
    const rezultateDiv = document.getElementById('rezultateMasini');
    rezultateDiv.innerHTML = '';
    //debugger;
    data.masiniReg.forEach(masina => {
       
        const imageSrc = masina.imagini[0] ? `${API_BASE_URL_IMG}/` + masina.imagini[0] : 'images/placeholder.jpg';
                  
        const piesaHTML = `
        <div class="card">
               <div class="card-image">
                    <figure>
                        <a class="link-masini" href="${generateCarUrl(masina)}">
                            <img src="${imageSrc}" alt="${masina.nume}">
                        </a>
                    </figure>
                </div>
                <div class="card-body">
                    <h3>
                        <a class="link-masini" href="${generateCarUrl(masina)}">${masina.nume}</a>
                    </h3>
                    <div class="card-desc">
                          <p>Cod motor: <span>${masina.codMotor} </span></p>
                           <p>Capacitate cilindrică: <span>${masina.capacitCil}</span></p>
                           <p>Combustibil: <span>${masina.combustibil} </span></p>
                            ${masina.putereCP ? `<p class="mb-0">Cai putere: <span>${masina.putereCP}<span></p>` : ''}
                            <p>An fabricație: <span>${masina.an}</span></p>
                            <p>ID vehicul: <span>${masina.id}</span></p>
                    </div>
                </div>
                <div class="card-footer">
                            ${masina.totalPiese > 0 ? ` <a href="${generateCarUrl(masina)}" class="btn-outline">Vezi ${masina.totalPiese} piese <img src='../images/Eye.svg' alt='Solicita piesa'></a>` : ''}
                          <a href="${generateCarUrl(masina)}" class="btn-primary">Solicită piesa <img src='../images/Chat.svg' alt='Solicita piesa'></a>
                </div>
        </div>`;

    
    
    
         rezultateDiv.innerHTML += piesaHTML;

     });             
  
    totalPages = data.totalPages; // Actualizează totalPages
    updatePaginationControls(); // Actualizează controalele de paginare


}



//**********  CAUTARE ********************************************************************* */
//**********  CAUTARE ********************************************************************* */
//**********  CAUTARE ********************************************************************* */
//**********  CAUTARE ********************************************************************* */

// document.getElementById('cautaBtn').addEventListener('click', () => {
//     //debugger;
//     searchTerm = document.getElementById('tb_cauta').value.trim();
//     currentPage = 1; // Resetăm la prima pagină

//     const selMarca = document.getElementById("ddd_cars");
//     selMarca.value = "";
//     const selModel = document.getElementById("ddd_models");
//     selModel.value = "";
//     const selGeneratie = document.getElementById("ddd_generatii");
//     selGeneratie.value = "";

//     carsApiCall(populateShopGrid);
       
// });
// document.getElementById('tb_cauta').addEventListener('keypress', (event) => {
//     if (event.key === 'Enter') {
//         searchTerm = event.target.value.trim();
//         currentPage = 1; // Resetăm la prima pagină

//         const selMarca = document.getElementById("ddd_cars");
//         selMarca.value = "";
//         const selModel = document.getElementById("ddd_models");
//         selModel.value = "";
//         const selGeneratie = document.getElementById("ddd_generatii");
//         selGeneratie.value = "";
    

//         carsApiCall(populateShopGrid);
//     }
// });



 // Funcția API GET DATE pentru a căuta piese după Marca, Model și Generatie
 function pieseApiCallFields(marca, model, generatie, currentPage, pageSize, orderTerm) {
    //debugger;    
    if(marca == ""){model = ""; generatie = "";}
    if(model == ""){generatie = "";}
    searchTerm = marca;
    searchTerm += ' ' + model;
    searchTerm += ' ' + generatie;
    const url = `${API_BASE_URL}/CarsRegister/searchMasiniReg?SearchTerm=${encodeURIComponent(searchTerm)}&PageNumber=${encodeURIComponent(currentPage)}&PageSize=${encodeURIComponent(pageSize)}&OrderBy=${encodeURIComponent(orderTerm)}`;
    
    // Afișează loaderul
    // Swal.fire({
    //     title: 'Loading...',
    //     text: 'Please wait while we fetch the data.',
    //     allowOutsideClick: false,
    //     didOpen: () => {
    //         Swal.showLoading();
    //     }
    // });

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Eroare la obținerea datelor');
            }
            return response.json();
        })
        .then(data => {
            //debugger;
            // Swal.close(); // Ascunde loaderul la succes
            return data; // Returnează datele primite de la API
        })
        .catch(error => {
            console.error('Eroare:', error);
            // Swal.close(); // Ascunde loaderul la eroare
            document.getElementById('rezultate-tabel').innerText = 'A apărut o eroare la căutarea pieselor.';
        });
    }
 

//**********  PAGINATION ********************************************************************* */
//**********  PAGINATION ********************************************************************* */
//**********  PAGINATION ********************************************************************* */
//**********  PAGINATION ********************************************************************* */

function updatePaginationControls() {
    document.getElementById('page-info').innerText = `Pagina ${currentPage} din ${totalPages}`;
    document.getElementById('prev-page').disabled = currentPage <= 1;
    document.getElementById('next-page').disabled = currentPage >= totalPages;
}
function changePage(delta) {
   //debugger;
    if ((delta === -1 && currentPage > 1) || (delta === 1 && currentPage < totalPages)) {
        currentPage += delta;
        
        carsApiCall(populateMasiniShopGrid);
       window.scrollTo({ top: 0, behavior: 'smooth' });
        
        
                 
    }
}
function changePageSize() {
    pageSize = parseInt(document.getElementById('page-size').value);
    currentPage = 1; // Resetăm la prima pagină
    carsApiCall(populateMasiniShopGrid);

}
function changeOrderBy() {
    debugger;
    orderTerm = document.getElementById('order_term').value;  
    carsApiCall(populateMasiniShopGrid);

}

//**********  EVENTS ********************************************************************* */
//**********  EVENTS ********************************************************************* */
//**********  EVENTS ********************************************************************* */
//**********  EVENTS ********************************************************************* */

function  veziPiese(id,totalPiese){   
    debugger; 
    if (id) {
        const url = totalPiese > 0 ? `index.html?id=${id}` : `masini-details.html?id=${id}`;
        window.open(url, '_self');
    } else {

    }
}

//logica

document.addEventListener('DOMContentLoaded', function () {
    //debugger;
    // const filtreBtn = document.getElementById('filtreBtn');
    // const filterSidebar = document.getElementById('filterSidebar');
    // const closeFilters = document.getElementById('closeFilters');
    // const filtrare = document.getElementById('filtrare');

    // Functia pentru a copia filtrele in meniul lateral
    // function copyFiltersToSidebar() {
    //     const checkboxContainerMarca = document.getElementById('checkboxContainerMarca');
    //     const checkboxContainerModel = document.getElementById('checkboxContainerModel');
    //     const checkboxContainerGeneratie = document.getElementById('checkboxContainerGeneratie');
        
    //     // Găsim div-urile specifice din filterSidebar
    //     const checkboxContainerMarcaSidebar = document.getElementById('checkboxContainerMarcaSidebar');
    //     const checkboxContainerModelSidebar = document.getElementById('checkboxContainerModelSidebar');
    //     const checkboxContainerGeneratieSidebar = document.getElementById('checkboxContainerGeneratieSidebar');

    //     // Golim div-urile laterale înainte de a copia conținutul
    //  /*    checkboxContainerMarcaSidebar.innerHTML = '';
    //     checkboxContainerModelSidebar.innerHTML = '';
    //     checkboxContainerGeneratieSidebar.innerHTML = ''; */


    //      // Copiem conținutul din div-urile de filtre în div-urile specifice din sidebar
    //      checkboxContainerMarcaSidebar.appendChild(checkboxContainerMarca.cloneNode(true));
    //      checkboxContainerModelSidebar.appendChild(checkboxContainerModel.cloneNode(true));
    //      checkboxContainerGeneratieSidebar.appendChild(checkboxContainerGeneratie.cloneNode(true));

    //     // Reatașăm evenimentele de filtrare la checkbox-urile copiate
    //     attachFilterEvents(filterSidebar);
    // }
    // function attachFilterEvents(container) {
    //     // Găsim toate checkbox-urile din meniul lateral
    //     const checkboxes = container.querySelectorAll('input[type="checkbox"]');

    //     // Adăugăm evenimentul 'change' pentru fiecare checkbox
    //     checkboxes.forEach(checkbox => {
    //         checkbox.addEventListener('change', function () {
    //             // Codul tău de filtrare va fi aici
    //             // Exemplu:
    //             console.log(`Filtrare activată pentru: ${checkbox.name}`);
    //             // Adaugă funcționalitatea de filtrare

    //             //!!!  aici trebuie
    //             handleMarcaChange(this, container);
    //         });
    //     });
    // }

    // filtreBtn.addEventListener('click', function () {
    //     debugger;
    //     copyFiltersToSidebar(); // Copiem filtrele în lateral
    //     filterSidebar.style.display = 'block';
    //     filtreBtn.style.display = 'none';  // Ascundem butonul "Filtre"
    //     closeFilters.style.display = 'block';
    // });

    // Închidem meniul lateral de filtre
    // closeFilters.addEventListener('click', function () {
    //     filterSidebar.style.display = 'none';
    //     filtreBtn.style.display = 'block';  // Afișăm din nou butonul "Filtre"
    //     closeFilters.style.display = 'none';
    // });
});



