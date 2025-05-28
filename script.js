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
        
        // Aspetta un momento per mostrare l'overlay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Nascondi il pulsante condividi
        shareButton.style.display = 'none';
        
        // Salva i path SVG originali
        const curvePath = document.getElementById('curve');
        const placeholderPath = document.getElementById('placeholder-curve');
        const originalCurvePath = curvePath.getAttribute('d');
        const originalPlaceholderPath = placeholderPath.getAttribute('d');
        
        // Applica la classe HD per il ridimensionamento
        container.classList.add('hd-screenshot');
        
        // Non modificare i path SVG per mantenere le proporzioni corrette
        // I path rimangono gli stessi per evitare distorsioni
        
        // Aspetta che i font siano caricati
        await document.fonts.ready;
        
        // Aspetta un momento extra per assicurarsi che tutto sia pronto
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Crea lo screenshot con dimensioni precise HD
        const canvas = await html2canvas(container, {
            width: 1080,
            height: 1920,
            scale: 2, // Aumenta la scala per maggiore qualità
            useCORS: true,
            allowTaint: true, // Permette font locali
            backgroundColor: '#ffffff',
            logging: false,
            removeContainer: false,
            onclone: function(clonedDoc) {
                // Forza il font nel documento clonato
                const clonedContainer = clonedDoc.getElementById('shareContainer');
                if (clonedContainer) {
                    // Applica lo stile direttamente agli elementi di testo
                    const textElements = clonedContainer.querySelectorAll('.curved-text-element, .curved-placeholder-element');
                    textElements.forEach(el => {
                        el.style.fontFamily = "'Friz Quadrata', Arial, sans-serif";
                    });
                }
            }
        });

        // Ripristina gli stili originali
        container.classList.remove('hd-screenshot');
        shareButton.style.display = 'block';
        
        // Ripristina i path SVG originali
        curvePath.setAttribute('d', originalCurvePath);
        placeholderPath.setAttribute('d', originalPlaceholderPath);
        
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