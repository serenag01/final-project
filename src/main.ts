import { vec3, mat4, vec4 } from "gl-matrix";
import * as Stats from "stats-js";
import * as DAT from "dat-gui";
import Square from "./geometry/Square";
import ScreenQuad from "./geometry/ScreenQuad";
import OpenGLRenderer from "./rendering/gl/OpenGLRenderer";
import Camera from "./Camera";
import { gl, setGL } from "./globals";
import ShaderProgram, { Shader } from "./rendering/gl/ShaderProgram";
import Mesh from "./geometry/Mesh";
import LSystem from "./l-system/L-System";
import { readTextFile } from "../src/globals";
import Player from "./player/Player";
import Terrain from "./terrain/terrain";
import FrameBuffer from "./rendering/gl/FrameBuffer";

var palette = {
  color1: [255, 127.0, 80.0, 1.0], // branch
  color2: [57, 217, 222, 1.0], // leaf
};

// controls:
let prevIters = 3;
let prevAngle = 15;
let prevScale = 1;
let prevColor1: vec4 = vec4.fromValues(
  palette.color1[0],
  palette.color1[1],
  palette.color1[2],
  1.0
);
let prevColor2: vec4 = vec4.fromValues(
  palette.color2[0],
  palette.color2[1],
  palette.color2[2],
  1.0
);

let screenQuad: ScreenQuad;
// let terrain: Mesh = new Mesh(
//   readTextFile("resources/plane.obj"),
//   vec3.fromValues(10, 10, 10)
// );
let terrainClass: Terrain;

let time: number = 0.0;
let isTransitioning: boolean = false;
//let branch: Mesh;
//let matrix: mat4 = mat4.create();
//let coral: LSystem = new LSystem(vec4.fromValues(0.0, 0.0, 0.0, 1.0), 4, 15, 1, prevColor1, prevColor2);
//let coral: LSystem;
/*let base: Mesh = new Mesh(
  readTextFile("resources/base.obj"),
  vec3.fromValues(0, 0, 0)
);*/

let treeLocations: Array<[number, number]> = [];
let treeBases: Mesh[] = [];
let treeBranches: Mesh[] = [];
let treeLeaves: Mesh[] = [];

function createBase(x: number, z: number) {
  let base = new Mesh(
    readTextFile("resources/base.obj"),
    vec3.fromValues(x, 0, z)
  );

  base.create();

  let base1 = [5, 0, 0, 0];
  let base2 = [0, 10, 0, 0];
  let base3 = [0, 0, 5, 0];
  let base4 = [0, 2, 0, 1];

  let cols = [0.761, 0.698, 0.502, 1.0];

  let bCol1: Float32Array = new Float32Array(base1);
  let bCol2: Float32Array = new Float32Array(base2);
  let bCol3: Float32Array = new Float32Array(base3);
  let bCol4: Float32Array = new Float32Array(base4);
  let bcolors: Float32Array = new Float32Array(cols);
  base.setInstanceVBOs(bCol1, bCol2, bCol3, bCol4, bcolors);
  base.setNumInstances(1);

  treeBases.push(base);
}

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  iterations: 3,
  angle: 15,
  decoration_scale: 1,
  Generate: loadScene,
};

// NOISE FUNCTIONS:

// generate trees
function createTrees() {
  // factors that determine the "natural-ness" of a tree
  let treeIters = 1;
  let angle = 10;

  // generate trees on the terrain
  for (let i = 0; i < terrainClass.sideLength; i++) {
    //treeIters += 1;
    for (let j = 0; j < terrainClass.sideLength; j++) {
      let rand = Math.random();

      if (rand < 0.1) {
        let x = i * terrainClass.squareDims;
        let z = j * terrainClass.squareDims;

        let treePos = vec4.fromValues(x, 0.0, z, 1.0);

        angle += 1;
        //treeIters += Math.floor(i / 10);

        // clamp angle and tree iters
        if (angle > 90) {
          angle = 90;
        }

        if (treeIters > 7) {
          treeIters = 7;
        }

        let s = 1;
        let col1 = vec4.fromValues(255.0, 255.0, 255.0, 255.0);
        let col2 = vec4.fromValues(255.0, 1.0, 1.0, 1.0);
        //createBase(x, z);

        let tree = new LSystem(treePos, treeIters, angle, s, col1, col2);

        treeBranches.push(tree.branch);
        treeLeaves.push(tree.leaf);

        tree.makeTree();
      }
    }
  }
}

