const API_URL = "https://fakestoreapi.com/products";
import { getProducts, getProductsByCategory } from './api.js';
import { 
    displayProducts, showLoading, displayCart, updateCartCount, 
    showNotification, setAddToCartHandler, setUpdateQuantityHandler, 
    setRemoveFromCartHandler, displayProductDetail, 
    setViewDetailsHandler, setAddToCartDetailHandler 
} from './ui.js';
import { addToCart, updateQuantity, removeFromCart, clearCart, getCart } from './cart.js';

// Variables globales
let allProducts = [];
let filteredProducts = [];

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', async () => {
    await loadProducts();
    setupEventListeners();
    updateCartCount();
    
    // Configurar handlers
    setAddToCartHandler(handleAddToCart);
    setUpdateQuantityHandler(handleUpdateQuantity);
    setRemoveFromCartHandler(handleRemoveFromCart);
    setViewDetailsHandler(handleViewDetails);
    setAddToCartDetailHandler(handleAddToCartDetail);
});

// Cargar productos
async function loadProducts() {
    showLoading(true);
    try {
        allProducts = await getProducts();
        filteredProducts = [...allProducts];
        displayProducts(filteredProducts);
    } catch (error) {
        showNotification('Error al cargar los productos', 'error');
        console.error('Error:', error);
    } finally {
        showLoading(false);
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Búsqueda
    document.getElementById('search-btn').addEventListener('click', filterProducts); 
    document.getElementById('search-input').addEventListener('input', filterProducts);
    
    // Filtros
    document.getElementById('category-filter').addEventListener('change', filterProducts);
    document.getElementById('price-filter').addEventListener('input', function() {
        document.getElementById('price-value').textContent = this.value;
        filterProducts();
    });
    document.getElementById('sort-by').addEventListener('change', filterProducts);
    
    // Limpiar filtros
    document.getElementById('clear-filters').addEventListener('click', clearFilters);
    
    // Carrito
    document.getElementById('cart-btn').addEventListener('click', openCart);
    document.getElementById('close-cart').addEventListener('click', closeCart);
    document.getElementById('clear-cart').addEventListener('click', handleClearCart);
    document.getElementById('checkout').addEventListener('click', handleCheckout);
    
    // Modal de producto
    document.getElementById('close-product-modal').addEventListener('click', closeProductModal);

    // Modal de éxito
    const closeSuccess = document.getElementById('close-success');
    if (closeSuccess) {
        closeSuccess.addEventListener('click', () => {
            document.getElementById('success-modal').style.display = 'none';
        });
    }
    
    // Cerrar modales al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (e.target.id === 'cart-modal') {
            closeCart();
        }
        if (e.target.id === 'product-modal') {
            closeProductModal();
        }
        if (e.target.id === 'success-modal') {
            document.getElementById('success-modal').style.display = 'none';
        }
    });
}

// Filtrar productos
function filterProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const category = document.getElementById('category-filter').value;
    const maxPrice = parseFloat(document.getElementById('price-filter').value);
    const sortBy = document.getElementById('sort-by').value;
    
    filteredProducts = allProducts.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm) ||
                             product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = category === 'all' || product.category === category;
        const matchesPrice = product.price <= maxPrice;
        
        return matchesSearch && matchesCategory && matchesPrice;
    });
    
    // Ordenar
    sortProducts(sortBy);
    
    displayProducts(filteredProducts);
}

// Ordenar productos
function sortProducts(sortBy) {
    switch (sortBy) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
            break;
    }
}

// Limpiar filtros
function clearFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('category-filter').value = 'all';
    document.getElementById('price-filter').value = 1000;
    document.getElementById('price-value').textContent = '1000';
    document.getElementById('sort-by').value = 'default';
    
    filterProducts();
}

// Handlers del carrito
function handleAddToCart(productId, products) {
    const product = products.find(p => p.id === productId);
    if (product) {
        addToCart(product);
        updateCartCount();
        showNotification(`${product.title} agregado al carrito`);
    }
}

function handleUpdateQuantity(productId, action) {
    const item = getCart().find(item => item.id === productId);
    if (item) {
        const newQuantity = action === 'increase' ? item.quantity + 1 : item.quantity - 1;
        if (newQuantity > 0) {
            updateQuantity(productId, newQuantity);
            displayCart();
            updateCartCount();
        }
    }
}

function handleRemoveFromCart(productId) {
    const item = getCart().find(item => item.id === productId);
    if (item) {
        removeFromCart(productId);
        displayCart();
        updateCartCount();
        showNotification('Producto eliminado del carrito');
    }
}

function handleClearCart() {
    if (confirm('¿Estás seguro de vaciar el carrito?')) {
        clearCart();
        displayCart();
        updateCartCount();
        showNotification('Carrito vaciado');
    }
}

function backupCart() {
    localStorage.setItem("cardBackup", JSON.stringify(getCart()));
}

function restoreCart() {
    const bakup = JSON.parse(localStorage.getItem("cartBackup"));
    if (bakup) {
        bakup.forEach(item => addToCart(item));
        updateCartCount();
        displayCart();
        showNotification("Carrito Restaurado")
    }
}
// ✅ Nuevo checkout con modal de éxito
function handleCheckout() {
    if (getCart().length === 0) {
        showNotification('El carrito está vacío', 'error');
        return;
    }
    savePurchase({date: new Date(), items: getCart() });
    // Mostrar modal en lugar de alert
    document.getElementById('success-modal').style.display = 'flex';
    
    clearCart();
    closeCart();
    updateCartCount();

}


// Handlers para detalles de producto
function handleViewDetails(productId, products) {
    const product = products.find(p => p.id === productId);
    if (product) {
        displayProductDetail(product);
    }
}

function handleAddToCartDetail(productId, quantity) {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        updateCartCount();
        showNotification(`${quantity} ${product.title} agregado(s) al carrito`);
        closeProductModal();
    }
}

// Abrir y cerrar carrito
function openCart() {
    displayCart();
    document.getElementById('cart-modal').style.display = 'block';
}

function closeCart() {
    document.getElementById('cart-modal').style.display = 'none';
}

// Cerrar modal de producto
function closeProductModal() {
    document.getElementById('product-modal').style.display = 'none';
}

function savePurchase(order) {
    let history = JSON.parse(localStorage.getItem("purchaseHistiry"))||[];
    history.push(order);
    localStorage.setItem("purchaseHistory", JSON.stringify(history));
}