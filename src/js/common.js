
//**********  GET POST UPDATE GENERIC ********************************************************************* */
//**********  GET POST UPDATE GENERIC********************************************************************* */
//**********  GET POST UPDATE GENERIC********************************************************************* */
//**********  GET POST UPDATE GENERIC********************************************************************* */

let prime = 0;

async function get(link) {
    try {
        const response = await fetch(link, {
            method: 'GET'
        });

        if (response.status === 404) {
            return null; // Returnează null pentru NotFound
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const objects = await response.json();
        return objects; // Returnează datele
    } catch (error) {
        if (error.message.includes('HTTP error! status: 404')) {
            console.log('Codul nu a fost găsit.'); // Mesaj prietenos pentru NotFound
            return null;
        } else {
            console.error('A apărut o eroare la apelarea API-ului:', error);
            return null; // Returnează null în caz de alte erori
        }
    }
}


async function insert(data, link) {
    try {
        const response = await fetch(link, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {  
            const errorMessage = await response.text();
            showErrorMessage(errorMessage);
            return { success: false, error: errorMessage || 'Eroare la înregistrare' };
        }

        const result = await response.json();
        showInsertSuccessMessage();
        //debugger;
        return { success: true, data: result }; 
    } catch (error) {
        return { success: false, error: `Eroare: ${error.message}` };
    }
}





async function update(id, data, link) {
    try {
        const response = await fetch(link, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            // Extragem mesajul de eroare din răspuns
            const errorMessage = await response.text();
            showErrorMessage(errorMessage);
            return { success: false, error: errorMessage || 'Eroare la actualizare' };
        }

        const result = await response.text(); // Dacă API-ul returnează NoContent, putem păstra acest pas
        showUpdateSuccessMessage();
        return { success: true, data: result }; // Returnăm rezultatul cu un flag de succes
    } catch (error) {
        // În caz de excepție, returnăm un obiect de eroare
        return { success: false, error: `Eroare: ${error.message}` };
    }
}


async function del(id, link) {
    const url = link;

    return fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: id
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Eroare la ștergere');
        }
        return response.text(); // sau response.json() dacă API-ul returnează JSON
    });
}



async function getCars(link) {
    
    try {
        const response = await fetch(link, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        //debugger;
        const cars = await response.json();
        populateDropdown(cars);
    } catch (error) {
        console.error('A apărut o eroare la apelarea API-ului:', error);
    }
}
function pieseApiCall(callback) {
    //debugger;
    searchTerm = document.getElementById('tb_cauta').value.trim();
    var url = "";    
    if (/^\d+$/.test(searchTerm)) {   //cautare dupa sku        
        url = `${API_BASE_URL}/Piese/search_sku?SearchTerm=${encodeURIComponent(searchTerm)}&PageNumber=${encodeURIComponent(currentPage)}&PageSize=${encodeURIComponent(pageSize)}&OrderBy=${encodeURIComponent(orderTerm)}`;
    } else {
        url = `${API_BASE_URL}/Piese/search?SearchTerm=${encodeURIComponent(searchTerm)}&PageNumber=${encodeURIComponent(currentPage)}&PageSize=${encodeURIComponent(pageSize)}&OrderBy=${encodeURIComponent(orderTerm)}`;
    }




    //const url = `${API_BASE_URL}/Piese/search?SearchTerm=${encodeURIComponent(searchTerm)}&PageNumber=${encodeURIComponent(currentPage)}&PageSize=${encodeURIComponent(pageSize)}&OrderBy=${encodeURIComponent(orderTerm)}`;
    
    // Afișează loaderul
    // Swal.fire({
    //     title: 'Loading...',
    //     text: 'Please wait while we fetch the data.',
    //     allowOutsideClick: false,
    //     didOpen: () => {
    //         Swal.showLoading();
    //     }
    // });

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

function populatePieseMasiniTable() {
    const carId = getQueryParam('id');
    const url =   `${API_BASE_URL}/InfoCars/GetById?IdMasina=` +  carId; 
        
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

            data.forEach(piesa => {
                const piesaRow = `
                    <tr data-id="${piesa.idPiesa}">
                        <td>${piesa.idPiesa}</td>
                        <td>${piesa.nume}</td>
                        <td>${piesa.nrOrdine}</td>
                        <td>${piesa.stoc}</td>
                        <td>${piesa.vandut}</td>
                        <td>${piesa.stoc - piesa.vandut}</td>
                        <td>${piesa.pret}</td>
                        <td>${piesa.discount}</td>
                        <td>${calculatePretVanzare(piesa.pret, piesa.discount)}</td>
                        <td>${piesa.autovit}</td>
                         <td>
                            <button class="edit-button" data-id="${piesa.idPiesa}"><i class="fas fa-edit" style="font-size:14px"></i></button>
                        </td>
                    </tr>
                `;
                rezultateTable.innerHTML += piesaRow;
            });

               // Adaugă eveniment pentru butoanele de editare
            document.querySelectorAll('.edit-button').forEach(button => {
                button.addEventListener('click', function (event) {
                    event.stopPropagation();
                    const id = this.getAttribute('data-id');                    
                    get_details(id); // Apelează funcția pentru a obține detaliile
                });
            });


            // Întârzierea închiderii loader-ului
            // setTimeout(() => {
            //     Swal.close(); // Închide loader-ul
            // }, 200); // Rămâne deschis pentru 200 ms

        })
        .catch(error => {
            console.error('Eroare:', error);
            document.getElementById('rezultate-tabel').innerText = 'A apărut o eroare la obținerea pieselor auto.';
        });
}

