//creating variables
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOverImg, restartImg
var jumpSound, checkPointSound, dieSound

//creating global scope variables
function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")

  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}
//function setup
function setup() {
  createCanvas(windowWidth, windowHeight);

  //trex setup
  trex = createSprite(50, windowHeight - 20, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;

  //ground setup
  ground = createSprite(windowWidth / 2, windowHeight - 20, windowWidth, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

  //game over setup
  gameOver = createSprite(windowWidth / 2, windowHeight / 2);
  gameOver.addImage(gameOverImg);

  //restart setup
  restart = createSprite(windowWidth / 2, windowHeight / 1.8);
  restart.addImage(restartImg);

  //scaling image size
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  //to make the trex run on the ground
  invisibleGround = createSprite(windowWidth / 2, windowHeight - 10, windowWidth, 10);
  invisibleGround.visible = false;

  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  console.log("Hello" + 5);

  //first, indicates shape | second, indicates x offset | third, indicates y offset | the fourth indicates the size.(if circle, radius)
  trex.setCollider("rectangle", 0, 0, 90, 90);
  trex.debug = false;
  //setting score to 0
  score = 0;

}

function draw() {

  //set background
  background("white");
  //displaying score
  textSize(15);
  text("Score: " + score, windowWidth - 100, windowHeight / 10);

  //process during the game
  if (gameState === PLAY) {
    gameOver.visible = false;
    restart.visible = false;
    //move the ground
    ground.velocityX = -8;
    //scoring
    score = score + Math.round(frameRate() / 60);
    trex.changeAnimation("running", trex_running);

    //creating infinite game
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }


    //check point sound when reaching 100 
    if (score % 100 === 0 && score > 0) {
      checkPointSound.play();
    }

    //jump when the space key is pressed
    if ((touches.length > 0 || keyDown("space")) && trex.y >= windowHeight - 50) {
      trex.velocityY = -12;
      jumpSound.play();
      touches=[];
    }

    //add gravity
    trex.velocityY = trex.velocityY + 0.8

    //spawn the clouds
    spawnClouds();

    //spawn obstacles on the ground
    spawnObstacles();

    //if trex touching obstacle, stop game
    if (obstaclesGroup.isTouching(trex)) {
      gameState = END;
      dieSound.play();
    }
  } else if (gameState === END) {

    //press to restart game again
    if (mousePressedOver(restart)) {
      console.log("Restart the Game!");
      reset();
    }

    console.log("hey")
    gameOver.visible = true;
    restart.visible = true;

    ground.velocityX = 0;
    trex.velocityY = 0

    //change the trex animation
    trex.changeAnimation("collided", trex_collided);

    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
  }


  //stop trex from falling down
  trex.collide(invisibleGround);



  drawSprites();
}

function spawnObstacles() {

  if (frameCount % 45 === 0) {

    var obstacle = createSprite(400, windowHeight - 35, 10, 40);
    obstacle.velocityX = -(6 + score / 200);

    //generate random obstacles
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }
    console.log(obstacle.width);
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;

    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    cloud = createSprite(600, 100, 40, 10);
    cloud.y = Math.round(random(10, 60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    //assign lifetime to the variable
    cloud.lifetime = 134;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //adding cloud to the group
    cloudsGroup.add(cloud);
  }
}

function reset() {
  gameState = PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  score = 0;
}