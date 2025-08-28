import { addToCart, removeFromCart, updateQuantity, getCart, getCartTotal, getCartItemCount, isCartEmpty, clearCart } from './cart.js';

// Mostrar u ocultar loading
export function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
}

// Mostrar productos en el grid
export function displayProducts(products) {
    const grid = document.getElementById('products-grid');
    const noProducts = document.getElementById('no-products');
    const resultsCount = document.getElementById('results-count');
    
    resultsCount.textContent = `${products.length} productos`;
    
    if (products.length === 0) {
        grid.style.display = 'none';
        noProducts.style.display = 'block';
        return;
    }
    
    grid.style.display = 'grid';
    noProducts.style.display = 'none';
    
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${product.id}">
                    Agregar al carrito
                </button>
                <button class="view-details-btn gradient" data-id="${product.id}">
                    <i class="fas fa-eye btn-icon"></i>
                    Ver más detalles
                </button>
            </div>
        </div>
    `).join('');
    
    // Agregar event listeners a los botones
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            onAddToCart(productId, products);
        });
    });
    
    // Agregar event listeners a los botones "Ver más"
    document.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            onViewDetails(productId, products);
        });
    });
}

// Mostrar carrito en el modal
export function displayCart() {
    const cartItems = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartTotal = document.getElementById('cart-total');
    const cart = getCart();
    
    if (isCartEmpty()) {
        cartItems.style.display = 'none';
        cartEmpty.style.display = 'block';
        // Mejora el mensaje de carrito vacío
        cartEmpty.innerHTML = `
            <i class="fas fa-shopping-basket"></i>
            <h3>Tu carrito está vacío</h3>
            <p>¡Explora nuestros productos y encuentra algo especial!</p>
        `;
    } else {
        cartItems.style.display = 'flex';
        cartEmpty.style.display = 'none';
        
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.title}</h4>
                    <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" data-action="decrease" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" data-action="increase" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `).join('');
        
        // Event listeners para los botones del carrito
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.id);
                const action = e.target.dataset.action;
                onUpdateQuantity(productId, action);
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.id);
                onRemoveFromCart(productId);
            });
        });
    }
    
    cartTotal.textContent = getCartTotal().toFixed(2);
}

// Actualizar contador del carrito
export function updateCartCount() {
    document.getElementById('cart-count').textContent = getCartItemCount();
}

// Mostrar notificación
export function showNotification(message, type = 'success') {
    // Crear notificación temporal
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 2000;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Mostrar detalles del producto
export function displayProductDetail(product) {
    const productDetail = document.getElementById('product-detail');
    
    // Calcular estrellas de rating
    const stars = Math.round(product.rating?.rate || 0);
    const starIcons = '★'.repeat(stars) + '☆'.repeat(5 - stars);
    
    productDetail.innerHTML = `
        <div class="product-detail-top">
            <div class="product-detail-image">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-detail-info">
                <h2 class="product-detail-title">${product.title}</h2>
                <p class="product-detail-category">${product.category}</p>
                <p class="product-detail-price">$${product.price.toFixed(2)}</p>
                
                ${product.rating ? `
                <div class="product-detail-rating">
                    <span class="rating-stars">${starIcons}</span>
                    <span>${product.rating.rate} (${product.rating.count} reviews)</span>
                </div>
                ` : ''}
                
                <div class="product-detail-actions">
                    <div class="quantity-selector">
                        <button class="quantity-btn" id="detail-decrease">-</button>
                        <input type="number" class="quantity-input" id="detail-quantity" value="1" min="1">
                        <button class="quantity-btn" id="detail-increase">+</button>
                    </div>
                    <button class="btn-add-to-cart-large" id="detail-add-to-cart" data-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i>
                        Agregar al carrito
                    </button>
                </div>
            </div>
        </div>
        <div class="product-detail-bottom">
            <h3>Descripción</h3>
            <p class="product-detail-description">${product.description}</p>
            
            <div class="product-detail-specs">
                <div class="spec-item">
                    <span class="spec-label">Categoría</span>
                    <span class="spec-value">${product.category}</span>
                </div>
                ${product.rating ? `
                <div class="spec-item">
                    <span class="spec-label">Calificación</span>
                    <span class="spec-value">${product.rating.rate} / 5</span>
                </div>
                <div class="spec-item">
                    <span class="spec-label">Reseñas</span>
                    <span class="spec-value">${product.rating.count}</span>
                </div>
                ` : ''}
            </div>
        </div>
    `;
    
    // Configurar event listeners para los controles de cantidad
    const quantityInput = document.getElementById('detail-quantity');
    const decreaseBtn = document.getElementById('detail-decrease');
    const increaseBtn = document.getElementById('detail-increase');
    const addToCartBtn = document.getElementById('detail-add-to-cart');
    
    decreaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });
    
    increaseBtn.addEventListener('click', () => {
        quantityInput.value = parseInt(quantityInput.value) + 1;
    });
    
    addToCartBtn.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value);
        onAddToCartDetail(product.id, quantity);
    });
    
    // Mostrar el modal
    document.getElementById('product-modal').style.display = 'block';
}

// Handlers de eventos
let onAddToCartCallback = null;
let onUpdateQuantityCallback = null;
let onRemoveFromCartCallback = null;
let onViewDetailsCallback = null;
let onAddToCartDetailCallback = null;

export function setAddToCartHandler(callback) {
    onAddToCartCallback = callback;
}

export function setUpdateQuantityHandler(callback) {
    onUpdateQuantityCallback = callback;
}

export function setRemoveFromCartHandler(callback) {
    onRemoveFromCartCallback = callback;
}

export function setViewDetailsHandler(callback) {
    onViewDetailsCallback = callback;
}

export function setAddToCartDetailHandler(callback) {
    onAddToCartDetailCallback = callback;
}

function onAddToCart(productId, products) {
    if (onAddToCartCallback) {
        onAddToCartCallback(productId, products);
    }
}

function onUpdateQuantity(productId, action) {
    if (onUpdateQuantityCallback) {
        onUpdateQuantityCallback(productId, action);
    }
}

function onRemoveFromCart(productId) {
    if (onRemoveFromCartCallback) {
        onRemoveFromCartCallback(productId);
    }
}

function onViewDetails(productId, products) {
    if (onViewDetailsCallback) {
        onViewDetailsCallback(productId, products);
    }
}

function onAddToCartDetail(productId, quantity) {
    if (onAddToCartDetailCallback) {
        onAddToCartDetailCallback(productId, quantity);
    }
}