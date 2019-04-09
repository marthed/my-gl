import "./styles.css";
import { getTextResource } from "./utils/loadingUtils";

const canvas = document.getElementById("glCanvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const gl = canvas.getContext("webgl");

const floor = [-0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5];
const hej = [0.5, -0.5, -0.5, 1];

const testPositions = [...floor, ...hej];

console.log('testPositions: ', testPositions);
const drawLoop = function() {
  gl.clearColor(0, 0, 0, 1.0);
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

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
  gl.drawArrays(gl.POINTS, 0, 4);
  gl.drawArrays(gl.LINE_STRIP, 4, 2);

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

function setupPositionBuffer(positions) {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

}

function connectBufferToProgram(program) {
  const positionAttributeLocation = gl.getAttribLocation(
    program,
    "vertPosition"
  );
  // Tell webGL how to take data from the buffer and supply it to the
  // attribute in the shader;
  gl.enableVertexAttribArray(positionAttributeLocation);

  const size = 2; // 3 components per iteration
    const type = gl.FLOAT; // The data is 32bit floats
    const normalize = false; // Don't normailze the data
    const stride = 0; // 0 = move forward size * sizeOf(type) each iteration to get next position
    const offset = 0; // start at the begining of the buffer

  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

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
    setupPositionBuffer(testPositions);
    connectBufferToProgram(program);
    drawLoop();
  } catch (e) {
    console.log(e);
  }
}

main();
