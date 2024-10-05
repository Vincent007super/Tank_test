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

    // Load Pak 75
    const loader = new GLTFLoader();
    loader.load('./media/models/pak75.glb', function(gltf) {
        pak75 = gltf.scene;
        pak75.position.set(6, -0.1, -12.6 * 1.5);  // Position Pak 75 on the left
        pak75.rotation.y = Math.PI / 1.1;  // Rotate to aim at Panzer IV
        pak75.scale.set(1, 1, 1);  // Adjust scale for Pak 75 (default 0.8)
        scene.add(pak75);
    }, undefined, function(error) {
        console.error(error);
    });

    // Load Custom Bunker
    loader.load('./media/models/bunker.glb', function(gltf) {
        bunker = gltf.scene;
        bunker.position.set(6, 0, -12 * 1.5);  // Same position as Pak 75 to enclose it
        bunker.rotation.y = Math.PI / 1.1;  // Rotate to aim at Panzer IV
        bunker.scale.set(1.4, 1.4, 1.4);  // Adjust scale for Bunker (default 1.2)
        scene.add(bunker);
    }, undefined, function(error) {
        console.error(error);
    });

    // Load Panzer IV
    loader.load('./media/models/tank.glb', function(gltf) {
        tank = gltf.scene;
        tank.position.set(3, 0, 0);  // Position Panzer IV on the right
        tank.scale.set(0.01, 0.01, 0.01);  // Adjust scale for Panzer IV (default 1)
        scene.add(tank);
    }, undefined, function(error) {
        console.error(error);
    });

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
