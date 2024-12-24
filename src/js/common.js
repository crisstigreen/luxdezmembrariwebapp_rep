
//**********  GET POST UPDATE GENERIC ********************************************************************* */
//**********  GET POST UPDATE GENERIC********************************************************************* */
//**********  GET POST UPDATE GENERIC********************************************************************* */
//**********  GET POST UPDATE GENERIC********************************************************************* */
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
    const response = await fetch(link, {  // Așteptăm ca fetch să fie finalizat
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Eroare la înregistrare');
    }
    return response.json();  // Returnăm datele JSON pentru a putea fi folosite mai departe
}
async function update(id, data, link) {    
    const url = link;
    data.Id = id;
    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Eroare la actualizarea mașinii');
        }        
        return response.text(); // API-ul returnează NoContent, deci nu va fi JSON
    })
    .then(result => {
        debugger;   
    })                 
}
async function del(id, link) {
    const url = link;
    fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: id
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Eroare la actualizarea mașinii');
        }        
        return response.text(); // API-ul returnează NoContent, deci nu va fi JSON
    })
    .then(result => {
        debugger;   
    })     
}
async function getCars(link) {
    //debugger;
    try {
        const response = await fetch(link, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const cars = await response.json();
        populateDropdown(cars);
    } catch (error) {
        console.error('A apărut o eroare la apelarea API-ului:', error);
    }
}
function pieseApiCall(callback) {
    debugger;
    const url = `${API_BASE_URL}/Piese/search?SearchTerm=${encodeURIComponent(searchTerm)}&PageNumber=${encodeURIComponent(currentPage)}&PageSize=${encodeURIComponent(pageSize)}&OrderBy=${encodeURIComponent(orderTerm)}`;
    
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
            setTimeout(() => {
                Swal.close(); // Închide loader-ul
            }, 200); // Rămâne deschis pentru 200 ms

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
            callback(data);
        })
        .catch(error => {
            console.error('Eroare:', error);
            document.getElementById('rezultate-tabel').innerText = 'A apărut o eroare la căutarea pieselor.';
        });
}

