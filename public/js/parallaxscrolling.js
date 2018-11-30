"use strict";

var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    ww = window.innerWidth,
    wh = window.innerHeight;

canvas.width = ww;
canvas.height = wh;

var ship = {
  x: 0,
  y: 0,
  deg: 0,
  r: 70
  // x: 200,
  // y: 0
};

function init() {
  ship.deg = 0;
  // ship.x= Math.random()*ww;
  // ship.y= Math.random()*wh;
}
function update() {
  // ship.x+= 0.1;
  // ship.y+= 0.5;
  // ship.deg+= 0.02;
  ship.deg = mousePos.x / 50;
  console.log(mousePos);
}

function draw() {
  ctx.fillStyle = "#001D2E";
  ctx.fillRect(0, 0, ww, wh);

  // 格線
  var span = 50;
  ctx.beginPath();
  for (var i = 0; i < ww; i += span) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i, wh);
  }
  for (var i = 0; i < wh; i += span) {
    ctx.moveTo(0, i);
    ctx.lineTo(ww, i);
  }

  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.stroke();
  ctx.save();

  ctx.translate(ww / 2, wh / 2);
  ctx.rotate(ship.deg);

  ctx.fillStyle = '#fff';
  ctx.fillRect(100, -25 / 2, 25, 25);

  // 船
  ctx.beginPath();
  ctx.arc(0, 0, ship.r, 0, Math.PI * 2);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 12;
  ctx.shadowBlur = 20;
  ctx.shadowColor = '#fff';

  ctx.stroke();

  for (var i = 0; i < 3; i++) {
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -ship.r);
    ctx.stroke();
    ctx.rotate(Math.PI * 2 / 3);
  }

  ctx.restore();

  ctx.fillStyle = "#fff";
  ctx.fillRect(ship.x, ship.x, 50, 50);

  requestAnimationFrame(draw);
}

init();

var fps = 60;

setInterval(update, 1000 / fps);
requestAnimationFrame(draw);

var mousePos = {
  x: 0,
  y: 0
};

canvas.addEventListener('mousemove', function (e) {
  console.log(e.x, e.y);

  mousePos.x = e.x;
  mousePos.y = e.y;
});