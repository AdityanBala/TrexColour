var trex, trex_running, trexCollided, edges;
var groundImage;
var InvisGround;
var CloudImage,Clouds;
var CloudsGroup;
var Cactus1,Cactus2,Cactus3,Cactus4,Cactus5,Cactus6;
var CactusImage1,CactusImage2,CactusImage3,CactusImage4,CactusImage5,CactusImage6;
var CactusGroup;
var RandomNumber, RandomNumber2;
let Score = 0;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameOver,gameOverImage,Restart,restartImage
var Jump,Die,CheckPoint;
var BackGroundImage;

function preload(){
  trex_running = loadAnimation("trex_1.png","trex_2.png","trex_3.png");
  trexCollided = loadAnimation("trex_collided-1.png")
  
  CloudImage = loadImage("cloud-1.png");
  
  groundImage = loadImage("Ground3.png");
  
  CactusImage1 = loadImage("obstacle1-1.png");
  CactusImage2 = loadImage("obstacle2-1.png");
  CactusImage3 = loadImage("obstacle3-1.png");
  CactusImage4 = loadImage("obstacle4-1.png");
  CactusImage5 = loadImage("obstacle5.png");
  CactusImage6 = loadImage("obstacle6.png");
  
  gameOverImage = loadImage("gameOver-1.png");
  restartImage = loadImage("restart-1.png");
  
  Jump = loadSound("jump.mp3");
  Die = loadSound("die.mp3");
  CheckPoint = loadSound("checkPoint.mp3");
  
  BackGroundImage = loadImage("backgroundImg.png");
}

function setup(){
  
  createCanvas(windowWidth,windowHeight);
  
  // creating trex
  trex = createSprite(50,height - 70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("Collide", trexCollided);
  //trex.debug = true;
  trex.setCollider("circle",0,0,300);
  
  //adding scale and position to trex
  trex.scale = 0.1;
  trex.x = 50
  
  edges = createEdgeSprites();
  
  ground = createSprite(width/2,height-450,width,2);
  ground.addImage(groundImage);
  ground.x = width/2;
  ground.velocityX = -4;
  //ground.velocityX = -(4 + 1.5*Score/100);
  //ground.debug = true;
  
  InvisGround = createSprite(width/2,(height) - 50,width,2);
  InvisGround.visible = false;
  
  gameOver = createSprite(width/2,height/2);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 1;
  
  Restart = createSprite(width/2,(height/2) + 40);
  Restart.addImage(restartImage);
  Restart.scale = 0.08
  
  CloudsGroup = new Group();
  
  CactusGroup = new Group();
  
  trex.depth = ground.depth + 1;
}


function draw(){
  //set background color 
   
  background(BackGroundImage);
  //logging the y position of the trex
  //console.log(trex.y)
  
  textSize(20);
  stroke("darkblue")
  strokeWeight(2);
  text("Score:" + Score,width-150,height/8);
  
  // console.log(frameCount);
  //console.log(frameRate());
  
  if(gameState === PLAY){
    Restart.visible = false;
    gameOver.visible = false;
    ground.velocityX = -(4 + 1.5*Score/500);
    if(ground.x < 100){
      ground.x = ground.width/2;
    }
    
    //Score = Score + (Math.round(getFrameRate()/60))/4;
    
    // console.log(Math.round(getFrameRate()/57));
    
    console.log(frameRate());

    if(Score%100 === 0 && Score > 0){
      CheckPoint.play();
    }
    
    //jump when space key is pressed
    if((touches.length > 0 || (keyDown("space")) && trex.y >= height-81)){
      trex.velocityY = -12 ;
      Jump.play();
      touches = [];
    }

    trex.velocityY = trex.velocityY + 0.5;
    
    SpawnClouds();
  
    SpawnCactus();
    Score = Score + 1;
    
    if(CactusGroup.isTouching(trex)){
      gameState = END;
      //trex.velocityY = -12 ;
      Die.play();
    }
  }
  if(gameState === END){
    Restart.visible = true;
    gameOver.visible = true;
    
    Restart.depth = Clouds.depth + 1
    gameOver.depth = Clouds.depth + 1
    
    ground.velocityX = 0;
    trex.velocityY = 0;
    CactusGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);
    
    trex.changeAnimation("Collide",trexCollided);
    
    CloudsGroup.setLifetimeEach(-1); 
    CactusGroup.setLifetimeEach(-1);
    
    /*if(mousePressedOver(Restart)){
      reset();
    }*/

    if(touches.length > 0 || keyWentDown("space")){
      reset();
      touches = [];
    }
  }
  
  //stop trex from falling down
  trex.collide(InvisGround);
  
  // console.log(trex.y);
  
  drawSprites();
}

function SpawnClouds(){
  if(frameCount%120 === 0){  
    Clouds = createSprite(width + 100,height - 600,10,10);
    Clouds.addImage(CloudImage);
    
    var CloudsSize = Math.round(random(0.5,2))
    Clouds.scale = CloudsSize;

    Clouds.velocityX = -3;
    
    Clouds.y = Math.round(random(10,height - 150));
    //console.log(Math.round(random(1,100)));
    
    trex.depth = Clouds.depth + 1;
    //console.log(trex.depth);
    //console.log(Clouds.depth);
    
    Clouds.lifetime = width/Clouds.velocityX;
    CloudsGroup.add(Clouds);
    
    //Clouds.debug = true;
  }
}

function SpawnCactus(){
  if(frameCount%120 === 0){
    RandomNumber = Math.round(random(1,4));
    //RandomNumber2 = Math.round(random(-50,51));
    Cactus = createSprite(width,height-90,10,10);
    
    switch(RandomNumber){
      case 1: Cactus.addImage(CactusImage1);
              Cactus.scale = 0.5;
              console.log(Cactus.width);
              break; 
      case 2: Cactus.addImage(CactusImage2);
              Cactus.scale = 0.5;
              console.log(Cactus.width);
              break;
      case 3: Cactus.addImage(CactusImage3);
              Cactus.scale = 0.2;
              console.log(Cactus.width);
              break;
      case 4: Cactus.addImage(CactusImage4);
              Cactus.scale = 0.2;
              console.log(Cactus.width);
              break;
      default: break;   
    }
    
    //Cactus.scale = 0.5;
    Cactus.velocityX = ground.velocityX;
    
    trex.depth = Cactus.depth + 1;
  
    Cactus.lifetime = width/Cactus.velocityX;  
    
    CactusGroup.add(Cactus);
    
    Cactus.setCollider("rectangle",0,0,100,60);
    
    Cactus.debug = true;
  }
}

function reset(){
  gameState = PLAY;
  
  //Restart.visible = false;
  //gameOver.visible = false;
  
  CactusGroup.destroyEach();
  CloudsGroup.destroyEach();
  
  trex.changeAnimation("running", trex_running);
  
  Score = 0;
}