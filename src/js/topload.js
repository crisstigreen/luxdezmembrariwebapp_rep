document.addEventListener("DOMContentLoaded", function () {
    updateCartCountDisplay(); 

    const path = window.location.pathname;
    const page = path.split("/").pop();                     
});

// Function to update the cart count display
function updateCartCountDisplay() {
    //debugger;     
     setTimeout(() => {
        //debugger; 
        const countElement = document.getElementById('cart-count');
        if(countElement != null)
        {
            countElement.textContent = getCartCount();
        }  
        
    }, 500); // Rămâne deschis pentru 1000 ms (1 secundă)
 
}

// Function to get the cart count from localStorage
function getCartCount() {
    //debugger; 
    let count = localStorage.getItem('cartCount');
    if (count) {
        return parseInt(count);
    } else {
        return 0;
    }
}

// Function to add an item to the cart
function addToCart(product) {
    debugger;
    let count = getCartCount();
    count += product.quantity;
    setCartCount(count);
    updateCartCountDisplay();

    let cartItems = getCartItems();

    const existingProduct = cartItems.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity += product.quantity;
    } else {
        cartItems.push(product);
    }

    setCartItems(cartItems);

}

// Function to set cart items in localStorage
function setCartItems(items) {
    localStorage.setItem('cartItems', JSON.stringify(items));
}

// Function to set the cart count in localStorage
function setCartCount(count) {
    //debugger;
    localStorage.setItem('cartCount', count);
}

// Function to get cart items from localStorage (same as defined in topload.js)
function getCartItems() {
    //debugger;
    let items = localStorage.getItem('cartItems');
    if (items) {
        return JSON.parse(items);
    } else {
        return [];
    }
}
