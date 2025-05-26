let scene, camera, renderer, player, obstacles = [];
let moveTargetX = 0, score = 0, highScore = 0;
const speed = 0.1;
const lanePositions = [-3, 0, 3]; // LEFT to RIGHT

init();
animate();

function init() {
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.z = 10;
  camera.position.y = 5;
  camera.lookAt(0, 0, 0);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Player
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  player = new THREE.Mesh(geometry, material);
  player.position.y = 0.5;
  scene.add(player);

  // Lights
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 10, 10).normalize();
  scene.add(light);

  // Ground
  const groundGeometry = new THREE.PlaneGeometry(20, 100);
  const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.z = -40;
  scene.add(ground);

  // High score
  highScore = localStorage.getItem("highScore") || 0;
  document.getElementById("highScore").textContent = "High Score: " + highScore;

  // Controls
  document.addEventListener('keydown', (e) => {
    if (["ArrowLeft", "a", "A", "q", "Q"].includes(e.key)) moveLeft();
    if (["ArrowRight", "d", "D"].includes(e.key)) moveRight();
  });

  spawnObstacle();
}

function moveLeft() {
  let index = lanePositions.indexOf(moveTargetX);
  if (index > 0) {
    moveTargetX = lanePositions[index - 1];
  }
}

function moveRight() {
  let index = lanePositions.indexOf(moveTargetX);
  if (index < lanePositions.length - 1) {
    moveTargetX = lanePositions[index + 1];
  }
}

function spawnObstacle() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const obstacle = new THREE.Mesh(geometry, material);
  const lane = lanePositions[Math.floor(Math.random() * lanePositions.length)];
  obstacle.position.set(lane, 0.5, -50);
  scene.add(obstacle);
  obstacles.push(obstacle);
  setTimeout(spawnObstacle, 1000);
}

function animate() {
  requestAnimationFrame(animate);

  // Player lane movement
  player.position.x += (moveTargetX - player.position.x) * 0.2;

  // Move obstacles
  obstacles.forEach((obs, index) => {
    obs.position.z += speed * 10;
    if (obs.position.z > 10) {
      scene.remove(obs);
      obstacles.splice(index, 1);
      score++;
      document.getElementById("score").textContent = "Score: " + score;

      if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
        document.getElementById("highScore").textContent = "High Score: " + highScore;
      }
    }

    // Collision detection
    if (Math.abs(obs.position.z - player.position.z) < 0.75 &&
        Math.abs(obs.position.x - player.position.x) < 0.75) {
      alert("Game Over! Score: " + score);
      location.reload();
    }
  });

  renderer.render(scene, camera);
}
