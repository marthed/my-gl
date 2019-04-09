
//precision mediump float;

attribute vec2 vertPosition;
//attribute vec2 vertTexCoord;
//attribute vec3 vertNormal;

//varying vec2 fragTexCoord;
//varying vec3 fragNormal;

// uniform mat4 mWorld;
// uniform mat4 mView;
// uniform mat4 mProj;
void main()
{
  //fragTexCoord = vertTexCoord;
  //fragNormal = (mWorld * vec4(vertNormal, 0.0)).xyz;
  gl_Position = vec4(vertPosition, 1.0, 1.0);
  gl_PointSize = 2.0;
}