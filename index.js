import * as THREE from './node_modules/three/src/Three.js';
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from './node_modules/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './node_modules/three/examples/jsm/postprocessing/RenderPass.js';
import { BokehPass } from './node_modules/three/examples/jsm/postprocessing/BokehPass.js';

let scene, camera, renderer, composer, pak75, tank, bunker;
let mouseX = 0;
let bokehPass;
let focusValue = 1.0; // Start focuswaarde
let targetFocusValue = 1.0; // Doelfocuswaarde voor soepele overgang
let focusLerpSpeed = 0.05; // Snelheid van de focus-overgang

function init() {
    // Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xaaaaaa, 0.05);

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(4.68, 1.8, 1);
    camera.rotation.y = Math.PI / 7;

    // Renderer setup
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.filter = 'blur(1px)';
    document.body.appendChild(renderer.domElement);

    // Load background image
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('./media/images/background.png', function(texture) {
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
        pak75.position.set(9, -3.1, -14.6 * 1.5);
        pak75.rotation.y = Math.PI / 1.12;
        pak75.rotation.x = Math.PI / 0.1004;
        pak75.scale.set(1.4, 1.4, 1.4);
        scene.add(pak75);
    }, undefined, function(error) {
        console.error(error);
    });

    // Load Custom Bunker
    loader.load('./media/models/bunker.glb', function(gltf) {
        bunker = gltf.scene;
        bunker.position.set(9, -3, -14 * 1.5);
        bunker.rotation.y = Math.PI / 1.1;
        bunker.scale.set(1.6, 2.1, 1.6);
        scene.add(bunker);
    }, undefined, function(error) {
        console.error(error);
    });

    // Load Panzer IV
    loader.load('./media/models/tank.glb', function(gltf) {
        tank = gltf.scene;
        tank.position.set(3, 0, 0);
        tank.scale.set(0.01, 0.01, 0.01);
        scene.add(tank);
    }, undefined, function(error) {
        console.error(error);
    });

    // Depth of field setup using BokehPass
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    bokehPass = new BokehPass(scene, camera, {
        focus: focusValue,
        aperture: 0.001,
        maxblur: 0.01,
        width: window.innerWidth,
        height: window.innerHeight
    });
    composer.addPass(bokehPass);

    // Event listeners for mouse hover
    window.addEventListener('mousemove', onDocumentMouseMove);
    window.addEventListener('mouseout', onMouseOut);

    function onDocumentMouseMove(event) {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        
        // Check for mouse over Pak 75
        const mouse = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        // Detect object intersection
        const intersects = raycaster.intersectObject(pak75);
        if (intersects.length > 0) {
            targetFocusValue = 15.5; // Focus op Pak 75
        } else {
            targetFocusValue = 1.0; // Focus terug naar tank
        }
    }

    function onMouseOut() {
        targetFocusValue = 1.0; // Focus terug naar tank bij muis buiten
    }

    window.addEventListener('resize', onWindowResize);
}

// Animation function
function animate() {
    requestAnimationFrame(animate);

    // Smooth focus transition
    focusValue = THREE.MathUtils.lerp(focusValue, targetFocusValue, focusLerpSpeed);
    bokehPass.uniforms.focus.value = focusValue;

    // Light tank shake effect to simulate engine running
    if (tank) {
        const shakeAmount = 0.00005;
        tank.position.x += (Math.sin(Date.now() * 0.01) * shakeAmount);
        tank.position.z += (Math.cos(Date.now() * 0.01) * shakeAmount);
    }

    camera.position.x = 4.68 * (1 + mouseX * 0.05);

    composer.render();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

// Initialize everything and start the animation loop
init();
animate();
