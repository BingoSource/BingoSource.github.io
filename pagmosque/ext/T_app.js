const productos = [
    { 
        img: "../image/Bate.jpg", 
        nombre: "Bate de tun tun sahur", 
        precio: 30,
        clase: "precio-verde",
        id: 1
    },
    { 
        img: "../image/Escopet_kurt.jpg", 
        nombre: "Escopeta de Kurt Cobain", 
        precio: 0, 
        clase: "estado-rojo",
        id: 2,
        agotado: true
    },
    { 
        img: "../image/machete.jpg", 
        nombre: "Machete", 
        precio: 0, 
        clase: "estado-rojo", 
        detalle: "Machete reservado por Eloi para el viernes, razón desconocida.",
        id: 3,
        agotado: true
    },
    { 
        img: "../image/ma.jpg", 
        nombre: "Prototipo", 
        precio: 0, 
        clase: "estado-rojo",
        id: 4,
        agotado: true
    },
    { 
        img: "../image/Lentes.jpg", 
        nombre: "Lentes de Wuender", 
        precio: 0, 
        clase: "estado-rojo", 
        reserva: "Reservado por Wuender",
        id: 5,
        agotado: true
    },
    { 
        img: "../image/Vacasaturno.jpg", 
        nombre: "Vaca Saturno Saturnita", 
        precio: 0, 
        clase: "estado-amarillo",
        id: 6,
        agotado: true
    },
    { 
        img: "../image/Padre.jpg", 
        nombre: "Papa", 
        precio: 0, 
        clase: "estado-rojo", 
        reserva: "Reservado por Agua",
        id: 7,
        agotado: true
    },
    { 
        img: "../image/gorr.jpg", 
        nombre: "Gorro de Juan", 
        precio: 45,
        clase: "precio-verde",
        id: 8
    },
    { 
        img: "../image/guitarra.jpg", 
        nombre: "Guitarra de Kurt Cobain", 
        precio: 75000,
        clase: "precio-verde",
        id: 9
    },
    { 
        img: "../image/gumbal.jpg", 
        nombre: "5 sticker", 
        precio: 20,
        clase: "estado-amarillo",
        id: 10
    }
];

const container = document.getElementById('productos-container');

productos.forEach(prod => {
    const card = document.createElement('div');
    card.classList.add('producto');
    card.dataset.id = prod.id;

    const imagen = document.createElement('img');
    imagen.src = prod.img;

    const info = document.createElement('div');
    info.classList.add('producto-info');

    const nombre = document.createElement('div');
    nombre.classList.add('nombre');
    nombre.textContent = prod.nombre;

    const precio = document.createElement('div');
    
    if (prod.agotado) {
        precio.classList.add('estado-rojo');
        precio.textContent = "Agotado";
    } else {
        precio.classList.add(prod.clase);
        precio.textContent = `${prod.precio} Mosquecoins`;
        
        // Añadir botón de compra si no está agotado
        const comprarBtn = document.createElement('button');
        comprarBtn.textContent = 'Comprar';
        comprarBtn.classList.add('comprar-btn');
        comprarBtn.onclick = function() {
            comprarProducto(prod.id);
        };
        info.appendChild(comprarBtn);
    }

    info.appendChild(nombre);
    info.appendChild(precio);

    if (prod.detalle) {
        const detalle = document.createElement('div');
        detalle.classList.add('detalle');
        detalle.textContent = prod.detalle;
        info.appendChild(detalle);
    }

    if (prod.reserva) {
        const reserva = document.createElement('div');
        reserva.classList.add('estado-dorado');
        reserva.textContent = prod.reserva;
        info.appendChild(reserva);
    }

    card.appendChild(imagen);
    card.appendChild(info);
    container.appendChild(card);
});

// Función para comprar producto
function comprarProducto(productId) {
    const producto = productos.find(p => p.id === productId);
    if (!producto) return;
    
    if (producto.agotado) {
        alert('Este producto está agotado.');
        return;
    }
    
    if (!canAfford(producto.precio)) {
        alert('No tienes suficientes Mosquecoins para comprar este producto.');
        return;
    }
    
    if (confirm(`¿Quieres comprar ${producto.nombre} por ${producto.precio} Mosquecoins?`)) {
        if (updateCoins(-producto.precio, `Compra: ${producto.nombre}`)) {
            alert(`¡Felicidades! Has comprado ${producto.nombre}`);
            // Aquí podrías añadir el producto al inventario del usuario
        }
    }
}