// ==========================
// BASIC SETUP
// ==========================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // sky

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ==========================
// LIGHTING
// ==========================
const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(100, 200, 100);
scene.add(sun);

scene.add(new THREE.AmbientLight(0xffffff, 0.4));

// ==========================
// FREE MAP (OpenStreetMap)
// ==========================

// Example tile (Lisbon area)
const tileURL = "https://tile.openstreetmap.org/14/8203/5300.png";

const loader = new THREE.TextureLoader();
const mapTexture = loader.load(tileURL);
mapTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(1000, 1000),
  new THREE.MeshStandardMaterial({ map: mapTexture })
);

ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// ==========================
// PLANE
// ==========================
const plane = new THREE.Mesh(
  new THREE.BoxGeometry(2, 0.5, 4),
  new THREE.MeshStandardMaterial({ color: 0xff0000 })
);

plane.position.set(0, 10, 0);
scene.add(plane);

// ==========================
// CONTROLS
// ==========================
const keys = {};
window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

let speed = 0;
const maxSpeed = 0.6;

function updatePlane() {
  // Throttle
  if (keys["w"]) speed = Math.min(speed + 0.01, maxSpeed);
  if (keys["s"]) speed = Math.max(speed - 0.01, 0);

  // Movement
  plane.translateZ(-speed);

  // Rotation
  if (keys["a"]) plane.rotation.y += 0.03;
  if (keys["d"]) plane.rotation.y -= 0.03;

  // Pitch
  if (keys["arrowup"]) plane.rotation.x += 0.02;
  if (keys["arrowdown"]) plane.rotation.x -= 0.02;

  // Simple gravity
  plane.position.y -= 0.02;
  if (plane.position.y < 5) plane.position.y = 5;
}

// ==========================
// CAMERA FOLLOW
// ==========================
camera.position.set(0, 15, -25);
camera.lookAt(plane.position);

// ==========================
// RESIZE HANDLER
// ==========================
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ==========================
// ANIMATION LOOP
// ==========================
function animate() {
  requestAnimationFrame(animate);

  updatePlane();

  camera.position.lerp(
    new THREE.Vector3(
      plane.position.x,
      plane.position.y + 15,
      plane.position.z - 25
    ),
    0.1
  );
  camera.lookAt(plane.position);

  renderer.render(scene, camera);
}

animate();

// Controls
const keys = {};
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

function updatePlane() {
  if (keys["w"]) plane.translateZ(-0.15);
  if (keys["s"]) plane.translateZ(0.1);
  if (keys["a"]) plane.rotation.y += 0.03;
  if (keys["d"]) plane.rotation.y -= 0.03;
  if (keys["ArrowUp"]) plane.position.y += 0.05;
  if (keys["ArrowDown"]) plane.position.y -= 0.05;
}

// Camera
camera.position.set(0, 3, -10);
camera.lookAt(plane.position);

function animate() {
  requestAnimationFrame(animate);

  updatePlane();

  camera.position.lerp(
    new THREE.Vector3(
      plane.position.x,
      plane.position.y + 3,
      plane.position.z - 10
    ),
    0.1
  );
  camera.lookAt(plane.position);

  renderer.render(scene, camera);
}

animate();
