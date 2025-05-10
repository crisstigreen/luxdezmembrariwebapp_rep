// PAGE LOAD

window.onload = function() {
    debugger;
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


function loadPiesa(piesaId) {
    debugger;    
    const urlSearch = `${API_BASE_URL}/Piese/` + piesaId;

    fetch(urlSearch)
        .then(response => {
            debugger;
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

            // Afișează detaliile piesei
            document.getElementById('piesaTitlu').textContent = piesa.nume;
            document.getElementById('piesaMasina').textContent = piesa.masina;
            document.getElementById('piesaCodPiesa').textContent = piesa.codPiesa;
            document.getElementById('piesaBucati').textContent = piesa.stoc;
            document.getElementById('piesaPret').textContent = piesa.pret;
            document.getElementById('piesaSku').textContent = piesa.skU_Id;
            document.getElementById('piesaCodMotor').textContent = piesa.codMotor;
            document.getElementById('piesaMotorizare').textContent = piesa.motorizare;

            const carImages = piesa.imagini;   
            const carouselInner = document.getElementById('carousel-inner');
            const carouselIndicatorsContainer = document.getElementById('carousel-indicators');

            // Golește conținutul existent
            carouselInner.innerHTML = '';
            carouselIndicatorsContainer.innerHTML = '';

            if (carImages.length === 0) {                          
                const placeholderSrc = `images/placeholder.jpg`;
                carImages.push(placeholderSrc);
                $("#carousel-indicators").hide();                
            }
            carImages.forEach((imgSrc, index) => {
                const isPlaceholder = imgSrc.includes('placeholder.jpg');
                // Creează elementele pentru imagini
                const carouselItem = document.createElement('div');
                carouselItem.classList.add('carousel-item');
                if (index === 0) {
                    carouselItem.classList.add('active');
                }

                const imgElement = document.createElement('img');
                imgElement.classList.add('d-block', 'w-100');                                 
                imgElement.src = isPlaceholder ? imgSrc : `${API_BASE_URL_IMG}/${imgSrc}`;
                imgElement.alt = `Slide ${index + 1}`;
                
                // Adaugă evenimentul onclick pentru a deschide modalul
                imgElement.onclick = function() {
                    openImageModal(imgElement.src);
                };

                carouselItem.appendChild(imgElement);
                document.getElementById('carousel-inner').appendChild(carouselItem);

                // Creează indicatorii
                const indicatorItem = document.createElement('img');                
                indicatorItem.src = isPlaceholder ? imgSrc : `${API_BASE_URL_IMG}/${imgSrc}`;
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


                document.getElementById('carousel-indicators').appendChild(indicatorItem);
            });

            
        })
        .catch(error => {
            console.error('Eroare:', error);
            document.getElementById('detaliiPiesa').innerText = 'A apărut o eroare la încărcarea piesei.';
        });
}

//celelalte

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
    var firstImageElement = document.querySelector('#carousel-inner img');    
    var firstImageSrc = firstImageElement ? firstImageElement.src : null;
           
    var imagini = firstImageSrc;

    var masina = document.getElementById('piesaMasina').innerText;    
    var codIntern = document.getElementById('piesaCodPiesa').innerText;
    var stoc = document.getElementById('piesaBucati').innerText;
    var piesaTitlu = document.getElementById('piesaTitlu').innerText;

    if(piesaId){
        const product = {
            id: piesaId,
            name: piesaTitlu,                        
            quantity: 1,
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




