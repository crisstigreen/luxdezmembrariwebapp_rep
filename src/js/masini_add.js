﻿let selectedFiles = null;



//PAGE LOAD
document.addEventListener('DOMContentLoaded', async  () => {
    //debugger;      
    await getCars(`${API_BASE_URL}/Cars/get`);  
    await fetchAndPopulateCarData(); 
    populatePieseMasiniTable()
});


//load imagini
document.addEventListener('DOMContentLoaded', async function() {  
    debugger;  
    const previewContainer = document.getElementById('preview');
    new Sortable(previewContainer, {
        animation: 150,
        ghostClass: 'ghost', // opțional: clasa aplicată elementului în mișcare
    });
    const piesaId = getQueryParam('id'); // Funcția getQueryParam definită anterior

    async function fetchImagini(itemId) {
        try {            
            const response = await fetch(`${API_BASE_URL}/Imagini/ImaginiByItemId?itemId=${itemId}&&tipItem=masini`);
                                          
            if (response.ok) {
                const images = await response.json();
                populatePreview(images);
            } else {
                console.error('Eroare la aducerea imaginilor:', response.statusText);
            }
        } catch (error) {
            console.error('Eroare la aducerea imaginilor:', error);
        }
    }

    function populatePreview(images) {
        const previewContainer = document.getElementById('preview');
        previewContainer.innerHTML = '';
        const masinaId = getQueryParam('id');

        images.forEach(image => {
            const wrapper = document.createElement('div');
            wrapper.classList.add('image-wrapper');

            const imageContainer = document.createElement('div');
            imageContainer.classList.add('image-container');
            imageContainer.setAttribute('data-id', image.denumireImagine);

            const img = document.createElement('img');
            img.src = `${API_BASE_URL_IMG}/${image.denumireImagine}?v=${Date.now()}`;
            img.style.transition = "transform 0.3s ease";
            img.dataset.rotation = "0";

            const buttonsContainer = document.createElement('div');
            buttonsContainer.classList.add('buttons-container');

            // Buton de ștergere
            const removeBtn = document.createElement('button');
            removeBtn.className = 'btn btn-danger btn-sm buttons';
            removeBtn.textContent = '✖';
            removeBtn.addEventListener('click', function () {
                previewContainer.removeChild(wrapper);
                fetch(`${API_BASE_URL}/Imagini/StergeImagine?numeImagine=${image.denumireImagine}&itemId=${masinaId}`, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (!response.ok) throw new Error('Eroare la ștergerea imaginii din backend.');
                })
                .catch(console.error);
            });

            // Buton rotire stânga
            const rotateLeftBtn = document.createElement('button');
            rotateLeftBtn.type = 'button';
            rotateLeftBtn.className = 'btn btn-secondary btn-sm buttons';
            rotateLeftBtn.textContent = '⟲';
            rotateLeftBtn.addEventListener('click', () => rotateImage(img, -90));

            // Buton rotire dreapta
            const rotateRightBtn = document.createElement('button');
            rotateRightBtn.type = 'button';
            rotateRightBtn.className = 'btn btn-secondary btn-sm buttons';
            rotateRightBtn.textContent = '⟳';
            rotateRightBtn.addEventListener('click', () => rotateImage(img, 90));

            // Buton salvare rotație
            const saveRotationBtn = document.createElement('button');
            saveRotationBtn.type = 'button';
            saveRotationBtn.className = 'btn btn-success btn-sm buttons';
            saveRotationBtn.textContent = '💾';
            saveRotationBtn.addEventListener('click', () => {
                const rotation = parseInt(img.dataset.rotation || "0");
                fetch(`${API_BASE_URL}/Imagini/RotireImagine`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        denumireImagine: image.denumireImagine,
                        rotatie: rotation
                    })
                })
                .then(response => {
                    if (response.ok) {
                        alert("Imagine rotită și salvată cu succes.");
                    } else {
                        alert("Eroare la salvare.");
                    }
                });
            });

            imageContainer.appendChild(img);
            buttonsContainer.appendChild(removeBtn);
            buttonsContainer.appendChild(rotateLeftBtn);
            buttonsContainer.appendChild(rotateRightBtn);
            buttonsContainer.appendChild(saveRotationBtn);
            wrapper.appendChild(imageContainer);
            wrapper.appendChild(buttonsContainer);
            previewContainer.appendChild(wrapper);
        });
    }

    function rotateImage(img, angle) {
        let currentRotation = parseInt(img.dataset.rotation || "0");
        currentRotation = (currentRotation + angle + 360) % 360;
        img.dataset.rotation = currentRotation.toString();
        img.style.transform = `rotate(${currentRotation}deg)`;
    }



    debugger;
    await sku_gen("tb_skupiese");
    if(piesaId){
        fetchImagini(piesaId);
    }
    else{
        await sku_gen("tb_sku");        
        nr_ordine_gen();
    }
});

