﻿//PAGE LOAD

document.addEventListener('DOMContentLoaded', function () {
    debugger;
    loadPiesa();
    
    
});


const urlParams = new URLSearchParams(window.location.search);
const carId = urlParams.get('id');
const masina = urlParams.get('masina');


    //const carImages = `${BASE_URL}/images/placeholder.jpg`;

function loadPiesa() {
    if (carId) {
        const url = `${API_BASE_URL}/CarsRegister/${carId}`;
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Eroare la obținerea detaliilor piesei');
                }
                return response.json();
            })
            .then(car => {
                debugger;                                                 
                const carImages = car.imagini;   
                const carouselInner = document.getElementById('carousel-inner');
                const carouselIndicatorsContainer = document.getElementById('carousel-indicators');

                // Golește conținutul existent
                carouselInner.innerHTML = '';
                carouselIndicatorsContainer.innerHTML = '';

                if (carImages.length === 0) {                    
                    const placeholderSrc = BASE_URL + '/images/placeholder.jpg';                            
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
    } else {
        // Dacă nu există ID în URL, afișează un mesaj de eroare
        document.getElementById('detaliiPiesa').innerText = 'Masina nu a fost găsită.';
    }
}

function openImageModal(imageSrc) {
    var modalImage = document.getElementById('modalImage');
    modalImage.src = imageSrc;
    $('#imageModal').modal('show');
}

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


    








 



