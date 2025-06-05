//PAGE LOAD
window.onload = function() {
    //debugger;
    //document.getElementById('link-Masini').classList.add('active');
    let pathname = window.location.pathname.substring(1); // Elimină primul "/"
    let regex = /(.+)-(\d+)$/; // Capturăm numele și ID-ul
    let match = pathname.match(regex);

    if (match) {        
        let id = match[2]; // 515
        console.log(id);
        loadMasina(id);
        pieseMasinaApiCall(id, populatePieseShopGrid);
    } else {
        document.getElementById('detaliiPiesa').innerText = 'Masina nu a fost găsită.';
    }
};


//cod nou
function loadMasina(carId) {
    const urlSearch = `${API_BASE_URL}/CarsRegister/${carId}`;

    fetch(urlSearch)
        .then(response => {
            if (!response.ok) {
                throw new Error('Eroare la căutarea ID-ului mașinii');
            }
            return response.json();
        })
        .then(car => {
            if (!car || !car.id) {
                throw new Error('Mașina nu a fost găsită în baza de date.');
            }
            return fetch(`${API_BASE_URL}/CarsRegister/${car.id}`);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Eroare la obținerea detaliilor piesei');
            }
            return response.json();
        })
        .then(car => {
            const carImages = car.imagini || [];
            const carouselInner = document.getElementById('carousel-inner');
            const carouselIndicatorsContainer = document.getElementById('carousel-indicators');

            carouselInner.innerHTML = '';
            carouselIndicatorsContainer.innerHTML = '';

            if (carImages.length === 0) {
                carImages.push('images/placeholder.jpg');
                carouselIndicatorsContainer.style.display = 'none';
            } else {
                carouselIndicatorsContainer.style.display = 'flex';
            }

            carImages.forEach((imgSrc, index) => {
                const isPlaceholder = imgSrc.includes('placeholder.jpg');
                const fullSrc = isPlaceholder ? imgSrc : `${API_BASE_URL_IMG}/${imgSrc}?v=${Date.now()}`;

                // Create carousel item
                const carouselItem = document.createElement('div');
                carouselItem.className = 'carousel-item';
                if (index === 0) carouselItem.classList.add('active');

                const img = document.createElement('img');
                img.src = fullSrc;
                img.alt = `Slide ${index + 1}`;
                img.classList.add('carousel-img');
                img.onclick = () => openImageModal(fullSrc);

                carouselItem.appendChild(img);
                carouselInner.appendChild(carouselItem);

                // Create thumbnail indicator
                const indicator = document.createElement('img');
                indicator.src = fullSrc;
                indicator.alt = `Thumbnail ${index + 1}`;
                indicator.classList.add('carousel-thumb');
                if (index === 0) indicator.classList.add('active');

                indicator.addEventListener('click', () => {
                    document.querySelector('.carousel-item.active')?.classList.remove('active');
                    carouselInner.children[index].classList.add('active');

                    document.querySelector('.carousel-thumb.active')?.classList.remove('active');
                    indicator.classList.add('active');
                });

                carouselIndicatorsContainer.appendChild(indicator);
            });

            // Optional: Left/right arrow logic (if you want to implement sliding)
            setupManualCarousel(carImages.length);

            // Update car detail fields
            document.getElementById('piesaTitlu').innerText = car.nume;
            document.getElementById('piesaMeniu').innerText = car.nume;
            document.getElementById('piesaIdentificator').innerText = car.nrOrdine;
            document.getElementById('piesaCodMotor').innerText = car.codMotor;
            document.getElementById('piesaCombustibil').innerText = car.combustibil;
            document.getElementById('piesaAn').innerText = car.an;
            document.getElementById('piesaCapacitCil').innerText = car.capacitCil;
            document.getElementById('piesaPutereCP').innerText = car.putereCP;
            document.getElementById('piesaKm').innerText = car.km;
            document.getElementById('piesaNrLoc').innerText = car.nrLocuri;
            document.getElementById('piesaTransmisie').innerText = car.transmisie;
            document.getElementById('piesaTranctiune').innerText = car.tractiune;
            document.getElementById('piesaNrViteze').innerText = car.nrViteze;
        })
        .catch(error => {
            console.error('Eroare:', error);
            document.getElementById('detaliiPiesa').innerText = 'A apărut o eroare la încărcarea detaliilor piesei.';
        });
}


function setupManualCarousel(totalSlides) {
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');

    if (!prevBtn || !nextBtn) return;

    prevBtn.onclick = () => navigateCarousel(-1, totalSlides);
    nextBtn.onclick = () => navigateCarousel(1, totalSlides);
}

