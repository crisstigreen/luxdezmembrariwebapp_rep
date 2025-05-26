// PAGE LOAD
document.addEventListener('DOMContentLoaded', function() {
    debugger;
    displayCartItems();
    updateTotalPrice();
   
});


function displayCartItems() {
    debugger;
    const items = getCartItems();
    const cartContainer = document.getElementById('cart-container');

    cartContainer.innerHTML = ''; 
           
    items.forEach(item => {
        const itemHtml = `
            <div class="row-cart" data-item-id="${item.id}">
                <div class="col-2">
                    <img src="${item.imagini}" class="img-fluid" alt="${item.name}">
                </div>
                <div class="col-4">
                    <h3>
                        <a href="piese-details.html?id=${item.id}" id="piesaTitlu-${item.id}">${item.name} ${item.masina}</a>
                    </h3>
                    <p>Disponibilitate <span><img src="images/CheckmarkCircle.svg" alt="Disponibil"> În stoc (${item.stoc})</span></p>
                    <a href="#" class="js-btn-delete" data-id="${item.id}">Sterge</a>
                </div>
                <div class="col-3 quantity">
                            <button class="btn-quantity js-btn-minus" type="button" data-id="${item.id}" data-action="minus" ${item.quantity === 1 ? 'disabled' : ''}>&minus;</button>
                            <input id="quantity-input-${item.id}" type="text" class="form-input quantity-input" value="${item.quantity}" readonly>
                            <button class="btn-quantity js-btn-plus" type="button" data-id="${item.id}" data-action="plus" ${item.quantity === parseInt(item.stoc) ? 'disabled' : ''}>&plus;</button>
                </div>
                <div class="col-3">
                    <h4>${item.pret} <span>RON/buc<span></h4> 
                </div>
            </div>
            <hr>
        `;
        cartContainer.innerHTML += itemHtml;
    });

    const summaryContainer = document.getElementById('summary-container');

    summaryContainer.innerHTML = ''; 
           
    items.forEach(item => {
        const itemHtml = `
            <div class="row-cart" data-item-id="${item.id}">
                <div class="col-7">
                <p>
                ${item.quantity > 1 ? `${item.quantity} x ` : ''}${item.name} ${item.masina}
                </p>
                </div>
                <div class="col-5">
                    <h4>${item.pret * item.quantity}<span>RON</span></h4> 
                </div>
            </div>
        `;
        summaryContainer.innerHTML += itemHtml;
    });


    // Adaugă evenimentele de click după ce elementele au fost adăugate în DOM
    document.querySelectorAll('.js-btn-minus, .js-btn-plus').forEach(button => {        
        button.addEventListener('click', function() {
            const itemId = this.getAttribute('data-id');
            const action = this.getAttribute('data-action');                        
            updateCartItemQuantity(itemId, action);
            updateTotalPrice();

        });
    });

    document.querySelectorAll('.js-btn-delete').forEach(button => {        
        button.addEventListener('click', function() {
            const itemId = this.getAttribute('data-id');
            deleteCartItem(itemId);
        });
    });
    
}


function updateCartItemQuantity(itemId, action) {
    debugger;
    const items = getCartItems();
    const item = items.find(item => item.id === itemId);

    if (item) {
        let count = getCartCount();                
        if (action === 'plus') {
            item.quantity += 1;
            item.pretTotal = item.pret * item.quantity;
            count += 1;

        } else if (action === 'minus') {

            if (item.quantity > 1) {
                item.quantity -= 1;
                item.pretTotal = item.pret * item.quantity;
                count -= 1;
            } else {
                return;
            }
        }
        setCartCount(count);                
        setCartItems(items);
        updateCartCountDisplay();  // Actualizează contorul global    
        displayCartItems();
     
        
                           
         // Dezactivează/activează butonul minus
        const minusButton = document.querySelector(`button.js-btn-minus[data-id='${itemId}']`);
        if (item.quantity === 1) {
            minusButton.setAttribute('disabled', true);
        } else {
            minusButton.removeAttribute('disabled');
        }
    }
}


