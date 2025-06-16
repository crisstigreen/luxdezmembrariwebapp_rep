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
let tipFiltrare = "";

// window.onload = function() {
//  document.getElementById('link-Piese').classList.add('active');
// }

window.addEventListener('DOMContentLoaded', () => {
    debugger;
    document.getElementById('prev-page').addEventListener('click', () => changePage(-1));
    document.getElementById('next-page').addEventListener('click', () => changePage(1));
       
    //new
    parsePathAndFilterOnLoad();

    //debugger;
    getCarsPieseForDropdown(function(cars) {
        //debugger;
        populateDropdown(cars);
    });
});



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
    

//POPULATE Piese GRID
 function populatePieseShopGrid(data){
    const rezultateDiv = document.getElementById('rezultatePiese');
    rezultateDiv.innerHTML = '';
    //debugger;
    
    data.piese.forEach(piesa => {
      
        //debugger;       
        //img.src = `${API_BASE_URL_IMG}/${image.denumireImagine}?v=${Date.now()}`;

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
                        <a  href="${generatePiesaUrl(piesa)}">                        
                            <img src="${imageSrc}" alt="${piesa.nume}" id="piesaImagine-${piesa.id}">
                        </a>
                    </figure>
                    </div>
                    <div class="card-body" id="piesa-${piesa.id}">
                        <h3 style="font-weight: bold;">
                            <a href="${generatePiesaUrl(piesa)}">${piesa.nume} ${piesa.codPiesa} ${piesa.masina} ${piesa.motorizare} ${piesa.codMotor} ${piesa.remarks}</a>
                        </h3>
                        <div class="card-desc-piese">
                            <p>Masina: <span id="piesaMasina-${piesa.id}">${piesa.masina}</span></p>
                            <p style='display:none' id="piesaStoc-${piesa.id}">${piesa.stoc}</p>
                            <p>Cod intern: <span id="piesaCodintern-${piesa.id}">${piesa.locatie}</span></p>
                            <p>SKU_ID: <span id="piesasku_ID-${piesa.id}">${piesa.skU_Id}</span></p>
                            <p>Disponibilitate: ${piesa.stoc > 0 ? `<span> <img src='/images/CheckmarkCircle.svg' alt="Disponibil"/> În stoc (${piesa.stoc})` : '<span>Fără stoc</span>'}</p>
                        </div>
                        <div class="card-footer">
                            <h4 id="piesaPret-${piesa.id}">${piesa.pret.replace('RON','').trim()}<span>RON</span></h4>
                            <a class="btn-primary" ${cartImageEvents}>
                                Cumpără
                                <img src='/images/ShoppingBagW.svg'  alt="Adauga in cos"   />
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 200); // Rămâne deschis pentru 1000 ms (1 secundă)

}



function onImageClick(idPiesa) {
    debugger;
    var nume =document.getElementById(`piesaTitlu-${idPiesa}`).innerText;
    var pretText = document.getElementById(`piesaPret-${idPiesa}`).innerText;
    var pret = parseInt(pretText.match(/\d+/)[0]); // Extrage doar numărul din text        
    var imagini = document.getElementById(`piesaImagine-${idPiesa}`).src;
    var masina = document.getElementById(`piesaMasina-${idPiesa}`).innerText;

   // var tipCaroserie = document.getElementById(`piesaTipCaroserie-${idPiesa}`).innerText;
    var codIntern = document.getElementById(`piesaCodintern-${idPiesa}`).innerText;
    var stoc = document.getElementById(`piesaStoc-${idPiesa}`).innerText;

    if(idPiesa){
        const product = {
            id: idPiesa.toString(),
            name: nume,
            quantity: 1,
            pret: pret,
            pretTotal: pret,
            imagini: imagini,
            masina: masina,            
            codIntern: codIntern,
            stoc: stoc
        };
        addToCart(product);
        window.location.href = '/cart.html'; // Redirecționează către pagina de coș
    }
}

 // Funcția API GET DATE pentru a căuta piese după Marca, Model și Generatie
async function pieseApiCallFields(marca, model, generatie, currentPage, pageSize, orderTerm) {
    debugger;
    //tip filtrare - cautare marca existenta
    const link = "http://localhost:5012/api/Piese/search_marcabyname?partialName=" + selectedTip;  
    var tipFiltrareObj = await get(link);
    tipFiltrare = tipFiltrareObj.length == 0 ? "byCateg" : "byMarca";
    

    //EXTRAG DIN URL   
    var menuSend = "";
    switch (Nivel) {
        case 1:
            menuSend = selectedTip;
            break;
        case 2:
            menuSend = selectedCategorie;
            break;
        case 3:
            menuSend = selectedSubcategorie;
            break;
    }

    if(tipFiltrare == 'byCateg'){     //*****byCateg
        //meniu
        if (!currentURL.includes("html") && !/\/[a-z0-9\-]+-\d+$/i.test(currentURL))
        {
            linkId = `${API_BASE_URL}/Piese?menu=` + menuSend + `&tip=` + Nivel;
            IdSubCat = await get(linkId);
        }
    }
    else{                             //*****byMarca        
        //marci
        linkMarciDuble = "http://localhost:5012/api/InfoCars/GetMarciDuble";  
        const marciDuble = await get(linkMarciDuble);
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
   
    // Curățare finală, evităm valori undefined
    if (!marca) { model = ""; generatie = ""; }
    if (!model) { generatie = ""; }

    const url = `${API_BASE_URL}/Piese/search_fields?Marca=${encodeURIComponent(marca)}&Model=${encodeURIComponent(model)}&Generatie=${encodeURIComponent(generatie)}&IdSubCat=${encodeURIComponent(IdSubCat)}&Nivel=${encodeURIComponent(Nivel)}&PageNumber=${encodeURIComponent(currentPage)}&PageSize=${encodeURIComponent(pageSize)}&OrderBy=${encodeURIComponent(orderTerm)}`;

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Eroare la obținerea datelor');
            }
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            document.getElementById('rezultate-tabel').innerText = 'A apărut o eroare la căutarea pieselor.';
            throw error;
        });
}

 



