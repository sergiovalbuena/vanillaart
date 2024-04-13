import canvasSketch from "canvas-sketch";
import { random, math } from "canvas-sketch-util";
import risoColors from "riso-colors";
import chroma from "chroma-js";

const seed = Date.now();
random.setSeed(seed);

// Pre-selección de colores para optimizar la selección
const rectColors = [random.pick(risoColors).hex, random.pick(risoColors).hex];
const bgColor = random.pick(risoColors).hex;

const settings = {
  dimensions: [1080, 1080],
  name: `art-${seed}`,
};

const sketch = ({ width, height }) => {
  const numRects = 40;
  const skewDegrees = -30;

  // Generación de rectángulos
  const rects = Array.from({ length: numRects }).map(() => ({
    x: random.range(0, width),
    y: random.range(0, height),
    w: random.range(600, width),
    h: random.range(40, 200),
    fill: random.pick(rectColors),
    stroke: random.pick(rectColors),
    blend: random.value() > 0.5 ? "overlay" : "source-over",
  }));

  const mask = {
    radius: width * 0.4,
    sides: 6, // Un hexágono
    x: width * 0.5,
    y: height * 0.5,
  };

  return ({ context }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    // Dibujar máscara
    context.save();
    context.translate(mask.x, mask.y);
    drawPolygon(context, mask.radius, mask.sides);
    context.clip();

    // Dibujar rectángulos dentro de la máscara
    rects.forEach(({ x, y, w, h, fill, stroke, blend }) => {
      context.save();
      context.globalCompositeOperation = blend;
      drawRect(
        context,
        x - mask.x,
        y - mask.y,
        w,
        h,
        skewDegrees,
        fill,
        stroke
      );
      context.restore();
    });

    context.restore();

    // Dibujar contorno del hexágono
    context.save();
    context.translate(mask.x, mask.y);
    context.beginPath();
    drawPolygon(context, mask.radius, mask.sides);
    context.strokeStyle = "black";
    context.lineWidth = 10;
    context.stroke();
    context.restore();
  };
};

const drawRect = (context, x, y, w, h, degrees, fill, stroke) => {
  context.translate(x, y);

  let shadowColor = chroma(fill).darken(1.5).alpha(0.5).css();
  context.shadowColor = shadowColor;
  context.shadowBlur = 20;
  context.shadowOffsetX = 10;
  context.shadowOffsetY = 10;

  // Dibujar rectángulo sesgado
  drawSkewedRect(context, w, h, degrees, fill, stroke);
};

const drawSkewedRect = (context, w, h, degrees, fill, stroke) => {
  const angle = math.degToRad(degrees);
  const rx = Math.cos(angle) * w;
  const ry = Math.sin(angle) * w;

  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(rx, ry);
  context.lineTo(rx, ry + h);
  context.lineTo(0, h);
  context.closePath();

  context.fillStyle = fill;
  context.strokeStyle = stroke;
  context.lineWidth = 4;
  context.fill();
  context.stroke();
};

const drawPolygon = (context, radius, sides) => {
  const slice = (Math.PI * 2) / sides;
  context.moveTo(radius, 0); // Moverse al primer punto
  for (let i = 1; i <= sides; i++) {
    const theta = slice * i;
    context.lineTo(Math.cos(theta) * radius, Math.sin(theta) * radius);
  }
  context.closePath();
};

canvasSketch(sketch, settings);
