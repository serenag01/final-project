#version 300 es

// This is a fragment shader. If you've opened this file first, please
// open and read lambert.vert.glsl before reading on.
// Unlike the vertex shader, the fragment shader actually does compute
// the shading of geometry. For every pixel in your program's output
// screen, the fragment shader is run for every bit of geometry that
// particular pixel overlaps. By implicitly interpolating the position
// data passed into the fragment shader by the vertex shader, the fragment shader
// can compute what color to apply to its pixel based on things like vertex
// position, light position, and vertex color.
precision highp float;

uniform vec4 u_Color; // The color with which to render this instance of geometry.
uniform vec3 u_DistFromStart;
uniform float u_ForestRadius;

// These are the interpolated values out of the rasterizer, so you can't know
// their specific values without knowing the vertices that contributed to them
in vec4 fs_Nor;
in vec4 fs_LightVec;
in vec4 fs_Col;

out vec4 out_Col; // This is the final output color that you will see on your
                  // screen for the pixel that is currently being processed.
                //  out vec2 fs_UV;


void main()
{
    // Material base color (before shading)
        vec4 inverse  =vec4(1.0) - fs_Col;
        float ratio = 1.0 - length(u_DistFromStart) / u_ForestRadius; 
        vec4 diffuseColor = vec4(vec3(vec4(1.0) - (inverse * ratio)), 1.0);

        // Calculate the diffuse term for Lambert shading
        float diffuseTerm = dot(normalize(fs_Nor), normalize(fs_LightVec));
        vec4 lightVec2 = vec4(vec3(0.0), 1.0);
        diffuseTerm = mix(diffuseTerm, dot(normalize(fs_Nor), normalize(lightVec2)), .5);
        // Avoid negative lighting values
        diffuseTerm = clamp(diffuseTerm, 0.15, 1.0);

        float ambientTerm = 0.2;

        float lightIntensity = diffuseTerm + ambientTerm;   //Add a small float value to the color multiplier
                                                            //to simulate ambient lighting. This ensures that faces that are not
                                                            //lit by our point light are not completely black.

        // adjust light intensity so ground and sky turn white at the same time
        lightIntensity *= 2.75 - (ratio);
        lightIntensity = clamp(lightIntensity, 0.50, 1.2);
        // Compute final shaded color
        out_Col = vec4(diffuseColor.rgb * lightIntensity, diffuseColor.a);
}