function navigateCarousel(direction, total) {
    const current = document.querySelector('.carousel-item.active');
    const items = document.querySelectorAll('.carousel-item');
    const thumbs = document.querySelectorAll('.carousel-thumb');

    let index = Array.from(items).indexOf(current);
    current.classList.remove('active');
    thumbs[index].classList.remove('active');

    index = (index + direction + total) % total;

    items[index].classList.add('active');
    thumbs[index].classList.add('active');
}

//POPULATE Piese GRID
 function populatePieseShopGrid(data){
    const rezultateDiv = document.getElementById('rezultatePieseMasina');
    rezultateDiv.innerHTML = '';
    //debugger;
    //cristi testache
 
    data.piese.forEach(piesa => {
       
        var imageSrc = piesa.imagini ? `${API_BASE_URL_IMG}/` + piesa.imagini[0] : 'images/placeholder.jpg';
    
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
                    <div class="card-body" id="piesa-${piesa.id}">
                        <h3 style="font-weight: bold;">
                            <a href="${generatePiesaUrl(piesa)}" id="piesaTitlu-${piesa.id}">${piesa.nume}</a>
                        </h3>
                        <div class="card-desc-piese">
                            <p>Masina: <span id="piesaMasina-${piesa.id}">${piesa.masina}</span></p>
                            <p style='display:none' id="piesaStoc-${piesa.id}">${piesa.stoc}</p>
                            <p>Cod intern: <span id="piesaCodintern-${piesa.id}">${piesa.locatie}</span></p>
                            <p>SKU_ID: <span id="piesasku_ID-${piesa.id}">${piesa.skU_Id}</span></p>
                            <p>Disponibilitate: ${piesa.stoc > 0 ? `<span> <img src='images/CheckmarkCircle.svg' alt="Disponibil"/> În stoc (${piesa.stoc})` : '<span>Fără stoc</span>'}</p>
                        </div>
                        <div class="card-footer">
                            <h4 id="piesaPret-${piesa.id}">${piesa.pret.replace('RON','').trim()}<span>RON</span></h4>
                            <a class="btn-primary" ${cartImageEvents}>
                                Cumpără
                                <img src='images/ShoppingBagW.svg'  alt="Adauga in cos"   />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        rezultateDiv.innerHTML += piesaHTML;                
     });             
   
}
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
function onImageClick(idPiesa) {
    //debugger;
    var nume =document.getElementById(`piesaTitlu-${idPiesa}`).innerText;
    var pretText = document.getElementById(`piesaPret-${idPiesa}`).innerText;
    var pret = parseInt(pretText.match(/\d+/)[0]); // Extrage doar numărul din text        
    var imagini = document.getElementById(`piesaImagine-${idPiesa}`).src;
    var masina = document.getElementById(`piesaMasina-${idPiesa}`).innerText;
    //var tipCaroserie = document.getElementById(`piesaTipCaroserie-${idPiesa}`).innerText;
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
        window.location.href = '/cart.html';
    }
}




//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!celelalte    

// function openImageModal(imageSrc) {
//     var modalImage = document.getElementById('modalImage');
//     modalImage.src = imageSrc;
//     $('#imageModal').modal('show');
// }

function plaseazaComanda(){    
    const link = `${API_BASE_URL}/ComenziPiese`; 

    const data = {
        nume: document.getElementById("tb_nume").value,
        telefon:  document.getElementById("tb_telefon").value,
        email:  document.getElementById("tb_email").value,
        mesaj:  document.getElementById("tb_mesaj").value        
    };   
    insert(data,link);
    clearform();
    showInsertSuccessMessage();
}

function clearform(){
    document.getElementById("tb_nume").value = ''; 
    document.getElementById("tb_telefon").value = ''; 
    document.getElementById("tb_email").value = ''; 
    document.getElementById("tb_mesaj").value = ''; 
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

function list(){
    debugger;
    const url = `masini.html`;
    window.location = url;
}

document.querySelectorAll('.accordion-header').forEach(header => {
  header.addEventListener('click', () => {
    const isActive = header.classList.contains('active');

    // Close all
    document.querySelectorAll('.accordion-header').forEach(h => h.classList.remove('active'));
    document.querySelectorAll('.accordion-body').forEach(b => b.classList.remove('show'));

    // Toggle current
    if (!isActive) {
      header.classList.add('active');
      header.nextElementSibling.classList.add('show');
    }
  });
});











 



