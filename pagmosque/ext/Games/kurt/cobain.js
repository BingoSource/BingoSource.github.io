const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const song = new Audio('Come.mp3');
const scoreDisplay = document.getElementById('score');
const missedCountDisplay = document.getElementById('missedCount');
const startScreen = document.getElementById('startScreen');
const gameOverModal = document.getElementById('gameOverModal');
const finalScoreDisplay = document.getElementById('finalScore');

// Configuración de flechas - usar colores en lugar de imágenes
const arrowColors = {
    left: '#ff6b6b',    // Rojo
    up: '#4ecdc4',      // Verde
    right: '#45b7d1'    // Azul
};

// Posiciones fijas (en X) para cada tipo de flecha
const arrowPositions = {
    left: 200,
    up: 350,
    right: 500
};

let arrows = []; // Flechas activas
let score = 0;
let missedCount = 0;
const maxMissed = 10; // Máximo de flechas que se pueden fallar
let gameStarted = false;
let isGameOver = false;

// Línea objetivo
const hitLineY = 500;
const lineHeight = 5;
const hitZoneHeight = 60; // Zona donde se pueden presionar las flechas

// Patrón de flechas sincronizado con "Come as You Are" (120 BPM)
// Cada número representa el tiempo en segundos desde el inicio de la canción
const arrowPattern = [
    { time: 0.5, type: 'left' },
    { time: 1.0, type: 'up' },
    { time: 1.5, type: 'right' },
    { time: 2.0, type: 'up' },
    { time: 2.5, type: 'left' },
    { time: 3.0, type: 'right' },
    { time: 3.5, type: 'up' },
    { time: 4.0, type: 'left' },
    { time: 4.5, type: 'right' },
    { time: 5.0, type: 'up' },
    { time: 5.5, type: 'left' },
    { time: 6.0, type: 'right' },
    { time: 6.5, type: 'up' },
    { time: 7.0, type: 'right' },
    { time: 7.5, type: 'left' },
    { time: 8.0, type: 'up' },
    { time: 9.0, type: 'left' },
    { time: 9.5, type: 'right' },
    { time: 10.0, type: 'up' },
    { time: 10.5, type: 'left' },
    { time: 11.0, type: 'right' },
    { time: 11.5, type: 'up' },
    { time: 12.0, type: 'left' },
    { time: 12.5, type: 'right' },
    { time: 13.0, type: 'up' },
    { time: 13.5, type: 'right' },
    { time: 14.0, type: 'left' },
    { time: 14.5, type: 'up' }
];

let arrowIndex = 0;
let lastSpawnTime = 0;
let songStartTime = 0;
let rafId = null;

// Generar flechas sincronizadas con el patrón
function spawnArrow(timestamp) {
    if (!gameStarted || isGameOver || arrowIndex >= arrowPattern.length) return;

    const currentTime = (timestamp - songStartTime) / 1000;
    
    // Verificar si es momento de generar una nueva flecha
    if (currentTime >= arrowPattern[arrowIndex].time) {
        const type = arrowPattern[arrowIndex].type;
        arrows.push({ 
            type: type, 
            y: -50,
            hit: false,
            missed: false,
            spawnTime: currentTime
        });
        arrowIndex++;
    }
}

// Dibujar línea de objetivo
function drawHitLine() {
    ctx.fillStyle = 'cyan';
    ctx.fillRect(0, hitLineY - hitZoneHeight / 2, canvas.width, lineHeight);

    // Dibujar zona de hit
    ctx.fillStyle = 'rgba(0, 255, 255, 0.2)';
    ctx.fillRect(0, hitLineY - hitZoneHeight / 2, canvas.width, hitZoneHeight);
}

// Dibujar flechas
function drawArrows() {
    arrows.forEach(arrow => {
        const x = arrowPositions[arrow.type];

        // Dibujar la flecha
        ctx.fillStyle = arrowColors[arrow.type];

        if (arrow.hit) {
            ctx.fillStyle = 'lime'; // Verde cuando se acierta
        } else if (arrow.missed) {
            ctx.fillStyle = 'red'; // Rojo cuando se falla
        }

        // Dibujar forma de flecha
        ctx.beginPath();
        ctx.moveTo(x, arrow.y + 20);
        ctx.lineTo(x - 15, arrow.y + 40);
        ctx.lineTo(x + 15, arrow.y + 40);
        ctx.closePath();
        ctx.fill();

        // Cuerpo de la flecha
        ctx.fillRect(x - 5, arrow.y + 40, 10, 20);
    });
}

