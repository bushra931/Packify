import * as THREE from 'https://esm.sh/three';
import { OrbitControls } from 'https://esm.sh/three/examples/jsm/controls/OrbitControls.js';

console.log("🟢 simulation.js loaded");

const container = document.getElementById("scene-container");

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf8f8f8);

// Camera
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(4, 3, 5);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Light
const light = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(light);

// Transparent outer box
const outerBox = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2, 2),
  new THREE.MeshStandardMaterial({ color: 0xcd853f, opacity: 0.5, transparent: true })
);
scene.add(outerBox);

// Wireframe padding
const paddingEdges = new THREE.EdgesGeometry(new THREE.BoxGeometry(3.6, 1.6, 1.6));
const paddingLines = new THREE.LineSegments(
  paddingEdges,
  new THREE.LineBasicMaterial({ color: 0x000000 })
);
scene.add(paddingLines);

// Product (sphere)
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.6, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0x888888 })
);
scene.add(sphere);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Animate
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