function pieseMasiniApiCall(callback) {
    
    const carId = getQueryParam('id');
    const url =   `${API_BASE_URL}/InfoCars/GetById?IdMasina=` +  carId; 
    
    // Afișează loaderul
    // Swal.fire({
    //     title: 'Loading...',
    //     text: 'Please wait while we fetch the data.',
    //     allowOutsideClick: false,
    //     didOpen: () => {
    //         Swal.showLoading();
    //     }
    // });

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Eroare la obținerea datelor');
            }
            return response.json();
        })
        .then(data => {            
            callback(data);
        })
        .catch(error => {
            console.error('Eroare:', error);
            document.getElementById('rezultate-tabel').innerText = 'A apărut o eroare la căutarea pieselor.';
        });
}

function carsApiCall(callback) {
    //debugger;
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


//**********  GET WITH CALL BACK ********************************************************************* */
//**********  GET WITH CALL BACK ********************************************************************* */
//**********  GET WITH CALL BACK ********************************************************************* */
//**********  GET WITH CALL BACK ********************************************************************* */
async function getCarsForDropdown(callback) {
    ////debugger;
    try {
        const url = `${API_BASE_URL}/Cars/get`;
        const response = await fetch(url, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const cars = await response.json();
        callback(cars)
    } catch (error) {
        console.error('A apărut o eroare la apelarea API-ului:', error);
    }
}
async function getCarsPieseForDropdown(callback) {
    ////debugger;
    try {
        const url = `${API_BASE_URL}/Cars/getCarsPiese`;
        const response = await fetch(url, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const cars = await response.json();
        callback(cars)
    } catch (error) {
        console.error('A apărut o eroare la apelarea API-ului:', error);
    }
}


async function getModelsForDropdown(marcaId, callback) {
    ////debugger;        
        try {            
            const link = `${API_BASE_URL}/Cars/getAllModels?marcaId=` + marcaId;  
                var models = await get(link);              
                callback(models)          
        } catch (error) {
            console.error('A apărut o eroare la apelarea API-ului pentru modele:', error);
        }
    
}
async function getGeneratiiForDropdown(modelId, callback) {
    try {
        const link = `${API_BASE_URL}/Cars/GetGeneratiiByModelId?modelId=` + modelId;  
            var generatii = await get(link);  
            callback(generatii);                       
    } catch (error) {
        console.error('A apărut o eroare la apelarea API-ului pentru generații:', error);
    }
}

//**********  GET LISTS ********************************************************************* */
//**********  GET LISTS ********************************************************************* */
//**********  GET LISTS ********************************************************************* */
//**********  GET LISTS ********************************************************************* */
function getBrandList() {
    const brandDropdown = document.getElementById('ddd_cars');
    return Array.from(brandDropdown.options)
                .map(option => option.text)
                .filter(text => text.trim() !== '');
}
function getModelList() {
    const modelDropdown = document.getElementById('ddd_models');
    return Array.from(modelDropdown.options)
                .map(option => option.text)
                .filter(text => text.trim() !== '');
}
function getGeneratieList() {
    const generatieDropdown = document.getElementById('ddd_generatii');
    return Array.from(generatieDropdown.options)
                .map(option => option.text)
                .filter(text => text.trim() !== '');
}

//**********  EXTRACTS ********************************************************************* */
//**********  EXTRACTS ********************************************************************* */
//**********  EXTRACTS ********************************************************************* */
//**********  EXTRACTS ********************************************************************* */
function extractCarBrand(fullName) {
    let brand = '';
    let parts = fullName.split(' ');

    const brandList = getBrandList(); // Obține lista de branduri actuală

    for (let i = 0; i < parts.length; i++) {
        if (brand) brand += ' ';
        brand += parts[i];

        // Verifică dacă brandul este valid
        if (brandList.includes(brand)) {
            return brand;
        }
    }

    return 'Unknown Brand'; // Dacă nu se găsește niciun brand
}
async function extractCarModel(fullName, brand) {
    ////debugger;
    const brandEndIndex = fullName.indexOf(brand) + brand.length;
    let rest = fullName.substring(brandEndIndex).trim();
    
    let model = '';
    let parts = rest.split(/ (?=\S)/); // Împarte la prima apariție a unui spațiu urmat de un caracter non-spațiu

    const modelList = getModelList(); // Obține lista de modele actuală

    for (let i = 0; i < parts.length; i++) {
        if (model) model += ' ';
        model += parts[i];    
        if (modelList.includes(model)) {
            return model;
        }
    }
    return 'Unknown Model'; // Dacă nu se găsește niciun model
}
async function extractCarGeneratie(fullName, model) {
    // Înlocuiește parantezele pătrate cu paranteze rotunde
    fullName = fullName.replace(/\[/g, '(').replace(/\]/g, ')');

    const modelIndex = fullName.indexOf(model) + model.length;
    let rest = fullName.substring(modelIndex).trim();
    
    let generatie = '';
    let parts = rest.split(/ (?=\S)/); // Împarte la prima apariție a unui spațiu urmat de un caracter non-spațiu

    const generatieList = getGeneratieList(); // Obține lista de generații actuală

    for (let i = 0; i < parts.length; i++) {
        if (generatie) generatie += ' ';
        generatie += parts[i];
        
        // Verifică dacă generația este validă
        if (generatieList.includes(generatie)) {
            return generatie;
        }
    }

    return 'Unknown Generation'; // Dacă nu se găsește nicio generație
}

//**********  POPULATE DD ********************************************************************* */
//**********  POPULATE DD ********************************************************************* */
//**********  POPULATE DD ********************************************************************* */
//**********  POPULATE DD ********************************************************************* */
function populateDropdown(cars) {
    //debugger;
    const dropdown = document.getElementById('ddd_cars');
    dropdown.innerHTML = '<option value="">Marca</option>';
    cars.forEach(car => {
        const option = document.createElement('option');
        option.value = car.marcaID; // `id` corespunde `Id` din C#
        option.text = car.marcaName; // `f2` corespunde `F2` din C#
        dropdown.appendChild(option);
    });
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
}
function populateModelsDropdown(models) {
    //debugger;
    var currentURL = window.location.href;
    if(currentURL.includes("nomenclator")){         
        if (quill) {  
            setTimeout(() => {
                quill.root.innerHTML = models.descriere ? models.descriere : '';        
            }, 0);
        }
    }
   
    const dropdown = document.getElementById('ddd_models');
    dropdown.innerHTML = '<option value="">Model</option>'; // Resetare dropdown
    // Adaugă opțiunile din lista de modele
    models.items.forEach(model => {
        const option = document.createElement('option');
        option.value = model.modelID; // `id` corespunde `Id` din C#
        option.text = model.modelName; // `name` corespunde `Name` din C#
        dropdown.appendChild(option);
    });
}
function populateGeneratiiDropdown(generatii) {
    var currentURL = window.location.href;
    if(currentURL.includes("nomenclator")){        
        if (quill) {  
            setTimeout(() => {
                quill.root.innerHTML = generatii.descriere ? generatii.descriere : '';        
            }, 0);
        }
    }    
    const dropdown = document.getElementById('ddd_generatii');
    dropdown.innerHTML = '<option value="">Generație</option>'; // Resetare dropdown

    // Adaugă opțiunile din lista de generații
    generatii.items.forEach(generatie => {
        const option = document.createElement('option');
        option.value = generatie.generatieID; // `id` corespunde `Id` din C#
        option.text = generatie.generatieName; // `name` corespunde `Name` din C#
        dropdown.appendChild(option);
    });
}

//**********  EVENTS DD ********************************************************************* */
//**********  EVENTS DD ********************************************************************* */
//**********  EVENTS DD ********************************************************************* */
//**********  EVENTS DD ********************************************************************* */
const dddCarsElement = document.getElementById('ddd_cars');
if (dddCarsElement) {
    dddCarsElement.addEventListener('change', function() {
        //debugger;
        const marcaId = this.value;
        var tbMarca = document.getElementById("tb_cars");
        if(tbMarca){
            tbMarca.value = getSelectedText('ddd_cars');  
        }
        if (marcaId) {
            getModelsForDropdown(marcaId, populateModelsDropdown);
        } else {
            // Curăță dropdown-ul de modele dacă nu este selectată nicio marcă
            document.getElementById('ddd_models').innerHTML = '<option value="">Model</option>';
        }
    });
}
const dddModelsElement = document.getElementById('ddd_models');
if (dddModelsElement) {
    document.getElementById('ddd_models').addEventListener('change', function() {
        //debugger;
        const modelId = this.value;
        var tbModel = document.getElementById("tb_models");
        if(tbModel){
            tbModel.value = getSelectedText('ddd_models');  
        }
        if (modelId) {
            getGeneratiiForDropdown(modelId, populateGeneratiiDropdown);
        } else {
            // Curăță dropdown-ul de generații dacă nu este selectat niciun model
            document.getElementById('ddd_generatii').innerHTML = '<option value="">Generație</option>';
        }
    });
}

const dddGeneratiiElement = document.getElementById('ddd_generatii');
if (dddModelsElement) {
    document.getElementById('ddd_generatii').addEventListener('change', async function() {
        //debugger;        
        var tbGeneratii = document.getElementById("tb_generatii");
        if(tbGeneratii){
            tbGeneratii.value = getSelectedText('ddd_generatii');  
        }  
        const generId = getSelectedValue('ddd_generatii');
        const link = `${API_BASE_URL}/Cars/GetGeneratiiByIdDesc?id=` + generId;  
        const generatie = await get(link);
        var currentURL = window.location.href;
        if(currentURL.includes("nomenclator")){            
            if (quill) {  
                setTimeout(() => {
                    quill.root.innerHTML = generatie.descriere ? generatie.descriere : '';        
                }, 0);
            }
            
        }                             
    });
}

//**********  POPULATE OTHERS ********************************************************************* */
//**********  POPULATE OTHERS ********************************************************************* */
//**********  POPULATE OTHERS ********************************************************************* */
//**********  POPULATE OTHERS ********************************************************************* */
function populateCombustibilDropdown() {
    const url = `${API_BASE_URL}/InfoCars/GetCombustibil`;
    
    return fetch(url) // Returnează promisiunea
        .then(response => {
            if (!response.ok) {
                throw new Error('Eroare la obținerea datelor de combustibil');
            }
            return response.json();
        })
        .then(data => {
            const combustibilDropdown = document.getElementById('ddd_combustibil');
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.text = item.numeCombustibil;
                combustibilDropdown.add(option);
            });
        })
        .catch(error => {
            console.error('Eroare:', error);
            document.getElementById('ddd_combustibil').innerText = 'A apărut o eroare la încărcarea datelor de combustibil.';
        });
}
function populateTractiuneDropdown() {
    ////debugger;
    const url =  `${API_BASE_URL}/InfoCars/GetTractiune`; 
    
    return fetch(url) // Returnează promisiunea
        .then(response => {
            if (!response.ok) {
                throw new Error('Eroare la obținerea datelor de tracțiune');
            }
            return response.json();
        })
        .then(data => {
            const tractiuneDropdown = document.getElementById('ddd_Tractiune');
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.text = item.numeTractiune;
                tractiuneDropdown.add(option);
            });
        })
        .catch(error => {
            console.error('Eroare:', error);
            document.getElementById('ddd_Tractiune').innerText = 'A apărut o eroare la încărcarea datelor de tracțiune.';
        });
}
function populateTipCutieDropdown() {
    const url = `${API_BASE_URL}/InfoCars/GetTipCutieViteze`;
    
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Eroare la obținerea datelor de tip cutie viteze');
            }
            return response.json();
        })
        .then(data => {
            const tipCutieDropdown = document.getElementById('ddd_tipCutie');
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.text = item.numeCutieViteze; // Presupunem că acesta este câmpul pentru numele tipului de cutie
                tipCutieDropdown.add(option);
            });
        })
        .catch(error => {
            console.error('Eroare:', error);
            document.getElementById('ddd_tipCutie').innerText = 'A apărut o eroare la încărcarea datelor de tip cutie viteze.';
        });
}
function populateCuloareDropdown() {
    ////debugger;
    const url = `${API_BASE_URL}/InfoCars/GetCuloare`;
    
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Eroare la obținerea datelor de culoare');
            }
            return response.json();
        })
        .then(data => {
            const culoareDropdown = document.getElementById('ddd_culoare');
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.text = item.numeCuloare; // Presupunem că acesta este câmpul pentru numele culorii
                culoareDropdown.add(option);
            });
        })
        .catch(error => {
            console.error('Eroare:', error);
            document.getElementById('ddd_culoare').innerText = 'A apărut o eroare la încărcarea datelor de culoare.';
        });
}
function populateTipCaroserieDropdown() {
    ////debugger;
    const url = `${API_BASE_URL}/InfoCars/GetTipCaroserie`;
    
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Eroare la obținerea datelor de Tip Caroserie');
            }
            return response.json();
        })
        .then(data => {
            const tipCaroserieDropdown = document.getElementById('ddd_TipCaroserie');
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.text = item.tipRO; // Presupunem că acesta este câmpul pentru numele culorii
                tipCaroserieDropdown.add(option);
            });
        })
        .catch(error => {
            console.error('Eroare:', error);
            document.getElementById('ddd_TipCaroserie').innerText = 'A apărut o eroare la încărcarea datelor de tip caroserie.';
        });
}

