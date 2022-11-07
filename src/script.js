import "./output.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import gsap from "gsap";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();
const world = {
  plane: {
    width: 400,
    height: 400,
    widthSegment: 50,
    heightSegment: 50,
  },
};
gui.add(world.plane, "width", 1, 500, 1).onFinishChange(generatePlane);

gui.add(world.plane, "height", 1, 500, 1).onFinishChange(generatePlane);

gui.add(world.plane, "widthSegment", 1, 100, 1).onFinishChange(generatePlane);

gui.add(world.plane, "heightSegment", 1, 100, 1).onFinishChange(generatePlane);

function generatePlane() {
  planeMesh.geometry.dispose();
  planeMesh.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegment,
    world.plane.heightSegment
  );

  const { array } = planeMesh.geometry.attributes.position;

  const randomValues = [];

  for (let i = 0; i < array.length; i += 3) {
    const x = array[i];
    const y = array[i + 1];
    const z = array[i + 2];

    array[i] = x + (Math.random() - 0.5) * 3;
    array[i + 1] = y + (Math.random() - 0.5) * 3;
    array[i + 2] = z + (Math.random() - 0.5) * 3;

    randomValues.push(Math.random() * Math.PI * 2);
    randomValues.push(Math.random() * Math.PI * 2);
    randomValues.push(Math.random() * Math.PI * 2);
  }

  planeMesh.geometry.attributes.position.randomValues = randomValues;

  planeMesh.geometry.attributes.position.originalPosition =
    planeMesh.geometry.attributes.position.array;

  console.log(planeMesh.geometry.attributes.position);

  const colors = [];
  for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
    colors.push(0, 0.19, 0.4);
  }

  planeMesh.geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(new Float32Array(colors), 3)
  );
}

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.set(0, 0, 50);
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

// Raycaster
const raycaster = new THREE.Raycaster();

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const planeGeometry = new THREE.PlaneGeometry(
  world.plane.width,
  world.plane.height,
  world.plane.widthSegment,
  world.plane.heightSegment
);
const planeMaterial = new THREE.MeshPhongMaterial({
  //   color: 0xff0000,
  side: THREE.DoubleSide,
  flatShading: THREE.FlatShading,
  vertexColors: true,
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

generatePlane();

/* const { array } = planeMesh.geometry.attributes.position;

const randomValues = [];

for (let i = 0; i < array.length; i += 3) {
  const x = array[i];
  const y = array[i + 1];
  const z = array[i + 2];

  array[i] = x + (Math.random() - 0.5) * 3;
  array[i + 1] = y + (Math.random() - 0.5) * 3;
  array[i + 2] = z + (Math.random() - 0.5) * 3;

  randomValues.push(Math.random() - 0.5);
  randomValues.push(Math.random() - 0.5);
  randomValues.push(Math.random() - 0.5);
}

planeMesh.geometry.attributes.position.randomValues = randomValues;

planeMesh.geometry.attributes.position.originalPosition =
  planeMesh.geometry.attributes.position.array;

console.log(planeMesh.geometry.attributes.position);

const colors = [];
for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
  colors.push(0, 0.19, 0.4);
}

planeMesh.geometry.setAttribute(
  "color",
  new THREE.BufferAttribute(new Float32Array(colors), 3)
);
 */
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1);
scene.add(light);

const backLight = new THREE.DirectionalLight(0xffffff, 1);
backLight.position.set(0, 0, -1);
scene.add(backLight);

const startGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
});

const starVertices = [];
for (let i = 0; i < 10000; i++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = (Math.random() - 0.5) * 2000;
  starVertices.push(x, y, z);
}

startGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(starVertices, 3)
);

console.log(startGeometry);
console.log(starMaterial);

const stars = new THREE.Points(startGeometry, starMaterial);
scene.add(stars);

/**
 * Animate
 */
const clock = new THREE.Clock();

const mouse = {
  x: undefined,
  y: undefined,
};

let frame = 0;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  frame += 0.01;
  // Update controls
  // controls.update();

  const { array, originalPosition, randomValues } =
    planeMesh.geometry.attributes.position;
  for (let i = 0; i < array.length; i += 3) {
    array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.01;
    array[i + 1] =
      originalPosition[i + 1] + Math.sin(frame + randomValues[i + 1]) * 0.01;
  }

  planeMesh.geometry.attributes.position.needsUpdate = true;

  // Raycaster
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(planeMesh);
  if (intersects.length > 0) {
    const { color } = intersects[0].object.geometry.attributes;

    color.setX(intersects[0].face.a, 0.1);
    color.setY(intersects[0].face.a, 0.5);
    color.setZ(intersects[0].face.a, 1);

    color.setX(intersects[0].face.b, 0.1);
    color.setY(intersects[0].face.b, 0.5);
    color.setZ(intersects[0].face.b, 1);

    color.setX(intersects[0].face.c, 0.1);
    color.setY(intersects[0].face.c, 0.5);
    color.setZ(intersects[0].face.c, 1);

    intersects[0].object.geometry.attributes.color.needsUpdate = true;

    const initialColor = { r: 0, g: 0.19, b: 0.4 };

    const hoverColor = { r: 0.1, g: 0.5, b: 1 };

    gsap.to(hoverColor, {
      r: initialColor.r,
      g: initialColor.g,
      b: initialColor.b,
      onUpdate() {
        color.setX(intersects[0].face.a, hoverColor.r);
        color.setY(intersects[0].face.a, hoverColor.g);
        color.setZ(intersects[0].face.a, hoverColor.b);

        color.setX(intersects[0].face.b, hoverColor.r);
        color.setY(intersects[0].face.b, hoverColor.g);
        color.setZ(intersects[0].face.b, hoverColor.b);

        color.setX(intersects[0].face.c, hoverColor.r);
        color.setY(intersects[0].face.c, hoverColor.g);
        color.setZ(intersects[0].face.c, hoverColor.b);
      },
    });
  }

  stars.rotation.x += 0.0001;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  //   console.log(mouse);
});

gsap.to("#threejsTitle", { opacity: 1, duration: 2 });

gsap.to("#threejsDescription", { opacity: 1, duration: 2, delay: 0.5 });

gsap.to("#viewWorkBtn", { opacity: 1, duration: 2, delay: 1 });

document.querySelector("#viewWorkBtn").addEventListener("click", (event) => {
  event.preventDefault();
  console.log("go");
  gsap.to("#container", {
    opacity: 0,
  });

  console.log("camera: ", camera);

  gsap.to(camera.position, {
    z: 25,
    ease: "power3.inOut",
    duration: 2,
  });
  gsap.to(camera.rotation, {
    x: 1.57,
    ease: "power3.inOut",
    duration: 2,
  });
  gsap.to(camera.position, {
    y: 1000,
    ease: "power3.in",
    duration: 1,
    delay: 2,
  });

  console.log("camera: ", camera);
});
