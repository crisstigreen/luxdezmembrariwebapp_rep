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
let marcaId = null;
let modelId = null;
let generatieId = null;

let allMarci = [];
let allModels = [];
let allGeneratii = []
let IdSubCat = "";
let Nivel = "";

let selectedTip = '';
let selectedCategorie = '';
let selectedSubcategorie = '';


window.addEventListener('DOMContentLoaded', () => {
    const pathSegments = window.location.pathname.split('/').filter(segment => segment);

    // Dacă avem mai mult de 1 segment în path (ex: cutii-de-viteze/suport-cutii-viteze)
    if (pathSegments.length > 1) {
        window.location.href = '/index.html';
    }
});

//get cars
document.addEventListener('DOMContentLoaded', function() {
    const containerMarca = document.getElementById('checkboxContainerMarca');
    getCarsPieseForDropdown(function(cars) {
        populateCheckboxesMarca(cars, containerMarca);
    });

    getDescriere('test',0);
});

//populate grid
document.addEventListener('DOMContentLoaded', async  () => {
    //debugger;        
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

//hamburger
document.addEventListener('DOMContentLoaded', async function () {
    await generateDynamicMenu();

    const hamburger = document.getElementById('hamburgerButton');
    const menu = document.getElementById('dynamicMenu');

    hamburger.addEventListener('click', function () {
        this.classList.toggle('active');
        menu.classList.toggle('active');
    });
});

//side menu
document.addEventListener('DOMContentLoaded', function () {
    //debugger;
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
        //debugger;
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




//**********  CAUTARE ********************************************************************* */
//**********  CAUTARE ********************************************************************* */
//**********  CAUTARE ********************************************************************* */
//**********  CAUTARE ********************************************************************* */

document.getElementById('cautaBtn').addEventListener('click', () => {
    //debugger;
    searchTerm = document.getElementById('tb_cauta').value.trim();
    currentPage = 1; // Resetăm la prima pagină
    pieseApiCall(populateShopGrid);       
});
document.getElementById('tb_cauta').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        //debugger;
        searchTerm = event.target.value.trim();
        currentPage = 1; // Resetăm la prima pagină
        pieseApiCall(populateShopGrid);
             
    }
});


//**********  POPULATE GRID ********************************************************************* */
//**********  POPULATE GRID ********************************************************************* */
//**********  POPULATE GRID ********************************************************************* */
//**********  POPULATE GRID ********************************************************************* */



function generatePiesaUrl(piesa) {
    //debugger;
    let categorie = document.getElementById("numeCatSelectata").value.trim(); // Obține categoria selectată
    
    // Transformă categoria în format URL-friendly, dar păstrează spațiile
    categorie = categorie
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ''); // Elimină caracterele speciale, dar păstrează spațiile

    let masina = piesa.masina
        .toLowerCase()
        .replace(/\s+/g, '-')  // Înlocuiește spațiile cu '-' (pentru mașină)
        .replace(/[^a-z0-9\-]/g, ''); // Elimină caracterele speciale
    
    const queryParam = getQueryParam('id');
    let final = categorie ? `/${categorie}-${masina}-${piesa.id}` : `/${masina}-${queryParam == null ? piesa.id : piesa.idPiesa}`;     
    return final;
}
    
    



 //POPULATE GRID
 function populateShopGrid(data){
    const rezultateDiv = document.getElementById('rezultate');
    rezultateDiv.innerHTML = '';
    //debugger;
    //cristi testache
    
    data.piese.forEach(piesa => {
        //debugger;       
        var imageSrc = piesa.imagini ? `${API_BASE_URL_IMG}/` + piesa.imagini[0] : 'images/placeholder.jpg';
        if(piesa.imagini != null && piesa.imagini.length == 0){
            imageSrc = '/images/placeholder.jpg';
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
            <div class="col-sm-6 col-lg-4 mb-4">
                <div class="block-4 border d-flex flex-column" style="height: 450px;">
                    <figure class="block-4-image">
                        <a  href="${generatePiesaUrl(piesa)}">                        
                            <img src="${imageSrc}" style='width: 100%; height: 165px; object-fit: contain;object-position: center;' alt="Image placeholder" class="img-fluid" id="piesaImagine-${piesa.id}">
                           
                        </a>
                    </figure>


                        <div class="block-4-text padding10 d-flex flex-column flex-grow-1" id="piesa-${piesa.id}">

                        <h6 style="font-weight: bold;">
                            <a href="${generatePiesaUrl(piesa)}">${piesa.nume}</a>
                        </h6>



                        <p class="mb-0"><strong style='font-weight: bold'>Masina: </strong> <span id="piesaMasina-${piesa.id}">${piesa.masina}</span></p>
                        <p class="mb-0"><strong style='font-weight: bold'>Disponibilitate: </strong> ${piesa.stoc > 0 ? `În stoc (${piesa.stoc})` : 'Fără stoc'}</p>
                        <p class="mb-0" style='display:none' id="piesaStoc-${piesa.id}">${piesa.stoc}</p>
                        <p class="mb-0"><strong style='font-weight: bold; display:none'>Tip caroserie: </strong><span style='display:none' id="piesaTipCaroserie-${piesa.id}">${piesa.tipCaroserie}</span></p>
                        
                        <p class="mb-0"><strong style='font-weight: bold'>Cod intern: </strong><span id="piesaCodintern-${piesa.id}">${piesa.locatie}</span></p>
                        <p class="mb-0"><strong style='font-weight: bold'>SKU_ID: </strong><span id="piesasku_ID-${piesa.id}">${piesa.skU_Id}</span></p>
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
           // debugger;
            get_details(id); // Apelează funcția pentru a obține detaliile
        });
    });
     // Întârzierea închiderii loader-ului
    //  setTimeout(() => {
    //     Swal.close(); // Închide loader-ul
    //     window.scrollTo({ top: 0, behavior: 'smooth' });
    // }, 200); // Rămâne deschis pentru 1000 ms (1 secundă)
}