function deleteUnlogged(itemId){    
    let items = getCartItems();
    const item = items.find(item => item.id === itemId);
    items = items.filter(item => item.id !== itemId);

    let count = getCartCount();  
    count -= item.quantity;
    setCartCount(count);     
    setCartItems(items);


    updateCartCountDisplay();  // Actualizează contorul global
    displayCartItems();  // Reafișează elementele din coș
    updateTotalPrice();
    
}


function getCartItems() {
    debugger;  
    let items = localStorage.getItem('cartItems');

    if (items) {
       
        return JSON.parse(items);
    } else {
        return [];
    }
}

// API GET DATE - Cart Items
function getCartApi(cartId) {
    const url = `${API_BASE_URL}/Cart/${encodeURIComponent(cartId)}`;
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Eroare la obținerea articolelor din coș');
            }
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            document.getElementById('rezultate-tabel').innerText = 'A apărut o eroare la obținerea articolelor din coș.';
            throw error;
        });
}

// DE VAZUT DACA MAI ESTE NEVOIE DE ACEASTA FUNCTIE
function populateCartItems(items) {
    debugger;
    const cartContainer = document.getElementById('cart-container');
    cartContainer.innerHTML = ''; // Golește conținutul anterior   
    items.forEach(item => {
        const itemHtml = `
            <div class="row mb-3" data-item-id="${item.id}">
                <div class="col-md-4">
                    <img src="${item.imagini}" class="img-fluid" alt="${item.nume}">
                </div>
                <div class="col-md-8">
                    <h5 class="card-title">${item.nume}</h5>
                    <p class="card-text">Descriere scurtă a ${item.nume}. Aceasta piesă </p>                    
                    <p class="card-text"><strong>Pret: ${item.pret} RON</strong></p>
                    <a href="#" class="btn btn-danger" onclick="deleteCartItem(${item.id})">Sterge</a>
                    <p class="card-text"><strong>${item.item}</strong></p>
                </div>
            </div>
            <hr>
        `;
        cartContainer.innerHTML += itemHtml;
    });
}


function deleteCartItem(itemId) {
    debugger;
    var logged = 0;
    if(logged == 1)
    {
        deleteLogged(itemId);
    }
    else    
    {
        deleteUnlogged(itemId);
    }
           
}



// function deleteLogged(itemId){
//     const url = `${API_BASE_URL}/CartItems/${encodeURIComponent(itemId)}`;

//     // Confirmarea ștergerii
//     Swal.fire({
//         title: 'Ești sigur?',
//         text: 'Aceasta piesă va fi ștearsă din coș!',
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#3085d6',
//         cancelButtonColor: '#d33',
//         confirmButtonText: 'Da, sterge!'
//     }).then((result) => {
//         if (result.isConfirmed) {
//             fetch(url, {
//                 method: 'DELETE'
//             })
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Eroare la ștergerea piesei din coș');
//                 }
//                 // Elimină elementul din DOM
//                 document.querySelector(`[data-item-id="${itemId}"]`).remove();
//                 Swal.fire(
//                     'Șters!',
//                     'Piesa a fost ștearsă din coș.',
//                     'success'
//                 );
//             })
//             .catch(error => {
//                 console.error('Eroare:', error);
//                 Swal.fire(
//                     'Eroare!',
//                     'A apărut o eroare la ștergerea piesei din coș.',
//                     'error'
//                 );
//             });
//         }
//     });
// }

function deleteLogged(itemId) {
    const url = `${API_BASE_URL}/CartItems/${encodeURIComponent(itemId)}`;

    fetch(url, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Eroare la ștergerea piesei din coș');
        }
        // Elimină elementul din DOM
        document.querySelector(`[data-item-id="${itemId}"]`).remove();
       
    })
    .catch(error => {
        console.error('Eroare:', error);
    });
}


document.getElementById('btn_finalizeaza').addEventListener('click', () => {
    debugger;        
    
    
    
    
});

// document.getElementById('btn_continue').addEventListener('click', () => {
//     debugger;            
//     window.location='index.html';
// });


function updateTotalPrice() {    
    const items = getCartItems(); 
       const totalPrice = items.reduce((sum, item) => {
        const itemTotal = item.pret * item.quantity;
        return sum + itemTotal;
    }, 0);
   document.getElementById('pretTotal').innerHTML = `${totalPrice.toFixed(0)}<span>RON</span>`;
}



