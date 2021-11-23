import * as internal from "assert";
import { vec3, vec4 } from "gl-matrix";
import Drawable from "../rendering/gl/Drawable";
import { gl } from "../globals";

class Terrain extends Drawable {
    indices: Uint32Array;
    positions: Float32Array;
    colors: Float32Array;
    normals: Float32Array;

    origin: vec3; // Origin of terrain
    sideLength: number; // Int side length (AKA number of points), terrain is bottom left cornered at origin
    squareDims: number; // length of a unit square on terrain.

    constructor() {
        super();
        this.origin = vec3.fromValues(0, 0, 0);
        this.sideLength = 70;
        this.squareDims = 20;
    }

    noise(x: number, z: number) {
        // REALLY BASIC NOISE FOR NOW
        // return(Math.sin(x + z));
        return 0.0;
    }

    create() {
        let posTemp: Array<number> = [];
        let norTemp: Array<number> = [];
        let colTemp: Array<number> = [];
        let idxTemp: Array<number> = [];

        let numFaces = this.sideLength * this.sideLength;

        for (let i = 0; i < this.sideLength; i++) {
            for (let j = 0; j < this.sideLength; j++) {
                // offset x and z so we always start drawing boxes at the right position
                let x = i * this.squareDims;
                let z = j * this.squareDims;

                // create square at x, z
                let y0 = this.noise(x, z);
                let y1 = this.noise(x + this.squareDims, z);
                let y2 = this.noise(x + this.squareDims, z + this.squareDims);
                let y3 = this.noise(x, z + this.squareDims);

                // push position vertices

                // v1
                posTemp.push(x); 
                posTemp.push(y0);
                posTemp.push(z);
                posTemp.push(1.0);

                // v2
                posTemp.push(x);
                posTemp.push(y1);
                posTemp.push(z + this.squareDims);
                posTemp.push(1.0);

                // v3
                posTemp.push(x + this.squareDims);
                posTemp.push(y2);
                posTemp.push(z + this.squareDims);
                posTemp.push(1.0);

                // v4
                posTemp.push(x + this.squareDims);
                posTemp.push(y3);
                posTemp.push(z);
                posTemp.push(1.0);

                // push normal vertices
                norTemp.push(0.0);
                norTemp.push(1.0);
                norTemp.push(0.0);
                norTemp.push(0.0);

                norTemp.push(0.0);
                norTemp.push(1.0);
                norTemp.push(0.0);
                norTemp.push(0.0);

                norTemp.push(0.0);
                norTemp.push(1.0);
                norTemp.push(0.0);
                norTemp.push(0.0);

                norTemp.push(0.0);
                norTemp.push(1.0);
                norTemp.push(0.0);
                norTemp.push(0.0);

                // push color vertices - all lilac for now
                for (let r = 0; r < 16; r++) {
                    colTemp.push(.784, .635, .784, 1.0);
                }
                // colTemp.push(.784, .635, .784, 1.0);
                // colTemp.push(.784, .635, .784, 1.0);
                // colTemp.push(.784, .635, .784, 1.0);
                // colTemp.push(.784, .635, .784, 1.0);

                // colTemp.push(1.0, 0.0, 0.0, 1.0);
                // colTemp.push(1.0, 0.0, 0.0, 1.0);
                // colTemp.push(1.0, 0.0, 0.0, 1.0);
                // colTemp.push(1.0, 0.0, 0.0, 1.0);

                // colTemp.push(1.0, 0.0, 0.0, 1.0);
                // colTemp.push(1.0, 0.0, 0.0, 1.0);
                // colTemp.push(1.0, 0.0, 0.0, 1.0);
                // colTemp.push(1.0, 0.0, 0.0, 1.0);

                // colTemp.push(1.0, 0.0, 0.0, 1.0);
                // colTemp.push(1.0, 0.0, 0.0, 1.0);
                // colTemp.push(1.0, 0.0, 0.0, 1.0);
                // colTemp.push(1.0, 0.0, 0.0, 1.0);
            }
        }

        // loop through all faces and generate indices
        for (let i = 0; i < numFaces; i++) {
            idxTemp.push(i * 4);
            idxTemp.push(i * 4 + 1);
            idxTemp.push(i * 4 + 2);
            idxTemp.push(i * 4);
            idxTemp.push(i * 4 + 2);
            idxTemp.push(i * 4 + 3);
        }

        this.indices = new Uint32Array(idxTemp);
        this.normals = new Float32Array(norTemp);
        this.positions = new Float32Array(posTemp);
        this.colors = new Float32Array(colTemp);

        this.generateIdx();
        this.generatePos();
        this.generateNor();
        this.generateCol();

        this.count = this.indices.length;
        console.log(this.count);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
        gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
        gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufCol);
        gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);

        console.log(`Created Terrain`);
    }
}

export default Terrain;