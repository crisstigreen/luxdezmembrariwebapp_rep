//PAGE LOAD
document.addEventListener('DOMContentLoaded', async  () => {
    await getProducatoriForDropdown();
    await fetchAndPopulateAnvData(); 
});

async function fetchAndPopulateAnvData() {  
    const anvId = getQueryParam('id');
    if (!anvId) return;
    try {
        const response = await fetch(`${API_BASE_URL}/Anvelope/${anvId}`);
        if (!response.ok) {
            throw new Error('Eroare la obținerea datelor');
        }    
        const data = await response.json();
        populateOtherFields(data);
                        
    } catch (error) {
        console.error('Eroare:', error);
        alert('A apărut o eroare la obținerea datelor mașinii.');
    }
}

function extrageDimAnv(text) {
    //debugger;
    const regex = /(\d{3})\/(\d{2})\sR(\d{2})/;

    // Aplicăm regex-ul asupra textului
    const matches = text.match(regex);

    if (matches) {
        // Extragem valorile pentru lățime, înălțime și diametru din array-ul matches
        const latime = matches[1];
        const inaltime = matches[2];
        const diametru = matches[3];

        // Returnăm valorile extrase
        return {
            latime: latime,
            inaltime: inaltime,
            diametru: diametru
        };
    } else {
        // În caz că textul nu se potrivește cu formatul așteptat
        throw new Error('Formatul textului nu este corect');
    }
}

//populeaza celelalte campurile
async function populateOtherFields(data) {
    debugger;
    await setSelectedValue('ddd_tipProdus', data.tipProdus);
    await setSelectedValue('ddd_stare', data.stare);

    await setSelectedText('ddd_producator', data.producator);

    

    var sezon = "";
    sezon = data.sezon;
    if(data.sezon.includes("all-season"))
    {
        sezon = "all-season";
    }
    else if(data.sezon.includes("winter") || data.sezon.includes("iarna"))
    {
        sezon = "winter";
    }
    else if(data.sezon.includes("summer") || data.sezon.includes("vara"))
        {
            sezon = "summer";
        }
    
    await setSelectedValue('ddd_sezon', sezon);


    var cauciuc = extrageDimAnv(data.dimensiuni);
    document.getElementById('tb_diametru').value = cauciuc.diametru || '';
    document.getElementById('tb_inaltime').value = cauciuc.inaltime || '';
    document.getElementById('tb_latime').value = cauciuc.latime || '';

    document.getElementById('tb_dot').value = data.dot || '';
    document.getElementById('tb_locatie').value = data.locatie || '';
    document.getElementById('tb_sku').value = data.skU_Id || '';
    document.getElementById('tb_pret').value = data.pret.substring(0, data.pret.indexOf(' '));
    document.getElementById('tb_discount').value = data.discount || '';
    document.getElementById('tb_stoc').value = data.stoc;
    document.getElementById('tb_vandut').value = data.vandut;

    debugger;
    await setSelectedValue('ddd_vizibil', data.vizibilitate);
   
    var valuta = data.pret.substring(data.pret.indexOf(' ') + 1);
    await setSelectedValue('ddd_valuta', valuta);  



    
}

