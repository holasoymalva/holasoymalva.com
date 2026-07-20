/**
 * 8-Bit Retro Arcade WebGL 3D Pixel Engine
 * Powered by Three.js with pixelated cube particles & arcade geometries
 */

(function () {
  let canvas;
  let scene, camera, renderer;
  let particleGroup, pixelCube;
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;
  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = window.innerHeight / 2;
  let clock;

  function init() {
    canvas = document.getElementById("webgl-hero-canvas");
    if (!canvas || typeof THREE === "undefined") return;

    clock = new THREE.Clock();

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xf6efe5, 0.0014);

    camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      2000
    );
    camera.position.z = 750;

    // Vintage Arcade Lighting
    const ambientLight = new THREE.AmbientLight(0xfff8f0, 0.55);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xd98b8b, 1.1, 900);
    pointLight.position.set(200, 300, 400);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xd9c089, 1, 900);
    pointLight2.position.set(-200, -300, -400);
    scene.add(pointLight2);

    // 8-Bit Pixel Cube Particles
    particleGroup = new THREE.Group();
    const particleCount = 180;
    const boxGeo = new THREE.BoxGeometry(12, 12, 12);

    const colors = [0xc58a91, 0xd6ba84, 0x7fa36b, 0x79a7a0, 0x8d7aa8];

    for (let i = 0; i < particleCount; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const mat = new THREE.MeshLambertMaterial({
        color: color,
        flatShading: true,
        transparent: true,
        opacity: 0.55,
      });

      const mesh = new THREE.Mesh(boxGeo, mat);

      const radius = 250 + Math.random() * 450;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      mesh.position.x = radius * Math.sin(phi) * Math.cos(theta);
      mesh.position.y = radius * Math.sin(phi) * Math.sin(theta);
      mesh.position.z = radius * Math.cos(phi);

      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;

      particleGroup.add(mesh);
    }
    scene.add(particleGroup);

    // Main 8-Bit Pixelated Center Cube
    const cubeGeo = new THREE.BoxGeometry(160, 160, 160);
    const cubeMat = new THREE.MeshStandardMaterial({
      color: 0xc58a91,
      wireframe: true,
      roughness: 0.45,
      metalness: 0.55,
    });

    pixelCube = new THREE.Mesh(cubeGeo, cubeMat);
    pixelCube.position.set(280, 0, -80);
    scene.add(pixelCube);

    // Renderer
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: false, // Intentional pixelated aesthetic
    });
    renderer.setPixelRatio(1); // 1:1 pixel rendering for arcade vibe
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.addEventListener("mousemove", onPointerMove);
    window.addEventListener("resize", onWindowResize);

    animate();
  }

  function onPointerMove(event) {
    targetMouseX = (event.clientX - windowHalfX) * 0.3;
    targetMouseY = (event.clientY - windowHalfY) * 0.3;
  }

  function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    // Rotate 8-bit particle cloud
    if (particleGroup) {
      particleGroup.rotation.y = elapsedTime * 0.08;
      particleGroup.rotation.x = elapsedTime * 0.04;
      particleGroup.position.x = mouseX * 0.4;
      particleGroup.position.y = -mouseY * 0.4;
    }

    // Spin pixel wireframe cube
    if (pixelCube) {
      pixelCube.rotation.x = elapsedTime * 0.3;
      pixelCube.rotation.y = elapsedTime * 0.4;
      pixelCube.position.x = 240 + mouseX * 0.2;
      pixelCube.position.y = -mouseY * 0.2;
    }

    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  }

  window.addEventListener("DOMContentLoaded", init);
})();