function onImageClick(idPiesa) {
    //debugger;
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
            //name: document.getElementById(`piesaTitlu-${idPiesa}`).innerText,
            name: "Ornament dreapta - hardcodat",
            quantity: 1,
            pret: pret,
            pretTotal: pret,
            imagini: imagini,
            masina: masina,            
            codIntern: codIntern,
            stoc: stoc
        };
        addToCart(product);
    }
}

 // Funcția API GET DATE pentru a căuta piese după Marca, Model și Generatie
 function pieseApiCallFields(marca, model, generatie, currentPage, pageSize, orderTerm) {
    //debugger;    
    if(marca == ""){model = ""; generatie = "";}
    if(model == ""){generatie = "";}                       
    const url = `${API_BASE_URL}/Piese/search_fields?Marca=${encodeURIComponent(marca)}&Model=${encodeURIComponent(model)}&Generatie=${encodeURIComponent(generatie)}&IdSubCat=${encodeURIComponent(IdSubCat)}&Nivel=${encodeURIComponent(Nivel)}&PageNumber=${encodeURIComponent(currentPage)}&PageSize=${encodeURIComponent(pageSize)}&OrderBy=${encodeURIComponent(orderTerm)}`;

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
            document.getElementById('rezultate-tabel').innerText = 'A apărut o eroare la căutarea pieselor.';
            //Swal.close(); // Ascunde loaderul la eroare
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
   //debugger;
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
    //debugger;
    orderTerm = document.getElementById('order_term').value;  
    populateApiPath();

}

function populateApiPath(){
        if(marca == "" && model == "" && generatie == "" && IdSubCat == null && Nivel == null){
            pieseApiCall(populateShopGrid);                       
        }
        else{
            //debugger;
            pieseApiCallFields(marca, model, generatie, currentPage, pageSize, orderTerm)
            .then(data => {                
                populateShopGrid(data);
            })
                .catch(error => {
                    console.error('Eroare la obținerea datelor:', error);
            });     
        }                    
}




