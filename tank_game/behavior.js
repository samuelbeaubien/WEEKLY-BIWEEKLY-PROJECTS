////////////////////////////////////////
//ATTRIBUTES
////////////////////////////////////////

//constants
const playerHeight = 50;
const playerWidth = 50;
const playerSpeed = 3;
const projectileHeight = 10;
const projectileWidth = 10;
const projectileSpeed = 6;
const projectileCooldownTime = 700;
const wallColor = "grey";
const maxProjectileRebounds = 3;

//players
player1 = new player("blue", 30, 30);
player2 = new player("red", 1000-30-playerHeight, 600-30-playerWidth);
var projectiles = [];
var walls = [];
walls.push(new wall(0,0,1000,10));
walls.push(new wall(0,0,10,600));
walls.push(new wall(990,0,10,600));
walls.push(new wall(0,590,1000,10));

walls.push(new wall(150,100,50,400));
var mouseX = 0;
var mouseY = 0;

//gameboard object
//recall an object must be declared with : and ,
var entireGameboard = {
  canvas : document.getElementById('gameboardCanvas'),
  start : function(){
    this.context = this.canvas.getContext("2d");
    this.canvas.width = 1000;
    this.canvas.height = 600;
    this.interval = setInterval(updateGameboard, 20);
  },
  clear : function(){
    this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
  }
}

//get offset between mouse location and canvas location
var canvasLocation = document.getElementById('gameboardCanvas').getBoundingClientRect();
var canvasLocationX = canvasLocation.left;
var canvasLocationY = canvasLocation.top;


////////////////////////////////////////
//FUNCTIONS
////////////////////////////////////////

//startgame function
//starts the gameboard
//main loop
function startGame(){
  entireGameboard.start();
}

//constructor function for a player
//recall a constructor uses the equal sign
function player(color, x, y){
  this.x = x;
  this.y = y;
  this.height = playerHeight;
  this.width = playerWidth;
  this.speedX = 0;
  this.speedY = 0;
  this.canShoot = true;
  this.firing = false;
  this.movingUp = false;
  this.movingRight = false;
  this.movingDown = false;
  this.movingLeft = false;
  //updating places this object in the context
  //it paints them onto the context
  this.update = function(){
    this.wallCollisionCheck();
    this.move();
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedX = 0;
    this.speedY = 0;
    context = entireGameboard.context;
    context.fillStyle = color;
    context.fillRect(this.x, this.y, playerWidth, playerHeight);
  }
  this.move = function(){
    if(this.movingUp && this.movingLeft){
      this.speedX = -2.5;
      this.speedY = -2.5;
    }
    else if(this.movingDown && this.movingLeft){
      this.speedX = -2.5;
      this.speedY = 2.5;
    }
    else if(this.movingDown && this.movingRight){
      this.speedX = 2.5;
      this.speedY = 2.5;
    }
    else if(this.movingRight && this.movingUp){
      this.speedX = 2.5;
      this.speedY = -2.5;
    }
    else if(this.movingUp){
      this.speedY = -3;
    }
    else if(this.movingDown){
      this.speedY = 3;
    }
    else if(this.movingLeft){
      this.speedX = -3;
    }
    else if(this.movingRight){
      this.speedX = 3;
    }
  }
  this.wallCollisionCheck = function(){
    for(var i = 0; i<walls.length; i++){
      collisionCheck(this, walls[i],4);
    }
  }
}

function projectile(xFrom,yFrom, xTo, yTo){
  xFrom += 25;
  yFrom += 25;
  this.reboundsLeft = maxProjectileRebounds;
  this.height = projectileHeight;
  this.width = projectileWidth;
  this.x = xFrom;
  this.y = yFrom;
  this.speedX = (xTo-xFrom)/Math.sqrt((xTo-xFrom)*(xTo-xFrom)+(yTo-yFrom)*(yTo-yFrom))*projectileSpeed;
  this.speedY = (yTo-yFrom)/Math.sqrt((xTo-xFrom)*(xTo-xFrom)+(yTo-yFrom)*(yTo-yFrom))*projectileSpeed;
  this.x+=3*this.speedX;
  this.y+=3*this.speedY;
  this.update = function(){
    this.wallCollisionCheck();
    this.x += this.speedX;
    this.y += this.speedY;
    context = entireGameboard.context;
    context.fillStyle = "black";
    context.fillRect(this.x, this.y, projectileWidth, projectileHeight);
  }
  this.wallCollisionCheck = function(){
    for(var i = 0; i<walls.length; i++){
      var collision = collisionCheck(this, walls[i],7);
      console.log(collision);
      if(collision=="upCollision" || collision =="downCollision"){
        this.speedY *= -1;
        this.reboundsLeft--;
      }
      if(collision=="leftCollision" || collision == "rightCollision"){
        this.speedX *= -1;
        this.reboundsLeft--;
      }
    }
  }
}

