//**********  PAGE LOAD ********************************************************************* */
//**********  PAGE LOAD ********************************************************************* */
//**********  PAGE LOAD ********************************************************************* */
//**********  PAGE LOAD ********************************************************************* */
let currentPage = 1;
let totalPages = 1;
let pageSize = 12; // Valoarea implicită
let orderTerm = 'DESC'; // Implicit
let searchTerm = ''; // Variabilă pentru a stoca termenul de căutare

let marcaId = null;
let modelId = null;
let generatieId = null;

let allMarci = [];
let allModels = [];
let allGeneratii = []
let IdSubCat = "";

let selectedTip = '';
let selectedCategorie = '';
let selectedSubcategorie = '';



// window.onload = function() {
//  document.getElementById('link-Masini').classList.add('active');
// }


document.addEventListener('DOMContentLoaded', async function () {
    debugger;
    document.getElementById('prev-page').addEventListener('click', () => changePage(-1));
    document.getElementById('next-page').addEventListener('click', () => changePage(1));
    
    //await carsApiCall(populateMasiniShopGrid);

     //new
    parsePathAndFilterOnLoad();
    

    getCarsPieseForDropdown(function(cars) {
        debugger;
        populateDropdown(cars);
    });


    document.querySelectorAll(".block-4-text a, .block-4-image a").forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault(); // Evită încărcarea paginii
            const newUrl = this.getAttribute("href");
            history.pushState(null, "", newUrl);
            loadCarDetails(newUrl);
        });
    });
});

