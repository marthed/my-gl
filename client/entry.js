import "./styles.css";
import { getTextResource } from "./utils/loadingUtils";

const canvas = document.getElementById("glCanvas");
const gl = canvas.getContext("webgl");

const drawLoop = function() {
  gl.clearColor(0.75, 0.85, 0.8, 1.0);
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.POINTS, 0, 10);

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
  }
  else {
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

const positions = [
  0, 0, 0.3,
  0, 0.3, 0.3, 
  0.7, 0.2, 1
]

async function main() {
  try {
    checkBrowserSupportForGL();
    const vertexShaderSource = await getTextResource('./shaders/shader.vs.glsl');
    const fragmentShaderSource = await getTextResource('./shaders/shader.fs.glsl');
    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource)
    const program = setupProgram(vertexShader, fragmentShader);

    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    



    drawLoop();
  } catch (e) {
    console.log(e);
  }
}

main();

