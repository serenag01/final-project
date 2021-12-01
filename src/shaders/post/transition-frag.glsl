#version 300 es
precision highp float;
// transition.frag.glsl:
// A fragment shader used for post-processing that simply reads the
// image produced in the first render pass by the surface shader

// blur adapted from: https://learnopengl.com/Advanced-OpenGL/Framebuffers
in vec2 fs_UV;
uniform float u_Time;
uniform int u_TransitionType;

out vec4 out_Col;
uniform sampler2D u_RenderedTexture;
const vec2 pixel = vec2(0.0, 0.0);
const float offset = 1.0 / 300.0;
const vec2 offsets[9] = vec2[] (vec2(-offset, offset), // top-left
  vec2(0.0f, offset), // top-center
  vec2(offset, offset), // top-right
  vec2(-offset, 0.0f),   // center-left
  vec2(0.0f, 0.0f),   // center-center
  vec2(offset, 0.0f),   // center-right
  vec2(-offset, -offset), // bottom-left
  vec2(0.0f, -offset), // bottom-center
  vec2(offset, -offset)  // bottom-right    
  );


float rand(vec2 uv) {
  return fract(sin(u_Time / 100.0 * dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec3 col = vec3(0.0);
  if (u_TransitionType == 1) {

  // noise
  vec4 diffuseColor = vec4(texture(u_RenderedTexture, fs_UV).rgb, 1.0);
  vec3 noise = vec3(rand(fs_UV));
  float sinVal = 0.5 * (sin(u_Time / 100.0) + 1.0);
  col = noise * (1.0 - sinVal) + vec3(diffuseColor * sinVal);

  } else if (u_TransitionType == 2) {

  // blur
  float x = sin(u_Time / 50.0);
  float y = 2.0 * x;
  float kernel[9] = float[](
    (1.0 - x) / 16.0, (2.0 - y) / 16.0, (1.0 - x) / 16.0,
    (2.0 - y) / 16.0, (4.0 + (4.0 * (x + y))) / 16.0, (2.0 - y) / 16.0,
    (1.0 - x) / 16.0, (2.0 - y) / 16.0, (1.0 - x) / 16.0 
  );

  vec3 sampleTex[9];
  for(int i = 0; i < 9; i++) {
    sampleTex[i] = vec3(texture(u_RenderedTexture, fs_UV + offsets[i]));
  }
  col = vec3(0.0);
  for(int i = 0; i < 9; i++)
    col += sampleTex[i] * kernel[i];

  }
    out_Col = vec4(col, 1.0);
}