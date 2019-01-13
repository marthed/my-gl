import styles from './styles.css';
import { loadResources } from './utils/loadingUtils';
import { setUpShaders } from './utils/shaderUtils';
import { glMatrix, mat4 } from './utils/gl-matrix';

var reqID;

var runDemo = function (vertexShaderText, fragmentShaderText, susanImage, model) {

  var canvas = document.getElementById('glCanvas');
  var gl = canvas.getContext('webgl');

  if (!gl){
    console.log('WebGL is not supported, falling back on e');
    gl = canvas.getContext('experimental-webgl');
  }
  if (!gl) {
    alert('Your browser does not support WebGL');
  }

  gl.clearColor(0.75, 0.85, 0.8, 1.0); // set color of paint
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.frontFace(gl.CCW);
  gl.cullFace(gl.BACK);

  //--------------------
  // Create and compile shaders
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(vertexShader, vertexShaderText);
  gl.shaderSource(fragmentShader, fragmentShaderText);

  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
    console.error('ERROR compiling vertex shader', 
    gl.getShaderInfoLog(vertexShader))
    return;
  };

  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
    console.error('ERROR compiling fragment shader', 
    gl.getShaderInfoLog(fragmentShader))
    return;
  };

  //---------------------------------
  // Create the program

  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('ERROR linking program', gl.getProgramInfoLog(program));
    return;
  }
  gl.validateProgram(program); // Catch additional issues
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
    console.error('ERROR validating program', gl.getProgramInfoLog(program));
    return;
  }

  //---------------------------
  // Verticies setup
  var susanVerticies = model.meshes[0].vertices; 
  //----------------------------
  // Indicies setup (create triangles)
  var susanIndicies = [].concat.apply([], model.meshes[0].faces);
  //-----------------------
  // Texture coordinates setup
  var susanTexCoords = model.meshes[0].texturecoords[0];
  //---------------------
  // Normals setup
  var susanNormals = model.meshes[0].normals;

 
  // Buffers setup
  var susanPosVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, susanPosVertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(susanVerticies), gl.STATIC_DRAW);

  var susanTexCoordsVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, susanTexCoordsVertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(susanTexCoords), gl.STATIC_DRAW);
  
  var susanIndexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, susanIndexBufferObject);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(susanIndicies), gl.STATIC_DRAW);

  var susanNormalBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, susanNormalBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(susanNormals), gl.STATIC_DRAW)

  //---------------------
  // Attributes setup
  
  // Position attributes
  gl.bindBuffer(gl.ARRAY_BUFFER, susanPosVertexBufferObject);
  var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
  gl.vertexAttribPointer(
    positionAttribLocation,// Attribute Location
    3,// Number of elements in each attribute
    gl.FLOAT, // Type of elements
    gl.FALSE, // Normalized
    3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
    0 // Offset from the beginning of a single vertex to this attribute
  );
  gl.enableVertexAttribArray(positionAttribLocation);
  
  // Texture attributes
  gl.bindBuffer(gl.ARRAY_BUFFER, susanTexCoordsVertexBufferObject);  
  var texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');  
  gl.vertexAttribPointer(
    texCoordAttribLocation,// Attribute Location
    2,// Number of elements in each attribute
    gl.FLOAT, // Type of elements
    gl.FALSE, // Normalized
    2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
    0 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
  );
  gl.enableVertexAttribArray(texCoordAttribLocation);

  // Normal attributes
  gl.bindBuffer(gl.ARRAY_BUFFER, susanNormalBufferObject);  
  var normalAttribLocation = gl.getAttribLocation(program, 'vertNormal');  
  gl.vertexAttribPointer(
    normalAttribLocation,// Attribute Location
    3,// Number of elements in each attribute
    gl.FLOAT, // Type of elements
    gl.TRUE, // Normalized
    3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
    0 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
  );
  gl.enableVertexAttribArray(normalAttribLocation);

  //------------------------------
  // Create texture
  var susanTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, susanTexture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, susanImage);
  
  gl.bindTexture(gl.TEXTURE_2D, null); // Unbind textures after loading them

  gl.useProgram(program);
  

  //-----------------------
  // Setup graphics pipeline matrices
  var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
  var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
  var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');
  
  var worldMatrix = new Float32Array(16);
  var viewMatrix = new Float32Array(16);
  var projMatrix = new Float32Array(16);

  mat4.identity(worldMatrix);
  mat4.lookAt(viewMatrix, [0, 0, -7], [0, 0, 0], [0, 1, 0]);
  mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);

  gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix); // Second argument: transpose matrix
  gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
  gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
  
  //------------------------
  // Rotation variables
  var xRotationMatrix = new Float32Array(16);
  var yRotationMatrix = new Float32Array(16);
  var zRotationMatrix = new Float32Array(16);
  var identityMatrix = new Float32Array(16);


  var degreeToRadian = function(degree) {
    return degree * (Math.PI/180)
  }

  mat4.identity(identityMatrix);
  mat4.rotate(xRotationMatrix, identityMatrix, degreeToRadian(-90), [1, 0, 0]);
  mat4.rotate(yRotationMatrix, identityMatrix, 0, [0, 1, 0]);
  mat4.rotate(zRotationMatrix, identityMatrix, degreeToRadian(180), [0, 0, 1]);
  
  var angle = 0; 

  //--------------------
  // Setup graphics pipeline lighting variables
  gl.useProgram(program);
  var ambientUniformLocation = gl.getUniformLocation(program, 'ambientLightIntensity');
  var sunlightDirUniformLocation = gl.getUniformLocation(program, 'sun.direction');
  var sunlightIntensityUniformLocation = gl.getUniformLocation(program, 'sun.color');

  gl.uniform3f(ambientUniformLocation, 0.2, 0.2, 0.2);
  gl.uniform3f(sunlightDirUniformLocation, 3.0, 4.0, -2.0);
  gl.uniform3f(sunlightIntensityUniformLocation, 0.9, 0.9, 0.9);

  //------------------
  // Main render loop
  
  var loop = function () {
    angle = performance.now() / 1000 / 6 * 2 * Math.PI; 
    mat4.rotate(yRotationMatrix, identityMatrix, angle / 2, [0, 1, 0]);
    mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix, zRotationMatrix);
    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    gl.bindTexture(gl.TEXTURE_2D, susanTexture);
    gl.activeTexture(gl.TEXTURE0);

    gl.drawElements(gl.TRIANGLES, susanIndicies.length, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(loop); // Whenever screen is ready to draw a new image, call this function
  };
  reqID = requestAnimationFrame(loop); // Whenever screen is ready to draw a new image, call this function 
};

// window.onload = () => {
//   setUpButton('b1', runDemo, reqID);
// };