//**********  POPULATE CB, HANDKE, RESTORE ********************************************************************* */
//**********  POPULATE CB, HANDKE, RESTORE ********************************************************************* */
//**********  POPULATE CB, HANDKE, RESTORE ********************************************************************* */
//**********  POPULATE CB, HANDKE, RESTORE ********************************************************************* */




function ChangeLink(marca, model, generatie) { 
    // Transformă valorile în format URL-friendly
    let marcaUrl = marca.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
    let modelUrl = model ? model.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '') : '';
    let generatieUrl = generatie ? generatie.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '') : '';

    // Construiește URL-ul nou
    let newPath = marcaUrl;
    if (modelUrl) {
        newPath += '-' + modelUrl;
    }
    if (generatieUrl) {
        newPath += '-' + generatieUrl;
    }

    let newUrl = `/${newPath}`;

    // Actualizează URL-ul fără reîncărcare
    history.pushState({}, '', newUrl);

    console.log("URL actualizat:", newUrl);
}

function ChangeLinkCateg(tip, categorie, subcategorie) {
    // Transformă valorile în format URL-friendly
    let tipUrl = tip ? tip.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '') : '';
    let categorieUrl = categorie ? categorie.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '') : '';
    let subcategorieUrl = subcategorie ? subcategorie.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '') : '';

    // Construiește URL-ul
    let newPath = '';
    if (tipUrl) newPath += `/${tipUrl}`;
    if (categorieUrl) newPath += `/${categorieUrl}`;
    if (subcategorieUrl) newPath += `/${subcategorieUrl}`;

    // Actualizează URL-ul fără reîncărcare
    history.pushState({}, '', newPath);

    console.log("URL actualizat pentru categorie:", newPath);
}




