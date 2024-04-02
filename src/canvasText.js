import canvasSketch from "canvas-sketch";
import { random } from "canvas-sketch-util";

const settings = {
  dimensions: [1080, 1080],
  animate: false,
};

let text = "S";
let fontSize = 1200;
let fontFamily = "Arial";
let manager;

const typeCanvas = document.createElement("canvas");
const typeContext = typeCanvas.getContext("2d");

const sketch = ({ context, width, height }) => {
  const cell = 20;
  const cols = Math.floor(width / cell); //
  const rows = Math.floor(height / cell); //
  const numCells = cols * rows;

  typeCanvas.width = cols;
  typeCanvas.height = rows;

  return ({ context, width, height }) => {
    typeContext.fillStyle = "black";
    typeContext.fillRect(0, 0, cols, rows);

    fontSize = cols * 0.99;

    typeContext.fillStyle = "white";
    typeContext.font = `${fontSize}px ${fontFamily}`;
    typeContext.textBaseline = "top";
    //typeContext.textAlign = "center";

    const metrics = typeContext.measureText(text);
    //console.log(metrics);
    const mx = metrics.actualBoundingBoxLeft * -1;
    const my = metrics.actualBoundingBoxAscent * -1;
    const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
    const mh =
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    const x = (cols - mw) * 0.5 - mx;
    const y = (rows - mh) * 0.5 - my;

    typeContext.save();
    typeContext.translate(x, y);

    typeContext.beginPath();
    typeContext.rect(mx, my, mw, mh);
    typeContext.stroke();

    typeContext.fillText(text, 0, 0);
    typeContext.restore();

    const typeData = typeContext.getImageData(0, 0, cols, rows).data;

    //context.drawImage(typeCanvas, 0, 0);

    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);

    context.textBaseline = "middle";
    context.textAlign = "center";

    //Find bitmaps in a grid
    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = col * cell;
      const y = row * cell;

      const r = typeData[i * 4 + 0];
      const g = typeData[i * 4 + 1];
      const b = typeData[i * 4 + 2];
      const a = typeData[i * 4 + 3];

      const glyph = getGlyph(r);

      context.font = `${cell * 1.6}px ${fontFamily}`;
      if (Math.random() < 0.1) context.font = `${cell * 6}px ${fontFamily}`;

      //context.fillStyle = `rgb(${r},${g},${b})`;
      context.fillStyle = `white`;

      context.save();
      context.translate(x, y);
      //context.fillRect(0, 0, cell, cell);

      // context.beginPath();
      // context.arc(cell * 0.5, cell * 0.5, cell * 0.5, 0, Math.PI * 2);
      // context.fill();

      context.fillText(glyph, 0, 0);

      context.restore();
    }
  };
};

const getGlyph = (value) => {
  if (value < 50) return " ";
  if (value < 100) return ".";
  if (value < 150) return "*";
  if (value < 200) return "+";
  if (value < 250) return "X";

  const glyphs = "_=/".split("");
  return random.pick(glyphs);
  //return "#";
};

const onKeyUp = (e) => {
  //console.log(e);
  text = e.key.toUpperCase();
  manager.render();
};
document.addEventListener("keyup", onKeyUp);

const start = async () => {
  manager = await canvasSketch(sketch, settings);
};
start();
