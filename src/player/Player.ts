import Camera from "../Camera";
import { vec3, mat4 } from "gl-matrix";
import Inputs from "./Inputs";

class Player {
  camera: Camera;
  position: vec3;
  forward: vec3;
  inputs: Inputs;

  constructor(cam: Camera, pos: vec3, fw: vec3) {
    this.camera = cam;

    this.position = vec3.clone(pos);
    this.forward = vec3.clone(fw);
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

  handleMouseMovement(event : MouseEvent) {
      console.log("MOUSE MOVES");
  }

  move(dT: number) {
    let direction: vec3 = vec3.fromValues(0.0, 0.0, 0.0);

    if (this.inputs.wPressed) {
      vec3.add(direction, direction, this.camera.forward);
      console.log("DEBUG: W WAS PRESSED, DIRECTION ADDED: " + direction);
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

    console.log("DEBUG: DIRECTION: " + direction);

    vec3.normalize(direction, direction);

    vec3.scaleAndAdd(this.position, this.position, direction, dT * 100.0);
    vec3.copy(this.camera.position, this.position);
  }

  update(dT: number) {
    this.move(dT);
    this.camera.update(); //somewhere in here, the positin is being updated
    console.log("DEBUG: CAMERA POSITION: " + this.camera.position);
  }
}
export default Player;
