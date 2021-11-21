import Camera from "../Camera";
import { vec3, mat4 } from "gl-matrix";
import Inputs from "./Inputs";

const MOUSE_SPEED = 0.005;
const PI = Math.PI;
const WORLD_UP = vec3.fromValues(0.0, 1.0, 0.0);
const TILT_LIMITS = 0.95;

class Player {
  camera: Camera;
  position: vec3;
  forward: vec3;
  inputs: Inputs;
  turnAngle: number = 0.0;
  groundedFoward: vec3;
  distanceFromStart : vec3 = vec3.fromValues(0.0, 0.0, 0.0);
  startPosition : vec3;

  constructor(cam: Camera, pos: vec3, fw: vec3) {
    this.camera = cam;

    this.position = vec3.clone(pos);
    this.startPosition = vec3.clone(pos);
    this.forward = vec3.clone(fw);

    this.groundedFoward = vec3.clone(fw);
    this.groundedFoward[1] = 0;

    this.inputs = new Inputs();
  }

  handleKeyPressEvent(event: KeyboardEvent) {
    if (event.defaultPrevented) {
      return; // Do nothing if event was already processed
    }

    switch (event.key) {
      case "w":
      case "W":
        this.inputs.trueW();
        break;
      case "a":
      case "A":
        this.inputs.trueA();
        break;
      case "s":
      case "S":
        this.inputs.trueS();
        break;
      case "d":
      case "D":
        this.inputs.trueD();
        break;
      default:
        return;
    }
  }

  handleKeyReleaseEvent(event: KeyboardEvent) {
    if (event.defaultPrevented) {
      return; // Do nothing if event was already processed
    }

    switch (event.key) {
      case "w":
      case "W":
        this.inputs.toggleW();
        break;
      case "a":
      case "A":
        this.inputs.toggleA();
        break;
      case "s":
      case "S":
        this.inputs.toggleS();
        break;
      case "d":
      case "D":
        this.inputs.toggleD();
        break;
      default:
        return;
    }
  }

  handleMouseMovement(event: MouseEvent) {
    // handle X movement
    if (event.movementX != 0) {
      this.turnAngle += event.movementX * MOUSE_SPEED;

      this.groundedFoward[0] = Math.cos(this.turnAngle);
      this.groundedFoward[2] = Math.sin(this.turnAngle);
    }
    // handle Y movement
    if (event.movementY != 0) {
      let newY = this.forward[1] - event.movementY * MOUSE_SPEED;
      // clamp newY between TILT_LIMITS
      this.forward[1] = Math.max(-TILT_LIMITS, Math.min(newY, TILT_LIMITS));
    }

    // update player and camera
    this.forward[0] = this.groundedFoward[0];
    this.forward[2] = this.groundedFoward[2];

    vec3.cross(this.camera.right, this.camera.forward, WORLD_UP);
    vec3.normalize(this.camera.right, this.camera.right);
    vec3.copy(this.camera.forward, this.forward);
  }

  move(dT: number) {
    let direction: vec3 = vec3.fromValues(0.0, 0.0, 0.0);

    if (this.inputs.wPressed) {
      vec3.add(direction, direction, this.camera.forward);
    }
    if (this.inputs.aPressed) {
      vec3.subtract(direction, direction, this.camera.right);
    }
    if (this.inputs.sPressed) {
      vec3.subtract(direction, direction, this.camera.forward);
    }
    if (this.inputs.dPressed) {
      vec3.add(direction, direction, this.camera.right);
    }

    vec3.normalize(direction, direction);

    vec3.scaleAndAdd(this.position, this.position, direction, dT * 100.0);
    vec3.copy(this.camera.position, this.position);
  }

  update(dT: number) {
    this.move(dT);
    this.distanceFromStart = vec3.scaleAndAdd(this.distanceFromStart, this.position, this.startPosition, -1);
    this.camera.update();
  }
}
export default Player;