function handleMarcaChange(checkbox) {  //container este container ul tot
    //debugger;
    currentPage = 1;
    marca = checkbox.checked ? checkbox.nextSibling.textContent : "";
    marcaId = checkbox.value;
    document.getElementById('tb_cauta').value = "";
    if(checkbox.checked == false){
        marcaId = 0;
    }
    getDescriere('Marca',marcaId);

    let marcaContainer;
    let modelContainer; 
    if (checkbox.closest('#filterSidebar')) {
        modelContainer = document.getElementById('checkboxContainerModelSidebar'); // Containerul din bara laterală
        marcaContainer = document.getElementById("checkboxContainerMarcaSidebar");
    } else {
        modelContainer = document.getElementById('checkboxContainerModel'); // Containerul principal
        marcaContainer = document.getElementById("checkboxContainerMarca");
    }    
      marcaContainer.innerHTML = '';
      modelContainer.innerHTML = '';
    if (checkbox.checked) {
              
        const checkboxWrapper = document.createElement('div');
        checkboxWrapper.style.marginBottom = '10px'; // Adaugă spațiu între checkbox-uri

        const label = checkbox.nextSibling; // Obține eticheta asociată
        checkboxWrapper.appendChild(checkbox);
        checkboxWrapper.appendChild(label); // Adaugă eticheta
        marcaContainer.appendChild(checkboxWrapper);        
        getModelsForDropdown(marcaId, function(models) {
            populateCheckboxesModel(models, modelContainer);
        });
    } else {
        restoreMarcaCheckboxes(marcaContainer);
    }
    model = "";
    generatie = "";
    pieseApiCallFields(marca, model, generatie, currentPage, pageSize, orderTerm)
        .then(data => {                
            populateShopGrid(data);
        })
        .catch(error => {
            console.error('Eroare la obținerea datelor:', error);
        });


    //COD LINK    
    //debugger;    

    
    ChangeLink(marca,model,generatie);
}




