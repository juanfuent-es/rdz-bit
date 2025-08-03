// Import Three.js desde npm
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

// Importar estilos
import '../src/css/main.css';

// Importar módulos del proyecto
import { init } from './js/go_rodriguez.js';
import { loader } from './js/init.js';

// Hacer THREE disponible globalmente para compatibilidad con código existente
window.THREE = THREE;
window.EffectComposer = EffectComposer;
window.RenderPass = RenderPass;

// Inicializar la aplicación directamente
loader(); 