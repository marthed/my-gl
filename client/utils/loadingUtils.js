var axios = require('axios');

// Load a text resource from a file over the network
var loadTextResource = function(url, callback) {
  var request = new XMLHttpRequest();
  request.open('GET', url + '?please-dont-cache='+Math.random(), true);
  request.onload = function () {
    if (request.status < 200 || request > 299) {
      callback('Error: HTTP Status ' + request.status + ' on resource ' + url);
    }
    else {
      console.log(request.responseText);
      callback(null, request.responseText);
    }
  };

  request.send();
}

// const loadTextResource = (url) => {
//   return axios.get(url);
// }

// const loadImage = (url) => {

// }

var loadImage = function (url, callback) {
  var image = new Image();
  image.onload = function () {
    callback(null, image);
  };
  image.src = url;
}

var loadJSONResource = function(url, callback) {
  loadTextResource(url, function(err, result) {
    if (err) {
      callback(err);
    }
    else {
      try {
        callback(null, JSON.parse(result));
      } catch (e) {
        callback(e);
      }
    }
  });
}

module.exports = {
  loadTextResource,
  loadImage,
  loadJSONResource
};