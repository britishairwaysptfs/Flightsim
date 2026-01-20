// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// CAMERA
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  5000
);

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// LIGHTING
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(100, 200, 100);
scene.add(sun);

// ==========================
// OSM TILE AS GROUND
// ==========================
const loader = new THREE.TextureLoader();
loader.crossOrigin = "anonymous";

// Tile URL (Lisbon example)
const tileURL = "https://tile.openstreetmap.org/14/8203/5300.png";

// Load tile
const mapTexture = loader.load(tileURL);

mapTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

// Ground plane
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(500, 500),
  new THREE.MeshStandardMaterial({ map: mapTexture })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// PLANE
const plane = new THREE.Mesh(
  new THREE.BoxGeometry(2, 0.5, 4),
  new THREE.MeshStandardMaterial({ color: 0xff0000 })
);
plane.position.y = 10;
scene.add(plane);

// CONTROLS
const keys = {};
window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

let speed = 0;
const maxSpeed = 1;

function updatePlane() {
  if (keys["w"]) speed = Math.min(speed + 0.02, maxSpeed);
  if (keys["s"]) speed = Math.max(speed - 0.02, 0);

  plane.translateZ(-speed);

  if (keys["a"]) plane.rotation.y += 0.03;
  if (keys["d"]) plane.rotation.y -= 0.03;

  if (keys["arrowup"]) plane.position.y += 0.2;
  if (keys["arrowdown"]) plane.position.y -= 0.2;

  // gravity
  plane.position.y -= 0.05;
  if (plane.position.y < 10) plane.position.y = 10;
}

// CAMERA FOLLOW
camera.position.set(0, 20, -40);
camera.lookAt(plane.position);

// RESIZE
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ANIMATION LOOP
function animate() {
  requestAnimationFrame(animate);

  updatePlane();

  camera.position.lerp(
    new THREE.Vector3(
      plane.position.x,
      plane.position.y + 20,
      plane.position.z - 40
    ),
    0.08
  );
  camera.lookAt(plane.position);

  renderer.render(scene, camera);
}

animate();
