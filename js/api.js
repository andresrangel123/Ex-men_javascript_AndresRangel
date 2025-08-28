// Función para obtener todos los productos
export async function getProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {
            throw new Error('Error al cargar los productos');
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Función para obtener productos por categoría
export async function getProductsByCategory(category) {
    try {
        const url = category === 'all' 
            ? 'https://fakestoreapi.com/products'
            : `https://fakestoreapi.com/products/category/${category}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error al cargar productos por categoría');
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}