async function  nr_ordine_gen() {      
    //debugger;  
    var link =  `${API_BASE_URL}/InfoCars/GetMaxNrOrdine`; 
    var x = await get(link);
    document.getElementById("tb_nrOrdine").value = x + 1;
}

function populatePieseMasiniTable() {
    debugger;
    const carId = getQueryParam('id');
    if(carId == null){
        document.getElementById('tb_nrPiese').value = 0;
        return;
    }
    const url =   `${API_BASE_URL}/InfoCars/GetById?IdMasina=` +  carId; 
        
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Eroare la obținerea datelor');
            }
            return response.json();
        })
        .then(data => {
            debugger;
            document.getElementById('tb_nrPiese').value = data.piese.length;   
            const rezultateTable = document.getElementById('rezultate-tabel');
            rezultateTable.innerHTML = ''; // Resetează tabela

            data.piese.forEach(piesa => {
                const piesaRow = `
                    <tr data-id="${piesa.id}">
                        <td>${piesa.id}</td>
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
                            <button class="edit-button" data-id="${piesa.id}"><i class="fas fa-edit" style="font-size:14px"></i></button>
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

async function get_details(id) {
    debugger;    
    if (id) {

        const url = `piese_add.html?id=${id}`;
        window.open(url, '_blank');

    } else {
        
    }
}

function list(){
    debugger;
    const url = `masini_admin.html`;
    window.location = url;
}

function calculatePretVanzare(pret, discount) {
    if (!discount || discount === "0") {
        return pret;
    }
    const pretFloat = parseFloat(pret);
    const discountFloat = parseFloat(discount);
    return (pretFloat - (pretFloat * (discountFloat / 100))).toFixed(2);
}


async function fetchAndPopulateCarData() {
    debugger;
    const carId = getQueryParam('id');
    populateDefaultFields();
    if (!carId) return;

    try {
        const response = await fetch(`${API_BASE_URL}/CarsRegister/${carId}`);
        if (!response.ok) {
            throw new Error('Eroare la obținerea datelor');
        }
        const data = await response.json();
        populateOtherFields(data);                
        const brandName = extractCarBrand(data.nume); // Extrage brand-ul                      
        const brandDropdown = document.getElementById('ddd_cars');
        const brandOption = Array.from(brandDropdown.options).find(option => option.text === brandName);
        const brandId = brandOption ? brandOption.value : null;                 
        if (brandId) {            
            await setSelectedValue('ddd_cars', brandName); // Setează brand-ul selectat      
            await getModelsForDropdown(brandId, populateModelsDropdown); // Populează modelele cu ID-ul brand-ului                       
            var modelName = await extractCarModel(data.nume, brandName);          
            const modelDropdown = document.getElementById('ddd_models');
            const modelOption = Array.from(modelDropdown.options).find(option => option.text === modelName);
            const modelId = modelOption ? modelOption.value : null;
            debugger;
            if (modelId) {
                await setSelectedValue('ddd_models', modelName); // Setează modelul selectat
                await getGeneratiiForDropdown(modelId, populateGeneratiiDropdown);    
                var generatieName = await  extractCarGeneratie(data.nume, modelName);                                     
                const generatieDropdown = document.getElementById('ddd_generatii');
                const generatieOption = Array.from(generatieDropdown.options).find(option => option.text === generatieName);
                if (generatieOption) {
                    await setSelectedValue('ddd_generatii', generatieName); // Setează generația selectată
                } else {
                    console.error('Generația nu a fost găsită.');
                }                            
            } else {
                console.error('Modelul nu a fost găsit.');
            } 
        }                
    } catch (error) {
        console.error('Eroare:', error);
        alert('A apărut o eroare la obținerea datelor mașinii.');
    }
}


async function  populateDefaultFields() {
    await populateCombustibilDropdown(); // Populează combustibil
    await populateTipCutieDropdown(); // Populează tip cutie viteze
    await populateTractiuneDropdown(); // Populează tracțiune
    await populateCuloareDropdown(); // Populează coloare
}

async function populateOtherFields(data) {
      
    // Populează restul câmpurilor
    document.getElementById('tb_nrOrdine').value = data.nrOrdine || '';
    document.getElementById('tb_an').value = data.an || 0;      
    await setSelectedValue('ddd_combustibil', data.combustibil);             
    await setSelectedValue('ddd_Tractiune', data.tractiune);   
    await setSelectedValue('ddd_tipCutie', data.transmisie);  
    await setSelectedValue('ddd_culoare', data.culoare);
    await setSelectedValue('ddd_vizibil', data.vizibilitate);
    document.getElementById('tb_sku').value = data.skU_ID || '';
    
    
    debugger;
    document.getElementById('tb_discount').value = data.discount || 0;
    //document.getElementById('tb_nrPiese').value = data.nrPiese || '';    
    document.getElementById('tb_utl').value = data.utl || ''; 
    document.getElementById('tb_detalii').value = data.detalii || ''; 
    document.getElementById('tb_codMotor').value = data.codMotor || ''; 
    document.getElementById('tb_vin').value = data.vin || ''; 
    document.getElementById('tb_km').value = data.km || ''; 
    document.getElementById('tb_capCil').value = data.capacitCil || ''; 
    document.getElementById('tb_nrLocuri').value = data.nrLocuri || ''; 
    document.getElementById('tb_nrUsi').value = data.nrUsi || ''; 
    document.getElementById('tb_nrViteze').value = data.nrViteze || ''; 
    document.getElementById('tb_alteDetalii').value = data.alteDetaliiTrans || ''; 

    document.getElementById('tb_putere').value = data.putere || ''; 
    document.getElementById('tb_puterecp').value = data.putereCP || ''; 


}

function extractGeneratie(nume) {
    // Expresie regulată pentru a găsi generația în paranteze rotunde
    const generatiePattern = /\b([^\(]+\([^\)]+\)\s*\([^\)]+\))/;
    const match = nume.match(generatiePattern);
    if (match) {
        return match[0];
    }
    return null;
}

function verificare(){
    //debugger;
    verif = true;
    var marca = document.getElementById("ddd_cars");
    var marcaText= marca.options[marca.selectedIndex].text;
    var model = document.getElementById("ddd_models");
    var modelText= model.options[model.selectedIndex].text;
    var gener = document.getElementById("ddd_generatii");
    var generText= gener.options[gener.selectedIndex].text;    
    if(marcaText == "Marca"){
        verif = false;
        verifRed(marca.id);
    }    
    else if(modelText == "Model"){
        verif = false;
        verifRed(model.id);
    }  
    else if(generText == "Generație"){
        verif = false;
        verifRed(gener.id);
    }            
    return verif;
}
function verifRed(controlId) {
    var control = document.getElementById(controlId);    
    if (control) {        
        control.classList.add('red-box-shadow');
    } else {
        console.error('Controlul cu id-ul ' + controlId + ' nu a fost găsit.');
    }
}
function verifRemoveRed(controlId){
    debugger;
    var control = document.getElementById(controlId);    
    if (control) {        
        control.classList.remove('red-box-shadow');
    } else {
        console.error('Controlul cu id-ul ' + controlId + ' nu a fost găsit.');
    }
}

function registerPiesaCar() {
    var marca = document.getElementById("ddd_cars");
    var marcaText= marca.options[marca.selectedIndex].text;
    var model = document.getElementById("ddd_models");
    var modelText= model.options[model.selectedIndex].text;
    var gener = document.getElementById("ddd_generatii");
    var generText= gener.options[gener.selectedIndex].text;    
    var nume = document.getElementById('tb_nume').value;
    var numeCar = marcaText + ' ' + modelText + ' ' + generText;  
    var codPiesa = document.getElementById('tb_codPiesa').value;
    //var valuta = document.getElementById("ddd_valuta");
    var valutaText= "RON";
    var pret = document.getElementById('tb_pret').value;
    //var um = document.getElementById('tb_um').value;  
    var discount = document.getElementById('tb_discount').value;
    var locatie = document.getElementById('tb_locatie').value;
    var stoc = document.getElementById('tb_stoc').value || -1;    
    var vandut = 0  
    var vizibil= document.getElementById("ddd_vizibil");
    var vizibilText= vizibil.options[vizibil.selectedIndex].text;
    var skU_ID = document.getElementById('tb_sku').value || -1;       
    var utl = document.getElementById('tb_utl').value;                
                                
    const piesa = {
        masina: numeCar,
        nume: nume,
        codPiesa: codPiesa,
        tipCaroserie: tipCaroserieText,
        pret: pret + " " + valutaText,
        um: um,
        discount: discount,
        locatie: locatie,
        stoc: stoc,
        vandut: vandut,
        vizibilitate: vizibilText,
        skU_Id: skU_ID,
        utl: utl                
    };
    debugger;
    const piesaId = getQueryParam('id');
    insert(piesa,`${API_BASE_URL}/Piese`);         
}

//Add masina
async function registerCar() {    
    await registerCarFunc(); 
    setTimeout(() => {
        window.location = 'masini_admin.html';
    }, 1500);         
}

async function registerCarFunc() {    
    debugger;
     if(verificare() == false){
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }
    var marca = document.getElementById("ddd_cars");
    var marcaText= marca.options[marca.selectedIndex].text;
    var model = document.getElementById("ddd_models");
    var modelText= model.options[model.selectedIndex].text;
    var gener = document.getElementById("ddd_generatii");
    var generText= gener.options[gener.selectedIndex].text;
    var numeCar = marcaText + ' ' + modelText + ' ' + generText;
    var combustibil = document.getElementById("ddd_combustibil");
    var combustibilText= combustibil.options[combustibil.selectedIndex].text;    
    var tractiune = document.getElementById("ddd_Tractiune");
    var tractiuneText= tractiune.options[tractiune.selectedIndex].text;    
    var tipCutie = document.getElementById("ddd_tipCutie");
    var tipCutieText= tipCutie.options[tipCutie.selectedIndex].text;
    var nrOrdine = parseInt(document.getElementById('tb_nrOrdine').value, 10);
    var an = parseInt(document.getElementById('tb_an').value, 10)  || 0;    
    var skU_ID = document.getElementById('tb_sku').value; 
    var discount = document.getElementById('tb_discount').value  || 0;
    var nrPiese = parseInt(document.getElementById('tb_nrPiese').value, 10)  || 0;
    var utl = document.getElementById('tb_utl').value;
    var km = document.getElementById('tb_km').value  || 0;
    var detalii = document.getElementById('tb_detalii').value;
    var codMotor = document.getElementById('tb_codMotor').value;
    var vin = document.getElementById('tb_vin').value;
    var capCil = document.getElementById('tb_capCil').value  || 0;    
    var putere = document.getElementById('tb_putere').value  || 0;
    var nrLocuri = document.getElementById('tb_nrLocuri').value  || 0;
    var nrUsi = document.getElementById('tb_nrUsi').value  || -1;
    var alteDetalii = document.getElementById('tb_alteDetalii').value;
    var culoare = document.getElementById("ddd_culoare");
    var culoareText= culoare.options[culoare.selectedIndex].text; 
    var nrViteze = document.getElementById('tb_nrViteze').value  || 0;
    var vizibil= document.getElementById("ddd_vizibil");
    var vizibilText= vizibil.options[vizibil.selectedIndex].text;
    var puterecp = document.getElementById('tb_puterecp').value  || 0;

    debugger;
    const carId = getQueryParam('id');

    const data = {
        nume: numeCar,
        nrOrdine: nrOrdine,
        an: an,
        km: km,
        combustibil: combustibilText,
        tractiune: tractiuneText,
        transmisie: tipCutieText,
        skU_ID: skU_ID,        
        nrPiese: nrPiese,
        vizibilitate: vizibilText,        
        status: "",
        images: "",
        autovit: "",
        utl: utl,
        detalii: detalii,
        codMotor: codMotor,
        vin: vin,
        capacitCil: capCil,
        putere: putere,
        nrLocuri: nrLocuri,
        nrUsi: nrUsi,
        alteDetaliiTrans: alteDetalii,
        culoare: culoareText,
        discount: discount,
        nrViteze: nrViteze,
        puterecp: puterecp
    };
 
    if (carId != null) {
        const updateResponse = 
        await update(carId, data, `${API_BASE_URL}/CarsRegister/${carId}`); 
         if (selectedFiles && selectedFiles.length > 0) {
            uploadImagini(selectedFiles, piesaId, 'masini');
        }            
                                    
        //ORDINE PIESA - ATENTIE
        await salveazaOrdineaImaginilor(carId);       
    } 
    else {
        const result = await insert(data, `${API_BASE_URL}/CarsRegister`);  
        debugger;     
        if(result.success){
            const tipItem = 'masini';
            const nouId = result.data.InsertedId;                
            if (selectedFiles && selectedFiles.length > 0) {
                await uploadImagini(selectedFiles, nouId, tipItem);
                //window.location='masini_admin.html';
            } 
            else{
                window.location='masini_admin.html';
            }
        }
    }        
}



//Add masina
async function registerPiesaMasina() {
    debugger;
    var marcaObj = document.getElementById("ddd_cars");
    var marca = marcaObj.options[marcaObj.selectedIndex].text;
    var marcaId = marcaObj.options[marcaObj.selectedIndex].value;
    var modelObj = document.getElementById("ddd_models");
    var model = modelObj.options[modelObj.selectedIndex].text;
    var modelId = modelObj.options[modelObj.selectedIndex].value;
    var generatieObj = document.getElementById("ddd_generatii");
    var generatie = generatieObj.options[generatieObj.selectedIndex].text;
    var generatieId = generatieObj.options[generatieObj.selectedIndex].value;
    var numeCar = marca + ' ' + model + ' ' + generatie;
    var nume = document.getElementById('tb_nume').value || -1;
    var codPiesa = document.getElementById('tb_codPiesa').value;
    var pret = document.getElementById('tb_pret').value;
    var valuta = document.getElementById("ddd_valuta");
    var valutaText = valuta.options[valuta.selectedIndex].text;
    var discount = document.getElementById('tb_discount').value;
    var locatie = document.getElementById('tb_locatie').value;
    var stoc = document.getElementById('tb_stoc').value || -1;
    var vizibil = document.getElementById("ddd_vizibil");
    var vizibilText = vizibil.options[vizibil.selectedIndex].text;
    var skU_ID = document.getElementById('tb_skupiese').value || -1;
    var IdSubCat = getSelectedValue('ddd_subcateg');  
    var codMotor = document.getElementById('tb_codMotor').value;

    const data = {
        masina: numeCar,
        nume: nume,
        codPiesa: codPiesa,
        pret: pret + " " + valutaText,
        discount: discount,
        locatie: locatie,
        stoc: stoc,
        vandut: 0,
        vizibilitate: vizibilText,
        skU_Id: skU_ID,
        marca: marca,
        model: model,
        generatie: generatie,
        IdSubCat,
        marcaId,
        modelId,
        generatieId,
        codMotor        
    };

    try {
        const carData = await insert(data, `${API_BASE_URL}/Piese`);  
        const masinaId = getQueryParam('id');
        const piesaMasina = {
            IdMasina: masinaId,
            IdPiesa: carData.data.id
        };

        await insert(piesaMasina, `${API_BASE_URL}/InfoCars`); 
        populatePieseMasiniTable();
        console.log('Inserare reușită pentru piesa:', carData);
    } catch (error) {
        console.error('A apărut o eroare:', error);
    }
}

/* tabs */
function openTab(evt, tabName) {
    var i, tabcontent, tabbuttons;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tabbuttons = document.getElementsByClassName("tab-button");
    for (i = 0; i < tabbuttons.length; i++) {
        tabbuttons[i].className = tabbuttons[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

document.addEventListener("DOMContentLoaded", function() {
    document.querySelector(".tab-button").click();
});

//**********  ALTELE ********************************************************************* */

//change
document.getElementById('fileInput').addEventListener('change', function(event) {
    debugger;
    const previewContainer = document.getElementById('preview');
    //previewContainer.innerHTML = '';
    const files = event.target.files;

    selectedFiles = event.target.files; 

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = function(e) {
            debugger;
            const imageContainer = document.createElement('div');
            imageContainer.classList.add('image-container');

            const img = document.createElement('img');
            img.src = e.target.result;

            const removeBtn = document.createElement('button');
            removeBtn.classList.add('remove-btn');
            removeBtn.textContent = 'x';
            removeBtn.addEventListener('click', function() {
                previewContainer.removeChild(imageContainer);
            });

            imageContainer.appendChild(img);
            imageContainer.appendChild(removeBtn);
            previewContainer.appendChild(imageContainer);
        };
        reader.readAsDataURL(file);
    }
});