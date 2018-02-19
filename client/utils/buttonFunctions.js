import { loadResources } from './loadingUtils';

export const setUpButton = (buttonID, runDemo, reqID) => {
    document.getElementById(buttonID).onclick = async () => {
        console.log('Clicked: ', buttonID);
        if (window.requestAnimationFrame) window.cancelAnimationFrame(reqID);
        const {
          vertexShaderText,
          fragmentShaderText,
          model,
          texture } = await loadResources(
          '/shaders/shader.vs.glsl',
          '/shaders/shader.fs.glsl',
          '/models/Susan.json',
          '/textures/SusanTexture.png');
      runDemo(vertexShaderText, fragmentShaderText, texture, model);
  };
};