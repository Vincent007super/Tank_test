import * as THREE from './node_modules/three/src/Three.js';
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, pak75, tank, bunker;

function init() {
    // Scene setup
    scene = new THREE.Scene();

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(
        4.68, // left to right
        1.8,  // up to down
        1     // forwards to backwards
    );
    camera.rotation.y = Math.PI / 7; // camera rotation

    // Renderer setup
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Load background image
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('./media/images/background.png', function(texture) {
        // Set the scene's background to the loaded texture
        scene.background = texture;
    }, undefined, function(error) {
        console.error(error);
    });

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 10, 10).normalize();
    scene.add(light);
    window.addEventListener('resize', onWindowResize);
}

// Animation function
function animate() {
    requestAnimationFrame(animate);
    
    // Add projectile animation logic here

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Initialize everything and start the animation loop
init();
animate();
