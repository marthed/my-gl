
//precision mediump float;

attribute vec4 a_vertPosition;
attribute vec4 a_color;
//attribute vec2 vertTexCoord;
//attribute vec3 vertNormal;

//varying vec2 fragTexCoord;
//varying vec3 fragNormal;

varying vec4 v_color;

uniform mat4 u_modelMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_projMatrix;

// uniform mat4 mWorld;
// uniform mat4 mView;
// uniform mat4 mProj;
void main()
{
  //fragTexCoord = vertTexCoord;
  //fragNormal = (mWorld * vec4(vertNormal, 0.0)).xyz;
  gl_Position = u_projMatrix * u_viewMatrix * u_modelMatrix * a_vertPosition;
  v_color = a_color; // Pass color to fragment shader;
}