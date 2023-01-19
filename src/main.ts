// import './style.css'
// import typescriptLogo from './typescript.svg'
// import { setupCounter } from './counter'

// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
//   <div>
//     <a href="https://vitejs.dev" target="_blank">
//       <img src="/vite.svg" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://www.typescriptlang.org/" target="_blank">
//       <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
//     </a>
//     <h1>Vite + TypeScript</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite and TypeScript logos to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
import * as THR from "three";
import "./style.css";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

//We begin by creating a scene. This will hold everything in place
const scene = new THR.Scene();

//To create a shape/object, we need geometry to define the object structure
// and material will define our object properties like color
const geometry = new THR.SphereGeometry(3, 64, 64);
const material = new THR.MeshStandardMaterial({
  color: "#00ff83",
  roughness: 0.2,
});

//Mesh will combine our geomerty + material and create a full object.
//We then add this mesh to our scene
const mesh = new THR.Mesh(geometry, material);
scene.add(mesh);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//For our object to be visible, we require some light
//We then add our light to the scene
const light = new THR.PointLight(0xffffffff, 1, 100);
light.position.set(30, 20, 0);
light.intensity = 1.25;
scene.add(light);

//We then set up a camera to signify our eye-view perspective.
//We then add our camera to the scene
const camera = new THR.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 15;
scene.add(camera);

//We then render our object in the HTML
const canvas = document.querySelector(".canv")! as HTMLElement;
const renderer = new THR.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

//We can then define some mouse controls on our object
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotateSpeed = 6;

let autoRot: boolean = false;

let rotItem = document.querySelector("#ping")!;
rotItem?.addEventListener("click", () => {
  autoRot = !autoRot;
  let val = autoRot == true ? "Disable Rotation" : "Enable Rotation";
  rotItem.innerHTML = val;
  controls.autoRotate = autoRot;
});

//Add an event lister for the resize capability
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

const renderLoop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderLoop);
};
renderLoop();

//Create some initial animation
const tml = gsap.timeline({
  defaults: { duration: 1.5 },
});
tml.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
tml.fromTo("nav", { y: "-100%" }, { y: "0%" });

let mouseDown: boolean = false;
let rgb = [];
window.addEventListener("mousedown", () => (mouseDown = true));
window.addEventListener("mouseup", () => (mouseDown = false));
window.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      150,
    ];

    let newColor = new THR.Color(`rgb(${rgb.join(",")})`);
    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    });
  }
});
