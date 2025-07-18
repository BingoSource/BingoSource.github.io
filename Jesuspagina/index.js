function continueToMain() {
    const username = document.getElementById('usernameInput').value.trim();
    if (username) {
        localStorage.setItem('username', username);
        window.location.href = "./P/P.html";
    } else {
        alert("Por favor, ingrese un nombre de usuario válido.");
    }
}
