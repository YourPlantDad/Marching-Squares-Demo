// === CONFIGURATIE (extern, door gebruiker te tweaken) ===
let cellSize          = 4;            // grootte van een gridcel in pixels
let noiseScaleUI      = 5;            // 1 t/m 100 → wordt omgerekend naar 0.01 t/m 1
let zIncrementUI      = 5;            // 1 t/m 100 → wordt omgerekend naar 0.001 t/m 0.1
let strokeColor       = [29, 162, 216];  // kleur van de lijnen
let backgroundColor   = [127, 205, 255];    // kleur van de achtergrond
let strokeWidth       = 3;            // dikte van de lijnen
let canvasSizeWidth   = 400;          // vierkante canvasafmeting
let canvasSizeHeight  = 400;         // vierkante canvasafmeting

// === INTERNE VARIABELEN ===
let noiseScale;
let zIncrement;
let field = [];
let cols, rows;
let zoff = 0;
let noiseSource;

function setup() {
  createCanvas(canvasSizeWidth, canvasSizeHeight);

  // ✨ Interne mapping van UI-waarden naar logische waarden
  noiseScale = noiseScaleUI * 0.01;    // 1 → 0.01, 100 → 1
  zIncrement = zIncrementUI * 0.001;   // 1 → 0.001, 100 → 0.1

  cols = 1 + width / cellSize;
  rows = 1 + height / cellSize;
  noiseSource = new OpenSimplexNoise(Date.now());

  field = new Array(cols);
  for (let i = 0; i < cols; i++) {
    field[i] = new Array(rows).fill(0);
  }
}

function drawLine(v1, v2) {
  stroke(strokeColor);
  strokeWeight(strokeWidth);
  line(v1.x, v1.y, v2.x, v2.y);
}

function draw() {
  background(backgroundColor);

  let xoff = 0;
  for (let i = 0; i < cols; i++) {
    let yoff = 0;
    for (let j = 0; j < rows; j++) {
      field[i][j] = float(noiseSource.noise3D(xoff, yoff, zoff));
      yoff += noiseScale;
    }
    xoff += noiseScale;
  }
  zoff += zIncrement;

  for (let i = 0; i < cols - 1; i++) {
    for (let j = 0; j < rows - 1; j++) {
      let x = i * cellSize;
      let y = j * cellSize;

      let state = getState(
        ceil(field[i][j]),
        ceil(field[i + 1][j]),
        ceil(field[i + 1][j + 1]),
        ceil(field[i][j + 1])
      );

      let a_val = field[i][j] + 1;
      let b_val = field[i + 1][j] + 1;
      let c_val = field[i + 1][j + 1] + 1;
      let d_val = field[i][j + 1] + 1;

      let a = createVector(lerp(x, x + cellSize, (1 - a_val) / (b_val - a_val)), y);
      let b = createVector(x + cellSize, lerp(y, y + cellSize, (1 - b_val) / (c_val - b_val)));
      let c = createVector(lerp(x, x + cellSize, (1 - d_val) / (c_val - d_val)), y + cellSize);
      let d = createVector(x, lerp(y, y + cellSize, (1 - a_val) / (d_val - a_val)));

      switch (state) {
        case 1:  drawLine(c, d); break;
        case 2:  drawLine(b, c); break;
        case 3:  drawLine(b, d); break;
        case 4:  drawLine(a, b); break;
        case 5:  drawLine(a, d); drawLine(b, c); break;
        case 6:  drawLine(a, c); break;
        case 7:  drawLine(a, d); break;
        case 8:  drawLine(a, d); break;
        case 9:  drawLine(a, c); break;
        case 10: drawLine(a, b); drawLine(c, d); break;
        case 11: drawLine(a, b); break;
        case 12: drawLine(b, d); break;
        case 13: drawLine(b, c); break;
        case 14: drawLine(c, d); break;
      }
    }
  }
}

function getState(a, b, c, d) {
  return a * 8 + b * 4 + c * 2 + d * 1;
}