function pieseApiCallBySubcat(idSubCat, nivel, currentPage, pageSize, orderTerm) {          
      const url = `${API_BASE_URL}/Piese/get_by_subcat` +
        `?IdCategorie=${encodeURIComponent(idSubCat)}` +
        `&Nivel=${encodeURIComponent(nivel)}` +
        `&PageNumber=${encodeURIComponent(currentPage)}` +
        `&PageSize=${encodeURIComponent(pageSize)}` +
        `&OrderBy=${encodeURIComponent(orderTerm)}`;
    

    // Arătăm loader-ul în timp ce așteptăm răspunsul
    Swal.fire({
        title: 'Loading...',
        text: 'Please wait while we fetch the data.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    // Facem fetch la API
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Eroare la obținerea datelor');
            }
            return response.json();
        })
        .then(data => {
            Swal.close(); // Ascundem loader-ul după primirea datelor
            return data;  // Returnăm datele primite (obiectul cu Piese și TotalPages)
        })
        .catch(error => {
            document.getElementById('rezultate-tabel').innerText = 'A apărut o eroare la căutarea pieselor.';
            Swal.close();
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
       window.scrollTo({ top: 0, behavior: 'smooth' });                              
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
        //debugger;
        if(marca == "" && model == "" && generatie == "" && IdSubCat == "" && Nivel == ""){
            pieseApiCall(populatePieseShopGrid);                       
        }
        else{
            //debugger;
            pieseApiCallFields(marca, model, generatie, currentPage, pageSize, orderTerm)
            .then(data => {                
                populatePieseShopGrid(data);
            })
                .catch(error => {
                    console.error('Eroare la obținerea datelor:', error);
            });     
        }                    
}








