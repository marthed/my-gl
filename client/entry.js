import "./styles.css";
import { getTextResource } from "./utils/loadingUtils";
import { mat4, glMatrix } from "./utils/gl-matrix";
import pyramid from './pyramid';

const canvas = document.getElementById("glCanvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const gl = canvas.getContext("webgl");

const { pyramidSide1, pyramidSide2 } = pyramid;

const vertecies = [...pyramidSide1.positions, ...pyramidSide2.positions];
const vertexColors = [...pyramidSide1.colors, ...pyramidSide2.colors];


console.log('vertecies: ', vertecies);
const drawLoop = function() {
  gl.clearColor(0, 0, 0, 1.0);
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);

  // Draw Arrays: GLenum, start, size
  // GLenums:
  // 1. POINTS: Draw a single point
  // 2. LINE_STRIP: Draw a line to the next vertex
  // 3. LINE_LOOP: Same as line-strip, but connects last to first
  // 4. LINES: Draws a line between a pair of vertecies 
  // 5. TRIANGLE_STRIP
  // 6. TRIANGLE_FAN
  // 7. TRIANGLES: Draw a triangle between 3 vertecies

  const start = 0;
  const count = 3;
  //gl.drawArrays(gl.TRIANGLES, start, count);
  //gl.drawArrays(gl.LINE_STRIP, 0, 2);
  gl.drawArrays(gl.TRIANGLES, start, count);

  requestAnimationFrame(drawLoop);
};

function setupProgram(shader1, shader2) {
  const program = gl.createProgram();
  gl.attachShader(program, shader1);
  gl.attachShader(program, shader2);
  //Linking a vertex shader and a fragment shader into a single program makes sure that both programs reference the same global variables.
  gl.linkProgram(program);
  const programIsLinked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (programIsLinked) {
    gl.useProgram(program);
    return program;
  } else {
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }
}

function createShader(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const shaderHasCompiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (shaderHasCompiled) {
    return shader;
  }
  console.log(`ERROR creating shader of type ${source}`);
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  throw new Error("Failed creating a shader. Did not compile");
}

function checkBrowserSupportForGL() {
  if (!gl) {
    alert("WEBGL not supported.");
    throw new Error("WebGL is not supported, falling back on e");
  }
}

function setupPositionBuffer(program, positions, attribute) {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  connectBufferToProgram(program, attribute);
}

function setupColorBuffer(program, colors, attribute) {
  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  connectBufferToProgram(program, attribute);
}

function connectBufferToProgram(program, attribute) {
  const attributeLocation = gl.getAttribLocation(
    program,
    attribute
  );
  // Tell webGL how to take data from the buffer and supply it to the
  // attribute in the shader;
  gl.enableVertexAttribArray(attributeLocation);

    const size = 3; // 3 components per iteration
    const type = gl.FLOAT; // The data is 32bit floats
    const normalize = false; // Don't normailze the data
    const stride = 0; // 0 = move forward size * sizeOf(type) each iteration to get next position
    const offset = 0; // start at the begining of the buffer

  gl.vertexAttribPointer(
    attributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );
}

function setupModelMatrix(program) {
  const uniformModelMatrixLocation = gl.getUniformLocation(program, 'u_modelMatrix');
  const uniformModelMatrix = new Float32Array(16);
  mat4.identity(uniformModelMatrix);
  gl.uniformMatrix4fv(uniformModelMatrixLocation, gl.FALSE, uniformModelMatrix);
}

function setupViewMatrix(program) {
  const uniformViewMatrixLocation = gl.getUniformLocation(program, 'u_viewMatrix');
  const uniformViewMatrix = new Float32Array(16);
  mat4.lookAt(uniformViewMatrix, [0, 0, 0.1], [0, 0, 0], [0, 1, 0]);
  console.log('uniformViewMatrix: ', uniformViewMatrix);
  gl.uniformMatrix4fv(uniformViewMatrixLocation, gl.FALSE, uniformViewMatrix);
}

function setupProjMatrix(program) {
  const uniformProjMatrixLocation = gl.getUniformLocation(program, 'u_projMatrix');
  const uniformProjMatrix = new Float32Array(16);
  mat4.perspective(uniformProjMatrix, glMatrix.toRadian(45), (canvas.width / canvas.height), 1, 1000);
  console.log('uniformProjMatrix: ', uniformProjMatrix);
  gl.uniformMatrix4fv(uniformProjMatrix, gl.FALSE, uniformProjMatrixLocation);
}

function setupMatricies(program) {
  setupModelMatrix(program);
  setupViewMatrix(program);
  setupProjMatrix(program);
}

async function main() {
  try {
    checkBrowserSupportForGL();
    const vertexShaderSource = await getTextResource(
      "./shaders/shader.vs.glsl"
    );
    const fragmentShaderSource = await getTextResource(
      "./shaders/shader.fs.glsl"
    );
    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );
    const program = setupProgram(vertexShader, fragmentShader);
    setupPositionBuffer(program, vertecies, 'a_vertPosition');
    setupColorBuffer(program, vertexColors, 'a_color');
    setupMatricies(program);
    drawLoop();
  } catch (e) {
    console.log(e);
  }
}

main();
