#version 300 es
precision highp float;

in vec4 fs_Col;
in vec4 fs_Pos;
in vec4 fs_Nor;

out vec4 out_Col;

void main()
{
    // for falloff: 
    // float dist = 1.0 - (length(fs_Pos.xyz) * 2.0);
    // out_Col = vec4(dist) * fs_Col;
    // sample y position on a sine curve
    //vec4 inverse = vec4(vec3(vec4(1.0) - fs_Col), 1.0);
    //float mixVal = sin(fs_Pos.y * 20.0);
    //out_Col = fs_Col;//mix(inverse, fs_Col, 1.0 - mixVal);

    vec4 diffuseColor = fs_Col;

    // Calculate the diffuse term for Lambert shading

    vec4 fs_LightVec = vec4(10.0, 10.0, 10.0, 1.0);
    float diffuseTerm = dot(normalize(fs_Nor), normalize(fs_LightVec));
    // Avoid negative lighting values
    diffuseTerm = clamp(diffuseTerm, 0.15, 1.0);

    float ambientTerm = 0.2;

    float lightIntensity = diffuseTerm + ambientTerm;   //Add a small float value to the color multiplier
                                                        //to simulate ambient lighting. This ensures that faces that are not
                                                        //lit by our point light are not completely black.

    // Compute final shaded color
    out_Col = vec4(diffuseColor.rgb * lightIntensity, diffuseColor.a);

}
