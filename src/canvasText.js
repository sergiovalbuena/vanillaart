import canvasSketch from "canvas-sketch";

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);

    context.font = "100px Arial";
    context.fillStyle = "white";
    context.fillText("Hello Canvas", 100, 100);
  };
};
sketch();

canvasSketch(sketch, settings);
