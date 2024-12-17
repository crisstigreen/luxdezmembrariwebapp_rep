//**********  PAGE LOAD ********************************************************************* */
//**********  PAGE LOAD ********************************************************************* */
//**********  PAGE LOAD ********************************************************************* */
//**********  PAGE LOAD ********************************************************************* */

//PULA
let currentPage = 1;
let totalPages = 1;
let pageSize = 24; // Valoarea implicită
let orderTerm = 'DESC'; // Implicit
let searchTerm = ''; // Variabilă pentru a stoca termenul de căutare
let marca = "";
let model = "";
let generatie = "";
let allMarci = [];
let allModels = [];
let allGeneratii = []
let IdSubCat = "";
let Nivel = "";


// Apelează funcția pentru a popula checkbox-urile pentru mărci când pagina se încarcă
document.addEventListener('DOMContentLoaded', getCarsForDropdown(populateCheckboxesMarca));
//
document.addEventListener('DOMContentLoaded', async  () => {
    debugger;    
    document.getElementById('prev-page').addEventListener('click', () => changePage(-1));
    document.getElementById('next-page').addEventListener('click', () => changePage(1));
    const carId = getQueryParam('id');

    if(carId){
        pieseMasiniApiCall(populateShopGrid);
    }
    else{
        pieseApiCall(populateShopGrid);   
    }



       
});

document.addEventListener('DOMContentLoaded', generateDynamicMenu);

//**********  CAUTARE ********************************************************************* */
//**********  CAUTARE ********************************************************************* */
//**********  CAUTARE ********************************************************************* */
//**********  CAUTARE ********************************************************************* */

document.getElementById('cautaBtn').addEventListener('click', () => {
    debugger;
    searchTerm = document.getElementById('tb_cauta').value.trim();
    currentPage = 1; // Resetăm la prima pagină
    pieseApiCall(populateShopGrid);       
});
document.getElementById('tb_cauta').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        debugger;
        searchTerm = event.target.value.trim();
        currentPage = 1; // Resetăm la prima pagină
        pieseApiCall(populateShopGrid);
             
    }
});


