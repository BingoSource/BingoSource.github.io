function selectGame(gameName) {
    if (gameName === 'Yo nunca nunca') {
        showPopup("Este juego se encuentra en desarrollo y no puedes jugarlo.");
        return; // No sumar puntos ni redirigir
    }

    let reward = 0;
    if (gameName === 'Trivia') {
        reward = 20;
        location.href = 'trivia/trivia.html';
    } else if (gameName === 'Quien es más probable') {
        reward = 15;
        location.href = 'probalt/probal.html';
    }
}

// Mostrar ventana emergente animada
function showPopup(message) {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.textContent = message;
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.style.opacity = '0';
        popup.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            document.body.removeChild(popup);
        }, 500);
    }, 2000);
}

// Función para cuando se completa un juego
function gameCompleted(reward) {
    if (updateCoins(reward, `Recompensa por juego`)) {
        showNotification(`+${reward} Mosquecoins por completar el juego!`);
    }
}

// Función para mostrar notificaciones
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0,255,0,0.8);
        color: white;
        padding: 15px;
        border-radius: 5px;
        z-index: 1000;
        animation: fadeInOut 3s forwards;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

function goBack() {
    location.href = '../index.html';
}