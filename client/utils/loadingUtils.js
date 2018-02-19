var axios = require('axios');

async function getTextResource(url) {
  return axios.get(url)
    .then(res => res.data)
    .catch(error => error);
};

async function getImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(error);
    image.src = url;
  });
};

async function getJSONResource(url) {
  return axios.get(url)
    .then(res => res.data)
    .catch(error => error);
};

var loadImage = function (url, callback) {
  var image = new Image();
  image.onload = function () {
    callback(null, image);
  };
  image.src = url;
}

module.exports = {
  getTextResource,
  getImage,
  getJSONResource,
};