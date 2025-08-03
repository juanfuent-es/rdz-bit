// Variables del módulo
let audio_loader, loaderContainer, counter = 1;

// Referencias a variables globales definidas en go_rodriguez.js
let context, analyser;
const keys = [ 0, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 80, 79, 81, 87, 69, 73, 84, 89, 85, 32, 82 ];
const soundsArray = new Object();

// Función de carga principal
export function loader() {
    // Variable para controlar el estado de carga
    let loaded = false;
    
    // Crear contenedor de audios dinámicamente
    const audiosContainer = document.createElement('div');
    audiosContainer.id = 'audios_container';
    
    // Array de archivos de audio
    const audioFiles = [
        { id: 'base_loop', src: '../audio/base_loop.mp3', loop: true },
        { id: 'tone_1', src: '../audio/tone_1.mp3' },
        { id: 'tone_2', src: '../audio/tone_2.mp3' },
        { id: 'tone_3', src: '../audio/tone_3.mp3' },
        { id: 'tone_4', src: '../audio/tone_4.mp3' },
        { id: 'tone_5', src: '../audio/tone_5.mp3' },
        { id: 'tone_6', src: '../audio/tone_6.mp3' },
        { id: 'tone_7', src: '../audio/tone_7.mp3' },
        { id: 'tone_8', src: '../audio/tone_8.mp3' },
        { id: 'tone_9', src: '../audio/tone_9.mp3' },
        { id: 'tone_0', src: '../audio/tone_0.mp3' },
        { id: 'tone_q', src: '../audio/tone_q.mp3' },
        { id: 'tone_w', src: '../audio/tone_w.mp3' },
        { id: 'tone_e', src: '../audio/tone_e.mp3' },
        { id: 'tone_r', src: '../audio/tone_rdz.mp3' },
        { id: 'tone_t', src: '../audio/tone_t.mp3' },
        { id: 'tone_y', src: '../audio/tone_y.mp3' },
        { id: 'tone_u', src: '../audio/tone_u.mp3' },
        { id: 'tone_i', src: '../audio/tone_i.mp3' },
        { id: 'tone_o', src: '../audio/tone_o.mp3' },
        { id: 'tone_p', src: '../audio/tone_p.mp3' },
        { id: 'tone_space', src: '../audio/tone_space.mp3' }
    ];

    // Crear elementos de audio
    audioFiles.forEach(file => {
        const audio = document.createElement('audio');
        audio.id = file.id;
        audio.src = file.src;
        if (file.loop) audio.loop = true;
        audiosContainer.appendChild(audio);
    });

    document.body.appendChild(audiosContainer);

    // Configurar elementos del loader
    audio_loader = document.getElementById('audio_loader');
    const canvas_loader = document.getElementById('canvas_loader');
    const txtCharge = document.getElementById('charging');
    loaderContainer = document.getElementById('loader_container');
    loaderContainer.style.display = 'block';

    const ctxWaves = canvas_loader.getContext('2d');
    const gradient = ctxWaves.createLinearGradient(0, 60, 0, 0);

    const ctxloader = new AudioContext();
    const loaderAnalyser = ctxloader.createAnalyser();
    loaderAnalyser.connect(ctxloader.destination);
    loaderAnalyser.fftSize = 32;
    audio_loader.play();

    const sourceLoader = ctxloader.createMediaElementSource(audio_loader);
    sourceLoader.connect(loaderAnalyser);
    loadProcesser();

    gradient.addColorStop(0, 'rgba(0,165,255,0.1)');
    gradient.addColorStop(1, '#00a5ff');

    ctxWaves.fillStyle = gradient;
    ctxWaves.fillRect(30, 0, 5, 0);

    ctxWaves.shadowColor = "#00a5ff";
    ctxWaves.shadowBlur = 10;

    function loadProcesser() {
        if (!loaded) window.requestAnimationFrame(loadProcesser);
        else txtCharge.style.opacity = 0;
        
        const loaderLines = new Uint8Array(loaderAnalyser.frequencyBinCount);
        let sizeImpulse = 0;
        loaderAnalyser.getByteFrequencyData(loaderLines);
        ctxWaves.clearRect(0, 0, 50, 60);
        
        for (let i = 0; i < loaderLines.length; ++i) {
            ctxWaves.fillRect(i * 3, 60, 2, -(loaderLines[i] / 4));
            sizeImpulse += loaderLines[i] / 256;
        }
        sizeImpulse = sizeImpulse / 16;
        txtCharge.style.opacity = sizeImpulse + 0.4;
    }

    window.onload = function () {
        addSounds();
        loaderContainer.style.opacity = 0;
        volumeDown();
    };

    // Función para bajar el volumen gradualmente
    function volumeDown() {
        counter++;
        if (counter == 12) {
            // Importar dinámicamente la función init
            import('./go_rodriguez.js').then(module => {
                module.init();
            });
            loaded = true;
            audio_loader.pause();
            audio_loader.volume = 0;
            loaderContainer.style.display = 'none';
            // Importar onWindowResize desde go_rodriguez.js
            import('./go_rodriguez.js').then(module => {
                if (module.onWindowResize) {
                    window.addEventListener('resize', module.onWindowResize, false);
                }
            });
        } else {
            setTimeout(volumeDown, 300);
            audio_loader.volume = audio_loader.volume - 0.1;
        }
    }

    // Función para agregar sonidos
    function addSounds() {
        context = new AudioContext();
        analyser = context.createAnalyser();
        analyser.connect(context.destination);
        analyser.fftSize = 512;
        const sounds = document.getElementById('audios_container').getElementsByTagName('audio');
        for (let i = 0; i < sounds.length; i++) {
            const sound = document.getElementById(sounds[i].id);
            const source = context.createMediaElementSource(sound);
            soundsArray[keys[i]] = sound;
            source.connect(analyser);
        }
    }
}