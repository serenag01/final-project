#version 300 es
precision highp float;

uniform vec3 u_DistFromStart;
uniform float u_ForestRadius;
in vec4 fs_Col;
in vec4 fs_Pos;
in vec4 fs_Nor;

out vec4 out_Col;

void main()
{

    float ratio = 1.0 - (length(u_DistFromStart) / u_ForestRadius); 
    vec3 inverse = vec3(1.0) - vec3(fs_Col);
    vec4 diffuseColor = vec4(vec3(1.0) - vec3(inverse * ratio), 1.0);

    // Calculate the diffuse term for Lambert shading

    vec4 fs_LightVec = vec4(10.0, 10.0, 10.0, 1.0);
    float diffuseTerm = dot(normalize(fs_Nor), normalize(fs_LightVec));
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