function loadScene() {
  // coral = new LSystem(
  //   vec4.fromValues(0.0, 0.0, 0.0, 1.0),
  //   controls.iterations,
  //   controls.angle,
  //   controls.decoration_scale,
  //   prevColor1,
  //   prevColor2
  // );

  //coral.makeTree();

  //putBase();

  // KEEP THIS FOR NOW: creates a terrain shape imported from a Maya OBJ
  //terrain.create();
  //terrain.setNumInstances(1);

  // KEEP THIS FOR NOW: creates terrain based on terrain class
  terrainClass = new Terrain();
  terrainClass.create();
  terrainClass.setNumInstances(1);

  createTrees();

  // background
  screenQuad = new ScreenQuad();
  screenQuad.create();
}

function calculateClearColor(player: Player) {
  let dist: vec3 = vec3.clone(player.distanceFromStart);
  let clearColor: vec3 = vec3.fromValues(0.0, 0.0, 0.0);
  let distScale: number = vec3.length(dist) / 1000.0;
  clearColor = vec3.scaleAndAdd(
    clearColor,
    clearColor,
    vec3.fromValues(1.0, 1.0, 1.0),
    distScale
  );

  return vec4.fromValues(clearColor[0], clearColor[1], clearColor[2], 1.0);
}

function main() {
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = "absolute";
  stats.domElement.style.left = "0px";
  stats.domElement.style.top = "0px";
  document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI();
  gui.add(controls, "iterations", 1, 5).step(1);
  gui.add(controls, "angle", 1, 20).step(1);
  gui.add(controls, "decoration_scale", 0, 3).step(0.1);
  gui.addColor(palette, "color1");
  gui.addColor(palette, "color2");
  gui.add(controls, "Generate");

  // get canvas and webgl context
  const canvas = <HTMLCanvasElement>document.getElementById("canvas");
  const gl = <WebGL2RenderingContext>canvas.getContext("webgl2");
  if (!gl) {
    alert("WebGL 2 not supported!");
  }

  const texWidth = window.innerWidth;
  const texHeight = window.innerHeight;
  let frameBuffer: FrameBuffer;
  frameBuffer = new FrameBuffer(gl, texWidth, texHeight, window.devicePixelRatio);
  frameBuffer.create();
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene();

  const camera = new Camera(
    vec3.fromValues(30, 10, 30),
    vec3.fromValues(100, 0, 100)
  );

  let player: Player = new Player(camera, camera.position, camera.forward);

  const renderer = new OpenGLRenderer(canvas);
  let clearColor: vec4 = calculateClearColor(player);
  renderer.setClearColor(clearColor[0], clearColor[1], clearColor[2], 1.0);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.enable(gl.DEPTH_TEST);

  const instancedShader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require("./shaders/instanced-vert.glsl")),
    new Shader(gl.FRAGMENT_SHADER, require("./shaders/instanced-frag.glsl")),
  ]);

  const postShader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require("./shaders/post/noOp-vert.glsl")),
    new Shader(
      gl.FRAGMENT_SHADER,
      require("./shaders/post/transition-frag.glsl")
    ),
  ]);

  const flat = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require("./shaders/flat-vert.glsl")),
    new Shader(gl.FRAGMENT_SHADER, require("./shaders/flat-frag.glsl")),
  ]);

  const lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require("./shaders/lambert-vert.glsl")),
    new Shader(gl.FRAGMENT_SHADER, require("./shaders/lambert-frag.glsl")),
  ]);

  function vec4Equals(a: vec4, b: vec4) {
    return vec4.len(vec4.subtract(vec4.create(), a, b)) < 0.1;
  }

  function checkTransition() {
    if (vec3.length(player.distanceFromStart) > 990) {
      isTransitioning = true;
    }
  }

  // This function will be called every frame
  function tick() {
    let deltaTime: number = 0.01;
    player.update(deltaTime);
    stats.begin();

    instancedShader.setTime(time);
    //flat.setTime(time++);
    gl.viewport(0, 0, texWidth, texHeight);
    renderer.clear();
    // set clear color based on player's position
    let clearColor: vec4 = calculateClearColor(player);
    renderer.setClearColor(clearColor[0], clearColor[1], clearColor[2], 1.0);

    // check if we are transitioning
    checkTransition();

    if (isTransitioning) {
      // wait 5 seconds, then set isTransitioning to false
      // found from: https://stackoverflow.com/questions/14226803/wait-5-seconds-before-executing-next-line
      setTimeout(function () {
        isTransitioning = false;
      }, 5000);

      // post-processing, adapted from: https://learnopengl.com/Advanced-OpenGL/Framebuffers

      // let framebuffer = gl.createFramebuffer();
      // gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

      // // generate texture
      // let textureColorbuffer = gl.createTexture();
      // gl.bindTexture(gl.TEXTURE_2D, textureColorbuffer);
      // gl.texImage2D(
      //   gl.TEXTURE_2D,
      //   0,
      //   gl.RGB,
      //   texWidth,
      //   texHeight,
      //   0,
      //   gl.RGB,
      //   gl.UNSIGNED_BYTE,
      //   null
      // );
      // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      // gl.bindTexture(gl.TEXTURE_2D, null);

      // // attach it to currently bound framebuffer object
      // gl.framebufferTexture2D(
      //   gl.FRAMEBUFFER,
      //   gl.COLOR_ATTACHMENT0,
      //   gl.TEXTURE_2D,
      //   textureColorbuffer,
      //   0
      // );

      // let rbo = gl.createRenderbuffer();
      // gl.bindRenderbuffer(gl.RENDERBUFFER, rbo);
      // gl.renderbufferStorage(
      //   gl.RENDERBUFFER,
      //   gl.DEPTH24_STENCIL8,
      //   texWidth,
      //   texHeight
      // );
      // gl.bindRenderbuffer(gl.RENDERBUFFER, null);

      // gl.framebufferRenderbuffer(
      //   gl.FRAMEBUFFER,
      //   gl.DEPTH_STENCIL_ATTACHMENT,
      //   gl.RENDERBUFFER,
      //   rbo
      // );
      // var FBOstatus = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
      // if (FBOstatus != gl.FRAMEBUFFER_COMPLETE)
      //   console.log("ERROR::FRAMEBUFFER:: Framebuffer is not complete!");
      // gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      //1. Render the scene as usual with the new framebuffer bound as the active framebuffer.
      // first pass
      frameBuffer.bindFrameBuffer();
      gl.viewport(0,0,window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);
      // gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.clearColor(0.1, 0.1, 0.1, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // we're not using the stencil buffer now
      gl.enable(gl.DEPTH_TEST);
      renderer.render(player, camera, lambert, [terrainClass]);
      renderer.render(player, camera, instancedShader, treeBases);
      renderer.render(player, camera, instancedShader, treeBranches);
      renderer.render(player, camera, instancedShader, treeLeaves);
      // nothing should appear bc we are rendering to the buffer

      //2. Bind to the default framebuffer.
      // second pass
      gl.bindFramebuffer(gl.FRAMEBUFFER, null); // back to default
      gl.viewport(0,0,window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);
      gl.clearColor(0.1, 0.1, 0.1, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // we're not using the stencil buffer now
      
      //3. Draw a quad that spans the entire screen with the new framebuffer's color buffer as its texture.
      gl.disable(gl.DEPTH_TEST);
      // gl.bindTexture(gl.TEXTURE_2D, textureColorbuffer);
      frameBuffer.bindToTextureSlot(1);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      postShader.setTexture1(null); // TODO maybe change this to accept the int ID of the tex slot you want the unif to bind to
      renderer.render(player, camera, postShader, [screenQuad]);
      

      // delete fbo when all done:
      //gl.deleteFramebuffer(fbo);
    } else {
      // render without post-processing effects
      // render normally
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.enable(gl.DEPTH_TEST);
      renderer.render(player, camera, lambert, [terrainClass]);
      renderer.render(player, camera, instancedShader, treeBases);
      renderer.render(player, camera, instancedShader, treeBranches);
      renderer.render(player, camera, instancedShader, treeLeaves);
    }

    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  // lock the mouse at the center of screen ------------------------------------------------
  // from: https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API
  canvas.onclick = function () {
    canvas.requestPointerLock();
  };

  function handleMouseMovement(event: MouseEvent) {
    player.handleMouseMovement(event);
  }

  function mouseLockChangeAlert() {
    if (document.pointerLockElement === canvas) {
      document.addEventListener("mousemove", handleMouseMovement, false);
    } else {
      document.removeEventListener("mousemove", handleMouseMovement, false);
    }
  }

  // EVENT LISTENERS------------------------------------------------------------

  document.addEventListener("pointerlockchange", mouseLockChangeAlert, false);

  window.addEventListener(
    "resize",
    function () {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.setAspectRatio(window.innerWidth / window.innerHeight);
      camera.updateProjectionMatrix();
      //flat.setDimensions(window.innerWidth, window.innerHeight);
      frameBuffer.resize(window.innerWidth, window.innerHeight, window.devicePixelRatio);
      frameBuffer.destroy();
      frameBuffer.create();
    },
    false
  );

  window.addEventListener(
    "keydown",
    function (event) {
      player.handleKeyPressEvent(event);
    },
    false
  );

  window.addEventListener(
    "keyup",
    function (event) {
      player.handleKeyReleaseEvent(event);
    },
    false
  );

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();
  //flat.setDimensions(window.innerWidth, window.innerHeight);

  // Start the render loop
  tick();
}

main();
