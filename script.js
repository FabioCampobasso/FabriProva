const editableText = document.querySelector('.editable-text');
const curvedTextElement = document.querySelector('.curved-text-element textPath');

// Aggiorna il testo curvato
function updateCurvedText() {
    const text = editableText.value;
    curvedTextElement.textContent = text;
}

// Auto-resize della textarea e aggiornamento testo curvato
editableText.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
    updateCurvedText();
});

// Aggiorna il testo curvato al caricamento
updateCurvedText();

// Adattamento responsive del container
function adjustContainer() {
    // Lasciamo che il CSS gestisca tutto
}

// Funzione per condividere l'immagine
async function shareImage() {
    try {
        const container = document.getElementById('shareContainer');
        const shareButton = document.querySelector('.share-button');
        const loadingOverlay = document.getElementById('loadingOverlay');
        
        // Mostra l'overlay di caricamento
        loadingOverlay.style.display = 'flex';
        
        // Nascondi il pulsante condividi temporaneamente
        shareButton.style.display = 'none';
        
        // Aspetta che i font siano caricati
        await document.fonts.ready;
        
        // Piccola pausa per assicurarsi che tutto sia pronto
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Crea lo screenshot del container così com'è
        const canvas = await html2canvas(container, {
            scale: 2, // Alta qualità
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false
        });

        // Ripristina il pulsante
        shareButton.style.display = 'block';
        
        // Nascondi l'overlay
        loadingOverlay.style.display = 'none';

        // Converti il canvas in blob
        canvas.toBlob(async (blob) => {
            try {
                const file = new File([blob], 'immagine-condivisa-hd.png', { type: 'image/png' });
                
                // Controlla se l'API Web Share è supportata
                if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        title: 'La mia immagine personalizzata HD',
                        text: 'Guarda cosa ho creato!',
                        files: [file]
                    });
                } else {
                    // Fallback: download dell'immagine
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'immagine-condivisa-hd.png';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    
                    alert('Immagine HD scaricata! Puoi condividerla manualmente sui social.');
                }
            } catch (error) {
                console.error('Errore nella condivisione:', error);
                alert('Errore nella condivisione. Riprova.');
                // Nascondi l'overlay in caso di errore
                loadingOverlay.style.display = 'none';
            }
        }, 'image/png', 0.95);
        
    } catch (error) {
        console.error('Errore nella creazione dello screenshot:', error);
        
        // Ripristina gli stili in caso di errore
        const container = document.getElementById('shareContainer');
        const shareButton = document.querySelector('.share-button');
        const loadingOverlay = document.getElementById('loadingOverlay');
        container.classList.remove('hd-screenshot');
        shareButton.style.display = 'block';
        
        // Nascondi l'overlay
        loadingOverlay.style.display = 'none';
        
        // I path SVG non sono stati modificati, quindi non serve ripristinarli
        
        alert('Errore nella creazione dell\'immagine. Riprova.');
    }
}

// Assicura che i font siano caricati all'avvio
document.fonts.load('bold 1rem "Friz Quadrata"').then(() => {
    console.log('Font Friz Quadrata caricato');
});

window.addEventListener('resize', adjustContainer);
adjustContainer();