function carsApiCall(callback) {
    debugger;
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
    debugger;
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
async function getModelsForDropdown(marcaId, callback) {
    debugger;        
        try {

            var currentURL = window.location.href;
            if(currentURL.includes("nomenclator")){        
                const link = `${API_BASE_URL}/Cars/getAllModels?marcaId=` + marcaId;  
                var models = await get(link);              
                callback(models)
            }
            else{

                const response = await fetch(`${API_BASE_URL}/Cars/getModels?marcaId=${marcaId}`, {
                    method: 'GET'
                });
    
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const models = await response.json();        
                callback(models)
            }
          
        } catch (error) {
            console.error('A apărut o eroare la apelarea API-ului pentru modele:', error);
        }
    
}
async function getGeneratiiForDropdown(modelId, callback) {
    try {
        var currentURL = window.location.href;
        if(currentURL.includes("nomenclator")){                
            const link = `${API_BASE_URL}/Cars/GetGeneratiiByModelId?modelId=` + modelId;  
            var generatii = await get(link);  
            callback(generatii);                        
        }
        else{
            const response = await fetch(`${API_BASE_URL}/Cars/getGeneratie?modelId=${modelId}`, {
                method: 'GET'
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const generatii = await response.json();        
            callback(generatii);
        }

      

    
        
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
    //debugger;
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
    const dropdown = document.getElementById('ddd_models');
    dropdown.innerHTML = '<option value="">Model</option>'; // Resetare dropdown

    // Adaugă opțiunile din lista de modele
    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model.modelID; // `id` corespunde `Id` din C#
        option.text = model.modelName; // `name` corespunde `Name` din C#
        dropdown.appendChild(option);
    });
}
function populateGeneratiiDropdown(generatii) {
    const dropdown = document.getElementById('ddd_generatii');
    dropdown.innerHTML = '<option value="">Generație</option>'; // Resetare dropdown

    // Adaugă opțiunile din lista de generații
    generatii.forEach(generatie => {
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
        debugger;
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
        debugger;
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
    document.getElementById('ddd_generatii').addEventListener('change', function() {
        debugger;        
        var tbGeneratii = document.getElementById("tb_generatii");
        if(tbGeneratii){
            tbGeneratii.value = getSelectedText('ddd_generatii');  
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
    //debugger;
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
    //debugger;
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
    //debugger;
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
function populateCheckboxesMarca(cars) {
    debugger;
    allMarci = cars;
    const container = document.getElementById('checkboxContainerMarca');
    container.innerHTML = ''; // Golește containerul înainte de a adăuga noile checkbox-uri

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
function handleMarcaChange(checkbox) {
    currentPage = 1;
    marca = checkbox.checked ? checkbox.nextSibling.textContent : "";
    const marcaId = checkbox.value;
    document.getElementById('tb_cauta').value = "";
    
    debugger;
    if (checkbox.checked) {
        // Golește lista de mărci și păstrează doar marca selectată
        const container = document.getElementById('checkboxContainerMarca');
        container.innerHTML = '';

        const checkboxWrapper = document.createElement('div');
        checkboxWrapper.style.marginBottom = '10px'; // Adaugă spațiu între checkbox-uri

        const label = checkbox.nextSibling; // Obține eticheta asociată
        checkboxWrapper.appendChild(checkbox);
        checkboxWrapper.appendChild(label); // Adaugă eticheta

        container.appendChild(checkboxWrapper);

        // Obține modelele pentru marca selectată
        getModelsForDropdown(marcaId,populateCheckboxesModel);
    } else {
        // Restaurează lista completă de mărci
        restoreMarcaCheckboxes();

        const container = document.getElementById('checkboxContainerModel');
        container.innerHTML = ''; 
        const containerg = document.getElementById('checkboxContainerGeneratie');
        containerg.innerHTML = ''; 
    }
    debugger;
    model = "";
    generatie = "";
    pieseApiCallFields(marca, model, generatie, currentPage, pageSize, orderTerm)
        .then(data => {                
            populateShopGrid(data);
        })
        .catch(error => {
            console.error('Eroare la obținerea datelor:', error);
        });
}
function restoreMarcaCheckboxes() {
    populateCheckboxesMarca(allMarci);
}

//------------------------------------------------
function populateCheckboxesModel(models) {
    allModels = models;
    const container = document.getElementById('checkboxContainerModel');
    container.innerHTML = ''; // Golește containerul înainte de a adăuga noile checkbox-uri

    models.forEach(model => {
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
function handleModelChange(checkbox) {
    currentPage = 1;
    model = checkbox.checked ? checkbox.nextSibling.textContent : "";
    const modelId = checkbox.value;
    document.getElementById('tb_cauta').value = "";

    debugger;
    if (checkbox.checked) {
        // Golește lista de modele și păstrează doar modelul selectat
        const container = document.getElementById('checkboxContainerModel');
        container.innerHTML = '';

        const checkboxWrapper = document.createElement('div');
        checkboxWrapper.style.marginBottom = '10px'; // Adaugă spațiu între checkbox-uri

        const label = checkbox.nextSibling; // Obține eticheta asociată
        checkboxWrapper.appendChild(checkbox);
        checkboxWrapper.appendChild(label); // Adaugă eticheta

        container.appendChild(checkboxWrapper);

        // Obține generațiile pentru modelul selectat
        getGeneratiiForDropdown(modelId, populateCheckboxesGeneratie);
    } else {
        // Restaurează lista completă de modele
        restoreModelCheckboxes();
        const containerg = document.getElementById('checkboxContainerGeneratie');
        containerg.innerHTML = ''; 
    }
    //cristi fields
    debugger;
    generatie = "";
    pieseApiCallFields(marca, model, generatie, currentPage, pageSize, orderTerm)
        .then(data => {                
            populateShopGrid(data);
        })
        .catch(error => {
            console.error('Eroare la obținerea datelor:', error);
        });
}
function restoreModelCheckboxes() {
    populateCheckboxesModel(allModels);
}
//------------------------------------------------
function populateCheckboxesGeneratie(generatii) {
    debugger;
    allGeneratii = generatii;
    const container = document.getElementById('checkboxContainerGeneratie');
    container.innerHTML = ''; // Golește containerul înainte de a adăuga noile checkbox-uri

    generatii.forEach(generatie => {
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
function handleGeneratieChange(checkbox) {
    currentPage = 1;
    generatie = checkbox.checked ? checkbox.nextSibling.textContent : "";
    const generatieId = checkbox.value;
    document.getElementById('tb_cauta').value = "";

    debugger;
    if (checkbox.checked) {
        // Golește lista de generații și păstrează doar generația selectată
        const container = document.getElementById('checkboxContainerGeneratie');
        container.innerHTML = '';

        const checkboxWrapper = document.createElement('div');
        checkboxWrapper.style.marginBottom = '10px'; // Adaugă spațiu între checkbox-uri

        const label = checkbox.nextSibling; // Obține eticheta asociată
        checkboxWrapper.appendChild(checkbox);
        checkboxWrapper.appendChild(label); // Adaugă eticheta

        container.appendChild(checkboxWrapper);

    } else {
        // Restaurează lista completă de generații
        restoreGeneratieCheckboxes();
    }
    //cristi fields
    debugger;
    pieseApiCallFields(marca, model, generatie, currentPage, pageSize, orderTerm)
        .then(data => {                
            populateShopGrid(data);
        })
        .catch(error => {
            console.error('Eroare la obținerea datelor:', error);
        });
}
function restoreGeneratieCheckboxes() {
    populateCheckboxesGeneratie(allGeneratii);
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
    const selectElement = document.getElementById(selectId);
    const options = selectElement.options;

    for (let i = 0; i < options.length; i++) {
        if (options[i].text === value) {
            selectElement.selectedIndex = i;
            break;
        }
    }
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
    Swal.fire({
        title: 'Success!',
        text: 'Insert operation completed successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
    });
}
function showUpdateSuccessMessage() {

    Swal.fire({
        title: 'Success!',
        text: 'Update operation completed successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
    });
}
function showDeleteSuccessMessage() {

    Swal.fire({
        title: 'Success!',
        text: 'Delete operation completed successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
    });
}
function showErrorMessage(errorMessage) {
    Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK'
    });
}


//**********  IMAGES ********************************************************************* */
//**********  IMAGES ********************************************************************* */
//**********  IMAGES ********************************************************************* */
//**********  IMAGES ********************************************************************* */

async function uploadImagini(files, itemId, tipItem) {
    debugger;
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
            //alert('Imaginile au fost încărcate cu succes.');
        } else {
            console.error('Eroare la încărcarea imaginilor:', response.statusText);
            alert('Eroare la încărcarea imaginilor.');
        }
    } catch (error) {
        console.error('Eroare la încărcarea imaginilor:', error);
        alert('Eroare la încărcarea imaginilor.');
    }
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
    debugger;
    var control = document.getElementById(controlId);    
    if (control) {        
        control.classList.add('red-box-shadow');
    } else {
        console.error('Controlul cu id-ul ' + controlId + ' nu a fost găsit.');
    }
}
function verifRemoveRed(controlId){
    //debugger;
    var control = document.getElementById(controlId);    
    if (control) {        
        control.classList.remove('red-box-shadow');
    } else {
        console.error('Controlul cu id-ul ' + controlId + ' nu a fost găsit.');
    }
}












