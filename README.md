# 🛒 Proyecto E-commerce FakeStore

Este proyecto es una aplicación web de **tienda en línea** que permite a los usuarios explorar productos, filtrarlos, ordenarlos y agregarlos a un carrito de compras. Incluye un flujo completo desde la selección de productos hasta la confirmación de compra.

---

## 📂 Estructura del Proyecto

e-commerce-fakestore/
│── index.html # Página principal
│── css/ # Estilos
│ └── styles.css
│── js/ # Scripts
│ └── app.js
│── assets/ # Imágenes e íconos
│── README.md # Documentación


---


---

## ⚙️ Funcionamiento

1. Los productos se obtienen de una **API FakeStore** o desde un archivo local.
2. El usuario puede:
   - Ver productos en tarjetas.
   - Aplicar **filtros** (por categoría).
   - Aplicar **ordenamientos** (por precio, nombre, popularidad).
   - Agregar productos al carrito.
3. El carrito permite:
   - Ver los productos seleccionados.
   - Eliminar productos.
   - Calcular el total automáticamente.
   - Confirmar la compra, mostrando un **modal estilizado de compra exitosa**.

---

## 📦 Estructura de Datos

### Representación de los productos
Cada producto se representa como un **objeto JavaScript** con las siguientes propiedades:

```js
{
  id: 1,
  title: "Camiseta",
  price: 29.99,
  category: "ropa",
  image: "assets/img/camiseta.png"
}
