// Sistema económico para Los Mosqueteros

// Cargar datos de usuario
function loadUserData() {
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) return null;
    
    const users = JSON.parse(localStorage.getItem('mosqueterosUsers'));
    return users[currentUser];
}

// Actualizar display de monedas
function updateCoinsDisplay() {
    const userData = loadUserData();
    if (!userData) return;
    
    const walletDisplay = document.getElementById('wallet-display');
    const coinsAmount = document.getElementById('coins-amount');
    const userDisplay = document.getElementById('user-display');
    
    if (walletDisplay && coinsAmount) {
        coinsAmount.textContent = userData.coins;
        walletDisplay.style.display = 'block';
    }
    
    if (userDisplay) {
        userDisplay.textContent = `${sessionStorage.getItem('currentUser')} - ${userData.coins} Mosquecoins`;
    }
}

// Mostrar billetera
function showWallet() {
    const userData = loadUserData();
    if (!userData) return;
    
    const modal = document.getElementById('wallet-modal');
    const walletUser = document.getElementById('wallet-user');
    const walletCoins = document.getElementById('wallet-coins');
    const historyContainer = document.getElementById('transaction-history');
    
    walletUser.textContent = sessionStorage.getItem('currentUser');
    walletCoins.textContent = userData.coins;
    
    // Cargar historial de transacciones
    const transactions = JSON.parse(localStorage.getItem(`transactions_${sessionStorage.getItem('currentUser')}`) || '[]');
    historyContainer.innerHTML = '';
    
    if (transactions.length === 0) {
        historyContainer.innerHTML = '<p>No hay transacciones registradas</p>';
    } else {
        transactions.slice(-10).reverse().forEach(transaction => {
            const item = document.createElement('div');
            item.className = `transaction-item ${transaction.amount >= 0 ? 'transaction-positive' : 'transaction-negative'}`;
            item.innerHTML = `
                <div>${transaction.description}</div>
                <div>${transaction.amount >= 0 ? '+' : ''}${transaction.amount} Mosquecoins</div>
                <small>${new Date(transaction.date).toLocaleString()}</small>
            `;
            historyContainer.appendChild(item);
        });
    }
    
    modal.style.display = 'flex';
}

// Cerrar billetera
function closeWallet() {
    document.getElementById('wallet-modal').style.display = 'none';
}

// Añadir transacción al historial
function addTransaction(amount, description) {
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) return;
    
    const transactions = JSON.parse(localStorage.getItem(`transactions_${currentUser}`) || '[]');
    transactions.push({
        date: new Date().toISOString(),
        amount: amount,
        description: description
    });
    
    localStorage.setItem(`transactions_${currentUser}`, JSON.stringify(transactions));
}

// Actualizar monedas del usuario
function updateCoins(amount, description) {
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) return false;
    
    const users = JSON.parse(localStorage.getItem('mosqueterosUsers'));
    users[currentUser].coins += amount;
    
    localStorage.setItem('mosqueterosUsers', JSON.stringify(users));
    addTransaction(amount, description);
    updateCoinsDisplay();
    
    return true;
}

// Verificar si el usuario puede pagar
function canAfford(amount) {
    const userData = loadUserData();
    return userData && userData.coins >= amount;
}

// Inicializar la economía cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Solo si hay un usuario logueado
    if (sessionStorage.getItem('currentUser')) {
        updateCoinsDisplay();
    }
});