document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    if (username) {
        document.getElementById('usernameDisplay').textContent = username;
    } else {
        alert("No se encontró un nombre de usuario. Redirigiendo al inicio...");
        window.location.href = "../Inicio.html";
    }
});

function toggleLike() {
    const likeButton = document.querySelector('.like-button');
    likeButton.classList.toggle('liked');
    localStorage.setItem('liked', likeButton.classList.contains('liked'));
}

function showFloatingEmojis(emoji) {
    const floatingEmojis = document.getElementById('floatingEmojis');
    const maxEmojis = 50; // Limitar la cantidad máxima de emojis en pantalla

    for (let i = 0; i < 10; i++) {
        if (floatingEmojis.childElementCount >= maxEmojis) break;

        const emojiElement = document.createElement('div');
        emojiElement.textContent = emoji;
        emojiElement.style.position = 'absolute';
        emojiElement.style.left = `${Math.random() * 100}%`;
        emojiElement.style.bottom = '0';
        emojiElement.style.fontSize = '2rem';
        emojiElement.style.animation = `float ${Math.random() * 2 + 3}s ease-out`;
        floatingEmojis.appendChild(emojiElement);

        setTimeout(() => {
            emojiElement.remove();
        }, 3000);
    }
}
