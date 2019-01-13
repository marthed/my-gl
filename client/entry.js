import "./styles.css";
import { getTextResource } from "./utils/loadingUtils";

const canvas = document.getElementById("glCanvas");
const gl = canvas.getContext("webgl");

const drawLoop = function() {
  gl.clearColor(0.75, 0.85, 0.8, 1.0);
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.POINTS, 5, 8, 4);

  requestAnimationFrame(drawLoop);
};

function setupProgram(shader) {
  const program = gl.createProgram();
  gl.attachShader(program, shader);
  //Linking a vertex shader and a fragment shader into a single program makes sure that both programs reference the same global variables.
  //gl.linkProgram();
  gl.useProgram(program);
}

function createShader(type, source) {
  const shader = gl.createShader(type);
  console.log('shader: ', shader);
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

async function main() {
  try {
    checkBrowserSupportForGL();
    const vertexShaderSource = await getTextResource('./shaders/shader.vs.glsl');
    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource); // gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
    console.log('vertexShader: ', vertexShader);
    setupProgram(vertexShader);
    drawLoop();
  } catch (e) {
    console.log(e);
  }
}

main();

