class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getDistance(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

class Point {
  constructor(x, y, color = "white") {
    this.pos = new Vector(x, y);
    this.vel = new Vector(randomRange(-1, 1), randomRange(-1, 1));
    this.radius = randomRange(4, 12);
    this.color = color;
  }

  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  bounce(width, height) {
    if (this.pos.x < 0 || this.pos.x > width) {
      this.vel.x = -this.vel.x;
    }
    if (this.pos.y < 0 || this.pos.y > height) {
      this.vel.y = -this.vel.y;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.strokeStyle = "lightblue";
    ctx.lineWidth = randomRange(0.1, 2);
    ctx.stroke();
    ctx.restore();
  }
}

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

const canvas = document.querySelector("#dotsAndLines");
const ctx = canvas.getContext("2d");
canvas.width = 1080;
canvas.height = 1080;

const pointA = new Point(100, 100, 10, "red");
const pointB = new Point(200, 200, 10, "blue");
const pointC = new Point(800, 400);
const points = [];

for (let i = 0; i < 40; i++) {
  points.push(
    new Point(Math.random() * canvas.width, Math.random() * canvas.height)
  );
}

pointC.draw(ctx);

ctx.beginPath();
ctx.arc(pointA.x, pointA.y, pointA.radius, 0, Math.PI * 2);
ctx.fillStyle = pointA.color;
ctx.fill();

ctx.beginPath();
ctx.arc(pointB.x, pointB.y, pointB.radius, 0, Math.PI * 2);
ctx.fillStyle = pointB.color;
ctx.fill();

function draw() {
  // Limpia el canvas
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < points.length; i++) {
    const point = points[i];

    for (let j = i + 1; j < points.length; j++) {
      const other = points[j];
      const distance = point.pos.getDistance(other.pos);
      if (distance < 200) {
        ctx.beginPath();
        ctx.lineWidth = randomRange(0.1, 0.9);
        ctx.moveTo(point.pos.x, point.pos.y);
        ctx.lineTo(other.pos.x, other.pos.y);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1 - distance / 100;
        ctx.stroke();
      }
    }
  }

  // Actualiza y dibuja tus puntos
  points.forEach((point) => {
    point.update();
    point.draw(ctx);
    point.bounce(canvas.width, canvas.height);
  });

  // Solicita el próximo cuadro de la animación
  window.requestAnimationFrame(draw);
}

// Inicia la animación
draw();
