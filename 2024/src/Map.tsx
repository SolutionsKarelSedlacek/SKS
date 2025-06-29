import React from 'react';
import World from './sks_work_space.svg';
import WorldPNG from './sks_work_space.png';
import './App.css';
// @ts-ignore
import Fade from 'react-reveal/Fade';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

function Map() {
  const header = "Seznam organizátorů, účastníků a možná i informací"

  return (
    <div className="App-world">
      <header className="SKS-header">
        <Fade top>
          <p>
             {header}
          </p>
        </Fade>
      </header>
      <TransformWrapper>
      <TransformComponent>
            <img
              className="SKS-world"
              src={WorldPNG}
              alt="SKS World"
            />
      </TransformComponent>
      </TransformWrapper>
    </div>
  );
}

export default Map;
