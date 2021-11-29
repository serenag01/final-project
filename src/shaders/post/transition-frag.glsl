#version 300 es
precision highp float;

// transition.frag.glsl:
// A fragment shader used for post-processing that simply reads the
// image produced in the first render pass by the surface shader
// and outputs it to the frame buffer


in vec2 fs_UV;

out vec3 out_Col;

uniform sampler2D u_RenderedTexture;

void main()
{
    out_Col = texture(u_RenderedTexture, fs_UV).rgb;
    // test to see if this is working
   // out_Col = vec3(fs_UV.x, fs_UV.y, 1.0);
   out_Col  = vec3(1.0, 1.0, 0.0);
}
