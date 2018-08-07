
window.addEventListener('keydown',function(k){
  switch(k.code){
    case "KeyA": player1.movingLeft = true;
      break;
    case "KeyW": player1.movingUp = true;
      break;
    case "KeyD": player1.movingRight = true;
      break;
    case "KeyS": player1.movingDown = true;
      break;
  }
})

window.addEventListener('keyup',function(k){
  switch(k.code){
    case "KeyA": player1.movingLeft = false;
      break;
    case "KeyW": player1.movingUp = false;
      break;
    case "KeyD": player1.movingRight = false;
      break;
    case "KeyS": player1.movingDown = false;
      break;
  }
})

window.addEventListener('mousedown',function(){
  player1.firing = true;
})

window.addEventListener('mouseup',function(){
  player1.firing = false;
})
window.addEventListener('mousemove',function(k){
  mouseX = k.clientX;
  mouseY = k.clientY;

})