//**********  POPULATE GRID ********************************************************************* */
//**********  POPULATE GRID ********************************************************************* */
//**********  POPULATE GRID ********************************************************************* */
//**********  POPULATE GRID ********************************************************************* */

 //POPULATE GRID
 function populateShopGrid(data){
    const rezultateDiv = document.getElementById('rezultate');
    rezultateDiv.innerHTML = '';
    debugger;
    //cristi testache
    
    data.piese.forEach(piesa => {
        debugger;
       
        var imageSrc = piesa.imagini ? `${API_BASE_URL_IMG}/uploads/` + piesa.imagini[0] : 'images/placeholder.jpg';
        if(piesa.imagini != null && piesa.imagini.length == 0){
            imageSrc = 'images/placeholder.jpg';
        }
        const inStock = piesa.stoc > 0;
        const cartImageStyles = inStock 
        ? "width: 34px; height: 34px; background: linear-gradient(to right, #1b78d1, #3098fa); padding: 8px; border-radius: 15%; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); transition: box-shadow 0.3s ease, transform 0.3s ease;"
        : "width: 34px; height: 34px; background: grey; padding: 8px; border-radius: 15%;";
    
        const cartImageEvents = inStock 
        ? `
            onmouseover="this.style.background='linear-gradient(to right, #368ddf, #4ca8ff)'" 
            onmouseout="this.style.background='linear-gradient(to right, #1b78d1, #3098fa)'" 
            onmousedown="this.style.boxShadow='none'; this.style.transform='scale(0.95)'" 
            onmouseup="this.style.boxShadow='0 4px 8px rgba(0, 0, 0, 0.2)'; this.style.transform='scale(1)'" 
            onclick="onImageClick(${piesa.id})"
        `
        : `
            onclick="event.preventDefault();"
        `;

        const piesaHTML = `
            <div class="col-sm-6 col-lg-4 mb-4" data-aos="fade-up">
                <div class="block-4 border d-flex flex-column" style="height: 450px;">
                    <figure class="block-4-image">
                        <a target='_blank' href="shop-single.html?id=${piesa.id}&masina=${piesa.masina}">                        
                            <img src="${imageSrc}" style='width: 100%; height: 165px; object-fit: contain;object-position: center;' alt="Image placeholder" class="img-fluid" id="piesaImagine-${piesa.id}">
                           
                        </a>
                    </figure>
                        <div class="block-4-text p-4 d-flex flex-column flex-grow-1" id="piesa-${piesa.id}">
                        <h6>
                            <a target='_blank' href="shop-single.html?id=${piesa.id}&masina=${piesa.masina}" id="piesaTitlu-${piesa.id}">${piesa.nume}</a>
                        </h6>
                        <p class="mb-0"><strong style='font-weight: bold'>Masina: </strong> <span id="piesaMasina-${piesa.id}">${piesa.masina}</span></p>
                        <p class="mb-0"><strong style='font-weight: bold'>Disponibilitate: </strong> ${piesa.stoc > 0 ? `În stoc (${piesa.stoc})` : 'Fără stoc'}</p>
                        <p class="mb-0" style='display:none' id="piesaStoc-${piesa.id}">${piesa.stoc}</p>
                        <p class="mb-0"><strong style='font-weight: bold; display:none'>Tip caroserie: </strong><span style='display:none' id="piesaTipCaroserie-${piesa.id}">${piesa.tipCaroserie}</span></p>
                        
                        <p class="mb-0"><strong style='font-weight: bold'>Cod intern: </strong><span id="piesaCodintern-${piesa.id}">${piesa.locatie}</span></p>
                        <div class="mt-auto d-flex justify-content-between align-items-center">
                            <h3 style="margin: 0;" id="piesaPret-${piesa.id}"><strong style='font-weight: bold; color:'>${piesa.pret}</strong></h3>
                            <a href="cart.html" class="site-cart">
                                <img 
                                    src='images/add-to-cart.png' 
                                    alt="Image placeholder" 
                                    class="img-fluid" 
                                    style="${cartImageStyles}"
                                    ${cartImageEvents}
                                > 
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        rezultateDiv.innerHTML += piesaHTML;                
     });             
    totalPages = data.totalPages; // Actualizează totalPages
    updatePaginationControls(); // Actualizează controalele de paginare

    // Adaugă eveniment pentru butoanele de editare
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', function (event) {
            event.stopPropagation();
            const id = this.getAttribute('data-id');
            debugger;
            get_details(id); // Apelează funcția pentru a obține detaliile
        });
    });
     // Întârzierea închiderii loader-ului
     setTimeout(() => {
        Swal.close(); // Închide loader-ul
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 200); // Rămâne deschis pentru 1000 ms (1 secundă)
}

function onImageClick(idPiesa) {
    debugger;
    var pretText = document.getElementById(`piesaPret-${idPiesa}`).innerText;
    var pret = parseInt(pretText.match(/\d+/)[0]); // Extrage doar numărul din text        
    var imagini = document.getElementById(`piesaImagine-${idPiesa}`).src;
    var masina = document.getElementById(`piesaMasina-${idPiesa}`).innerText;
    var tipCaroserie = document.getElementById(`piesaTipCaroserie-${idPiesa}`).innerText;
    var codIntern = document.getElementById(`piesaCodintern-${idPiesa}`).innerText;
    var stoc = document.getElementById(`piesaStoc-${idPiesa}`).innerText;

    if(idPiesa){
        const product = {
            id: idPiesa.toString(),
            name: document.getElementById(`piesaTitlu-${idPiesa}`).innerText,
            quantity: 1,
            pret: pret,
            pretTotal: pret,
            imagini: imagini,
            masina: masina,
            tipCaroserie: tipCaroserie,
            codIntern: codIntern,
            stoc: stoc
        };
        addToCart(product);
    }
}

 // Funcția API GET DATE pentru a căuta piese după Marca, Model și Generatie
 function pieseApiCallFields(marca, model, generatie, currentPage, pageSize, orderTerm) {
    debugger;    
    if(marca == ""){model = ""; generatie = "";}
    if(model == ""){generatie = "";}                       
    const url = `${API_BASE_URL}/Piese/search_fields?Marca=${encodeURIComponent(marca)}&Model=${encodeURIComponent(model)}&Generatie=${encodeURIComponent(generatie)}&IdSubCat=${encodeURIComponent(IdSubCat)}&Nivel=${encodeURIComponent(Nivel)}&PageNumber=${encodeURIComponent(currentPage)}&PageSize=${encodeURIComponent(pageSize)}&OrderBy=${encodeURIComponent(orderTerm)}`;

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
            document.getElementById('rezultate-tabel').innerText = 'A apărut o eroare la căutarea pieselor.';
            Swal.close(); // Ascunde loaderul la eroare
            throw error;
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
        populateApiPath();
                                       
    }
}
function changePageSize() {
    pageSize = parseInt(document.getElementById('page-size').value);
    currentPage = 1; // Resetăm la prima pagină
    populateApiPath();

}
function changeOrderBy() {
    debugger;
    orderTerm = document.getElementById('order_term').value;  
    populateApiPath();

}

function populateApiPath(){
        if(marca == "" && model == "" && generatie == "" && IdSubCat == null && Nivel == null){
            pieseApiCall(populateShopGrid);                       
        }
        else{
            debugger;
            pieseApiCallFields(marca, model, generatie, currentPage, pageSize, orderTerm)
            .then(data => {                
                populateShopGrid(data);
            })
                .catch(error => {
                    console.error('Eroare la obținerea datelor:', error);
            });     
        }                    
}




// Funcția care gestionează click-ul pe fiecare nivel de meniu
async function handleMenuClick(level, id, name) {
    debugger;
    if(level == 'tip'){
        Nivel = 1;
    }
    else if(level == 'categorie'){
        Nivel = 2;
    }
    else if(level == 'subcategorie'){
        Nivel = 3
    }
    IdSubCat = id;
 
    try {
        let filterData = { level, id, name };
        let link = `${API_BASE_URL}/InfoCars/GetMenuItems?level=${filterData.level}&id=${filterData.id}`;

        // Apelăm API-ul pentru a aduce piesele filtrate
        const response = await fetch(link);
        const items = await response.json();

        // Afișăm piesele filtrate (acesta este doar un exemplu, se poate adapta pentru a le afișa într-o zonă anume)
        console.log(`Filtrare pentru ${name} la nivelul ${level}`);
        console.log(items);

        // Poți adăuga aici logica pentru a actualiza UI-ul cu piesele filtrate (ex: afișare într-un tabel, listă etc.)
    } catch (error) {
        console.error('Eroare la filtrarea pieselor:', error);
    }

    populateApiPath();      
}

async function generateDynamicMenu() {
    try {        
        const link = `${API_BASE_URL}/InfoCars/GetMenuItems`;
        const response = await fetch(link);
        const menuItems = await response.json();

        const menu = document.getElementById('dynamicMenu');
        const categoriiTipMap = new Map();
        const categoriiMap = new Map();

        menuItems.forEach(item => {
            const tipId = item.CategoriiTipId;
            const tipNume = item.CategoriiTipNume;
            const catId = item.CategoriiId;
            const catNume = item.CategoriiNume;
            const subId = item.CategoriiSubId;
            const subNume = item.CategoriiSubNume;

            if (tipId && tipNume) {
                if (!categoriiTipMap.has(tipId)) {
                    const tipElement = document.createElement('div');
                    tipElement.classList.add('menu-item');
                    tipElement.innerHTML = `<a href="#" class="menu-link">${tipNume}</a><div class="submenu"></div>`;
                    menu.appendChild(tipElement);
                    categoriiTipMap.set(tipId, tipElement.querySelector('.submenu'));

                    // Adăugăm funcția de click pentru CategoriiTip
                    tipElement.querySelector('.menu-link').addEventListener('click', function() {
                        handleMenuClick('tip', tipId, tipNume);  // Apelăm funcția de filtrare pentru Nivel 1
                    });
                }

                // Verifică dacă există date pentru Categorii și creează doar dacă sunt valide
                if (Number.isInteger(catId) && catNume) {
                    if (!categoriiMap.has(catId)) {
                        const catElement = document.createElement('div');
                        catElement.classList.add('submenu-item');
                        catElement.dataset.catId = catId;
                        catElement.innerHTML = `<a href="#" class="menu-link">${catNume}</a><div class="subsubmenu"></div>`;
                        categoriiTipMap.get(tipId).appendChild(catElement);
                        categoriiMap.set(catId, catElement.querySelector('.subsubmenu'));

                        // Adăugăm funcția de click pentru Categorii
                        catElement.querySelector('.menu-link').addEventListener('click', function() {
                            handleMenuClick('categorie', catId, catNume);  // Apelăm funcția de filtrare pentru Nivel 2
                        });
                    }

                    // Verifică dacă există date pentru CategoriiSub și creează doar dacă sunt valide
                    if (Number.isInteger(subId) && subNume) {
                        const subElement = document.createElement('div');
                        subElement.classList.add('subsubmenu-item');
                        subElement.innerHTML = `<a href="#" class="menu-link">${subNume}</a>`;
                        categoriiMap.get(catId).appendChild(subElement);

                        // Adăugăm funcția de click pentru CategoriiSub
                        subElement.querySelector('.menu-link').addEventListener('click', function() {
                            handleMenuClick('subcategorie', subId, subNume);  // Apelăm funcția de filtrare pentru Nivel 3
                        });
                    }
                }
            }
        });
    } catch (error) {
        console.error('Eroare la generarea meniului dinamic:', error);
    }
}








