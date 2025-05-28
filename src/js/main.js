//  AOS.init({
//  	duration: 800,
//  	easing: 'slide',
//  	once: true
//  });

// jQuery(document).ready(function($) {


	

// 	"use strict";
	

// 	// var slider = function() {
// 	// 	$('.nonloop-block-3').owlCarousel({
// 	//     center: false,
// 	//     items: 1,
// 	//     loop: false,
// 	// 		stagePadding: 15,
// 	//     margin: 20,
// 	//     nav: true,
// 	// 		navText: ['<span class="icon-arrow_back">', '<span class="icon-arrow_forward">'],
// 	//     responsive:{
//     //     600:{
//     //     	margin: 20,
//     //       items: 2
//     //     },
//     //     1000:{
//     //     	margin: 20,
//     //       items: 3
//     //     },
//     //     1200:{
//     //     	margin: 20,
//     //       items: 3
//     //     }
// 	//     }
// 	// 	});
// 	// };
// 	// slider();



	


// 	var sitePlusMinus = function() {
// 		$('.js-btn-minus').on('click', function(e){
// 			e.preventDefault();
// 			if ( $(this).closest('.input-group').find('.form-control').val() != 0  ) {
// 				$(this).closest('.input-group').find('.form-control').val(parseInt($(this).closest('.input-group').find('.form-control').val()) - 1);
// 			} else {
// 				$(this).closest('.input-group').find('.form-control').val(parseInt(0));
// 			}
// 		});
// 		$('.js-btn-plus').on('click', function(e){
// 			e.preventDefault();
// 			$(this).closest('.input-group').find('.form-control').val(parseInt($(this).closest('.input-group').find('.form-control').val()) + 1);
// 		});
// 	};
// 	sitePlusMinus();


// 	var siteSliderRange = function() {
//     $( "#slider-range" ).slider({
//       range: true,
//       min: 0,
//       max: 500,
//       values: [ 75, 300 ],
//       slide: function( event, ui ) {
//         $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
//       }
//     });
//     $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
//       " - $" + $( "#slider-range" ).slider( "values", 1 ) );
// 	};
// 	siteSliderRange();


// 	// var siteMagnificPopup = function() {
// 	// 	$('.image-popup').magnificPopup({
// 	//     type: 'image',
// 	//     closeOnContentClick: true,
// 	//     closeBtnInside: false,
// 	//     fixedContentPos: true,
// 	//     mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
// 	//      gallery: {
// 	//       enabled: true,
// 	//       navigateByImgClick: true,
// 	//       preload: [0,1] // Will preload 0 - before current, and 1 after the current image
// 	//     },
// 	//     image: {
// 	//       verticalFit: true
// 	//     },
// 	//     zoom: {
// 	//       enabled: true,
// 	//       duration: 300 // don't foget to change the duration also in CSS
// 	//     }
// 	//   });

// 	//   $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
// 	//     disableOn: 700,
// 	//     type: 'iframe',
// 	//     mainClass: 'mfp-fade',
// 	//     removalDelay: 160,
// 	//     preloader: false,

// 	//     fixedContentPos: false
// 	//   });
// 	// };
// 	// siteMagnificPopup();


// });


let currentPage = 1;
let totalPages = 1;
let pageSize = 4; // Valoarea implicită
let orderTerm = 'DESC'; // Implicit
let searchTerm = ''; // Variabilă pentru a stoca termenul de căutare



