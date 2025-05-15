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
let marca = "";
let model = "";
let generatie = "";

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

    await pieseApiCall(populatePieseShopGrid);   
});
function generateCarUrl(masina) {
    let marcaModelGeneratie = masina.nume
        .toLowerCase()
        .replace(/\s+/g, '-') 
        .replace(/[^a-z0-9\-]/g, '');
    return `/:${marcaModelGeneratie}-${masina.id}`; 
}
function veziPiese(id,totalPiese){   
    debugger; 
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

//POPULATE Masini GRID
function populateMasiniShopGrid(data){
    const rezultateDiv = document.getElementById('rezultateMasini');
    rezultateDiv.innerHTML = '';
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

    
    
    
         rezultateDiv.innerHTML += piesaHTML;

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
        const cartImageStyles = inStock 
        ? "width: 34px; height: 34px; background: linear-gradient(to right, #1b78d1, #3098fa); padding: 8px; border-radius: 15%; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); transition: box-shadow 0.3s ease, transform 0.3s ease;"
        : "width: 34px; height: 34px; background: grey; padding: 8px; border-radius: 15%;";
    
        const cartImageEvents = inStock 
        ? `
            onmouseover="this.style.background='linear-gradient(to right, #368ddf, #4ca8ff)'" 
            onmouseout="this.style.background='linear-gradient(to right, #1b78d1, #3098fa)'" 
            onmousedown="this.style.boxShadow='none'; this.style.transform='scale(0.95)'" 
            onmouseup="this.style.boxShadow='0 4px 8px rgba(0, 0, 0, 0.2)'; this.style.transform='scale(1)'" 
            onclick="onImageClick(${piesa.id})"
        `
        : `
            onclick="event.preventDefault();"
        `;

        const piesaHTML = `
            <div class="col-sm-6 col-lg-4 mb-4">
                <div class="block-4 border d-flex flex-column" style="height: 450px;">
                    <figure class="block-4-image">
                        <a  href="${generatePiesaUrl(piesa)}">                        
                            <img src="${imageSrc}" style='width: 100%; height: 165px; object-fit: contain;object-position: center;' alt="Image placeholder" class="img-fluid" id="piesaImagine-${piesa.id}">
                           
                        </a>
                    </figure>


                        <div class="block-4-text padding10 d-flex flex-column flex-grow-1" id="piesa-${piesa.id}">

                        <h6 style="font-weight: bold;">
                            <a href="${generatePiesaUrl(piesa)}">${piesa.nume}</a>
                        </h6>



                        <p class="mb-0"><strong style='font-weight: bold'>Masina: </strong> <span id="piesaMasina-${piesa.id}">${piesa.masina}</span></p>
                        <p class="mb-0"><strong style='font-weight: bold'>Disponibilitate: </strong> ${piesa.stoc > 0 ? `În stoc (${piesa.stoc})` : 'Fără stoc'}</p>
                        <p class="mb-0" style='display:none' id="piesaStoc-${piesa.id}">${piesa.stoc}</p>
                        <p class="mb-0"><strong style='font-weight: bold; display:none'>Tip caroserie: </strong><span style='display:none' id="piesaTipCaroserie-${piesa.id}">${piesa.tipCaroserie}</span></p>
                        
                        <p class="mb-0"><strong style='font-weight: bold'>Cod intern: </strong><span id="piesaCodintern-${piesa.id}">${piesa.locatie}</span></p>
                        <p class="mb-0"><strong style='font-weight: bold'>SKU_ID: </strong><span id="piesasku_ID-${piesa.id}">${piesa.skU_Id}</span></p>
                        <div class="mt-auto d-flex justify-content-between align-items-center">
                            <h3 style="margin: 0;" id="piesaPret-${piesa.id}"><strong style='font-weight: bold; color:'>${piesa.pret}</strong></h3>
                            <a href="cart.html" class="site-cart">
                                <img 
                                    src='images/add-to-cart.png' 
                                    alt="Image placeholder" 
                                    class="img-fluid" 
                                    style="${cartImageStyles}"
                                    ${cartImageEvents}
                                > 
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        rezultateDiv.innerHTML += piesaHTML;                
     });             
   
}