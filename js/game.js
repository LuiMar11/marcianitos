var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');

var playerImage = new Image();
playerImage.src = 'img/player.png';

var bulletImage = new Image();
bulletImage.src = 'img/bullet.png';

var player = {
  width: 64,
  height: 64,
  x: (canvas.width - 64) / 2,
  y: canvas.height - 80,
  speed: 5,
};

var enemyImage = new Image();
enemyImage.src = 'img/enemy1.png';

var enemies = [];
var enemyWidth = 64;
var enemyHeight = 64;
var enemyRowCount = 4;
var enemyColumnCount = 8;
var enemySpeedX = 2;
var enemySpeedY = 10;

for (var c = 0; c < enemyColumnCount; c++) {
  for (var r = 0; r < enemyRowCount; r++) {
    enemies.push({
      x: c * (enemyWidth + 10) + 30,
      y: r * (enemyHeight + 10) + 30,
      width: enemyWidth,
      height: enemyHeight,
      status: 1,
    });
  }
}

var bullets = [];
var bulletWidth = 10;
var bulletHeight = 20;
var bulletSpeed = 7;

var rightPressed = false;
var leftPressed = false;
var spacePressed = false;

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function keyDownHandler(e) {
  if (e.key == 'Right' || e.key == 'ArrowRight') {
    rightPressed = true;
  } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
    leftPressed = true;
  } else if (e.key == ' ' || e.key == 'Spacebar') {
    spacePressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == 'Right' || e.key == 'ArrowRight') {
    rightPressed = false;
  } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
    leftPressed = false;
  } else if (e.key == ' ' || e.key == 'Spacebar') {
    spacePressed = false;
  }
}

function drawPlayer() {
  ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

function drawEnemies() {
  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i].status == 1) {
      ctx.drawImage(
        enemyImage,
        enemies[i].x,
        enemies[i].y,
        enemies[i].width,
        enemies[i].height
      );
    }
  }
}

function drawBullets() {
  for (var i = 0; i < bullets.length; i++) {
    ctx.drawImage(
      bulletImage,
      bullets[i].x,
      bullets[i].y,
      bulletWidth,
      bulletHeight
    );
  }
}

function moveEnemies() {
  for (var i = 0; i < enemies.length; i++) {
    enemies[i].x += enemySpeedX;
    if (enemies[i].x + enemyWidth > canvas.width || enemies[i].x < 0) {
      enemySpeedX = -enemySpeedX; // Cambiar de dirección si alcanza el borde
      for (var j = 0; j < enemies.length; j++) {
        enemies[j].y += enemySpeedY; // Bajar los enemigos
      }
    }
  }
}

function moveBullets() {
  for (var i = 0; i < bullets.length; i++) {
    bullets[i].y -= bulletSpeed;
    if (bullets[i].y < 0) {
      bullets.splice(i, 1);
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawEnemies();
  drawBullets();
  moveEnemies();
  moveBullets();

  if (rightPressed && player.x < canvas.width - player.width) {
    player.x += player.speed;
  } else if (leftPressed && player.x > 0) {
    player.x -= player.speed;
  }

  if (spacePressed) {
    shoot();
  }

  requestAnimationFrame(draw);
}

function shoot() {
  var bulletX = player.x + player.width / 2 - bulletWidth / 2;
  var bulletY = player.y;
  bullets.push({ x: bulletX, y: bulletY });
}

draw();
