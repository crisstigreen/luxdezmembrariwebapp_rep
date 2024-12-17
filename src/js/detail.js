//PAGE LOAD

document.addEventListener('DOMContentLoaded', function () {
    debugger;
    loadPiesa();
    
});


const urlParams = new URLSearchParams(window.location.search);
const piesaId = urlParams.get('id');
const masina = urlParams.get('masina');


function loadPiesa(){
     debugger;
     if (piesaId) {
         const url = `${API_BASE_URL}/Piese/${piesaId}`;
 
         fetch(url)
             .then(response => {
                 if (!response.ok) {
                     throw new Error('Eroare la obținerea detaliilor piesei');
                 }
                 return response.json();
             })
             .then(obj => {                  
             
                var piesa = obj;
                if(piesa.stoc == 0)
                {                    
                    disableAddToCart();                   
                }







                
                debugger;           
                const carImages = piesa.imagini;   
                const carouselInner = document.getElementById('carousel-inner');
                const carouselIndicatorsContainer = document.getElementById('carousel-indicators');

                // Golește conținutul existent
                carouselInner.innerHTML = '';
                carouselIndicatorsContainer.innerHTML = '';

                if (carImages.length === 0) {
                    const placeholderSrc = `${BASE_URL}/images/placeholder.jpg`;
                    carImages.push(placeholderSrc);
                    $("#carousel-indicators").hide();
                }
                carImages.forEach((imgSrc, index) => {
                    // Creează elementele pentru imagini
                    const carouselItem = document.createElement('div');
                    carouselItem.classList.add('carousel-item');
                    if (index === 0) {
                        carouselItem.classList.add('active');
                    }

                    const imgElement = document.createElement('img');
                    imgElement.classList.add('d-block', 'w-100');
                     //img.src = `${API_BASE_URL_IMG}/uploads/${image.denumireImagine}`; // Aceasta este calea corecta  
                    imgElement.src = imgSrc.startsWith('http') ? imgSrc : `${API_BASE_URL_IMG}/uploads/${imgSrc}`;
                    imgElement.alt = `Slide ${index + 1}`;
                    
                    // Adaugă evenimentul onclick pentru a deschide modalul
                    imgElement.onclick = function() {
                        openImageModal(imgElement.src);
                    };

                    carouselItem.appendChild(imgElement);
                    document.getElementById('carousel-inner').appendChild(carouselItem);

                    // Creează indicatorii
                    const indicatorItem = document.createElement('img');
                    indicatorItem.src = imgSrc.startsWith('http') ? imgSrc : `${API_BASE_URL_IMG}/uploads/${imgSrc}`;
                    indicatorItem.alt = `Thumbnail ${index + 1}`;
                    indicatorItem.setAttribute('data-target', '#carouselExampleIndicators');
                    indicatorItem.setAttribute('data-slide-to', index);

                    // Adaugă clasa activă pe primul indicator
                    if (index === 0) {
                        indicatorItem.classList.add('active');
                    }

                    // Adaugă eveniment pentru a seta indicatorul activ
                    indicatorItem.addEventListener('click', function () {
                        const activeIndicator = document.querySelector('.carousel-indicators-container img.active');
                        if (activeIndicator) {
                            activeIndicator.classList.remove('active');
                        }
                        // Aplică clasa activă la indicatorul pe care s-a dat clic
                        this.classList.add('active');
                    });

                    document.getElementById('carousel-indicators').appendChild(indicatorItem);
                });

                // Adaugă evenimentul pentru a sincroniza indicatorii la schimbarea slide-ului
                $('#carouselExampleIndicators').on('slide.bs.carousel', function (e) {
                    const nextSlideIndex = $(e.relatedTarget).index();
                    const activeIndicator = document.querySelector('.carousel-indicators-container img.active');
                    if (activeIndicator) {
                        activeIndicator.classList.remove('active');
                    }
                    const nextIndicator = document.querySelector(`.carousel-indicators-container img[data-slide-to="${nextSlideIndex}"]`);
                    if (nextIndicator) {
                        nextIndicator.classList.add('active');
                    }
                });

                // Funcția de scroll a indicatorilor
                function scrollIndicators(direction) {
                    const container = document.querySelector('.carousel-indicators-container');
                    const scrollAmount = 100; // Cantitatea de scroll
                    if (direction === 'prev') {
                        container.scrollBy({
                            left: -scrollAmount,
                            behavior: 'smooth'
                        });
                    } else if (direction === 'next') {
                        container.scrollBy({
                            left: scrollAmount,
                            behavior: 'smooth'
                        });
                    }
                }












                 
                 document.getElementById('piesaTitlu').innerText = piesa.nume + " " + masina;
                 document.getElementById('piesaMeniu').innerText = piesa.nume;
                 document.getElementById('piesaMasina').innerText = masina;                 
                 document.getElementById('piesaBucati').innerText = piesa.stoc;
                 document.getElementById('piesatipCaroserie').innerText = piesa.tipCaroserie; 
                 document.getElementById('piesaCodPiesa').innerText = piesa.codPiesa;                                 
                 document.getElementById('piesaPret').innerText = `${piesa.pret}`;
             })
             .catch(error => {
                 console.error('Eroare:', error);
                 document.getElementById('detaliiPiesa').innerText = 'A apărut o eroare la încărcarea detaliilor piesei.';
             });
     } else {
         // Dacă nu există ID în URL, afișează un mesaj de eroare
         document.getElementById('detaliiPiesa').innerText = 'Piesa nu a fost găsită.';
     }

}

function openImageModal(imageSrc) {
    var modalImage = document.getElementById('modalImage');
    modalImage.src = imageSrc;
    $('#imageModal').modal('show');
}



  // Adaugă evenimentele de click după ce elementele au fost adăugate în DOM
  document.querySelectorAll('.js-btn-minus, .js-btn-plus').forEach(button => {        
    button.addEventListener('click', function() {    
        debugger;    
        const action = this.getAttribute('data-action');                        
        updateQuantity(action);        
    });
});


function updateQuantity(action){
    debugger;
    var count = parseInt(document.getElementById('quantity-input').value);
    if(action == 'plus')
    {
        count++;
    }
    else if (count > 1){
        count--;
    }
    
    var pret = parseInt(document.getElementById('piesaPret').innerText); 
    var total = count * pret;
    
    document.getElementById('piesaPretTotal').innerText = total + " RON";
}

document.getElementById('addToCart').addEventListener('click', () => {
    debugger;        
    
    var pretText = document.getElementById('piesaPret').innerText;
    var pret = parseInt(pretText.substring(0, pretText.indexOf(' ')));        
    var pretTotal = pret;    
    var imagini = document.getElementById('piesaImagine').src;
    var masina = document.getElementById('piesaMasina').innerText;
    var tipCaroserie = document.getElementById('piesatipCaroserie').innerText;
    var codIntern = document.getElementById('piesaCodPiesa').innerText;
    var stoc = document.getElementById('piesaBucati').innerText;

    if(piesaId){
        const product = {
            id: piesaId,
            name: document.getElementById('piesaTitlu').innerText,            
            quantity: 1,
            pret: pret,
            pretTotal: pretTotal,
            imagini: imagini,
            masina: masina,
            tipCaroserie: tipCaroserie,
            codIntern,
            stoc: stoc
        };
        addToCart(product);    
    }        
});

 
function disableAddToCart() {
    const addToCartLink = document.getElementById('addToCart');
    addToCartLink.classList.add('disabled-link');
    addToCartLink.removeAttribute('href');  // Oprirea navigării la pagină
}


