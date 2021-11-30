#version 300 es
precision highp float;
// transition.frag.glsl:
// A fragment shader used for post-processing that simply reads the
// image produced in the first render pass by the surface shader
in vec2 fs_UV;
uniform float u_Time;

out vec4 out_Col;
uniform sampler2D u_RenderedTexture;
const vec2 pixel = vec2(0.0, 0.0);

float rand(vec2 uv){
    return fract(sin(u_Time / 100.0 * dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
}

void main()
{
     vec4 diffuseColor = vec4( texture(u_RenderedTexture, fs_UV).rgb, 1.0);
    // test to see if this is working
  vec3 noise = vec3(rand(fs_UV));
  out_Col = vec4(noise * sin(u_Time / 100.0) + vec3(diffuseColor * (1.0 - (sin(u_Time / 100.0)))), 1.0);
}