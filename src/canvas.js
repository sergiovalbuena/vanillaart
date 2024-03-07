import canvasSketch from "canvas-sketch";
import random from "canvas-sketch-util/random";
import math from "canvas-sketch-util/math";
import { Pane } from "tweakpane";

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const params = {
  cols: 10,
  rows: 10,
  scaleMin: 1,
  scaleMax: 30,
  freq: 0.001,
  amp: 0.2,
  frame: 0.2,
  animate: true,
  lineCap: "butt",
};

const sketchFunction = () => {
  return ({ context: ctx, width, height, frame }) => {
    ctx.save();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    const cols = params.cols;
    const rows = params.rows;
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

      const f = params.animate ? frame : params.frame;

      const n = random.noise2D(x + f * 10, y, params.freq);
      //const n = random.noise3D(x + frame * 10, y, params.freq);

      const angle = n * Math.PI * params.amp;
      //  const scale = (n + 1) / 2 * 30;
      //const scale = (n * 0.5 + 0.5) * params.scaleMax;
      const scale = math.mapRange(n, -1, 1, params.scaleMin, params.scaleMax);

      ctx.save();
      ctx.translate(x, y);
      ctx.translate(margx, margy);
      ctx.translate(cellw * 0.5, cellh * 0.5);
      ctx.rotate(angle);

      ctx.beginPath();
      ctx.strokeStyle = "white";

      ctx.lineWidth = scale;
      ctx.lineCap = params.lineCap;

      ctx.moveTo(w * -0.5, 0);
      ctx.lineTo(w * 0.5, 0);
      ctx.stroke();
      ctx.restore();
    }
  };
};

const createPane = () => {
  const pane = new Pane();
  let folder;
  folder = pane.addFolder({ title: "Grid" });
  folder.addBinding(params, "lineCap", {
    options: { butt: "butt", round: "round", square: "square" },
  });
  folder.addBinding(params, "cols", { min: 2, max: 50, step: 5 });
  folder.addBinding(params, "rows", { min: 2, max: 50, step: 5 });
  folder.addBinding(params, "scaleMin", { min: 1, max: 50 });
  folder.addBinding(params, "scaleMax", { min: 1, max: 50 });

  folder = pane.addFolder({ title: "Noise" });
  folder.addBinding(params, "freq", { min: 0.01, max: 1 });
  folder.addBinding(params, "amp", { min: 0, max: 1 });
  folder.addBinding(params, "animate");
  folder.addBinding(params, "frame", { min: 0, max: 999 });
};
createPane();

canvasSketch(sketchFunction, settings);
