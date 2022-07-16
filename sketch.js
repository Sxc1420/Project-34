const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world, backgroundImg;
var canvas, angle, tower, ground, artilleryGun, tank;
var bullets = [];
var tanks = [];
var score = 0;
var artilleryBullet;

var isGameOver = false;
//var isCheering = false;

//var backgroundSound, soldierCheerSound;
var cannonExplosionSound;

function preload() {
  backgroundImg = loadImage("assets/background.png");
  towerImage = loadImage("assets/tower.png");
  tankImage = loadImage("assets/military_tank.png");
  //backgroundSound = loadSound("assets/background_music.mp3");
  //soldierCheerSound = loadSound("assets/pirate_laugh.mp3");
  cannonExplosionSound = loadSound("assets/cannon_explosion.mp3");
}

function setup() {
  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;
  angleMode(DEGREES);
  angle = 15;

  ground = Bodies.rectangle(0, height - 1, width * 2, 1, {isStatic: true});
  World.add(world, ground);

  tower = Bodies.rectangle(160, 350, 160, 310, {isStatic: true});
  World.add(world, tower);

  artilleryGun = new ArtilleryGun(180, 110, 130, 100, angle);
}

function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);

  /*if(!backgroundSound.isPlaying()) {
    backgroundSound.play();
    backgroundSound.setVolume(0.1);
  }*/

  Engine.update(engine);

  push();
  translate(ground.position.x, ground.position.y);
  fill("brown");
  rectMode(CENTER);
  rect(0, 0, width * 2, 1);
  pop();

  push();
  translate(tower.position.x, tower.position.y);
  rotate(tower.angle);
  imageMode(CENTER);
  image(towerImage, 0, 0, 160, 310);
  pop();

  showTanks();

  for(var i = 0; i < bullets.length; i++) {
    showArtilleryBullets(bullets[i], i);
    collisionWithTank(i);
  }

  artilleryGun.display();

  fill("#6d4c41");
  textSize(40);
  text(`Score:${score}`, width - 200, 50);
  textAlign(CENTER, CENTER);
}

function collisionWithTank(index) {
  for(var i = 0; i < tanks.length; i++) {
    if(bullets[index] !== undefined && tanks[i] !== undefined) {
      var collision = Matter.SAT.collides(bullets[index].body, tanks[i].body);

      if(collision.collided) {
        score += 5;
        tanks[i].remove();

        Matter.World.remove(world, bullets[index].body);
        delete bullets[index];
      }
    }
  }
}

function keyPressed() {
  if(keyCode === DOWN_ARROW) {
    var artilleryBullet = new ArtilleryBullet(artilleryGun.x, artilleryGun.y);
    artilleryBullet.trajectory = [];
    Matter.Body.setAngle(artilleryBullet.body, artilleryGun.angle);
    bullets.push(artilleryBullet);
  }
}

function showArtilleryBullets(bullet, index) {
  if(bullet) {
    bullet.display();
    bullet.animate();

    if(bullet.body.position.x >= width || bullet.body.position.y >= height - 50) {
      if(!bullet.isSink) {
        bullet.remove(index);
      }
    }
  }
}

function showTanks() {
  if(tanks.length > 0) {
    if(tanks.length < 4 && tanks[tanks.length - 1].body.position.x < width - 300) {
      var positions = [-40, -60, - 70, -20];
      var position = random(positions);
      var tank = new Tank(width, height - 100, 170, 170, position, tankImage);

      tanks.push(tank);
    }

    for(var i = 0; i < tanks.length; i++) {
        Matter.Body.setVelocity(tanks[i].body, {x: -0.9, y: 0});

        tanks[i].display();
        tanks[i].animate();

        var collision = Matter.SAT.collides(this.tower, tanks[i].body);

        if(collision.collided && !tanks[i].isBroken) {
          /*if(!isCheering && !soldierCheerSound.isPlaying()) {
            isCheering = true;
            soldierCheerSound.play();
            soldierCheerSound.setVolume(0.1);
          }*/

          isGameOver = true;
          gameOver();
        }
      }
  } else {
    var tank = new Tank(width, height - 60, 170, 170, -60, tankImage);
    tanks.push(tank);
  }
}

function keyReleased() {
  if(keyCode === DOWN_ARROW && !isGameOver) {
    bullets[bullets.length - 1].shoot();
    cannonExplosionSound.play();
    cannonExplosionSound.setVolume(0.1);
  }
}

function gameOver() {
  swal(
    {
      title: `Game Over!!!`,
      text: "Thanks for playing!!",
      imageUrl:
        "https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
      imageSize: "150x150",
      confirmButtonText: "Play Again"
    },

    function(isConfirm) {
      if (isConfirm) {
        location.reload();
      }
    }
  );
}
