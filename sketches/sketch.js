const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");

const settings = {
  dimensions: [2048, 2048]
};

const sketch = () => {
  const createGrid = () => {
    const points = [];
    const count = 6;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        let u = count < 0 ? 0.5 : x / (count - 1);
        let v = count < 0 ? 0.5 : y / (count - 1);
        points.push([u, v]);
      }
    }
    return points;
  };
  const points = createGrid();
  const backgroundColor = "white";
  const palette = random.pick(palettes);
  console.log(palette);
  const margin = 400;
  return ({ context, width, height }) => {
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, width, height);
    // make 6X6 grid points
    // ! grid points are made but circles are not made/displayed
    // points.forEach(([u, v]) => {
    //   const x = lerp(margin, width - margin, u);
    //   const y = lerp(margin, width - margin, v);
    //   context.fillStyle = "black";
    //   context.beginPath();
    //   context.arc(x, y, 15, 0, Math.PI * 2);
    //   context.fill();
    // });

    //filter out bottom row of points
    const pointsCpy = points.filter(([x, y]) => {
      return y < 1;
    });

    const getPoints = () => {
      const currentPick = random.pick(pointsCpy);
      const currentPickIndex = pointsCpy.findIndex(([x, y]) => {
        return x === currentPick[0] && y === currentPick[1];
      });
      pointsCpy.splice(currentPickIndex, 1);
      return currentPick;
    };

    //interpolate function to be called on every coordinate
    const i = z => {
      return lerp(margin, width - margin, z);
    };

    const drawTrap = (start, end) => {
      context.strokeStyle = backgroundColor;
      context.lineWidth = 10;

      let a = start;
      let b = end;
      let d = [start[0], 1];
      let c = [end[0], 1];
      context.save();
      context.moveTo(i(a[0]), i(a[1]));
      context.lineTo(i(b[0]), i(b[1]));
      context.lineTo(i(c[0]), i(c[1]));
      context.lineTo(i(d[0]), i(d[1]));
      context.lineTo(i(a[0]), i(a[1]));
      context.globalAlpha = 0.7;
      context.fill();
      context.stroke();
      context.restore();
    };

    while (pointsCpy.length > 0) {
      let currentFill = random.pick(palette);
      context.fillStyle = currentFill;
      let pointA = getPoints();
      let pointB = getPoints();
      drawTrap(pointA, pointB);
    }
  };
};

canvasSketch(sketch, settings);
