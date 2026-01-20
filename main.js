// SCENE & CAMERA & RENDERER (same as before)
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  5000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// LIGHT
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(100, 200, 100);
scene.add(sun);

// GROUND (simple green for now)
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(500, 500),
  new THREE.MeshStandardMaterial({ color: 0x228b22 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// ==========================
// LOAD REAL PLANE MODEL
// ==========================
let plane; // will hold the loaded model

const loader = new THREE.GLTFLoader();
loader.load(
  'models/airplane.glb', // path to your GLB file
  function(gltf) {
    plane = gltf.scene;
    plane.scale.set(0.5, 0.5, 0.5); // adjust size
    plane.position.set(0, 10, 0);
    scene.add(plane);
  },
  undefined,
  function(error) {
    console.error('Error loading model:', error);
  }
);

// ==========================
// CONTROLS
// ==========================
const keys = {};
window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

let speed = 0;
const maxSpeed = 1;

function updatePlane() {
  if (!plane) return; // wait until plane loads

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

// CAMERA
camera.position.set(0, 20, -40);
camera.lookAt(0,10,0);

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

  if (plane) {
    camera.position.lerp(
      new THREE.Vector3(
        plane.position.x,
        plane.position.y + 20,
        plane.position.z - 40
      ),
      0.08
    );
    camera.lookAt(plane.position);
  }

  renderer.render(scene, camera);
}

animate();
