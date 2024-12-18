//**********  PAGE LOAD ********************************************************************* */

//load piesa
document.addEventListener('DOMContentLoaded', async  () => {  
    //debugger; 
    const piesaId = getQueryParam('id');
    await getCars(`${API_BASE_URL}/Cars/get`);      
    await fetchAndPopulatePieseData();       
    if(piesaId){
        await getPieseCompatAndGenerateHtml(piesaId);            
    }   
    else{
        await sku_gen();
    }     
});

async function  sku_gen() {
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += Math.floor(Math.random() * 10);
    }   
    document.getElementById("tb_sku").value = code;         
}

//load imagini
document.addEventListener('DOMContentLoaded', function() {
    //debugger;
    const previewContainer = document.getElementById('preview');
    const piesaId = getQueryParam('id'); // Funcția getQueryParam definită anterior

    async function fetchImagini(itemId) {
        try {            
            const response = await fetch(`${API_BASE_URL}/Imagini/ImaginiByItemId?itemId=${itemId}&&tipItem=piese`);
                                          
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
        //debugger;
        const previewContainer = document.getElementById('preview');
        previewContainer.innerHTML = '';
        const piesaId = getQueryParam('id');
    
        images.forEach(image => {
            //debugger;
            const imageContainer = document.createElement('div');
            imageContainer.classList.add('image-container');
    
            const img = document.createElement('img');
            img.src = `${API_BASE_URL_IMG}/uploads/${image.denumireImagine}`; // Aceasta este calea corecta                       
    
            const removeBtn = document.createElement('button');
            removeBtn.classList.add('remove-btn');
            removeBtn.textContent = 'x';
            removeBtn.addEventListener('click', function() {
                // Șterge imaginea din frontend
                previewContainer.removeChild(imageContainer);
    
                // Apelează API-ul pentru a șterge imaginea din backend
                fetch(`${API_BASE_URL}/Imagini/StergeImagine?numeImagine=${image.denumireImagine}&itemId=${piesaId}`, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (response.ok) {
                        console.log('Imaginea a fost ștearsă cu succes din backend.');
                    } else {
                        console.error('Eroare la ștergerea imaginii din backend.');
                    }
                })
                .catch(error => {
                    console.error('Eroare de rețea:', error);
                });
            });
    
            imageContainer.appendChild(img);
            imageContainer.appendChild(removeBtn);
            previewContainer.appendChild(imageContainer);
        });
    }
    if(piesaId){fetchImagini(piesaId);}
});



function verificare(){
    //debugger;
    verif = true;
    var marca = document.getElementById("ddd_cars");
    var marcaText= marca.options[marca.selectedIndex].text;
    var model = document.getElementById("ddd_models");
    var modelText= model.options[model.selectedIndex].text;
    var gener = document.getElementById("ddd_generatii");
    var generText= gener.options[gener.selectedIndex].text;
   /*  var tipCaroserie= document.getElementById("ddd_TipCaroserie");
    var tipCaroserieText= tipCaroserie.options[tipCaroserie.selectedIndex].text; */
    var nume = document.getElementById('tb_nume'); 
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
/*     else if(tipCaroserieText == "Tip Caroserie"){
        verif = false;
        verifRed(tipCaroserie.id);
    } */
    else if(nume.value == ""){
        verif = false;
        verifRed(nume.id);
    } 
    return verif;
}

