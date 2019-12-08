import createCanvasArray from '../src/canvas-painter';

describe('Canvas painter', () => {
  it('should returns canvas with correct dimensions', () => {
    const text = 'C 6 5';

    const result = createCanvasArray(text);

    expect(result.length).toEqual(6);
    result.forEach(line => {
      expect(line.length).toEqual(5);
    });
  });

  it('should thows an error if canvas command is missing', () => {
    const text = 'L 1 1 2 2';

    try {
      createCanvasArray(text);
    } catch(error) {
      expect(error.message).toEqual('Canvas field is missing');
    }
  });

  it('should throws an error if unknown command is passed', () => {
    const text = 'C 5 6\nF 1';

    try {
      createCanvasArray(text);
    } catch(error) {
      expect(error.message).toEqual('Unsupported command line');
    }
  });

  describe('drawLine', () => {
    it('should draws horizontal line if command has correct argument list', () => {
      const text = 'C 6 5\nL 1 2 3 2';

      const result = createCanvasArray(text);

      for(let x = 0; x < 3; x++) {
        expect(result[x][1]).toEqual('x');
      }
    });

    it('should draws vertical line if command has correct argument list', () => {
      const text = 'C 6 5\nL 1 2 1 5';

      const result = createCanvasArray(text);

      for(let y = 1; y < 5; y++) {
        expect(result[0][y]).toEqual('x');
      }
    });

    it('should throws an error if command has wrong arguments length', () => {
      const text = 'C 6 5\nL 1 2 3';

      try {
        createCanvasArray(text);
      } catch (error) {
        expect(error.message).toEqual('Incorrect arguments length');
      }
    });

    it('should throws an error if line is diagonal', () => {
      const text = 'C 6 5\nL 1 2 3 4';

      try {
        createCanvasArray(text);
      } catch (error) {
        expect(error.message).toEqual('Unsupported diagonal line');
      }
    });

    it('should throws an error if line goes out of the field', () => {
      const text = 'C 6 5\nL 1 2 1 7';

      try {
        createCanvasArray(text);
      } catch (error) {
        expect(error.message).toEqual('Line cannot be drawn outside of canvas');
      }
    });
  });

  describe('drawRectangle', () => {
    it ('should draws rectangle if command has correct argument list', () => {
      const text = 'C 6 5\nR 1 1 3 3';

      const result = createCanvasArray(text);

      for (let x = 0; x < 2; x++) {
        for (let y = 0; y < 2; y++) {
          if (x === 0 || x === 2) {
            expect(result[x][y]).toEqual('x');
          } else if (y === 0 || y === 2) {
            expect(result[x][y]).toEqual('x');
          }
        }
      }

      expect(result[1][1]).toEqual(undefined);
    });

    it('should throws an error if command has wrong arguments length', () => {
      const text = 'C 6 5\nR 1 1 3';

      try {
        createCanvasArray(text);
      } catch (error) {
        expect(error.message).toEqual('Incorrect arguments length');
      }
    });

    it('should throws an error if rectangle goes out of the field', () => {
      const text = 'C 6 5\nR 1 2 1 7';

      try {
        createCanvasArray(text);
      } catch (error) {
        expect(error.message).toEqual('Rectangle cannot be drawn outside of canvas');
      }
    });
  });

  describe('floodArea', () => {
    it ('should fills unclosed empty area', () => {
      const text = 'C 6 5\nL 2 1 2 5\nB 4 4 o';

      const result = createCanvasArray(text);

      for (let y = 0; y < 5; y++) {
        expect(result[1][y]).toEqual('x');
        expect(result[0][y]).toEqual(undefined);
      }

      for (let x = 2; x < 6; x++) {
        for (let y = 0; y < 5; y++) {
          expect(result[x][y]).toEqual('o');
        }
      };
    });

    it('should fills only drawn line if mark hits that line', () => {
      const text = 'C 6 5\nL 2 1 2 5\nB 2 2 o';

      const result = createCanvasArray(text);

      for (let y = 0; y < 5; y++) {
        expect(result[1][y]).toEqual('o');
        expect(result[0][y]).toEqual(undefined);
      }

      for (let x = 2; x < 6; x++) {
        for (let y = 0; y < 5; y++) {
          expect(result[x][y]).toEqual(undefined);
        }
      };
    });

    it('should not fills area if mark is placed outside the area', () => {
      const text = 'C 6 5\nL 2 1 2 5\nB 2 2 o';

      const result = createCanvasArray(text);

      for (let y = 0; y < 5; y++) {
        expect(result[1][y]).toEqual('o');
        expect(result[0][y]).toEqual(undefined);
      }

      for (let x = 2; x < 6; x++) {
        for (let y = 0; y < 5; y++) {
          expect(result[x][y]).toEqual(undefined);
        }
      };
    });
  });
});