// Actualizar posición de flechas
function updateArrows() {
    arrows.forEach(arrow => {
        // Calcular la velocidad basada en el tiempo para mantener la sincronización
        const elapsedTime = (performance.now() - songStartTime) / 1000;
        const expectedY = hitLineY - (hitLineY + 50) * (1 - (elapsedTime - arrow.spawnTime) / 4);
        
        // Interpolar suavemente hacia la posición esperada
        arrow.y += (expectedY - arrow.y) * 0.1;

        // Comprobar si alguna flecha pasó la línea sin ser presionada
        if (arrow.y + 40 > hitLineY + hitZoneHeight / 2 && !arrow.hit && !arrow.missed) {
            arrow.missed = true;
            updateMissedCount(1);
        }
    });

    // Eliminar flechas que hayan salido de la pantalla
    arrows = arrows.filter(arrow => arrow.y < canvas.height + 50 && !arrow.missed);
}

// Actualizar puntuación
function updateScore(points) {
    score += points;
    scoreDisplay.textContent = `Puntos: ${score}`;
}

// Actualizar contador de flechas falladas
function updateMissedCount(count) {
    missedCount += count;
    missedCountDisplay.textContent = `Flechas falladas: ${missedCount}/${maxMissed}`;
    
    // Comprobar si se ha perdido por demasiadas flechas falladas
    if (missedCount >= maxMissed) {
        gameOver();
    }
}

// Crear efecto visual al presionar una tecla
function createHitEffect(x, y) {
    const effect = document.createElement('div');
    effect.className = 'hit-effect';
    effect.style.left = `${x - 40}px`;
    effect.style.top = `${y - 40}px`;
    document.getElementById('gameContainer').appendChild(effect);
    
    // Eliminar el efecto después de la animación
    setTimeout(() => {
        if (effect.parentNode) {
            effect.parentNode.removeChild(effect);
        }
    }, 500);
}

// Manejar presión de teclas
function handleKeyPress(e) {
    if (!gameStarted || isGameOver) return;

    // Resaltar tecla visualmente
    const keyElements = {
        'ArrowLeft': document.getElementById('leftKey'),
        'ArrowUp': document.getElementById('upKey'),
        'ArrowRight': document.getElementById('rightKey')
    };

    if (keyElements[e.key]) {
        keyElements[e.key].classList.add('active');
        setTimeout(() => {
            keyElements[e.key].classList.remove('active');
        }, 200);
    }

    let keyMap = {
        'ArrowLeft': 'left',
        'ArrowUp': 'up',
        'ArrowRight': 'right'
    };

    let type = keyMap[e.key];
    if (!type) return;

    let hit = false;

    arrows.forEach(arrow => {
        const inHitZone = arrow.y > hitLineY - hitZoneHeight / 2 && arrow.y < hitLineY + hitZoneHeight / 2;

        if (arrow.type === type && inHitZone && !arrow.hit && !arrow.missed) {
            arrow.hit = true;
            hit = true;

            // Crear efecto visual
            createHitEffect(arrowPositions[arrow.type], hitLineY);

            // Calcular precisión (cuanto más cerca del centro, más puntos)
            const distanceFromCenter = Math.abs(arrow.y - hitLineY);
            const points = Math.max(5, 15 - Math.floor(distanceFromCenter / 5));
            updateScore(points);
        }
    });

    if (!hit) {
        updateScore(-2); // Pequeña penalización por presionar mal
    }
}

// Game Over
function gameOver() {
    isGameOver = true;
    song.pause();
    cancelAnimationFrame(rafId);
    
    // Mostrar modal de game over
    finalScoreDisplay.textContent = score;
    gameOverModal.style.display = 'flex';

    // Calcular recompensa basada en la puntuación
    const recompensa = Math.floor(score / 5);
    
    // Dar recompensa si es válida
    if (recompensa > 0 && typeof updateCoins === 'function') {
        updateCoins(recompensa, "Recompensa: Guitar Hero");
        showNotification(`+${recompensa} Mosquecoins por tocar como Kurt Cobain!`);
    }
}

// Resetear juego
function resetGame() {
    arrows = [];
    score = 0;
    missedCount = 0;
    arrowIndex = 0;
    isGameOver = false;
    updateScore(0);
    updateMissedCount(0);
    startGame();
}

// Bucle principal
function gameLoop(timestamp) {
    if (!gameStarted || isGameOver) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawHitLine();
    spawnArrow(timestamp);
    drawArrows();
    updateArrows();

    rafId = requestAnimationFrame(gameLoop);
}

// Iniciar juego
function startGame() {
    startScreen.style.display = 'none';
    gameStarted = true;
    score = 0;
    missedCount = 0;
    updateScore(0);
    updateMissedCount(0);

    // Reproducir música
    song.volume = 0.7;
    song.currentTime = 0;
    
    song.play().catch(error => {
        console.log("Reproducción de audio prevenida:", error);
        // Simular la reproducción para desarrollo
        songStartTime = performance.now();
        gameLoop();
    }).then(() => {
        songStartTime = performance.now();
        gameLoop();
    });
}

// Función para mostrar notificaciones
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Event listeners
document.addEventListener('keydown', handleKeyPress);

// Instrucciones iniciales
console.log("Mini Guitar Hero - Come As You Are");
console.log("Presiona las flechas ← ↑ → cuando lleguen a la línea azul");