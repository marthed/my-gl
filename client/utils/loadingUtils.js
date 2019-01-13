const axios = require('axios');

function getTextResource(url) {
  return axios.get(url)
    .then(res => res.data)
    .catch(error => error);
};

function getImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(error);
    image.src = url;
  });
};

function getJSONResource(url) {
  return axios.get(url)
    .then(res => res.data)
    .catch(error => error);
};

async function loadResources(vsUrl, fsUrl, modelURL, textureURL) {
  try {
    const vertexShaderText = await getTextResource(vsUrl);
    const fragmentShaderText = await getTextResource(fsUrl);
    const model = await getJSONResource(modelURL);
    const texture = await getImage(textureURL);
    return { vertexShaderText, fragmentShaderText, model, texture };
  } catch (error) {
    console.log('Error: ', error);
    return Promise.reject(error);
  }
}

module.exports = {
  loadResources,
  getTextResource
};