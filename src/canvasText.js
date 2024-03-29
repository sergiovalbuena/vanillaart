import canvasSketch from "canvas-sketch";

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

let text = "S";
let fontSize = 1200;
let fontFamily = "Arial";
let manager;

const typeCanvas = document.createElement("canvas");
const typeContext = typeCanvas.getContext("2d");

const sketch = ({ context, width, height }) => {
  return ({ context, width, height }) => {
    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);

    context.fillStyle = "white";
    context.font = `${fontSize}px ${fontFamily}`;
    context.textBaseline = "top";
    //context.textAlign = "center";

    const metrics = context.measureText(text);
    //console.log(metrics);
    const mx = metrics.actualBoundingBoxLeft * -1;
    const my = metrics.actualBoundingBoxAscent * -1;
    const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
    const mh =
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    const x = (width - mw) * 0.5 - mx;
    const y = (height - mh) * 0.5 - my;

    context.save();
    context.translate(x, y);

    context.beginPath();
    context.rect(mx, my, mw, mh);
    context.stroke();

    context.fillText(text, 0, 0);
    context.restore();
  };
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
