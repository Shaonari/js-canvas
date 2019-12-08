function drawLine (command, canvas) {
  const [, x1, y1, x2, y2] = command;

  if (command.length !== 5) {
    throw new Error('Incorrect arguments length');
  }

  if (x1 !== x2 && y1 !== y2) {
    throw new Error('Unsupported diagonal line');
  }

  if(x1 < 0 || y1 < 0 || x2 > canvas.length || y2 > canvas[0].length) {
    throw new Error('Line cannot be drawn outside of canvas')
  }

  if (x1 === x2) {
    for (let y = y1 - 1; y < y2; y++) {
      canvas[x1 - 1][y] = 'x'
    }
  } else {
    for (let x = x1 - 1; x < x2; x++) {
      canvas[x][y1 - 1] = 'x'
    }
  }
};

function drawRectangle (command, canvas) {
  const [, x1, y1, x2, y2] = command;

  if (command.length !== 5) {
    throw new Error('Incorrect arguments length');
  }

  if(x1 < 0 || y1 < 0 || x2 > canvas.length || y2 > canvas[0].length) {
    throw new Error('Rectangle cannot be drawn outside of canvas')
  }

  for (let x = x1 - 1; x < x2; x++) {
    for (let y = y1 - 1; y < y2; y++) {
      if (x === x1 - 1 || x === x2 - 1) {
        canvas[x][y] = 'x';
      } else if (y === y1 - 1 || y === y2 - 1) {
        canvas[x][y] = 'x';
      }
    }
  }
}

function floodArea (x, y, color, cellColor, canvas) {
  if (x < 0 || x > canvas.length - 1 || y < 0 || y > canvas[0].length - 1) {
    return;
  }

  let targetColor = cellColor;
  if (targetColor === null) {
    targetColor = canvas[x][y];
  }

  if (canvas[x][y] !== targetColor) {
    return;
  }

  canvas[x][y] = color;

  floodArea(x + 1, y, color, targetColor, canvas);
  floodArea(x - 1, y, color, targetColor, canvas);
  floodArea(x, y + 1, color, targetColor, canvas);
  floodArea(x, y - 1, color, targetColor, canvas);
};

export function createTextFile (data) {
  let textFile = null;
  let text = '';

  for (let y = 0; y < data[0].length; y++) {
    for (let x = 0; x < data.length; x++) {
      if (data[x][y] !== undefined) {
        text = text.concat(data[x][y])
      } else {
        text = text.concat(' ');
      }
    }
    text = text.concat('\n');
  }

  let result = new Blob([text], {type: 'text/plain'});

  if (textFile !== null) {
    window.URL.revokeObjectURL(textFile);
  }

  textFile = window.URL.createObjectURL(result);

  return textFile;
};

export default function (text) {
  let canvas = null;
  const lines = text.trim().split('\n');

  if(lines[0].split(' ')[0] !== 'C') {
    throw new Error('Canvas field is missing');
  }

  lines.forEach(line => {
    const command = line.split(' ');

    switch(command[0]) {
      case 'C': 
        canvas = [...Array(parseInt(command[1]))].map(i => Array(parseInt(command[2])));
        break;
      case 'L':
        drawLine(command, canvas);
        break;
      case 'R':
        drawRectangle(command, canvas);
        break;
      case 'B':
        floodArea(command[1] - 1, command[2] - 1, command[3], null, canvas);
        break;
      default: throw new Error('Unsupported command line');
    }
  });

  return canvas;
};