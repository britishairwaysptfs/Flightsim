// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// CAMERA
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// LIGHT
scene.add(new THREE.AmbientLight(0xffffff, 0.6));

const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(10, 20, 10);
scene.add(sun);

// GROUND (NO TEXTURES)
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(500, 500),
  new THREE.MeshStandardMaterial({ color: 0x228b22 })
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

// CAMERA POSITION
camera.position.set(0, 15, -25);
camera.lookAt(plane.position);

// CONTROLS
const keys = {};
window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

let speed = 0;

function updatePlane() {
  if (keys["w"]) speed += 0.01;
  if (keys["s"]) speed -= 0.01;
  speed = Math.max(0, Math.min(speed, 1));

  plane.translateZ(-speed);

  if (keys["a"]) plane.rotation.y += 0.03;
  if (keys["d"]) plane.rotation.y -= 0.03;

  if (keys["arrowup"]) plane.position.y += 0.2;
  if (keys["arrowdown"]) plane.position.y -= 0.2;

  // gravity
  plane.position.y -= 0.05;
  if (plane.position.y < 5) plane.position.y = 5;
}

// RESIZE
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// LOOP
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
