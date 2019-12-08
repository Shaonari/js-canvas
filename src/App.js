import React, { useState, useEffect } from 'react';

import createCanvasArray, { createTextFile } from './canvas-painter';

import './style.css';

function App() {
  const [data, setData] = useState(null);
  const [isParsing, setIsParsing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsParsing(true);

      const result = await createCanvasArray();


      setData(result);
      setIsParsing(false);
    };

    fetchData();
  }, []);

  const drawCanvas = () => {
    let canvas = [];

    for (let y = 0; y < data[0].length; y++) {
      for (let x = 0; x < data.length; x++) {
        switch (data[x][y]) {
          case 'x':
            canvas.push(<div key={`${x}-${y}`} className="cell line" />);
            break;
          case undefined:
            canvas.push(<div key={`${x}-${y}`} className="cell" />);
            break;
          default: canvas.push(<div key={`${x}-${y}`} className="cell fill" />);
        }
      }
    }

    return canvas;
  };

  return (
    <div className="App">
      { isParsing && <div> parsing </div> }
      {
        !isParsing && data &&
        <>
        <div className="container">
          { drawCanvas() }
        </div>
        <a href={ createTextFile(data) } download="output.txt">download</a>
        </>
      }
    </div>
  );
};

export default App;
