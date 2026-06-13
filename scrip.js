// Módulo de Inteligencia y Conexión

let API_KEY = ""; 
let esperandoKey = false;

const consoleDiv = document.getElementById('console');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const resetBtn = document.getElementById('resetBtn');

function logPantalla(texto, clase) {
    const p = document.createElement('div');
    p.className = `msg ${clase}`;
    p.innerText = texto;
    consoleDiv.appendChild(p);
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
}

function inicializarSistema() {
    const keyGuardada = localStorage.getItem("jarvis_api_key");
    if (keyGuardada) {
        API_KEY = keyGuardada;
        esperandoKey = false;
        userInput.placeholder = "Hable con J.A.R.V.I.S...";
        setTimeout(() => { hablar("Sistemas centrales activos, señor. ¿Qué desea consultar?"); }, 800);
    } else {
        esperandoKey = true;
        userInput.placeholder = "Pegue su API Key aquí...";
        logPantalla("SISTEMA: Ingrese una API Key válida de Google AI Studio.", "system-text");
    }
}

async function preguntarAGemini(preguntaUsuario) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    
    const cuerpoPeticion = {
        contents: [{
            parts: [{
                text: "Actúa como J.A.R.V.I.S. de Iron Man. Habla en español de México, sé conciso y educado, y dirígete al usuario como 'señor'. No uses asteriscos ni markdown. Pregunta: " + preguntaUsuario
            }]
        }]
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cuerpoPeticion)
        });

        const data = await response.json();

        if (data.error) {
            logPantalla(`CÓDIGO DE ERROR GOOGLE: ${data.error.status} - ${data.error.message}`, "error-text");
            hablar("Error de validación en los servidores de Google, señor.");
            return;
        }

        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const respuestaIA = data.candidates[0].content.parts[0].text;
            hablar(respuestaIA); // Llama a la función 'hablar' que está en voz.js
        } else {
            logPantalla("JARVIS: Recibí una respuesta vacía del servidor.", "error-text");
        }

    } catch (error) {
        logPantalla("JARVIS: Error de red o bloqueo de conexión externo.", "error-text");
    }
}

function ejecutarComando() {
    let texto = userInput.value.trim(); 
    if (texto === "") return;

    if (esperandoKey) {
        API_KEY = texto;
        localStorage.setItem("jarvis_api_key", texto);
        userInput.value = "";
        esperandoKey = false;
        userInput.placeholder = "Hable con J.A.R.V.I.S...";
        logPantalla("SISTEMA: Clave de acceso guardada en el núcleo.", "system-text");
        hablar("Llave registrada. Conectando con los servidores neuronales, señor.");
        return;
    }

    logPantalla("TÚ: " + texto, "user-text");
    userInput.value = ""; 
    preguntarAGemini(texto);
}

resetBtn.addEventListener('click', () => {
    localStorage.removeItem("jarvis_api_key");
    API_KEY = "";
    esperandoKey = true;
    consoleDiv.innerHTML = "";
    userInput.placeholder = "Pegue su API Key aquí...";
    logPantalla("SISTEMA: Memoria del núcleo limpia. Esperando nueva clave.", "system-text");
    hablar("Memoria reiniciada, señor.");
});

sendBtn.addEventListener('click', ejecutarComando);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') ejecutarComando(); });

// Arranca todo cuando carga la página
window.onload = inicializarSistema;