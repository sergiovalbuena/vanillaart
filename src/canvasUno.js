//import math from "canvas-sketch-util/math";
//import random from "canvas-sketch-util/random";

const canvas = document.querySelector("#canvasUno");
const ctx = canvas.getContext("2d");
canvas.width = 1080;
canvas.height = 1080;

function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.fillStyle = "white";

const cx = canvas.width * 0.5;
const cy = canvas.height * 0.5;
const w = canvas.width * 0.01;
const h = canvas.height * 0.1;
let x, y;

//crear un ciruclo
// ctx.beginPath();
// ctx.arc(x, y, 50, 0, Math.PI * 2);
// ctx.fill();

const num = 12;
const radius = canvas.width * 0.2;

// esta es la forma de hacer un circulo con rectangulos
for (let i = 0; i < num; i++) {
  const slice = degToRad(360 / num);
  const angle = slice * i;

  x = cx + radius * Math.sin(angle);
  y = cy + radius * Math.cos(angle);

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-angle);
  ctx.scale(randomRange(0.1, 2.4), 1);

  ctx.beginPath();
  ctx.rect(-w * 0.5, randomRange(0, h * 0.5), w, h);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-angle);

  ctx.lineWidth = randomRange(5, 20);
  ctx.strokeStyle = "white";
  ctx.beginPath();
  ctx.arc(
    0,
    0,
    radius * randomRange(0.7, 1.4),
    slice * randomRange(1, -8),
    slice * randomRange(1, -0.7)
  );
  ctx.stroke();

  ctx.restore();
}