function registerPiesa() {
    //debugger;
    if(verificare() == false){
        return;
    }
    //return;
    var marca = document.getElementById("ddd_cars");
    var marcaText= marca.options[marca.selectedIndex].text;
    var model = document.getElementById("ddd_models");
    var modelText= model.options[model.selectedIndex].text;
    var gener = document.getElementById("ddd_generatii");
    var generText= gener.options[gener.selectedIndex].text;
    
    var nume = document.getElementById('tb_nume').value;
    var numeCar = marcaText + ' ' + modelText + ' ' + generText;  

    var tipCaroserie= document.getElementById("ddd_TipCaroserie");
    var tipCaroserieText= tipCaroserie.options[tipCaroserie.selectedIndex].text;

    var codPiesa = document.getElementById('tb_codPiesa').value;
    var valuta = document.getElementById("ddd_valuta");
    var valutaText= valuta.options[valuta.selectedIndex].text; 
    var pret = document.getElementById('tb_pret').value;
    var um = document.getElementById('tb_um').value;  
    var discount = document.getElementById('tb_discount').value;
    var locatie = document.getElementById('tb_locatie').value;
    var stoc = document.getElementById('tb_stoc').value || -1;    
    var vandut = document.getElementById('tb_vandut').value || -1;    
    var vizibil= document.getElementById("ddd_vizibil");
    var vizibilText= vizibil.options[vizibil.selectedIndex].text;
    var skU_ID = document.getElementById('tb_sku').value || -1;       
    var utl = document.getElementById('tb_utl').value;       
    var IdSubCat = getSelectedValue('ddd_subcateg');            
                  
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
        utl: utl,
        marca: marcaText,
        model: modelText,
        generatie: generText,               
        IdSubCat
    };

    debugger;
    const piesaId = getQueryParam('id');
    if(piesaId != null){
       // updatePiesa(piesaId, piesa)      
        update(piesaId,piesa,`${API_BASE_URL}/Piese/${piesaId}`)  
        showUpdateSuccessMessage();
    }  
    else{
        //insertPiesa(piesa);   
        insert(piesa,`${API_BASE_URL}/Piese`);      
        showInsertSuccessMessage();
    }

   
}

async function SetCategoriiStyff(id) {
    debugger;
    const link = `${API_BASE_URL}/InfoCars/GetCategorieDetails/` + id;
    const details = await get(link);

    setSelectedValueVal("ddd_Tip",details.IdTip);  
    await getCategorii(details.IdTip);
    setSelectedValueVal("ddd_Categorii",details.IdCat);  
    await subCategorii(details.IdCat);
    setSelectedValueVal("ddd_subcateg",details.IdSubCat); 

}

