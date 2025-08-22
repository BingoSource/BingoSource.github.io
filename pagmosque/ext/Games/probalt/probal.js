const preguntas = [
  {
    pregunta: "¿Quién es más probable que se robe a las niñas de 5 años?",
    opciones: [
      { texto: "Wuender", size: "pequeno" },
      { texto: "Jesus", size: "pequeno" },
      { texto: "Eloi", size: "pequeno" },
      { texto: "AGUA", size: "grande" }
    ],
    correcta: "AGUA"
  },
  {
    pregunta: "¿Quién es más probable que repruebe un año escolar?",
    opciones: [
      { texto: "Wuender", size: "normal" },
      { texto: "Eloi", size: "normal" },
      { texto: "agua", size: "normal" },
      { texto: "jesus", size: "normal" },
      { texto: "juan", size: "normal" }
    ],
    correcta: "Wuender",
    extra: { texto: "Yo ya pasé 💀🙏", duracion: 2000 }
  },
  {
    pregunta: "¿Quién es más probable que se gane la lotería y lo gaste todo en un día?",
    opciones: [
      { texto: "Wuender" }, { texto: "jesus" }, { texto: "eloi" },
      { texto: "agua" }, { texto: "pablo" }, { texto: "juan" },
      { texto: "todos" }, { texto: "ninguno" }
    ],
    correcta: "ninguno"
  },
  {
    pregunta: "¿Quién es más probable que se haga viral por un video vergonzoso?",
    opciones: ["wuender", "jesus", "eloi", "agua", "pablo", "juan"].map(o => ({ texto: o })),
    correcta: "Jesus"
  },
  {
    pregunta: "¿Quién es más probable que olvide su propio cumpleaños?",
    opciones: ["Wuender", "jesus", "eloi", "agua", "pablo", "juan"].map(o => ({ texto: o })),
    correcta: "Agua"
  },
  {
    pregunta: "¿Quién es más probable que se coma una pizza entera él solo?",
    opciones: ["Wuender", "jesus", "eloi", "agua", "pablo", "juan"].map(o => ({ texto: o })),
    correcta: "Wuender",
    extra: { texto: "Que molleja de mordelón👀☢", duracion: 2000 }
  },
  {
    pregunta: "¿Quién es más probable que se haga una maratón de serie en 24h sin dormir?",
    opciones: ["Wuender", "jesus", "eloi", "agua", "pablo", "juan"].map(o => ({ texto: o })),
    correcta: "Wuender"
  },
  {
    pregunta: "¿Quién es más probable que rompa su control/teclado de la rabia?",
    opciones: ["Wuender", "jesus", "eloi", "agua", "pablo", "juan"].map(o => ({ texto: o })),
    correcta: "Eloi"
  },
  {
    pregunta: "¿Quién es más probable que se aprenda el lore de un juego que nadie más jugó?",
    opciones: ["Wuender", "jesus", "eloi", "agua", "pablo", "juan"].map(o => ({ texto: o })),
    correcta: "Wuender"
  },
  {
    pregunta: "¿Quién es más probable que culpe al 'lag' cuando pierde?",
    opciones: ["Wuender", "jesus", "eloi", "agua", "pablo", "juan"].map(o => ({ texto: o })),
    correcta: "Jesus"
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
  const mensajeElem = document.getElementById("mensaje");
  mensajeElem.textContent = "";
  mensajeElem.className = "mensaje";
  document.getElementById("btn-siguiente").style.display = "none";

  if (preguntasRestantes.length === 0 || preguntasContestadas >= preguntas.length) {
    terminarJuego();
    return;
  }

  preguntaActual = preguntasRestantes.pop();
  
  document.getElementById("pregunta").textContent = preguntaActual.pregunta;
  const opcionesElem = document.getElementById("opciones");
  opcionesElem.innerHTML = "";

  preguntaActual.opciones.forEach(op => {
    const btn = document.createElement("button");
    btn.textContent = op.texto;
    btn.className = `opcion-btn ${op.size || "normal"}`;
    btn.onclick = () => verificarRespuesta(op.texto, btn);
    opcionesElem.appendChild(btn);
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
    
    let mensajeHTML = `<div>✅ ¡Correcto! +${puntosGanados} puntos</div>`;
    
    if (preguntaActual.extra) {
      mensajeHTML += `<div class="mensaje-extra">${preguntaActual.extra.texto}</div>`;
    }
    
    document.getElementById("mensaje").innerHTML = mensajeHTML;
  } else {
    boton.classList.add("incorrecta");
    
    // Encontrar la respuesta correcta y marcarla
    botones.forEach(b => {
      if (b.textContent.toLowerCase() === preguntaActual.correcta.toLowerCase()) {
        b.classList.add("correcta");
      }
    });
    
    document.getElementById("mensaje").innerHTML = "❌ Incorrecto. La respuesta era: " + preguntaActual.correcta;
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
  if (updateCoins(recompensaTotal, "Recompensa: ¿Quién es más probable?")) {
    // Notificación de recompensa
    setTimeout(() => {
      showNotification(`+${recompensaTotal} Mosquecoins por completar el juego!`);
    }, 1000);
  }
}

function generarMensajeDesempeno(porcentaje) {
  if (porcentaje >= 90) return "¡Excelente! Eres un verdadero conocedor de los mosqueteros 💀🙏";
  if (porcentaje >= 70) return "¡Buen trabajo! Sabes bastante del grupo";
  if (porcentaje >= 50) return "¡No está mal! Te sabes algunas cosas";
  if (porcentaje >= 30) return "Puedes hacerlo mejor. ¡Presta más atención!";
  return "¡Necesitas convivir más con los mosqueteros!";
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