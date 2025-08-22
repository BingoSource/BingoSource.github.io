let currentUser = '';
let currentPassword = '';

// Datos base
const defaultUsers = {
    'Wuender': { password: '201025', coins: 0 },
    'Jesus': { password: '5414', coins: 0 },
    'Eloi': { password: '2612', coins: 0 },
    'Juan': { password: '3421', coins: 0 },
    'Pablo': { password: '5621', coins: 0 },
    'Agua': { password: '2124', coins: 0 }
};

// Cargar desde localStorage o usar default
let users = JSON.parse(localStorage.getItem('mosqueterosUsers')) || defaultUsers;

// Sincronizar contraseñas y asegurar estructura
for (let name in defaultUsers) {
    if (!users[name]) {
        users[name] = defaultUsers[name];
    } else {
        users[name].password = defaultUsers[name].password; // fuerza contraseña actualizada
        if (users[name].coins === undefined) users[name].coins = 0;
    }
}

// Guardar cambios
localStorage.setItem('mosqueterosUsers', JSON.stringify(users));

// Asignar colores aleatorios a todos los botones de usuario
document.querySelectorAll('.user-btn').forEach(btn => {
    btn.style.color = randomColor();
});

function randomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

// Abrir modal de contraseña
function openPasswordModal(username, password) {
    currentUser = username;
    currentPassword = password;
    document.getElementById('password-title').innerText = `Contraseña para ${username}`;
    document.getElementById('password-input').value = '';
    document.getElementById('login-modal').style.display = 'none';
    document.getElementById('password-modal').style.display = 'flex';
}

// Cerrar modal de contraseña
function closePasswordModal() {
    document.getElementById('password-modal').style.display = 'none';
    document.getElementById('login-modal').style.display = 'flex';
}

// Verificar contraseña
function checkPassword() {
    const pass = document.getElementById('password-input').value;
    if (users[currentUser] && pass === users[currentUser].password) {
        const lastLogin = localStorage.getItem(`lastLogin_${currentUser}`);
        const today = new Date().toDateString();

        if (lastLogin !== today) {
            users[currentUser].coins += 10;
            localStorage.setItem(`lastLogin_${currentUser}`, today);
            localStorage.setItem('mosqueterosUsers', JSON.stringify(users));
            showNotification(`+10 Mosquecoins por inicio de sesión diario!`);
        }

        document.getElementById('user-display').innerText = `${currentUser} - ${users[currentUser].coins} Mosquecoins`;
        document.getElementById('user-display').style.display = 'block';
        document.getElementById('password-modal').style.display = 'none';
        document.getElementById('main-menu').style.display = 'block';
        sessionStorage.setItem('currentUser', currentUser);
        updateCoinsDisplay();
    } else {
        alert('Contraseña incorrecta.');
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