// DEFAULT AIA BUNA Funcția care gestionează click-ul pe fiecare nivel de meniu
/* async function handleMenuClick(level, id, name) {
    debugger;
    document.getElementById("numeCatSelectata").value = name;
    if(level == 'tip'){
        Nivel = 1;
        getDescriere("CategoriiTip",id)
    }
    else if(level == 'categorie'){
        Nivel = 2;
        getDescriere("Categorii",id)
    }
    else if(level == 'subcategorie'){
        Nivel = 3
        getDescriere("CategoriiSub",id)
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
 */


async function handleMenuClick(level, id, name, parentTip = '', parentCategorie = '') {
    document.getElementById("numeCatSelectata").value = name;

    if (level === 'tip') {
        selectedTip = name;
        selectedCategorie = '';
        selectedSubcategorie = '';
        getDescriere("CategoriiTip", id);
    } else if (level === 'categorie') {
        selectedTip = parentTip;
        selectedCategorie = name;
        selectedSubcategorie = '';
        getDescriere("Categorii", id);
    } else if (level === 'subcategorie') {
        selectedTip = parentTip;
        selectedCategorie = parentCategorie;
        selectedSubcategorie = name;
        getDescriere("CategoriiSub", id);
    }

    IdSubCat = id;

    try {
        let link = `${API_BASE_URL}/InfoCars/GetMenuItems?level=${level}&id=${id}`;
        const response = await fetch(link);
        const items = await response.json();

        console.log(`Filtrare pentru ${name} la nivelul ${level}`);
        console.log(items);

        // 🔥 aici construiești linkul complet
        ChangeLinkCateg(selectedTip, selectedCategorie, selectedSubcategorie);
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

                    const hasChildren = menuItems.some(mi => mi.CategoriiTipId === tipId && Number.isInteger(mi.CategoriiId) && mi.CategoriiNume);

                    tipElement.innerHTML = `<a href="#" class="menu-link">${tipNume}${hasChildren ? '&nbsp;<i class="arrow down"></i>' : ''}</a><div class="submenu"></div>`;
                    menu.appendChild(tipElement);
                    categoriiTipMap.set(tipId, tipElement.querySelector('.submenu'));

                    tipElement.querySelector('.menu-link').addEventListener('click', function () {
                        handleMenuClick('tip', tipId, tipNume);
                    });
                }

                if (Number.isInteger(catId) && catNume) {
                    if (!categoriiMap.has(catId)) {
                        const catElement = document.createElement('div');
                        catElement.classList.add('submenu-item');
                        catElement.dataset.catId = catId;

                        const hasSubChildren = menuItems.some(mi => mi.CategoriiId === catId && Number.isInteger(mi.CategoriiSubId) && mi.CategoriiSubNume);

                        catElement.innerHTML = `<a href="#" class="menu-link">${catNume}${hasSubChildren ? ' <i class="arrow right"></i>' : ''}</a><div class="subsubmenu"></div>`;
                        categoriiTipMap.get(tipId).appendChild(catElement);
                        categoriiMap.set(catId, catElement.querySelector('.subsubmenu'));

                        catElement.querySelector('.menu-link').addEventListener('click', function () {
                            handleMenuClick('categorie', catId, catNume, tipNume); // trimitem tipNume ca părinte
                        });
                    }

                    if (Number.isInteger(subId) && subNume) {
                        const subElement = document.createElement('div');
                        subElement.classList.add('subsubmenu-item');
                        subElement.innerHTML = `<a href="#" class="menu-link">${subNume}</a>`;
                        categoriiMap.get(catId).appendChild(subElement);

                        subElement.querySelector('.menu-link').addEventListener('click', function () {
                            handleMenuClick('subcategorie', subId, subNume, tipNume, catNume); // trimitem ambii părinți
                        });
                    }
                }
            }
        });
    } catch (error) {
        console.error('Eroare la generarea meniului dinamic:', error);
    }
}



