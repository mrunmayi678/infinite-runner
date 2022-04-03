var PLAY = 1;
var END = 0;
var gameState = PLAY;
var bg;
var bgImage;

var player, player_running,player_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  player_running = loadAnimation("r1.png","r2.png","r3.png","r4.png","r5.png","r6.png","r7.png","r8.png");
  player_collided = loadAnimation("rd.png");
  bgImage = loadImage("bg.png")
  groundImage = loadImage("race.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("h1.png");
  obstacle2 = loadImage("h2.png");
  obstacle3 = loadImage("h3.png");
  obstacle4 = loadImage("h4.png");
  obstacle5 = loadImage("h2.png");
  obstacle6 = loadImage("h3.png");
  
  restartImg = loadImage("res.png")
  gameOverImg = loadImage("go.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);

  var message = "This is a message";
 console.log(message)
  bg = createSprite(300,130,600,200);
  player = createSprite(50,160,20,50);
  player.addAnimation("running", player_running);
  player.addAnimation("collided", player_collided);
  bg.addImage("bg",bgImage)
  bg.scale = .7

  player.scale = 0.2;
  
  ground = createSprite(200,300,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.4;
  restart.scale = 0.08;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  player.setCollider("rectangle",0,0,100,300);
  //trex.debug = true
  
  score = 0;
  
}

function draw() {
  
  background("white");
  //displaying score
  fill("black")
  text("Score: "+ score, 500,10);
  text("Athletic Runner Infinite",100,10);
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(frameRate()/30);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    player.depth = ground.depth+1
    
    //jump when the space key is pressed
    if(keyDown("space")&& player.y >= 130) {
        player.velocityY = -8;
        jumpSound.play();
    }
    
    //add gravity
    player.velocityY =player.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(player)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      player.changeAnimation("collided", player_collided);
    
     player.x = player.x+5;
     player.y = player.y + 5
  
     
      ground.velocityX = 0;
      player.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop trex from falling down
  player.collide(invisibleGround);
  
  if(mousePressedOver(restart)&&gameState === END) {
      gameState = PLAY
     obstaclesGroup.setLifetimeEach(0);
    cloudsGroup.setLifetimeEach(0);
    score = 0;
    player.x = 50;
    player.y = 160;
     player.changeAnimation("running", player_running);

    }


  drawSprites();
}

function reset(){
  

}


function spawnObstacles(){
 if (frameCount % 50 === 0){
   var obstacle = createSprite(600,170,10,40);
   obstacle.velocityX = -(6 + score/50);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.1;
    obstacle.lifetime = 300;
   //obstacle.debug = true
   obstacle.setCollider("rectangle",0,0,200,400)
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = player.depth;
    player.depth = player.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