function restoreMarcaCheckboxes(container) {
    //debugger;
    populateCheckboxesMarca(allMarci,container);
}
function populateCheckboxesMarca(cars, container) {
    ////debugger;
    allMarci = cars;
    cars.forEach(car => {
        const checkboxWrapper = document.createElement('div');
        checkboxWrapper.style.marginBottom = '10px'; // Adaugă spațiu între checkbox-uri

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `marca_${car.marcaID}`; // Asigură-te că fiecare checkbox are un ID unic
        checkbox.value = car.marcaID; // ID-ul mărcii
        checkbox.addEventListener('change', function() {
            handleMarcaChange(this);
        });

        const label = document.createElement('label');
        label.htmlFor = `marca_${car.marcaID}`;
        label.textContent = car.marcaName;
        label.style.fontWeight = 'bold'; 
        label.style.color = '#007bff'; 
        label.style.marginLeft = '5px';                     
        label.style.fontSize = '15px';

        checkboxWrapper.appendChild(checkbox);
        checkboxWrapper.appendChild(label);

        container.appendChild(checkboxWrapper);
    });
}

//------------------------------------------------

function handleModelChange(checkbox) {
    //debugger;
    currentPage = 1;
    model = checkbox.checked ? checkbox.nextSibling.textContent : "";
    modelId = checkbox.value;
    document.getElementById('tb_cauta').value = "";
    if(checkbox.checked == false){                
        getDescriere('Marca',marcaId);        
    }
    getDescriere('Model',modelId);
   
    let modelContainer;  
    let generatieContainer;

    if (checkbox.closest('#filterSidebar')) {
        modelContainer = document.getElementById('checkboxContainerModelSidebar'); // Containerul din bara laterală
        generatieContainer = document.getElementById("checkboxContainerGeneratieSidebar");
    } else {
        modelContainer = document.getElementById('checkboxContainerModel'); // Containerul principal
        generatieContainer = document.getElementById("checkboxContainerGeneratie");
    }    
    
      modelContainer.innerHTML = '';
      generatieContainer.innerHTML = '';

    if (checkbox.checked) {
        const checkboxWrapper = document.createElement('div');
        checkboxWrapper.style.marginBottom = '10px'; // Adaugă spațiu între checkbox-uri

        const label = checkbox.nextSibling; // Obține eticheta asociată
        checkboxWrapper.appendChild(checkbox);
        checkboxWrapper.appendChild(label); // Adaugă eticheta
        modelContainer.appendChild(checkboxWrapper);

        // Obține generațiile pentru modelul selectat
        //getGeneratiiForDropdown(modelId, generatii => populateCheckboxesGeneratie(generatii, document.getElementById('checkboxContainerGeneratie')));
        getGeneratiiForDropdown(modelId, function(generatii) {
            populateCheckboxesGeneratie(generatii, generatieContainer);
        });
    } else {
        // Restaurează lista completă de modele
        restoreModelCheckboxes(modelContainer);
    }
    //debugger;
    generatie = "";
    pieseApiCallFields(marca, model, generatie, currentPage, pageSize, orderTerm)
        .then(data => {                
            populateShopGrid(data);
        })
        .catch(error => {
            console.error('Eroare la obținerea datelor:', error);
        });


    ChangeLink(marca,model,generatie);
}
function restoreModelCheckboxes(container) {
    populateCheckboxesModel(allModels,container);
}
function populateCheckboxesModel(models, container) {
    //debugger;
    allModels = models;
    models.items.forEach(model => {
        const checkboxWrapper = document.createElement('div');
        checkboxWrapper.style.marginBottom = '10px'; // Adaugă spațiu între checkbox-uri

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `model_${model.modelID}`; // Asigură-te că fiecare checkbox are un ID unic
        checkbox.value = model.modelID; // ID-ul modelului
        checkbox.addEventListener('change', function() {
            handleModelChange(this);
        });

        const label = document.createElement('label');
        label.htmlFor = `model_${model.modelID}`;
        label.textContent = model.modelName;
        label.style.fontWeight = 'bold'; 
        label.style.color = '#007bff'; 
        label.style.marginLeft = '5px';                     
        label.style.fontSize = '15px';

        checkboxWrapper.appendChild(checkbox);
        checkboxWrapper.appendChild(label);

        container.appendChild(checkboxWrapper);
    });
}
//------------------------------------------------

