import "./style.css";
import typescriptLogo from "./typescript.svg";
import viteLogo from "/vite.svg";
import { setupCounter } from "./counter.ts";
import * as THREE from "three";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
  <div id="imageContainer">
    <img id="myImage" src="https://assets.codepen.io/9051928/glitch.png">
</div>
`;

setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);

// variables
const imageContainer = document.getElementById("imageContainer")!;
const imageElement = document.getElementById("myImage") as HTMLImageElement;

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let planeMesh: THREE.Mesh;
let isHovered = false;
let hoverDuration = 0;

const ANIMATION_CONFIG = {
  updateFrequency: 0.1,
  glitchIntensityMod: 0.5,
};

// shaders
const vertexShader = `
    varying vec2 vUv;
    void main() {
       vUv = uv;
       gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
   }
`;

const fragmentShader = `
  uniform sampler2D tDiffuse;
  uniform float glitchIntensity;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    vec4 baseState = texture2D(tDiffuse, uv);

    if (glitchIntensity > 0.0) {
        float segment = floor(uv.y * 12.0); 
        float randomValue = fract(sin(segment * 12345.6789 + glitchIntensity) * 43758.5453); 
        vec2 offset = vec2(randomValue * 0.03, 0.0) * glitchIntensity;

        vec4 redGlitch = texture2D(tDiffuse, uv + offset);
        vec4 greenGlitch = texture2D(tDiffuse, uv - offset);
        vec4 blueGlitch = texture2D(tDiffuse, uv);

        if (mod(segment, 3.0) == 0.0) {
            gl_FragColor = vec4(redGlitch.r, greenGlitch.g, baseState.b, 1.0);
        } else if (mod(segment, 3.0) == 1.0) {
            gl_FragColor = vec4(baseState.r, greenGlitch.g, blueGlitch.b, 1.0);
        } else {
            gl_FragColor = vec4(redGlitch.r, baseState.g, blueGlitch.b, 1.0);
        }
    } else {
        gl_FragColor = baseState; 
    }
}

`;

function initializeScene(texture: THREE.Texture) {
  //   camera setup
  camera = new THREE.PerspectiveCamera(
    80,
    imageElement.offsetWidth / imageElement.offsetHeight,
    0.01,
    10
  );
  camera.position.z = 1;

  //   scene creation
  scene = new THREE.Scene();

  //   uniforms
  const shaderUniforms: ShaderUniforms = {
    tDiffuse: { value: texture },
    glitchIntensity: { value: 0.0 },
  };

  //   creating a plane mesh with materials
  interface ShaderUniforms {
    tDiffuse: { value: THREE.Texture };
    glitchIntensity: { value: number };
    [uniform: string]: { value: any };
  }

  planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({
      uniforms: shaderUniforms,
      vertexShader,
      fragmentShader,
    })
  );

  //   add mesh to scene
  scene.add(planeMesh);

  //   render
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(imageElement.offsetWidth, imageElement.offsetHeight);

  //   create a new canvas in imageContainer
  imageContainer.appendChild(renderer.domElement);

  //   if mouse is over the image, isHovered is true
  imageContainer.addEventListener("mouseover", function () {
    isHovered = true;
  });

  //   if mouse is out of the image, isHovered is false and glitchIntensity value is 0
  imageContainer.addEventListener("mouseout", function () {
    isHovered = false;
    shaderUniforms.glitchIntensity.value = 0;
  });
}

// use the existing image from html in the canvas
initializeScene(new THREE.TextureLoader().load(imageElement.src));

animateScene();

function animateScene() {
  requestAnimationFrame(animateScene);

  if (isHovered) {
    hoverDuration += ANIMATION_CONFIG.updateFrequency;

    if (hoverDuration >= 0.5) {
      hoverDuration = 0;
      (
        planeMesh.material as THREE.ShaderMaterial
      ).uniforms.glitchIntensity.value =
        Math.random() * ANIMATION_CONFIG.glitchIntensityMod;
    }
  }

  renderer.render(scene, camera);
}
