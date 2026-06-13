// Módulo de Voz Avanzado con ElevenLabs IA

let ELEVEN_API_KEY = "";
let VOICE_ID = ""; // Aquí se guardará el ID de la voz de Jarvis

// Función para inicializar las llaves de voz desde la memoria del navegador
function cargarConfiguracionVoz() {
    ELEVEN_API_KEY = localStorage.getItem("eleven_api_key") || "";
    VOICE_ID = localStorage.getItem("eleven_voice_id") || "";
}

async function hablar(texto) {
    // Si no están configuradas las llaves de ElevenLabs, usamos la voz básica de respaldo
    if (!ELEVEN_API_KEY || !VOICE_ID) {
        logPantalla("SISTEMA (Voz de respaldo): " + texto, "jarvis-text");
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = 'es-MX';
        window.speechSynthesis.speak(utterance);
        return;
    }

    logPantalla("JARVIS (Generando voz real...): " + texto, "jarvis-text");

    // Conexión directa al servidor de ElevenLabs (Modelo Multilingüe v2)
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;
    
    const cuerpo = {
        text: texto,
        model_id: "eleven_multilingual_v2", // Habla cualquier idioma con el tono clonado
        voice_settings: {
            stability: 0.5,       // Estabilidad de la voz
            similarity_boost: 0.75 // Qué tanto se parece al clon original
        }
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "xi-api-key": ELEVEN_API_KEY
            },
            body: JSON.stringify(cuerpo)
        });

        if (!response.ok) {
            const errData = await response.json();
            logPantalla(`ERROR ELEVENLABS: ${errData.detail.status} - ${errData.detail.message}`, "error-text");
            return;
        }

        // El servidor nos regresa un archivo de audio binario (Blob)
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Creamos un reproductor oculto y le damos Play
        const audio = new Audio(audioUrl);
        audio.play();

    } catch (error) {
        logPantalla("ERROR: No se pudo conectar con el servidor de voz de ElevenLabs.", "error-text");
    }
}

// Cargar las llaves en cuanto abra el archivo
cargarConfiguracionVoz();