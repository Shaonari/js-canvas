import React, { useState, useEffect } from 'react';

import createCanvasArray, { createTextFile } from './canvas-painter';

import './style.css';

function App() {
  const [data, setData] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsParsing(true);

      try {
        const result = await fetch('./input.txt')
        .then(response => response.text())
        .then(data => {
          return createCanvasArray(data)
        });

        setData(result);
      } catch (error) {
        setError(error.message);
      }

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
      { isParsing && <div className="loader"></div> }
      {
        data &&
        <>
        <div className="container">
          { drawCanvas() }
        </div>
        <a href={ createTextFile(data) } download="output.txt" className="download">download txt file</a>
        </>
      }
      {
        error && <div>{ error }</div>
      }
    </div>
  );
};

export default App;
