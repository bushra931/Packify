import * as THREE from 'https://esm.sh/three';
import { OrbitControls } from 'https://esm.sh/three/examples/jsm/controls/OrbitControls.js';

console.log("🟢 simulation.js loaded");

const container = document.getElementById("scene-container");

// Box dimensions
const boxLength = 4;
const boxHeight = 2;
const boxWidth = 2;
const flapSize = 0.7;

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color('#000000');

// Camera
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(4, 3, 5);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 10, 7);
directionalLight.castShadow = true;
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(0, 6, 0);
scene.add(pointLight);

const spotLight = new THREE.SpotLight(0xffffff, 1.2, 10, Math.PI / 6, 0.3, 2);
spotLight.position.set(2, 5, 2);
spotLight.target.position.set(0, 1, 0);
spotLight.castShadow = true;
scene.add(spotLight);
scene.add(spotLight.target);

// Box Material
const boxMaterial = new THREE.MeshStandardMaterial({
  color: '#ffd4b5',
  roughness: 1,
  metalness: 0.1
});

// Hollow box (walls only)
const thickness = 0.05;
const yMid = boxHeight / 2;

const back = new THREE.Mesh(new THREE.BoxGeometry(boxLength, boxHeight, thickness), boxMaterial);
back.position.set(0, yMid, -boxWidth / 2 + thickness / 2);
scene.add(back);

const front = new THREE.Mesh(new THREE.BoxGeometry(boxLength, boxHeight, thickness), boxMaterial);
front.position.set(0, yMid, boxWidth / 2 - thickness / 2);
scene.add(front);

const left = new THREE.Mesh(new THREE.BoxGeometry(thickness, boxHeight, boxWidth), boxMaterial);
left.position.set(-boxLength / 2 + thickness / 2, yMid, 0);
scene.add(left);

const right = new THREE.Mesh(new THREE.BoxGeometry(thickness, boxHeight, boxWidth), boxMaterial);
right.position.set(boxLength / 2 - thickness / 2, yMid, 0);
scene.add(right);

const bottom = new THREE.Mesh(new THREE.BoxGeometry(boxLength, thickness, boxWidth), boxMaterial);
bottom.position.set(0, thickness / 2, 0);
bottom.receiveShadow = true;
scene.add(bottom);

// Enlarged flaps
const flapFront = new THREE.Mesh(new THREE.BoxGeometry(boxLength, 0.02, flapSize), boxMaterial);
flapFront.position.set(0, boxHeight + 0.09, boxWidth / 2 + 0.12);
flapFront.rotation.x = -Math.PI / 4;
scene.add(flapFront);

const flapBack = new THREE.Mesh(new THREE.BoxGeometry(boxLength, 0.02, flapSize), boxMaterial);
flapBack.position.set(0, boxHeight + 0.09, -boxWidth / 2 - 0.12);
flapBack.rotation.x = Math.PI / 4;
scene.add(flapBack);

// Vase (procedural, glossy)
const points = [];
points.push(new THREE.Vector2(0.0, 0.0));
points.push(new THREE.Vector2(0.3, 0.0));
points.push(new THREE.Vector2(0.5, 0.3));
points.push(new THREE.Vector2(0.65, 0.6));
points.push(new THREE.Vector2(0.55, 1.0));
points.push(new THREE.Vector2(0.3, 1.4));
points.push(new THREE.Vector2(0.25, 1.5));
points.push(new THREE.Vector2(0.3, 1.6));

const vaseGeometry = new THREE.LatheGeometry(points, 64);
const vaseMaterial = new THREE.MeshStandardMaterial({
  color: '#7fd5ff',
  roughness: 0.2,
  metalness: 0.3,
  clearcoat: 0.6,
  clearcoatRoughness: 0.1
});
const vase = new THREE.Mesh(vaseGeometry, vaseMaterial);
vase.rotation.z = Math.PI / 2;
vase.position.set(1.8, 1.1, 0);
vase.scale.set(1.2, 2.2, 1.3);
vase.castShadow = true;
scene.add(vase);

// ✅ Load Textures
const textureLoader = new THREE.TextureLoader();

// Fragile Sticker (Front)
const fragileTexture = textureLoader.load('images/boxSticker.png', () => {
  console.log("📦 Sticker texture loaded");
});
const stickerMaterial = new THREE.MeshBasicMaterial({
  map: fragileTexture,
  transparent: true,
  side: THREE.DoubleSide
});
const sticker = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.4), stickerMaterial);
sticker.position.set(1.2, 0.4, boxWidth / 2 + 0.06);
sticker.rotation.y = 0;
scene.add(sticker);

// Packify Logo (Back)
const logoTexture = textureLoader.load('images/logo.png', () => {
  console.log("🟣 Packify logo loaded");
});
const logoMaterial = new THREE.MeshBasicMaterial({
  map: logoTexture,
  transparent: true,
  side: THREE.DoubleSide
});
const logo = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.6), logoMaterial); // enlarged
logo.position.set(0, 1.0, -boxWidth / 2 - 0.06); // centered horizontally and lifted slightly
logo.rotation.y = Math.PI;
scene.add(logo);


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
