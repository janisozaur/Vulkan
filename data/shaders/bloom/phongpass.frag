#version 450

#extension GL_ARB_separate_shader_objects : enable
#extension GL_ARB_shading_language_420pack : enable

layout (binding = 1) uniform sampler2D colorMap;

layout (location = 0) in vec3 inNormal;
layout (location = 1) in vec2 inUV;
layout (location = 2) in vec3 inColor;
layout (location = 3) in vec3 inEyePos;
layout (location = 4) in vec3 inLightVec;

layout (location = 0) out vec4 outFragColor;

void main() 
{
	// No light calculations for glow color 
	// Use max. color channel value
	// to detect bright glow emitters
	if ((inColor.r >= 0.9) || (inColor.g >= 0.9) || (inColor.b >= 0.9)) 
	{
		outFragColor.rgb = inColor;
	}
	else
	{
		vec3 Eye = normalize(-inEyePos);
		vec3 Reflected = normalize(reflect(-inLightVec, inNormal)); 

		vec4 IDiffuse = vec4(inColor, 1.0) * max(dot(inNormal, inLightVec), 0.0);
		float specular = 0.25;
		vec4 ISpecular = vec4(0.5, 0.5, 0.5, 1.0) * pow(max(dot(Reflected, Eye), 0.0), 16.0) * specular; 
		outFragColor = IDiffuse + ISpecular; 
	}
}