function handleGeneratieChange(checkbox,container) {
    currentPage = 1;
    generatie = checkbox.checked ? checkbox.nextSibling.textContent : "";
    generatieId = checkbox.value;
    document.getElementById('tb_cauta').value = "";

    if(checkbox.checked == false){                
        getDescriere('Model',modelId);        
    }
    getDescriere('Generatie',generatieId);

    let generatieContainer;

    if (checkbox.closest('#filterSidebar')) {        
        generatieContainer = document.getElementById("checkboxContainerGeneratieSidebar");
    } else {        
        generatieContainer = document.getElementById("checkboxContainerGeneratie");
    }  
    generatieContainer.innerHTML = '';

    if (checkbox.checked) {
        const checkboxWrapper = document.createElement('div');
        checkboxWrapper.style.marginBottom = '10px'; // Adaugă spațiu între checkbox-uri

        const label = checkbox.nextSibling; // Obține eticheta asociată
        checkboxWrapper.appendChild(checkbox);
        checkboxWrapper.appendChild(label); // Adaugă eticheta

        generatieContainer.appendChild(checkboxWrapper);

    } else {
        // Restaurează lista completă de generații
        restoreGeneratieCheckboxes(generatieContainer);
    }
    //cristi fields
    //debugger;
    pieseApiCallFields(marca, model, generatie, currentPage, pageSize, orderTerm)
        .then(data => {                
            populateShopGrid(data);
        })
        .catch(error => {
            console.error('Eroare la obținerea datelor:', error);
        });

    ChangeLink(marca,model,generatie);
}
function restoreGeneratieCheckboxes(container) {
    populateCheckboxesGeneratie(allGeneratii,container);
}
function populateCheckboxesGeneratie(generatii,container) {
    //debugger;
    allGeneratii = generatii;    

    generatii.items.forEach(generatie => {
        const checkboxWrapper = document.createElement('div');
        checkboxWrapper.style.marginBottom = '10px'; // Adaugă spațiu între checkbox-uri

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `generatie_${generatie.generatieID}`; // Asigură-te că fiecare checkbox are un ID unic
        checkbox.value = generatie.generatieID; // ID-ul generației
        checkbox.addEventListener('change', function() {
            handleGeneratieChange(this);
        });

        const label = document.createElement('label');
        label.htmlFor = `generatie_${generatie.generatieID}`;
        label.textContent = generatie.generatieName;
        label.style.fontWeight = 'bold'; 
        label.style.color = '#007bff'; 
        label.style.marginLeft = '5px';                     
        label.style.fontSize = '15px';

        checkboxWrapper.appendChild(checkbox);
        checkboxWrapper.appendChild(label);

        container.appendChild(checkboxWrapper);
    });
}

