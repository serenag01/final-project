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
void main()
{
   // if (abs(fs_UV.x * 1.0 - pixel.x) > 0.0 || abs(fs_UV.y * 1.0 - pixel.y) > 0.0) {
     if (true) {
        out_Col = vec4(1.0);
    }
     out_Col = vec4( texture(u_RenderedTexture, fs_UV).rgb, 1.0);
    // test to see if this is working
    out_Col = vec4(1.0, 0.0, 1.0, sin(u_Time / 100.0)) + vec4( texture(u_RenderedTexture, fs_UV).rgb, 1.0 - sin(u_Time / 100.0));
}