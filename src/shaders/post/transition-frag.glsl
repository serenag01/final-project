#version 150
// transition.frag.glsl:
// A fragment shader used for post-processing that simply reads the
// image produced in the first render pass by the surface shader
// and outputs it to the frame buffer


in vec2 fs_UV;

out vec3 color;

uniform sampler2D u_RenderedTexture;

void main()
{
    // color = texture(u_RenderedTexture, fs_UV).rgb;
    // test to see if this is working
    color = vec3(1.0, 0.0, 1.0);
}
