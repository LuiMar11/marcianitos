const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const playerImg = new Image();
playerImg.src = '/img/player.png';

const player = {
  x: canvas.width / 2,
  y: canvas.height - 30,
  width: 30,
  height: 30,
  speed: 8,
};

document.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowLeft') {
    player.x -= player.speed;
  } else if (event.key === 'ArrowRight') {
    player.x += player.speed;
  }
});

function drawPlayer() {
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  requestAnimationFrame(draw);
}

draw();
