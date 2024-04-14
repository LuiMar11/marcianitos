let tileSize = 32;
let rows = 16;
let cols = 16;

let board;
let boardWidth = tileSize * cols;
let boardHeight = tileSize * rows;
let ctx;

let playerWidth = tileSize;
let playerHeight = tileSize;
let playerImg;
let playerVel = tileSize;
let playerX = (tileSize * cols) / 2;
let playerY = tileSize * rows - tileSize * 2;

let player = {
  x: playerX,
  y: playerY,
  width: playerWidth,
  height: playerHeight,
};

let aliens = [];
let alienWidth = tileSize;
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienImg;
let alienRows = 3;
let alienCols = 5;
let alienCount = 0;
let alienVelX = 4;

let bossWidth = tileSize * 2;
let bossHeight = tileSize;
let bossImg;
let bossVel = 4;
let bossX = (tileSize * cols) / 2;
let bossY = tileSize;
let bossLife = 100;
let boss = {
  x: bossX,
  y: bossY,
  width: bossWidth,
  height: bossHeight,
};
var projectiles = [];
let bullets = [];
let bulletVel = -10;
let bulletImg;

let bossBullets = [];
let bossBulletVel = 10;
let bossBulletImg;

let score = 0;
let gameOver = 0;

function iniciar() {
  document.getElementById('iniciar').style.display = 'none';
  board = document.getElementById('gameCanvas');
  board.width = boardWidth;
  board.height = boardHeight;
  ctx = board.getContext('2d');

  playerImg = new Image();
  playerImg.src = 'img/player.png';
  playerImg.onload = function () {
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
  };

  alienImg = new Image();
  alienImg.src = 'img/invader.png';
  createAliens();

  bulletImg = new Image();
  bulletImg.src = 'img/bullet.png';

  bossImg = new Image();
  bossImg.src = 'img/finalBoss.png';

  bossBulletImg = new Image();
  bossBulletImg.src = 'img/bulletBoss.png';

  document.addEventListener('keydown', movePlayer);
  document.addEventListener('keyup', shoot);
  requestAnimationFrame(nivel1);
}

function nivel1() {
  requestAnimationFrame(nivel1);
  ctx.clearRect(0, 0, boardWidth, boardHeight);
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
  ctx.font = '30px VT323';
  ctx.fillStyle = '#FFF';
  ctx.fillText('Score: ' + score, 10, 20);

  //aliens
  for (let i = 0; i < aliens.length; i++) {
    let alien = aliens[i];
    if (alien.alive) {
      alien.x += alienVelX;
      if (alien.x + alien.width >= boardWidth || alien.x <= 0) {
        alienVelX *= -1;
        alien.x += alienVelX * 2;
        for (let j = 0; j < aliens.length; j++) {
          aliens[j].y += alienHeight;
        }
      }
      ctx.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);
      if (collition(player, alien)) {
        ctx.font = '30px VT323';
        ctx.fillStyle = '#FFF';
        ctx.fillText('Game over', boardWidth / 2 - tileSize, boardHeight / 2);
        ctx.fillText(
          'Final Score: ' + score,
          boardWidth / 2 - tileSize * 2,
          boardHeight / 2 + tileSize
        );
        alienVelX = 0;
        playerVel = 0;
        bullets.length = 0;
        document.getElementById('reload').style.display = 'inline';
      }
    }
  }
  //balas
  for (let i = 0; i < bullets.length; i++) {
    let bullet = bullets[i];
    bullet.y += bulletVel;
    ctx.drawImage(bulletImg, bullet.x, bullet.y, bullet.width, bullet.height);
    for (let j = 0; j < aliens.length; j++) {
      let alien = aliens[j];
      if (!bullet.used && alien.alive && collition(bullet, alien)) {
        bullet.used = true;
        alien.alive = false;
        alienCount--;
        score += 10;
      }
      if (!bullet.used && bossLife > 0 && collition(bullet, boss)) {
        bullet.used = true;
        bossLife -= 10;
        score += 10;
      }
    }
    while (bullets.length > 0 && (bullets[0].used || bullets[0].y < 0)) {
      bullets.shift();
    }
  }

  // boss
  if (alienCount == 0) {
    ctx.drawImage(bossImg, boss.x, boss.y, boss.width, boss.height);

    if (bossLife > 0) {
      for (let i = 0; i < projectiles.length; i++) {
        let projectile = projectiles[i];
        ctx.beginPath();
        ctx.arc(projectile.x, projectile.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.closePath();
      }
      boss.x += bossVel;
      if (boss.x + boss.width >= boardWidth || boss.x <= 0) {
        bossVel *= -1;
        boss.x += bossVel * 2;
      }
    }
  }
  if (bossLife === 0) {
    ctx.font = '30px VT323';
    ctx.fillStyle = '#FFF';
    ctx.fillText('Game over', boardWidth / 2 - tileSize, boardHeight / 2);
    ctx.fillText(
      'Final Score: ' + score,
      boardWidth / 2 - tileSize * 2,
      boardHeight / 2 + tileSize
    );
    bossVel = 0;
    playerVel = 0;
    bullets.length = 0;
    document.getElementById('reload').style.display = 'inline';
  }
}

function movePlayer(e) {
  if (e.code === 'ArrowLeft' && player.x - playerVel >= 0) {
    player.x -= playerVel;
  } else if (e.code === 'ArrowRight' && player.x + playerVel < boardWidth) {
    player.x += playerVel;
  }
}

function createAliens() {
  for (let c = 0; c < alienCols; c++) {
    for (let r = 0; r < alienRows; r++) {
      let alien = {
        img: alienImg,
        x: alienX + c * alienWidth,
        y: alienY + r * alienHeight,
        width: alienWidth,
        height: alienHeight,
        alive: true,
      };
      aliens.push(alien);
    }
  }
  alienCount = aliens.length;
}

function shoot(e) {
  if (e.code === 'Space') {
    let bullet = {
      img: bulletImg,
      x: player.x + (playerWidth * 15) / 32,
      y: player.y,
      width: tileSize / 4,
      height: tileSize / 2,
      used: false,
    };
    bullets.push(bullet);
  }
}

function collition(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function reload() {
  document.location.reload();
}
