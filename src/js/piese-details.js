// PAGE LOAD
let MAX_QUANTITY = 1;
let MIN_QUANTITY = 1;

window.onload = function() {
    debugger;
    document.getElementById('link-Piese').classList.add('active');
    let pathname = window.location.pathname.substring(1); 

    pathname = pathname.replace(/%20/g, '-'); 

    //console.log('Pathname modifcat:', pathname);

    let regex = /^(?:([^\/]+)\/)?(.+)-(\d+)$/;
    let match = pathname.match(regex);

    if (match) {
        let categorie = match[1] || ''; 
        let id = match[3]; 
        piesaId = id;

        //console.log("Categorie:", categorie);
        //console.log("ID Piesa:", id);

        loadPiesa(id); 

        if (categorie) {
            document.getElementById('categoriePiesa').innerText = 'Categorie: ' + categorie;
        }

        let newUrl = "/" + (categorie ? categorie + "/" : "") + match[2] + "-" + id;
        history.pushState({}, '', newUrl); 
    } else {
        document.getElementById('detaliiPiesa').innerText = 'Piesa nu a fost găsită.';
    }
};

const urlParams = new URLSearchParams(window.location.search);
var piesaId = urlParams.get('id');
const masina = urlParams.get('masina');


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

function loadPiesa(piesaId) {
    const urlSearch = `${API_BASE_URL}/Piese/${piesaId}`;

    fetch(urlSearch)
        .then(response => {
            if (!response.ok) {
                throw new Error('Eroare la căutarea ID-ului piesei');
            }
            return response.json();
           
        })
        .then(piesa => {
            if (!piesa || !piesa.id) {
                document.getElementById('detaliiPiesa').innerText = 'Piesa nu a fost găsită.';
                return;
            }
            MAX_QUANTITY = piesa.stoc;
            // Afișează detaliile piesei
            document.getElementById('piesaMeniu').innerText = piesa.nume;
            
            document.getElementById('piesaTitlu').textContent = piesa.nume  + " " + piesa.codPiesa + " " + piesa.masina + " " 
            + piesa.motorizare + " " + piesa.codMotor + " " + (piesa.remarks == null ? "" : piesa.remarks);

            document.getElementById('piesaMasina').textContent = piesa.masina;
            document.getElementById('piesaCodPiesa').textContent = piesa.codPiesa;
            document.getElementById('piesaBucati').textContent = piesa.stoc;
            if(piesa.discount > 0){
                document.getElementById('piesaReducere').textContent = piesa.discount + '%';
            }else{
                 document.getElementById('piesaReducere').style.display = 'none';
            }
            const addToCartBtn = document.getElementById('addToCart');
            if (piesa.stoc === 0) {
                addToCartBtn.classList.add('disabled');
                addToCartBtn.style.pointerEvents = 'none';
            } else {
                addToCartBtn.classList.remove('disabled');
                addToCartBtn.style.pointerEvents = 'auto';
            }

            const pretFaraRON = piesa.pret.replace('RON', '').trim();
            document.getElementById('piesaPret').innerHTML = `${pretFaraRON} <span>RON/buc</span>`;
            document.getElementById('piesaSku').textContent = piesa.skU_Id;
            document.getElementById('piesaCodMotor').textContent = piesa.codMotor;
            document.getElementById('piesaMotorizare').textContent = piesa.motorizare;


            const carImages = piesa.imagini || [];
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

            // Optional: setup carousel arrows if defined
            setupManualCarousel(carImages.length);
        })
        .catch(error => {
            console.error('Eroare:', error);
            document.getElementById('detaliiPiesa').innerText = 'A apărut o eroare la încărcarea piesei.';
        });
}


//celelalte

// function openImageModal(imageSrc) {
//     var modalImage = document.getElementById('modalImage');
//     modalImage.src = imageSrc;
//     $('#imageModal').modal('show');
// }
  // Adaugă evenimentele de click după ce elementele au fost adăugate în DOM
//   document.querySelectorAll('.js-btn-minus, .js-btn-plus').forEach(button => {        
//     button.addEventListener('click', function() {    
//         debugger;    
//         const action = this.getAttribute('data-action');                        
//         updateQuantity(action);        
//     });
// });

// function updateQuantity(action){
//     debugger;
//     var count = parseInt(document.getElementById('quantity-input').value);
//     if(action == 'plus')
//     {
//         count++;
//     }
//     else if (count > 1){
//         count--;
//     }
    
//     var pret = parseInt(document.getElementById('piesaPret').innerText); 
//     var total = count * pret;
    
//     document.getElementById('piesaPretTotal').innerText = total + " RON";
// }

document.getElementById('addToCart').addEventListener('click', () => {
    debugger;            
    var pretText = document.getElementById('piesaPret').innerText;
    var pret = parseInt(pretText.substring(0, pretText.indexOf(' ')));        
    var pretTotal = pret;        
    var firstImageElement = document.querySelector('#carousel-inner img');    
    var firstImageSrc = firstImageElement ? firstImageElement.src : null;
    var quantity = document.getElementById(`quantity-input`).value     
    var imagini = firstImageSrc;

    var masina = document.getElementById('piesaMasina').innerText;    
    var codIntern = document.getElementById('piesaCodPiesa').innerText;
    var stoc = document.getElementById('piesaBucati').innerText;
    var piesaTitlu = document.getElementById('piesaTitlu').innerText;

    if(piesaId){
        const product = {
            id: piesaId,
            name: piesaTitlu,                        
            quantity: quantity,
            pret: pret,
            pretTotal: pretTotal,
            imagini: imagini,
            masina: masina,            
            codIntern,
            stoc: stoc
        };
        debugger;
        addToCart(product);    
    }        
});
 
function disableAddToCart() {
    const addToCartLink = document.getElementById('addToCart');
    addToCartLink.classList.add('disabled-link');
    addToCartLink.removeAttribute('href');  // Oprirea navigării la pagină
}

function list(){
    debugger;
    const url = `index.html`;
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


//Event for quantity input
 function increase() {
    const input = document.getElementById("quantity-input");
    let value = parseInt(input.value, 10);

    if (value < MAX_QUANTITY) {
        input.value = value + 1;
    }
}

  function decrease() {
    const input = document.getElementById("quantity-input");
    let value = parseInt(input.value, 10);

    if (value > MIN_QUANTITY) {
        input.value = value - 1;
    }
}







