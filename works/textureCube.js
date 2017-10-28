var vertexShaderText =
[
  'precision mediump float;',
  '',
  'attribute vec3 vertPosition;',
  'attribute vec2 vertTexCoord;',
  'varying vec2 fragTexCoord;',
  'uniform mat4 mWorld;',
  'uniform mat4 mView;',
  'uniform mat4 mProj;',
  'void main()',
  '{',
  'fragTexCoord = vertTexCoord;',
  'gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
  '}'
].join('\n');

var fragmentShaderText =
[
  'precision mediump float;',
  '',
  'varying vec2 fragTexCoord;',
  'uniform sampler2D sampler;',
  'void main()',
  '{',
  'gl_FragColor = texture2D(sampler, fragTexCoord);',
  '}'
].join('\n');
  
var initDemo = function () {
  console.log('This is working');

  var canvas = document.getElementById('glCanvas');
  var gl = canvas.getContext('webgl');

  if (!gl){
    console.log('WebGL is not supported, falling back on e');
    gl = canvas.getContext('experimental-webgl');
  }
  if (!gl) {
    alert('Your browser doesnt support WebGL');
  }

  gl.clearColor(0.75, 0.85, 0.8, 1.0); // set color of paint
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
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

  var boxVerticies = [
    // X, Y            U, V
    // Top
    -1.0, 1.0, -1.0,   0, 0,
    -1.0, 1.0, 1.0,    0, 1,
    1.0, 1.0, 1.0,     1, 1,
    1.0, 1.0, -1.0,    1, 0,

    // Left
    -1.0, 1.0, 1.0,    1, 1,
    -1.0, -1.0, 1.0,   0, 1,
    -1.0, -1.0, -1.0,  0, 0,
    -1.0, 1.0, -1.0,   1, 0,

    // Right
    1.0, 1.0, 1.0,     1, 1,
    1.0, -1.0, 1.0,    0, 1,
    1.0, -1.0, -1.0,   0, 0,
    1.0, 1.0, -1.0,    1, 0,

    // Front
    1.0, 1.0, 1.0,     1, 1,
    1.0, -1.0, 1.0,    1, 0,
    -1.0, -1.0, 1.0,   0, 0,
    -1.0, 1.0, 1.0,    0, 1,

    // Back
    1.0, 1.0, -1.0,    1, 1,
    1.0, -1.0, -1.0,   1, 0,
    -1.0, -1.0, -1.0,  0, 0,
    -1.0, 1.0, -1.0,   0, 1,

    // Bottom
    -1.0, -1.0, -1.0,   0, 0,
    -1.0, -1.0, 1.0,    0, 1,
    1.0, -1.0, 1.0,     1, 1,
    1.0, -1.0, -1.0,    1, 0
  ];

  //----------------------------
  // Indicies setup (create triangles)

  var boxIndicies = [
    // Top
    0, 1, 2,
    0, 2, 3,

    // Left
    5, 4, 6,
    6, 4, 7,

    // Right
    8, 9, 10,
    8, 10, 11,

    // Front
    13, 12, 14,
    15, 14, 12,

    // Back
    16, 17, 18,
    16, 18, 19,

    // Bottom
    21, 20, 22,
    22, 20, 23
  ];

  //-----------------------
  // Buffers setup
  var boxVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVerticies), gl.STATIC_DRAW);

  var boxIndexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndicies), gl.STATIC_DRAW);

  //---------------------
  // Attributes setup
  var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
  var texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
  gl.vertexAttribPointer(
    positionAttribLocation,// Attribute Location
    3,// Number of elements in each attribute
    gl.FLOAT, // Type of elements
    gl.FALSE, // Normalized
    5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
    0 // Offset from the beginning of a single vertex to this attribute
  );

  gl.vertexAttribPointer(
    texCoordAttribLocation,// Attribute Location
    2,// Number of elements in each attribute
    gl.FLOAT, // Type of elements
    gl.FALSE, // Normalized
    5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
    3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
  );

  //--------------------------
  // Tell openGL state machine which program is active and enable attributes
  
  gl.enableVertexAttribArray(positionAttribLocation);
  gl.enableVertexAttribArray(texCoordAttribLocation);

  //------------------------------
  // Create texture
  var boxTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, boxTexture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById('crate-img'));
  
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
  mat4.lookAt(viewMatrix, [0, 0, -10], [0, 0, 0], [0, 1, 0]);
  mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);

  gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix); // Second argument: transpose matrix
  gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
  gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

  //-----------------
  // Variables for rendering
  var xRotationMatrix = new Float32Array(16);
  var yRotationMatrix = new Float32Array(16);

  var identityMatrix = new Float32Array(16);
  mat4.identity(identityMatrix);
  var angle = 0; 

  //------------------
  // Main render loop
  
  var loop = function () {
    angle = performance.now() / 1000 / 6 * 2 * Math.PI; 
    mat4.rotate(xRotationMatrix, identityMatrix, angle, [1, 0, 0]);
    mat4.rotate(yRotationMatrix, identityMatrix, angle / 4, [0, 1, 0]);
    mat4.mul(worldMatrix, xRotationMatrix, yRotationMatrix);
    
    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    gl.bindTexture(gl.TEXTURE_2D, boxTexture);
    gl.activeTexture(gl.TEXTURE0);

    gl.drawElements(gl.TRIANGLES, boxIndicies.length, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(loop); // Whenever screen is ready to draw a new image, call this function
  };
  requestAnimationFrame(loop); // Whenever screen is ready to draw a new image, call this function
  
 
};