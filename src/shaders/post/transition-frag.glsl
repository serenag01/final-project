#version 300 es
precision highp float;
// transition.frag.glsl:
// A fragment shader used for post-processing that simply reads the
// image produced in the first render pass by the surface shader
in vec2 fs_UV;
out vec4 out_Col;
uniform sampler2D u_RenderedTexture;
void main()
{
     out_Col = vec4(vec3(1.0) - texture(u_RenderedTexture, fs_UV).rgb, 1.0);
    // test to see if this is working
    //out_Col = vec3(1.0, 0.0, 1.0);
}