document.addEventListener('DOMContentLoaded', async function () {


    await carsApiCall(populateMasiniShopGrid);

    document.querySelectorAll(".link-masini").forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault(); // Evită încărcarea paginii
            const newUrl = this.getAttribute("href");
            history.pushState(null, "", newUrl);
            loadCarDetails(newUrl);
        });
    });




     
});
function generateCarUrl(masina) {
    let marcaModelGeneratie = masina.nume
        .toLowerCase()
        .replace(/\s+/g, '-') 
        .replace(/[^a-z0-9\-]/g, '');
    return `/:${marcaModelGeneratie}-${masina.id}`; 
}
function veziPiese(id,totalPiese){   
    //debugger; 
    if (id) {
        const url = totalPiese > 0 ? `index.html?id=${id}` : `masini-details.html?id=${id}`;
        window.open(url, '_self');
    } else {

    }
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
    var pretText = document.getElementById(`piesaPret-${idPiesa}`).innerText;
    var pret = parseInt(pretText.match(/\d+/)[0]); // Extrage doar numărul din text        
    var imagini = document.getElementById(`piesaImagine-${idPiesa}`).src;
    var masina = document.getElementById(`piesaMasina-${idPiesa}`).innerText;
    var tipCaroserie = document.getElementById(`piesaTipCaroserie-${idPiesa}`).innerText;
    var codIntern = document.getElementById(`piesaCodintern-${idPiesa}`).innerText;
    var stoc = document.getElementById(`piesaStoc-${idPiesa}`).innerText;

    if(idPiesa){
        const product = {
            id: idPiesa.toString(),
            //name: document.getElementById(`piesaTitlu-${idPiesa}`).innerText,
            name: "Ornament dreapta - hardcodat",
            quantity: 1,
            pret: pret,
            pretTotal: pret,
            imagini: imagini,
            masina: masina,            
            codIntern: codIntern,
            stoc: stoc
        };
        addToCart(product);
    }
}

//POPULATE Masini GRID
function populateMasiniShopGrid(data){
    //debugger;
    const rezultateDiv = document.getElementById('rezultateMasini');
    if(rezultateDiv != null){
         rezultateDiv.innerHTML = '';
    }  
   
    //debugger;
    data.masiniReg.forEach(masina => {
       
        const imageSrc = masina.imagini[0] ? `${API_BASE_URL_IMG}/` + masina.imagini[0] : 'images/placeholder.jpg';
                  
        const piesaHTML = `
        <div class="card">
               <div class="card-image">
                    <figure>
                        <a class="link-masini" href="${generateCarUrl(masina)}">
                            <img src="${imageSrc}" alt="${masina.nume}">
                        </a>
                    </figure>
                </div>
                <div class="card-body">
                    <h3>
                        <a class="link-masini" href="${generateCarUrl(masina)}">${masina.nume}</a>
                    </h3>
                    <div class="card-desc">
                          <p>Cod motor: <span>${masina.codMotor} </span></p>
                           <p>Capacitate cilindrică: <span>${masina.capacitCil}</span></p>
                           <p>Combustibil: <span>${masina.combustibil} </span></p>
                            ${masina.putereCP ? `<p class="mb-0">Cai putere: <span>${masina.putereCP}<span></p>` : ''}
                            <p>An fabricație: <span>${masina.an}</span></p>
                            <p>ID vehicul: <span>${masina.id}</span></p>
                    </div>
                </div>
                <div class="card-footer">
                            ${masina.totalPiese > 0 ? ` <a href="${generateCarUrl(masina)}" class="btn-outline">Vezi ${masina.totalPiese} piese <img src='../images/Eye.svg' alt='Solicita piesa'></a>` : ''}
                          <a href="${generateCarUrl(masina)}" class="btn-primary">Solicită piesa <img src='../images/Chat.svg' alt='Solicita piesa'></a>
                </div>
        </div>`;

    
    
        if(rezultateDiv != null){rezultateDiv.innerHTML += piesaHTML;}         
     });             
  



}
//POPULATE Piese GRID
 function populatePieseShopGrid(data){
    const rezultateDiv = document.getElementById('rezultatePiese');
    rezultateDiv.innerHTML = '';
    //debugger;
    //cristi testache
    
    data.piese.forEach(piesa => {
        //debugger;       
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
                            <a href="${generatePiesaUrl(piesa)}">${piesa.nume}</a>
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
                            <a href="cart.html" class="btn-primary">
                                Cumpără
                                <img src='images/ShoppingBagW.svg'  alt="Adauga in cos"  ${cartImageEvents} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        rezultateDiv.innerHTML += piesaHTML;                
     });             
   
}