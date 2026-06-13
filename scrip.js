// Reemplaza SOLAMENTE la función ejecutarComando en tu script.js por esta:

function ejecutarComando() {
    let texto = userInput.value.trim(); 
    if (texto === "") return;

    // Configuración de la API Key de Gemini
    if (esperandoKey) {
        API_KEY = texto;
        localStorage.setItem("jarvis_api_key", texto);
        userInput.value = "";
        
        // Pasamos al siguiente paso de configuración de voz
        userInput.placeholder = "Pegue su API Key de ElevenLabs...";
        logPantalla("SISTEMA: API Key de Gemini guardada. Ahora ingrese su API Key de ElevenLabs (o escriba 'saltar').", "system-text");
        esperandoKey = false;
        window.esperandoElevenKey = true; // Activamos bandera temporal
        return;
    }

    // Configuración de la API Key de ElevenLabs
    if (window.esperandoElevenKey) {
        if (texto.toLowerCase() !== 'saltar') {
            localStorage.setItem("eleven_api_key", texto);
            logPantalla("SISTEMA: API Key de ElevenLabs guardada. Ahora pegue el VOICE ID de Jarvis.", "system-text");
            window.esperandoElevenKey = false;
            window.esperandoVoiceId = true;
        } else {
            logPantalla("SISTEMA: Configuración de voz avanzada saltada. Usando voz local.", "system-text");
            window.esperandoElevenKey = false;
            inicializarSistema(); // Reiniciar flujo normal
        }
        userInput.value = "";
        userInput.placeholder = "Pegue el Voice ID de Jarvis...";
        return;
    }

    // Configuración del Voice ID
    if (window.esperandoVoiceId) {
        localStorage.setItem("eleven_voice_id", texto);
        userInput.value = "";
        window.esperandoVoiceId = false;
        logPantalla("SISTEMA: Configuración completa. Reiniciando Jarvis...", "system-text");
        
        // Forzamos la recarga de las nuevas llaves en ambos archivos
        if (typeof cargarConfiguracionVoz === "function") cargarConfiguracionVoz();
        inicializarSistema();
        return;
    }

    // Flujo normal de chat
    logPantalla("TÚ: " + texto, "user-text");
    userInput.value = ""; 
    preguntarAGemini(texto);
}