//**********  GET SET SELECTED ********************************************************************* */
//**********  GET SET SELECTED ********************************************************************* */
//**********  GET SET SELECTED ********************************************************************* */
//**********  GET SET SELECTED ********************************************************************* */

function getSelectedValue(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
        return dropdown.value;
    }
    return null;
}

function getSelectedText(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
        const selectedOption = dropdown.options[dropdown.selectedIndex];
        if (selectedOption) {
            return selectedOption.text;
        }
    }
    return null;
}


async function setSelectedValue(selectId, value) {


    setTimeout(() => {
            
   

        const selectElement = document.getElementById(selectId);
        const options = selectElement.options;

        for (let i = 0; i < options.length; i++) {
            if (options[i].text === value) {
                selectElement.selectedIndex = i;
                break;
            }
        }

    }, 100);
}  

async function setSelectedValueVal(selectId, value) {
    const selectElement = document.getElementById(selectId);
    const options = selectElement.options;

    for (let i = 0; i < options.length; i++) {
        if (options[i].value === value.toString()) {
            selectElement.selectedIndex = i;
            break;
        }
    }
}  

//**********  MESSAGES ********************************************************************* */
//**********  MESSAGES ********************************************************************* */
//**********  MESSAGES ********************************************************************* */
//**********  MESSAGES ********************************************************************* */
function showInsertSuccessMessage() {
    // Swal.fire({
    //     title: 'Success!',
    //     text: 'Insert operation completed successfully.',
    //     icon: 'success',
    //     confirmButtonText: 'OK'
    // });
}
function showUpdateSuccessMessage() {

    // Swal.fire({
    //     title: 'Success!',
    //     text: 'Update operation completed successfully.',
    //     icon: 'success',
    //     confirmButtonText: 'OK'
    // });
}
function showDeleteSuccessMessage() {

    // Swal.fire({
    //     title: 'Success!',
    //     text: 'Delete operation completed successfully.',
    //     icon: 'success',
    //     confirmButtonText: 'OK'
    // });
}
function showErrorMessage(errorMessage) {
    // Swal.fire({
    //     title: 'Error!',
    //     text: errorMessage,
    //     icon: 'error',
    //     confirmButtonText: 'OK'
    // });
}


//**********  IMAGES ********************************************************************* */
//**********  IMAGES ********************************************************************* */
//**********  IMAGES ********************************************************************* */
//**********  IMAGES ********************************************************************* */



async function uploadImagini(files, itemId, tipItem) {
        debugger;
        if (itemId == null) return;
    
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }
        formData.append('itemId', itemId);
        formData.append('tipItem', tipItem);
    
        try {
            const url = `${API_BASE_URL}/Imagini/UploadImagini`;
            const response = await fetch(url, {
                method: 'POST',
                body: formData
            });
    
            if (response.ok) {
                const result = await response.json();
                console.log(result);
    
                // După încărcare, salvează ordinea imaginilor (din preview-ul actual)
                await salveazaOrdineaImaginilor(itemId);
            } else {
                console.error('Eroare la încărcarea imaginilor:', response.statusText);
                alert('Eroare la încărcarea imaginilor 12334.');
            }
        } catch (error) {
            console.error('Eroare la încărcarea imaginilor:', error);
            alert('Eroare la încărcarea imaginilor 456.');
        }
    }
    


    async function salveazaOrdineaImaginilor(itemId) {
        //debugger;
        const ordine = getOrdineImagini();
    
        if (ordine.length === 0) return;
    
        try {
            const response = await fetch(`${API_BASE_URL}/Imagini/UpdateOrdine`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ itemId: itemId, ordine: ordine })
            });
    
            if (response.ok) {
                console.log("Ordinea imaginilor a fost salvată cu succes.");
            } else {
                console.error("Eroare la salvarea ordinii imaginilor.");
            }
        } catch (err) {
            console.error("Eroare la salvarea ordinii:", err);
        }
    }

    function getOrdineImagini() {
        const containers = document.querySelectorAll('#preview .image-container');
        const ordine = [];
    
        containers.forEach((container, index) => {
            const id = container.getAttribute('data-id');
            if (id) {
                ordine.push({ id: id, ordine: index + 1 }); // index + 1 pentru a începe de la 1
            }
        });
    
        return ordine;
    }
    
    
    



