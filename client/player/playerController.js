import { getCurrentState } from '../state';
import { vec3, mat4 } from '../utils/gl-matrix';

function degreeToRadian(degree) {
  return degree * (Math.PI/180)
}

function getBackwardVector(matrix) {
  const x = matrix[8];
  const y = matrix[9];
  const z = matrix[10];
  return [x, y, z];
}

function getForwardVector(matrix) {
  const x = -1 * matrix[8];
  const y = -1 * matrix[9];
  const z = -1 * matrix[10];
  return [x, y, z];
}

function forward() {
  const { program, gl } = getCurrentState();
  const uniformModelMatrixLocation = gl.getUniformLocation(program, 'u_modelMatrix');
  const currentUniformValue = gl.getUniform(program, uniformModelMatrixLocation);
  const direction = vec3.normalize([0, 0, 0], getForwardVector(currentUniformValue));
  const uniformModelMatrix = mat4.translate(new Float32Array(16), currentUniformValue, direction);
  gl.uniformMatrix4fv(uniformModelMatrixLocation, gl.FALSE, uniformModelMatrix);
}

function backward() {
  const { program, gl } = getCurrentState();
  const uniformModelMatrixLocation = gl.getUniformLocation(program, 'u_modelMatrix');
  const currentUniformValue = gl.getUniform(program, uniformModelMatrixLocation);
  const direction = vec3.normalize([0, 0, 0], getBackwardVector(currentUniformValue));

  const uniformModelMatrix = mat4.translate(new Float32Array(16), currentUniformValue, direction);
  gl.uniformMatrix4fv(uniformModelMatrixLocation, gl.FALSE, uniformModelMatrix);
}

function rotateLeft() {
  const { program, gl } = getCurrentState();
  const uniformModelMatrixLocation = gl.getUniformLocation(program, 'u_modelMatrix');
  const uniformModelMatrix = gl.getUniform(program, uniformModelMatrixLocation);
  console.log('uniformModelMatrix: ', uniformModelMatrix);
  const radian = degreeToRadian(-1);
  mat4.rotate(uniformModelMatrix, uniformModelMatrix, radian, [0, 1, 0]);
  gl.uniformMatrix4fv(uniformModelMatrixLocation, gl.FALSE, uniformModelMatrix);

}

function rotateRight() {
  const { program, gl } = getCurrentState();
  const uniformModelMatrixLocation = gl.getUniformLocation(program, 'u_modelMatrix');
  const uniformModelMatrix = gl.getUniform(program, uniformModelMatrixLocation);
  const radian = degreeToRadian(1);
  mat4.rotate(uniformModelMatrix, uniformModelMatrix, radian, [0, 1, 0]);
  gl.uniformMatrix4fv(uniformModelMatrixLocation, gl.FALSE, uniformModelMatrix);
}


document.addEventListener('keydown', evt => {
  const key = evt.key;
  switch (key) {
    case 'ArrowUp':
      return forward();
    case 'ArrowDown':
      return backward();
    case 'ArrowLeft':
      return rotateLeft();
    case 'ArrowRight':
      return rotateRight();
    default:
      break; 
  }
});