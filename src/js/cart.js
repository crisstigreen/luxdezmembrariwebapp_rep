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
            <div class="row mb-3" data-item-id="${item.id}">
                <div class="col-md-4">
                    <img src="${item.imagini}" class="img-fluid" alt="${item.name}">
                </div>
                <div class="col-md-6">
                    
                    <h5 class="card-title">
                        <a href="shop-single.html?id=${item.id}" id="piesaTitlu-${item.id}">${item.name} ${item.masina}</a>
                    </h5>
                    <p class="card-text"><strong>Masina: </strong>${item.masina}</p>
                    <p class="card-text"><strong>Tip caroserie: </strong>${item.tipCaroserie}</p>
                    <p class="card-text"><strong>Cod intern: </strong>${item.codIntern}</p>
                    <p class="card-text"><strong>id: ${item.id}</strong></p>
                    <p class="card-text"><strong>stoc: ${item.stoc}</strong></p>
                    <p class="card-text"><strong>Pret: </strong>${item.pret} RON / buc</p>                                                                              
                </div>
                <div class="col-md-2" >
                    <p class="card-text" style="font-size: 20px;"><strong>${item.pretTotal} RON</strong></p>
                    <div class="mb-5">
                        <div class="input-group mb-3" style="max-width: 120px;">
                            <div class="input-group-prepend">
                                <button class="btn btn-outline-primary js-btn-minus" type="button" data-id="${item.id}" data-action="minus" ${item.quantity === 1 ? 'disabled' : ''}>&minus;</button>
                            </div>
                            <input id="quantity-input-${item.id}" type="text" class="form-control text-center" value="${item.quantity}" readonly>
                            <div class="input-group-append">                                
                                <button class="btn btn-outline-primary js-btn-plus" type="button" data-id="${item.id}" data-action="plus" ${item.quantity === parseInt(item.stoc) ? 'disabled' : ''}>&plus;</button>
                            </div>
                        </div>
                    </div>
                    <a href="#" class="btn btn-danger js-btn-delete" data-id="${item.id}">Sterge</a>
                    
                </div>
            </div>
            <hr>
        `;
        cartContainer.innerHTML += itemHtml;
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

// Funcția pentru a popula div-ul cu articolele din coș
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



function deleteLogged(itemId){
    const url = `${API_BASE_URL}/CartItems/${encodeURIComponent(itemId)}`;

    // Confirmarea ștergerii
    Swal.fire({
        title: 'Ești sigur?',
        text: 'Aceasta piesă va fi ștearsă din coș!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Da, șterge!'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(url, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Eroare la ștergerea piesei din coș');
                }
                // Elimină elementul din DOM
                document.querySelector(`[data-item-id="${itemId}"]`).remove();
                Swal.fire(
                    'Șters!',
                    'Piesa a fost ștearsă din coș.',
                    'success'
                );
            })
            .catch(error => {
                console.error('Eroare:', error);
                Swal.fire(
                    'Eroare!',
                    'A apărut o eroare la ștergerea piesei din coș.',
                    'error'
                );
            });
        }
    });
}


document.getElementById('btn_finalizeaza').addEventListener('click', () => {
    debugger;        
    
    
    
    
});

document.getElementById('btn_continue').addEventListener('click', () => {
    debugger;        
    localStorage.clear(); 
    window.location='shop.html';
});


function updateTotalPrice() {    
    const items = getCartItems(); // Assuming getCartItems() returns the current items in the cart
    const totalPrice = items.reduce((sum, item) => sum + item.pretTotal, 0);
    document.getElementById('pretTotal').textContent = `${totalPrice.toFixed(2)} RON`;
}