//**********  OTHERS ********************************************************************* */
//**********  OTHERS ********************************************************************* */
//**********  OTHERS ********************************************************************* */
//**********  OTHERS ********************************************************************* */
function renunta(){
    window.close();
}
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
function clearddd(ddd){
    document.getElementById(ddd).innerHTML = '<option value="">---</option>';  
}
function cleartb(tb){
    document.getElementById(tb).value = '';  
}


function verifRed(controlId) {
    //debugger;
    var control = document.getElementById(controlId);    
    if (control) {        
        control.classList.add('red-box-shadow');
    } else {
        console.error('Controlul cu id-ul ' + controlId + ' nu a fost găsit.');
    }
}
function verifRemoveRed(controlId){
    ////debugger;
    var control = document.getElementById(controlId);    
    if (control) {        
        control.classList.remove('red-box-shadow');
    } else {
        console.error('Controlul cu id-ul ' + controlId + ' nu a fost găsit.');
    }
}


async function getDescriere(numeTabel,id){   
    ////debugger; 
    const link = `${API_BASE_URL}/InfoCars/GetDescriere?numeTabel=` + numeTabel + `&id=` + id;
    const desc = await get(link);
    if(desc != null){
        document.getElementById('p_descriere').innerHTML = desc.descriere;
    }    
}


async function  sku_gen(controlId) {
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += Math.floor(Math.random() * 10);
    }   
    document.getElementById(controlId).value = code;         
}




/* if(currentURL.includes("nomenclator")){ 
    document.getElementById("ta_DescTip").value = categ.descriere;
}   */

//autocomplete
document.addEventListener('DOMContentLoaded', function () {
    ////debugger;
    // var currentURL = window.location.href;	
    // if(currentURL.includes("masini_add") || currentURL.includes("piese_add")){ 
    //     $("#tb_nume").autocomplete({
    //         source: function (request, response) {
    //             const url = `${API_BASE_URL}/Piese/get_autocomplete?searchTerm=${request.term}`;
    //             $.ajax({
    //                 url: url,
    //                 method: "GET",
    //                 success: function (data) {
    //                     const results = data.map(item => ({
    //                         label: item.numeSubCat, 
    //                         value: item.id         
    //                     }));
    //                     response(results); 
    //                 },
    //                 error: function () {
    //                     console.error("Nu am putut obține rezultatele pentru autocomplete.");
    //                 }
    //             });
    //         },
    //         minLength: 2, 
    //         delay: 300, 
    
    //         select: function (event, ui) {
    //             //debugger;
    //             event.preventDefault();
    //             $(this).val(ui.item.label);
    //             console.log("ID selectat:", ui.item.value);
    //             setCategoriiAutocomplete(ui.item.value);
    //         },
    //         focus: function (event, ui) {
    //             event.preventDefault();
    //             $(this).val(ui.item.label);
    //         }
    //     });
    // }  
   
});

async function setCategoriiAutocomplete(id) {
    //debugger;
    const link = `${API_BASE_URL}/Piese/get_categorii_autocomplete?idSubCat=` + id;
    const things = await get(link);

    // Setează valoarea pentru `ddd_Tip` și declanșează evenimentul `change`
    await setSelectedValueVal('ddd_Tip', things.categoriiTip[0].Tip);
    const tipDropdown = document.getElementById('ddd_Tip');
    const tipEvent = new Event('change', { bubbles: true });
    tipDropdown.dispatchEvent(tipEvent);

    // Așteaptă ca `ddd_Categorii` să fie populat
    if (things.categorii && things.categorii.length > 0) {
        await waitForDropdownToPopulate('ddd_Categorii');
        await setSelectedValueVal('ddd_Categorii', things.categorii[0].IdCateg);
        const categoriiDropdown = document.getElementById('ddd_Categorii');
        const categoriiEvent = new Event('change', { bubbles: true });
        categoriiDropdown.dispatchEvent(categoriiEvent);
    }

    // Așteaptă ca `ddd_subcateg` să fie populat
    if (things.categoriiSub && things.categoriiSub.length > 0) {
        await waitForDropdownToPopulate('ddd_subcateg');
        await setSelectedValueVal('ddd_subcateg', id);
    }
}

// Funcție pentru așteptarea populării dropdown-ului
function waitForDropdownToPopulate(dropdownId) {
    return new Promise((resolve) => {
        const dropdown = document.getElementById(dropdownId);
        const observer = new MutationObserver(() => {
            if (dropdown.options.length > 1) { // Verifică dacă dropdown-ul are opțiuni
                observer.disconnect();
                resolve();
            }
        });
        observer.observe(dropdown, { childList: true }); // Monitorizează modificările în lista de copii
    });
}

//Slider Testiomoniale
const slides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.dot');

if (slides.length > 0 && dots.length > 0) {
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
            dots[i].classList.toggle('active', i === index);
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    // Auto-slide every 5 seconds
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }, 5000);

    // Initialize
    showSlide(currentSlide);
}






