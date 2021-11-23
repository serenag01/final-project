var CameraControls = require("3d-view-controls");
import { vec3, mat4 } from "gl-matrix";

class Camera {
  projectionMatrix: mat4 = mat4.create();
  viewMatrix: mat4 = mat4.create();
  fovy: number = (45 * Math.PI) / 180.0;
  aspectRatio: number = 1;
  near: number = 0.1;
  far: number = 2000;
  position: vec3 = vec3.create();
  target: vec3 = vec3.create();
  up: vec3 = vec3.fromValues(0, 1, 0);
  right: vec3 = vec3.fromValues(1, 0, 0);
  forward: vec3 = vec3.fromValues(0, 0, 1);

  constructor(position: vec3, target: vec3) {
    vec3.copy(this.position, position);
    vec3.scaleAndAdd(this.forward, target, position, -1.0);
    vec3.normalize(this.forward, this.forward);

    vec3.cross(this.right, this.forward, this.up);

    vec3.add(this.target, this.position, this.forward);

    mat4.lookAt(this.viewMatrix, this.position, this.target, this.up);
  }

  setAspectRatio(aspectRatio: number) {
    this.aspectRatio = aspectRatio;
  }

  updateProjectionMatrix() {
    mat4.perspective(
      this.projectionMatrix,
      this.fovy,
      this.aspectRatio,
      this.near,
      this.far
    );
  }

  update() {
    vec3.add(this.target, this.position, this.forward);
    mat4.lookAt(this.viewMatrix, this.position, this.target, this.up);
  }
}

export default Camera;