async function fetchAndPopulatePieseData() {   
    //debugger;
    const piesaId = getQueryParam('id');
    if (!piesaId) {
        await populateTipCaroserieDropdown(); // Populează tip Caroserie     
        return;    
    }
    else{        
        document.getElementById("tb_stoc").disabled = true;
        document.getElementById("tb_vandut").disabled = true;   
    }    
                
    try {
        const response = await fetch(`${API_BASE_URL}/Piese/${piesaId}`);
        debugger;
        if (!response.ok) {
            throw new Error('Eroare la obținerea datelor');
        }        
        const data = await response.json();   
        SetCategoriiStyff(data.idSubCat);   
        populateOtherFields(data);                
        const brandName = extractCarBrand(data.masina); // Extrage brand-ul                      
        const brandDropdown = document.getElementById('ddd_cars');
        const brandOption = Array.from(brandDropdown.options).find(option => option.text === brandName);
        const brandId = brandOption ? brandOption.value : null;                 
        if (brandId) {
            
            await setSelectedValue('ddd_cars', brandName); // Setează brand-ul selectat      
            
            await getModelsForDropdown(brandId, populateModelsDropdown);                      
            
            var modelName = await extractCarModel(data.masina, brandName);          
            const modelDropdown = document.getElementById('ddd_models');
            const modelOption = Array.from(modelDropdown.options).find(option => option.text === modelName);
            const modelId = modelOption ? modelOption.value : null;

            //debugger;
            if (modelId) {
                await setSelectedValue('ddd_models', modelName); // Setează modelul selectat
                //await getGeneratiiForDropdown(modelId, populateCheckboxesGeneratie);    
                await getGeneratiiForDropdown(modelId, populateGeneratiiDropdown);    

                // Extrage și setează generația
                var generatieName = await  extractCarGeneratie(data.masina, modelName);                                     
                const generatieDropdown = document.getElementById('ddd_generatii');
                const generatieOption = Array.from(generatieDropdown.options).find(option => option.text === generatieName);
                const generatieId = generatieOption ? generatieOption.value : null;

                if(generatieId){
                    await setSelectedValue('ddd_generatii', generatieName); // Setează brand-ul selectat  
                }   
                debugger; 
                const link = `${API_BASE_URL}/InfoCars/GetPieseMasiniByPiesaId?IdPiesa=${piesaId}`;
                const cars = await get(link); // Așteaptă datele și le atribuie variabilei cars      
                if(cars.length > 0){
                    var linkMasina = document.getElementById('linkMasina');
                    linkMasina.href = `masini_add.html?id=${cars[0].masinaId}`;                                
                    linkMasina.textContent = cars[0].nrOrdine ;                   
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
//populeaza celelalte campurile
async function populateOtherFields(data) {      
    //debugger; 
    document.getElementById('tb_nume').value = data.nume || '';
    document.getElementById('tb_codPiesa').value = data.codPiesa || '';
    document.getElementById('tb_pret').value = data.pret.substring(0, data.pret.indexOf(' ')) || '';
    document.getElementById('tb_um').value = data.um || '';
    document.getElementById('tb_discount').value = data.discount || '';
    document.getElementById('tb_locatie').value = data.locatie || '';
    document.getElementById('tb_stoc').value = data.stoc || '';    
    document.getElementById('tb_vandut').value = data.vandut || '';
    await setSelectedValue('ddd_vizibil', data.vizibilitate);    
    document.getElementById('tb_sku').value = data.skU_Id || '';
    document.getElementById('tb_utl').value = data.utl || '';
    
    var valuta = data.pret.substring(data.pret.indexOf(' ') + 1);
    await setSelectedValue('ddd_valuta', valuta);  
   
    await populateTipCaroserieDropdown(); // Populează tip Caroserie
    await setSelectedValue('ddd_TipCaroserie', data.tipCaroserie);              
  
    
}

//**********  ALTELE ********************************************************************* */


document.getElementById('fileInput').addEventListener('change', function(event) {
    debugger;
    const previewContainer = document.getElementById('preview');
    previewContainer.innerHTML = '';
    const files = event.target.files;

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

    // Obține ID-ul piesei din query string
    const piesaId = getQueryParam('id');

    // Tipul itemului
    const tipItem = 'piese';

    // Apelează funcția pentru a încărca imaginile
    uploadImagini(files, piesaId, tipItem);
});

async function getPieseCompatAndGenerateHtml(piesaId) {
    try {
        const response = await fetch(`${API_BASE_URL}/Compat/GetPiesaCompat?PiesaId=${piesaId}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const compatData = await response.json();
        const generatedHtmlElement = generateHtml(compatData); // Obține elementul generat

        // Afișează HTML-ul generat într-un element de pe pagină
        const outputContainer = document.getElementById('compatDiv');
        outputContainer.innerHTML = ''; // Resetează conținutul existent
        outputContainer.appendChild(generatedHtmlElement); // Adaugă noul element generat
    } catch (error) {
        console.error('A apărut o eroare la apelarea API-ului:', error);
    }
}

function generateHtml(compatData) {    
    const container = document.createElement('div');

    compatData.forEach(item => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'form-group row'; // Adaugă clasa pentru grupul de formular

// ************************************ MARCA*****************************************************************
        const marcaDiv = document.createElement('div');
        marcaDiv.className = 'col-md-3'; // Adaugă clasa pentru coloană

        const marcaTextbox = document.createElement('input');
        marcaTextbox.type = 'text';
        marcaTextbox.className = 'form-control ddd slimTextBox'; // Adaugă clasa pentru stilul textbox-ului
        marcaTextbox.value = item.marcaName || '';  
        marcaTextbox.readOnly = true; 

        marcaDiv.appendChild(marcaTextbox);
        rowDiv.appendChild(marcaDiv);

// ************************************ MODEL*****************************************************************
        const modelDiv = document.createElement('div');
        modelDiv.className = 'col-md-3'; // Adaugă clasa pentru coloană
        
        const modelTextbox = document.createElement('input');
        modelTextbox.type = 'text';
        modelTextbox.className = 'form-control ddd slimTextBox'; // Adaugă clasa pentru stilul textbox-ului
        modelTextbox.value = item.modelName || '';  
        modelTextbox.readOnly = true; 

        modelDiv.appendChild(modelTextbox);
        rowDiv.appendChild(modelDiv);

// ************************************ GENERATIE*****************************************************************
        const generatieDiv = document.createElement('div');
        generatieDiv.className = 'col-md-5'; // Adaugă clasa pentru coloană
          
        const generatieTextbox = document.createElement('input');
        generatieTextbox.type = 'text';
        generatieTextbox.className = 'form-control ddd slimTextBox'; // Adaugă clasa pentru stilul textbox-ului
        generatieTextbox.value = item.generatieName || '';  
        generatieTextbox.readOnly = true; 

        generatieDiv.appendChild(generatieTextbox);
        rowDiv.appendChild(generatieDiv);

// ************************************ DELETE*****************************************************************
        const buttonDiv = document.createElement('div');
        buttonDiv.className = 'col-md-1 ddd'; // Adaugă clasa pentru coloană

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger btn-sm'; // Clasa Bootstrap pentru buton roșu
        deleteButton.textContent = 'X';
        
        // Adaugă un eveniment click pentru butonul de ștergere
        deleteButton.addEventListener('click', () => {
            debugger;
            event.preventDefault();
            const url = `${API_BASE_URL}/Compat/${encodeURIComponent(item.id)}`;           
            fetch(url, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Eroare la ștergerea piesei din coș');
                }
                rowDiv.remove(); // Elimină rândul din DOM (opțional)
            })
            .catch(error => {
                console.error('Eroare:', error);
                Swal.fire(
                    'Eroare!',
                    'A apărut o eroare la ștergerea piesei din coș.',
                    'error'
                );
            });

        })
               
        buttonDiv.appendChild(deleteButton);
        rowDiv.appendChild(buttonDiv);

// ************************************ id*****************************************************************
const IdDiv = document.createElement('div');
IdDiv.className = 'col-md-1'; // Adaugă clasa pentru coloană  
const IdTextbox = document.createElement('input');
IdTextbox.type = 'text';
IdTextbox.className = 'form-control ddd slimTextBox'; // Adaugă clasa pentru stilul textbox-ului        
IdTextbox.value = item.id || '';  
IdTextbox.readOnly = true; 
IdTextbox.style.display = "none";

IdDiv.appendChild(IdTextbox);
rowDiv.appendChild(IdDiv);


        // Adaugă div-ul rândului în container
        container.appendChild(rowDiv);
    });

    // Returnează containerul complet
    return container; 
}

function adaugaPiesaCompat(){
    debugger;
    const piesaId = getQueryParam('id');
    var marca = document.getElementById("ddd_cars");    
    var model = document.getElementById("ddd_models");    
    var gener = document.getElementById("ddd_generatii");
                                       
    const compat = {

        piesaID: piesaId,
        marca: marca.value,             
        model: model.value,
        generatie: gener.value
    };
    
    const url = `${API_BASE_URL}/Compat`;
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(compat)
    })
    .then(response => {
        debugger;
        if (!response.ok) {
            throw new Error('Eroare la înregistrarea piesei');
        }
        
        getPieseCompatAndGenerateHtml(piesaId);
        fetchAndPopulatePieseData();
        return response.json();
    })              
}



