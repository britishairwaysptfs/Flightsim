const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 10);
scene.add(light);

// Ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(500, 500),
  new THREE.MeshStandardMaterial({ color: 0x228B22 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Plane
const plane = new THREE.Mesh(
  new THREE.BoxGeometry(2, 0.5, 4),
  new THREE.MeshStandardMaterial({ color: 0xff0000 })
);
plane.position.y = 5;
scene.add(plane);

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
