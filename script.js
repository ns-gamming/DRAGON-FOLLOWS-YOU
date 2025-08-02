"use strict";

const screen = document.getElementById("screen");
const xmlns = "http://www.w3.org/2000/svg";
const xlinkns = "http://www.w3.org/1999/xlink";

const viewBoxWidth = 300; // SVG viewBox width (-150 to 150)
const viewBoxHeight = 300; // SVG viewBox height (-150 to 150)
const viewBoxXMin = -150;
const viewBoxYMin = -150;

// Map pixel coordinates to SVG viewBox coordinates
const mapToSvgCoords = (pixelX, pixelY) => {
  const svgX = (pixelX / window.innerWidth) * viewBoxWidth + viewBoxXMin;
  const svgY = (pixelY / window.innerHeight) * viewBoxHeight + viewBoxYMin;
  return { x: svgX, y: svgY };
};

window.addEventListener(
  "pointermove",
  (e) => {
    const svgCoords = mapToSvgCoords(e.clientX, e.clientY);
    pointer.x = svgCoords.x;
    pointer.y = svgCoords.y;
    rad = 0;
  },
  false
);

const resize = () => {
  width = window.innerWidth;
  height = window.innerHeight;
};

let width, height;
window.addEventListener("resize", () => resize(), false);
resize();

const prepend = (use, i) => {
  const elem = document.createElementNS(xmlns, "use");
  elems[i].use = elem;
  elem.setAttributeNS(xlinkns, "xlink:href", "#" + use);
  screen.prepend(elem);
};

const N = 30;

const elems = [];
for (let i = 0; i < N; i++) {
  const svgCoords = mapToSvgCoords(width / 2, height / 2);
  elems[i] = { use: null, x: svgCoords.x, y: svgCoords.y };
}
const pointerSvgCoords = mapToSvgCoords(width / 2, height / 2);
const pointer = { x: pointerSvgCoords.x, y: pointerSvgCoords.y };
const radm = Math.min(viewBoxWidth, viewBoxHeight) / 6 - 20; // Adjusted for smaller viewBox
let frm = Math.random();
let rad = 0;

for (let i = 1; i < N; i++) {
  if (i === 1) prepend("Cabeza", i);
  else if (i === 6 || i === 13) prepend("Aletas", i);
  else prepend("Espina", i);
}

const run = () => {
  requestAnimationFrame(run);
  let e = elems[0];
  const ax = (Math.cos(3 * frm) * rad * viewBoxWidth) / viewBoxHeight;
  const ay = (Math.sin(4 * frm) * rad * viewBoxHeight) / viewBoxWidth;
  e.x += (ax + pointer.x - e.x) / 10;
  e.y += (ay + pointer.y - e.y) / 10;
  for (let i = 1; i < N; i++) {
    let e = elems[i];
    let ep = elems[i - 1];
    const a = Math.atan2(e.y - ep.y, e.x - ep.x);
    e.x += (ep.x - e.x + (Math.cos(a) * (100 - i)) / 22) / 4;
    e.y += (ep.y - e.y + (Math.sin(a) * (100 - i)) / 22) / 4;
    const s = (162 + 4 * (1 - i)) / 300; // Further reduced scale for smaller dragon
    if (e.use) {
      e.use.setAttributeNS(
        null,
        "transform",
        `translate(${(ep.x + e.x) / 2},${(ep.y + e.y) / 2}) rotate(${
          (180 / Math.PI) * a
        }) translate(0,0) scale(${s},${s})`
      );
    }
  }
  if (rad < radm) rad++;
  frm += 0.003;
  if (rad > 60) {
    pointer.x += (0 - pointer.x) * 0.05; // Center in SVG coords (0,0)
    pointer.y += (0 - pointer.y) * 0.05;
  }
};

run();
