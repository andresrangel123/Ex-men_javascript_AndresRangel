// Carrito de compras
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Guardar carrito en localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Agregar producto al carrito
export function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart();
    return cart;
}

// Eliminar producto del carrito
export function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    return cart;
}

// Actualizar cantidad
export function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, newQuantity);
        saveCart();
    }
    return cart;
}

// Vaciar carrito
export function clearCart() {
    cart = [];
    saveCart();
    return cart;
}

// Obtener carrito
export function getCart() {
    return cart;
}

// Calcular total
export function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Contar items
export function getCartItemCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// Verificar si está vacío
export function isCartEmpty() {
    return cart.length === 0;
}