function wall(x,y, width, height){
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.update = function(){
    context = entireGameboard.context;
    context.fillStyle = wallColor;
    context.fillRect(this.x, this.y, width, height);
  }
}

//get the mouse position relative to the canvas
function getMousePos(canvas) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: mouseX - rect.left,
      y: mouseY - rect.top
    };
}

//prevent the player from shooting super fast
function projectileCooldown(player){
  player.canShoot = false;
  setTimeout(function(){
    player.canShoot = true;
  }, projectileCooldownTime);
}

function projectileReboundDeletion(){
  for(var i = 0; i<projectiles.length; i++){
    if(projectiles[i].reboundsLeft<=0){
      console.log(projectiles);
      projectiles.splice(i, 1);
      console.log("projectile deleted");
      console.log(projectiles);
    }
  }
}

function shootProjectile(player){
  var location = getMousePos(entireGameboard.canvas);
  if(player.canShoot){
    projectiles.push(new projectile(player.x, player.y, location.x, location.y));
    projectileCooldown(player);
  }
}

function projectileCollisionCheck(){
  for(var i = 0; i<projectiles.length; i++){
    if (Math.abs(player2.x+playerWidth/2.0 - (projectiles[i].x+projectileWidth/2.0)) <= (playerWidth/2.0+projectileWidth/2.0)
      && Math.abs(player2.y+playerHeight/2.0 - (projectiles[i].y+projectileHeight/2.0)) <= (playerHeight/2.0+projectileHeight/2.0)) {
        console.log(player2.x, player2.y, projectiles[i].x, projectiles[i].y);
        console.log
      alert("hi");
      document.location.reload();
    }
  }
}

//clears board and updates players
function updateGameboard(){
  entireGameboard.clear();

  player1.update();
  player2.update();


  for(var i = 0; i<walls.length; i++){
    walls[i].update();
  }

  if(player1.firing){
    shootProjectile(player1);
  }

  for(var i = 0; i<projectiles.length; i++){
    projectiles[i].update();
  }
  projectileCollisionCheck();
  projectileReboundDeletion();

}


////////////////////////////////////////
//HELPER FUNCTIONS
////////////////////////////////////////


function collisionCheck(object1, object2, minimumSpacing){
    //the minimum distance is set to 5!! this is because the players go 2.5 by 2.5 in diagonal and
    //5 is greater than sqrt(2.5 squared + 2.5 squared) (pythagore)
    if(object1.x + object1.width < object2.x && object1.x + object1.width > object2.x - minimumSpacing &&
      ((object1.y + object1.height > object2.y && object1.y + object1.height < object2.y+object2.height)
      || (object1.y > object2.y && object1.y < object2.y + object2.height))){
      object1.movingRight = false;
      return "rightCollision";
    }
    else if(object1.x > object2.x +object2.width && object1.x < object2.x + object2.width + minimumSpacing &&
      ((object1.y + object1.height > object2.y && object1.y + object1.height < object2.y+object2.height)
      || (object1.y > object2.y && object1.y < object2.y + object2.height))){
        object1.movingLeft = false;
        return "leftCollision";
    }
    if(object1.y > object2.y + object2.height && object1.y < object2.y + object2.height + minimumSpacing &&
      ((object1.x + object1.width > object2.x && object1.x + playerWidth < object2.x+object2.width)
      || (object1.x > object2.x && object1.x < object2.x + object2.width))){
        object1.movingUp = false;
        return "upCollision";
    }
    else if(object1.y + object1.height < object2.y && object1.y + object1.height > object2.y - minimumSpacing &&
      ((object1.x + object1.width > object2.x && object1.x + playerWidth < object2.x+object2.width)
      || (object1.x > object2.x && object1.x < object2.x + object2.width))){
        object1.movingDown = false;
        return "downCollision";
  }
}


////////////////////////////////////////
//FUNCTION CALL STARTGAME
////////////////////////////////////////

startGame();
