import canvasSketch from "canvas-sketch";
import random from "canvas-sketch-util/random";
import math from "canvas-sketch-util/math";

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const sketchFunction = () => {
  return ({ context: ctx, width, height, frame }) => {
    ctx.save();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    const cols = 10;
    const rows = 10;
    const numCells = cols * rows;

    const gridw = width * 0.8;
    const gridh = height * 0.8;
    const cellw = gridw / cols;
    const cellh = gridh / rows;
    const margx = (width - gridw) * 0.5;
    const margy = (height - gridh) * 0.5;

    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cellw;
      const y = row * cellh;
      const w = cellw * 0.8;
      const h = cellh * 0.8;

      const n = random.noise2D(x + frame * 10, y, 0.001);
      const angle = n * Math.PI * 0.2;
      const scale = math.mapRange(n, -1, 1, 0.1, 30);

      ctx.save();
      ctx.translate(x, y);
      ctx.translate(margx, margy);
      ctx.translate(cellw * 0.5, cellh * 0.5);
      ctx.rotate(angle);

      ctx.beginPath();
      ctx.strokeStyle = "white";
      ctx.lineWidth = scale;
      ctx.moveTo(w * -0.5, 0);
      ctx.lineTo(w * 0.5, 0);
      ctx.stroke();
      ctx.restore();
    }
  };
};

canvasSketch(sketchFunction, settings);
