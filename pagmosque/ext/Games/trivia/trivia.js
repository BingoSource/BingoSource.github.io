const preguntas = [
    {
        pregunta: "¿Quién le robó la vaca saturno saturnita a Eloi?",
        opciones: ["Jesus", "El papa de Agua", "Luisana💀🙏"],
        correcta: "Jesus"
    },
    {
        pregunta: "¿Quién es el mejor jugador de los mosqueteros?",
        opciones: ["Wuender", "agua", "Eloi💀🙏", "Depende"],
        correcta: "Depende"
    },
    {
        pregunta: "¿Quién es el más mardito?",
        opciones: ["AGUA", "AGUA", "AGUA"],
        correcta: "agua"
    },
    {
        pregunta: "¿Quién es el mascapito💀🙏?",
        opciones: ["Jesus", "Pablo", "Elio", "Juan"],
        correcta: "Jesus",
        mensajeExtra: "Jesus el mascador de pito💀🙏"
    },
    {
        pregunta: "Completa la frase 'Viva el rock😝'",
        opciones: ["Que viva!", "Yeah", "Cállate mardito", "Solo escucha nirvana💀🙏"],
        correcta: "Solo escucha nirvana💀🙏"
    }
];

// Variables del juego
let preguntasRestantes = [...preguntas].sort(() => Math.random() - 0.5);
let preguntaActual = null;
let preguntasContestadas = 0;
let preguntasCorrectas = 0;
let puntosAcumulados = 0;
let recompensaTotal = 0;
let juegoTerminado = false;

// Inicializar el juego
function iniciarJuego() {
    preguntasContestadas = 0;
    preguntasCorrectas = 0;
    puntosAcumulados = 0;
    recompensaTotal = 0;
    juegoTerminado = false;
    preguntasRestantes = [...preguntas].sort(() => Math.random() - 0.5);
    
    actualizarEstadisticas();
    mostrarPregunta();
}

function actualizarEstadisticas() {
    document.getElementById("pregunta-numero").textContent = `Pregunta ${preguntasContestadas + 1} de ${preguntas.length}`;
    document.getElementById("puntos-acumulados").textContent = `Puntos: ${puntosAcumulados}`;
}

function mostrarPregunta() {
    document.getElementById("mensaje").textContent = "";
    document.getElementById("btn-siguiente").style.display = "none";

    if (preguntasRestantes.length === 0 || preguntasContestadas >= preguntas.length) {
        terminarJuego();
        return;
    }

    preguntaActual = preguntasRestantes.pop();
    
    document.getElementById("pregunta").textContent = preguntaActual.pregunta;
    const opcionesDiv = document.getElementById("opciones");
    opcionesDiv.innerHTML = "";

    preguntaActual.opciones.forEach(op => {
        const btn = document.createElement("button");
        btn.textContent = op;
        btn.classList.add("opcion-btn");
        btn.onclick = () => verificarRespuesta(op, btn);
        opcionesDiv.appendChild(btn);
    });
    
    actualizarEstadisticas();
}

function verificarRespuesta(opcion, boton) {
    const botones = document.querySelectorAll(".opcion-btn");
    botones.forEach(b => b.disabled = true);
    
    preguntasContestadas++;

    if (opcion.toLowerCase() === preguntaActual.correcta.toLowerCase()) {
        boton.classList.add("correcta");
        preguntasCorrectas++;
        
        // Calcular puntos (más puntos por responder rápido)
        const puntosGanados = 10 + Math.floor(Math.random() * 10); // Entre 10 y 20 puntos
        puntosAcumulados += puntosGanados;
        
        document.getElementById("mensaje").innerHTML = `
            <div>✅ ¡Correcto! +${puntosGanados} puntos</div>
            ${preguntaActual.mensajeExtra ? `<div>${preguntaActual.mensajeExtra}</div>` : ''}
        `;
    } else {
        boton.classList.add("incorrecta");
        
        // Encontrar la respuesta correcta y marcarla
        botones.forEach(b => {
            if (b.textContent.toLowerCase() === preguntaActual.correcta.toLowerCase()) {
                b.classList.add("correcta");
            }
        });
        
        if (preguntaActual.pregunta === "¿Quién es el mejor jugador de los mosqueteros?" && opcion.toLowerCase() === "eloi💀🙏".toLowerCase()) {
            document.getElementById("mensaje").innerHTML = "❌ Es bautista?👀❌";
        } else {
            document.getElementById("mensaje").innerHTML = "❌ Incorrecto. La respuesta era: " + preguntaActual.correcta;
        }
    }

    document.getElementById("btn-siguiente").style.display = "inline-block";
    actualizarEstadisticas();
}

function siguientePregunta() {
    if (preguntasContestadas >= preguntas.length) {
        terminarJuego();
    } else {
        mostrarPregunta();
    }
}

function terminarJuego() {
    juegoTerminado = true;
    
    // Calcular recompensa basada en el desempeño
    const porcentajeCorrectas = (preguntasCorrectas / preguntas.length) * 100;
    recompensaTotal = Math.floor((puntosAcumulados * porcentajeCorrectas) / 10);
    
    // Mínimo de 5 monedas incluso si falló todo
    recompensaTotal = Math.max(5, recompensaTotal);
    
    document.getElementById("pregunta").innerHTML = `
        <div>🎉 ¡Juego Terminado! 🎉</div>
        <div style="margin-top: 15px;">Respuestas correctas: ${preguntasCorrectas} de ${preguntas.length}</div>
        <div>Puntos totales: ${puntosAcumulados}</div>
    `;
    
    document.getElementById("opciones").innerHTML = "";
    
    document.getElementById("mensaje").innerHTML = `
        <div class="recompensa">¡Ganaste ${recompensaTotal} Mosquecoins!</div>
        <div style="margin-top: 10px;">${generarMensajeDesempeno(porcentajeCorrectas)}</div>
    `;
    
    document.getElementById("btn-siguiente").style.display = "none";
    
    // Botón para volver a jugar
    const jugarDeNuevoBtn = document.createElement("button");
    jugarDeNuevoBtn.textContent = "Jugar de nuevo";
    jugarDeNuevoBtn.classList.add("menu-btn");
    jugarDeNuevoBtn.onclick = iniciarJuego;
    document.getElementById("opciones").appendChild(jugarDeNuevoBtn);
    
    // Otorgar recompensa
    if (updateCoins(recompensaTotal, "Recompensa de trivia")) {
        // Notificación de recompensa
        setTimeout(() => {
            showNotification(`+${recompensaTotal} Mosquecoins por completar la trivia!`);
        }, 1000);
    }
}

function generarMensajeDesempeno(porcentaje) {
    if (porcentaje >= 90) return "¡Excelente! Eres un verdadero mosquetero 💀🙏";
    if (porcentaje >= 70) return "¡Buen trabajo! Casi perfecto";
    if (porcentaje >= 50) return "¡No está mal! Sigue practicando";
    if (porcentaje >= 30) return "Puedes hacerlo mejor. ¡Sigue intentando!";
    return "¡Sigue practicando, lo harás mejor la próxima vez!";
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

// Añadir estilos para la animación de notificación si no existen
if (!document.querySelector('style#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(-20px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-20px); }
        }
    `;
    document.head.appendChild(style);
}

// Iniciar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', iniciarJuego);