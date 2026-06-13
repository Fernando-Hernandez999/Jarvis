// Módulo de Voz para J.A.R.V.I.S.

function hablar(texto) {
    // Cancela cualquier respuesta de voz que se haya quedado trabada antes
    window.speechSynthesis.cancel(); 

    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'es-MX'; // Configura el acento en Español Latino
    
    // Intenta buscar una voz masculina o la de Google instalada en el sistema
    const voices = window.speechSynthesis.getVoices();
    for (let i = 0; i < voices.length; i++) {
        if (voices[i].lang.includes('es') && (voices[i].name.includes('Male') || voices[i].name.includes('Google'))) {
            utterance.voice = voices[i];
            break;
        }
    }

    // Configuración opcional por si quieres que hable más rápido o lento
    utterance.rate = 1.0;  // Velocidad (1.0 es normal)
    utterance.pitch = 0.9; // Tono (un poquito más grave para que suene robótico)

    // El navegador reproduce la voz
    window.speechSynthesis.speak(utterance);
    
    // Mostramos lo que Jarvis dijo directamente en la consola visual
    logPantalla("JARVIS: " + texto, "jarvis-text");
}