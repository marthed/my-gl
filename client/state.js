const canvas = document.getElementById("glCanvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const gl = canvas.getContext("webgl");

let player = {
  position: new Float32Array([0, 0, 0]),
  focus: new Float32Array([0, 0, 1]),
  up: new Float32Array([0, 1, 0])
}

let program;

let state = {
  canvas,
  gl,
  player,
  program,
}

console.log('IM IMPORTED!');

function setState(updates = {}) {
  state = { ...state, ...updates };
}

function getCurrentState() {
  return state;
}

module.exports = {
  getCurrentState,
  setState
}