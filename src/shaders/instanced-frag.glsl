#version 300 es
precision highp float;

uniform vec3 u_DistFromStart;
in vec4 fs_Col;
in vec4 fs_Pos;

out vec4 out_Col;

void main()
{
    // for falloff: 
    // float dist = 1.0 - (length(fs_Pos.xyz) * 2.0);
    // out_Col = vec4(dist) * fs_Col;
    // sample y position on a sine curve
    vec4 inverse = vec4(vec3(vec4(1.0) - fs_Col), 1.0);
    float mixVal = sin(fs_Pos.y * 20.0);
    float ratio = 1.0 - length(u_DistFromStart) / 1000.0; 
    vec4 fullColor = mix(inverse, fs_Col, 1.0 - mixVal);    
    vec4 diffuseColor = vec4(vec3(vec4(1.0) - (fullColor * ratio)), 1.0);
    out_Col = diffuseColor;

}
