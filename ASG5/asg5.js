let camera, scene, renderer;
let geometry, material, mesh;

init();
animate();

function init() {
  scene = new THREE.Scene();

  const fov = 60;
  const aspect = 1920 / 1080;
  const near = 1.0;
  const far = 1000.0;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(75, 20, 0);

  const loader = new THREE.CubeTextureLoader();
  const texture = loader.load([
    'texture/px.jpg',
    'texture/nx.jpg',
    'texture/py.jpg',
    'texture/ny.jpg',
    'texture/pz.jpg',
    'texture/nz.jpg',
  ]);
  scene.background = texture;

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100, 1, 1),
    new THREE.MeshStandardMaterial({
      color: 0xFFFFFF
    })
  ); 
  plane.castShadow = false;
  plane.reeceiveShadow = true;
  plane.rotation.x = -Math.PI/2;

  
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  window.addEventListener('resize', () => {
    OnWindowResize();
  }, false);

  let light = new THREE.DirectionalLight(0xFFFFFF);
  light.position.set(100, 100, 100);
  light.target.position.set(0, 0, 0);
  light.castShadow = true;
  light.shadow.bias = -0.01;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  light.shadow.camera.near = 1.0;
  light.shadow.camera.far = 500;
  light.shadow.left = 200;
  light.shadow.right = -200;
  light.shadow.top = 200;
  light.shadow.bottom = -200;
  scene.add(light);
  light = new THREE.AmbientLight(0x404040);
  scene.add(light);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.minDistance = 1;
  controls.maxDistance = 20;

}

function OnWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