function verificare(){
    //debugger;
    verif = true;
    var tipProdus = document.getElementById("ddd_tipProdus");
    var tipProdusText= tipProdus.options[tipProdus.selectedIndex].value;
    var stare = document.getElementById("ddd_stare");
    var stareText= stare.options[stare.selectedIndex].value;
    var sezon = document.getElementById("ddd_sezon");
    var sezonText= sezon.options[sezon.selectedIndex].value;
    var tipVehicul= document.getElementById("ddd_tipVehicul");
    var tipVehiculText= tipVehicul.options[tipVehicul.selectedIndex].value;

    var latime = document.getElementById('tb_latime'); 
    var inaltime = document.getElementById('tb_inaltime'); 
    var diametru = document.getElementById('tb_diametru'); 


    if(tipProdusText == ""){
        verif = false;
        verifRed(tipProdus.id);
    }    
    else if(stareText == ""){
        verif = false;
        verifRed(stare.id);
    }  
    else if(sezonText == ""){
        verif = false;
        verifRed(sezon.id);
    }        
    else if(tipVehiculText == ""){
        verif = false;
        verifRed(tipVehicul.id);
    }
    else if(latime.value == ""){
        verif = false;
        verifRed(latime.id);
    } 
    else if(inaltime.value == ""){
        verif = false;
        verifRed(inaltime.id);
    } 
    else if(diametru.value == ""){
        verif = false;
        verifRed(diametru.id);
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

function registerAnvelopa() {
    debugger;
    if(verificare() == false){
        return;
    }
    //return;
    var tipProdus = document.getElementById("ddd_tipProdus");
    var tipProdusText= tipProdus.options[tipProdus.selectedIndex].value;
    var stare = document.getElementById("ddd_stare");
    var stareText= stare.options[stare.selectedIndex].value;
    var sezon = document.getElementById("ddd_sezon");
    var sezonText= sezon.options[sezon.selectedIndex].value;
    var tipVehicul= document.getElementById("ddd_tipVehicul");
    var tipVehiculText= tipVehicul.options[tipVehicul.selectedIndex].value;

    var latime = document.getElementById('tb_latime'); 
    var inaltime = document.getElementById('tb_inaltime'); 
    var diametru = document.getElementById('tb_diametru'); 

    var producator= document.getElementById("ddd_producator");
    var producatorText= producator.options[producator.selectedIndex].text;

    var valuta = document.getElementById("ddd_valuta");
    var valutaText= valuta.options[valuta.selectedIndex].text; 
    
    var dot = document.getElementById('tb_dot').value;
    var locatie = document.getElementById('tb_locatie').value;
    var skU_Id = document.getElementById('tb_sku').value || -1;  
    var pret = document.getElementById('tb_pret').value;
    var discount = document.getElementById('tb_discount').value;
    var stoc = document.getElementById('tb_stoc').value || -1;    
    var vandut = document.getElementById('tb_vandut').value || -1;    
    var vizibil= document.getElementById("ddd_vizibil");
    var vizibilText= vizibil.options[vizibil.selectedIndex].value;

                                                    
    const anv = {

        tipProdus: tipProdusText,
        stare: stareText,
        sezon: sezonText,
        dimensiuni: latime.value + "/" + inaltime.value + " R" + diametru.value + "[,]",
        producator: producatorText,
        dot: dot,
        locatie: locatie,
        skU_Id: skU_Id,
        pret: pret + " " + valutaText,
        discount: discount,
        stoc: stoc,
        vandut: vandut,
        vizibilitate: vizibilText                  
    };

    debugger;
    const anvId = getQueryParam('id');
    if(anvId != null){
        updateAnvelopa(anvId, anv)        
    }  
    else{
        insertAnvelopa(anv);    
    }

   
}

function insertAnvelopa(anv){
    const url = `${API_BASE_URL}/Anvelope`;
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(anv)
    })
    .then(response => {
        debugger;
        if (!response.ok) {
            throw new Error('Eroare la înregistrarea anvelopei');
        }
        showInsertSuccessMessage();
        return response.json();
    })              
}

function updateAnvelopa(id, anv){

    debugger;
    const url = `${API_BASE_URL}/Anvelope/${id}`;

    // Adaugă id-ul în obiectul carData pentru a se potrivi cu cerințele API-ului
    anv.Id = id;

    // Trimite cererea PUT către API
    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(anv)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Eroare la actualizarea anvelopei');
        }        
        return response.text(); // API-ul returnează NoContent, deci nu va fi JSON
    })
    .then(result => {
        debugger;
        showUpdateSuccessMessage();    
    })  

}


async function setSelectedValue(selectId, value) {    
    const selectElement = document.getElementById(selectId);
    const options = selectElement.options;

    for (let i = 0; i < options.length; i++) {
        if (options[i].value === value) {
            selectElement.selectedIndex = i;
            break;
        }
    }
} 
async function setSelectedText(selectId, text) {    
    const selectElement = document.getElementById(selectId);
    const options = selectElement.options;

    for (let i = 0; i < options.length; i++) {
        if (options[i].text === text) {
            selectElement.selectedIndex = i;
            break;
        }
    }
} 

function renunta(){
    window.close();
}

function showUpdateSuccessMessage() {
    Swal.fire({
        title: 'Success!',
        text: 'Update operation completed successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
    });
}

function showInsertSuccessMessage() {
    Swal.fire({
        title: 'Success!',
        text: 'Insert operation completed successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
    });
}



















//**********  ALTELE ********************************************************************* */


function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

async function getProducatoriForDropdown() {
    debugger;
    try {
        const url = `${API_BASE_URL}/ProducatoriAnv`;
        const response = await fetch(url, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const prod = await response.json();
        populateDropdown(prod);
    } catch (error) {
        console.error('A apărut o eroare la apelarea API-ului:', error);
    }
}
//DROP DOWN
function populateDropdown(prod) {
    //debugger;
    const dropdown = document.getElementById('ddd_producator');
    dropdown.innerHTML = '<option value="">Producator</option>';

    // Adaugă opțiunile din lista de mașini
    prod.forEach(pro => {
        const option = document.createElement('option');
        option.value = pro.id; // `id` corespunde `Id` din C#
        option.text = pro.producator; // `f2` corespunde `F2` din C#
        dropdown.appendChild(option);
    });

   

}

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');