function carsApiCall(callback) {
    debugger;
    const url = `${API_BASE_URL}/CarsRegister/searchMasiniReg?SearchTerm=${encodeURIComponent(searchTerm)}&PageNumber=${encodeURIComponent(currentPage)}&PageSize=${encodeURIComponent(pageSize)}&OrderBy=${encodeURIComponent(orderTerm)}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Eroare la obținerea datelor');
            }
            return response.json();
        })
        .then(data => {
            //populateMainGrid(data);
            callback(data);
        })
        .catch(error => {
            console.error('Eroare:', error);
            document.getElementById('rezultate-tabel').innerText = 'A apărut o eroare la căutarea pieselor.';
        });
}


function parsePathAndFilterOnLoad() {
    const path = window.location.pathname; // ex: /motoare
    const parts = path.split('/').filter(Boolean); // elimină golurile

    if (parts.length >= 1) {     
        Nivel = 1;  
        selectedTip = decodeURIComponent(parts[0] || '');
        populateApiPath(); // sau pieseApiCallFields(...) dacă ai nevoie mai direct
    }
}


function populateApiPath(){
        debugger;
        if(marca == "" && model == "" && generatie == "" && IdSubCat == "" && Nivel == ""){
            pieseApiCall(populatePieseShopGrid);                       
        }
        else{
            //debugger;
            pieseApiCallFields(marca, model, generatie, currentPage, pageSize, orderTerm)
            .then(data => {                
                populateMasiniShopGrid(data);
            })
                .catch(error => {
                    console.error('Eroare la obținerea datelor:', error);
            });     
        }                    
}


function populatePieseShopGrid(data){
    const rezultateDiv = document.getElementById('rezultateMasini');
    rezultateDiv.innerHTML = '';
    //debugger;
    //cristi testache
    
    data.masiniReg.forEach(piesa => {
        debugger;       
        //var imageSrc = piesa.imagini ? `${API_BASE_URL_IMG}/` + piesa.imagini[0] : 'images/placeholder.jpg';

          var imageSrc = piesa.imagini
            ? `${API_BASE_URL_IMG}/${piesa.imagini[0]}?v=${Date.now()}`
            : 'images/placeholder.jpg';
      
        if(piesa.imagini != null && piesa.imagini.length == 0){
            imageSrc = '/images/placeholder.jpg';
        }
        const inStock = piesa.stoc > 0;
    
        const cartImageEvents = inStock 
        ? `
            onclick="onImageClick(${piesa.id})"
        `
        : `
            onclick="event.preventDefault();"
        `;

        const piesaHTML = `
            <div class="card">
                <div class="card-image">
                    <figure class="link-piese">
                        <a  href="${generateCarUrl(piesa)}">                        
                            <img src="${imageSrc}" alt="${piesa.nume}" id="piesaImagine-${piesa.id}">
                        </a>
                    </figure>
                    <div class="card-body" id="piesa-${piesa.id}">
                        <h3 style="font-weight: bold;">
                            <a href="${generateCarUrl(piesa)}">${piesa.nume}</a>
                        </h3>
                        <div class="card-desc-piese">
                            <p>Masina: <span id="piesaMasina-${piesa.id}">${piesa.masina}</span></p>
                            <p style='display:none' id="piesaStoc-${piesa.id}">${piesa.stoc}</p>
                            <p>Cod intern: <span id="piesaCodintern-${piesa.id}">${piesa.locatie}</span></p>
                            <p>SKU_ID: <span id="piesasku_ID-${piesa.id}">${piesa.skU_Id}</span></p>
                            <p>Disponibilitate: ${piesa.stoc > 0 ? `<span> <img src='/images/CheckmarkCircle.svg' alt="Disponibil"/> În stoc (${piesa.stoc})` : '<span>Fără stoc</span>'}</p>
                        </div>
                        <div class="card-footer">                            
                            <a href="cart.html" class="btn-primary">
                                Cumpără
                                <img src='images/ShoppingBagW.svg'  alt="Adauga in cos"  ${cartImageEvents} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        rezultateDiv.innerHTML += piesaHTML;                
     });             
   
}


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
       
        const imageSrc = masina.imagini[0] 
        ? `${API_BASE_URL_IMG}/${masina.imagini[0]}?v=${Date.now()}` 
        : 'images/placeholder.jpg';
                  
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
 async function pieseApiCallFields(marca, model, generatie, currentPage, pageSize, orderTerm) {
    debugger;    

        //EXTRAG DIN URL
    if(marca == "")  
    {
        var menuSend = "";
        switch (Nivel) {
            case 1:
                menuSend = selectedTip.substr(1);
                break;
            case 2:
                menuSend = selectedCategorie;
                break;
            case 3:
                menuSend = selectedSubcategorie;
                break;
        }
        //iau marcile care au doua cuvinte - gen Alfa Romeo
        const link = "http://localhost:5012/api/InfoCars/GetMarciDuble";  
        const marciDuble = await get(link);
        const marciDubleSlug = marciDuble.map(nume => nume.toLowerCase().replace(/ /g, "-"));
        const menuSlug = menuSend.toLowerCase();
        marca = "";
        model = "";
        generatie = "";

        if (IdSubCat == "" && !currentURL.includes("html")) {
        // 1. Căutăm dacă menuSlug începe cu o marcă dublă cunoscută
        const matchedMarca = marciDubleSlug.find(marcaSlug => menuSlug.startsWith(marcaSlug));

        if (matchedMarca) {
                // Marca este marca dublă găsită (ex: "alfa-romeo")
                marca = matchedMarca.replace(/-/g, " ");

                // Extragem restul după marca dublă + separator "-"
                let rest = menuSlug.substring(matchedMarca.length);
                if (rest.startsWith("-")) rest = rest.substring(1); // scoatem separatorul dacă există

                if (rest) {
                    const restParts = rest.split("-");

                    if (restParts.length >= 3) {
                        // Restul conține: model + cod generatie + ani (ex: "i01-facelift-2017---2020")
                        model = restParts[0].replace(/-/g, " ");

                        const codGen = restParts[1].replace(/-/g, " ");
                        const aniGen = restParts.slice(2).join("-").replace(/---/g, " - ").replace(/-/g, " ");

                        generatie = `${codGen} ${aniGen}`.trim();
                    } else if (restParts.length === 1) {
                        // doar model
                        model = restParts[0].replace(/-/g, " ");
                    } else if (restParts.length === 2) {
                        // model + cod generatie
                        model = restParts[0].replace(/-/g, " ");
                        generatie = restParts[1].replace(/-/g, " ");
                    }
                }
            } else {
                // Nu e marcă dublă, deci presupunem marcă simplă ca prima parte
                const parts = menuSlug.split("-");

                marca = parts[0].replace(/-/g, " ");

                if (parts.length >= 4) {
                    // Format: marca-model-codGeneratie-ani
                    model = parts[1].replace(/-/g, " ");
                    const codGen = parts[2].replace(/-/g, " ");
                    const aniGen = parts.slice(3).join("-").replace(/---/g, " - ").replace(/-/g, " ");
                    generatie = `${codGen} ${aniGen}`.trim();
                } else if (parts.length === 3) {
                    // Format: marca-model-generatie (fara ani)
                    model = parts[1].replace(/-/g, " ");
                    generatie = parts[2].replace(/-/g, " ");
                } else if (parts.length === 2) {
                    model = parts[1].replace(/-/g, " ");
                }
            }

            if(model != "" && generatie != ""){
                const link = "http://localhost:5012/api/Piese/search_generation?GenText=" + generatie + "&MarcaName=" + marca + "&ModelName=" + model;  
                const generatieNoua = await get(link);
                generatie = generatieNoua[0].generatieName;
            }            
            IdSubCat = "";
        }

    }


    if(marca == ""){model = ""; generatie = "";}
    if(model == ""){generatie = "";}
    searchTerm = marca;
    searchTerm += ' ' + model;
    searchTerm += ' ' + generatie;
    const url = `${API_BASE_URL}/CarsRegister/searchMasiniReg?SearchTerm=${encodeURIComponent(searchTerm)}&PageNumber=${encodeURIComponent(currentPage)}&PageSize=${encodeURIComponent(pageSize)}&OrderBy=${encodeURIComponent(orderTerm)}`;    

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Eroare la obținerea datelor');
            }
            return response.json();
        })
        .then(data => {
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



