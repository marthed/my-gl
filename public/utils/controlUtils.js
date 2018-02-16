
document.onkeydown = handleKeyDown;

function handleKeyDown(event) {

  //console.log(event.keyCode);

  if (event.keyCode == 37) {
      //Left Arrow Key
     console.log('left');
     cameraPos[0] -= 1;
  } else if (event.keyCode == 38) {
      //Up Arrow Key
      console.log('up');
      cameraPos[1] += 1;
  } else if (event.keyCode == 39) {
      //Right Arrow Key
      console.log('right');
      cameraPos[0] += 1;
    } else if (event.keyCode == 40) {
      //Down Arrow Key
      console.log('down');
      cameraPos[1] -= 1;
    } else if (event.keyCode == 87) {
       console.log('W');
       cameraPos[2] += 1;
    } else if (event.keyCode == 83) {
        console.log('S');
        cameraPos[2] -= 1;
    } else if (event.keyCode == 65) {
        console.log('A');
        cameraPos[0] += 1;
      } else if (event.keyCode == 68) {
        console.log('D');
        cameraPos[0] -= 1;
      }
    console.log('cameraPos', cameraPos);
    
}