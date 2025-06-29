import React from 'react';
import logo from './damien_post.svg';
import './App.css';
// @ts-ignore
import Fade from 'react-reveal/Fade';
// @ts-ignore
import Zoom from 'react-reveal/Zoom';

function Warning() {
  return (
    <div className="App">
      
      <header className="Warning-header">
        <Fade top>
            <img src={logo} className="App-logo" alt="logo" />
        <p>
          At your own risk.
        </p>

        </Fade>
      </header>
    </div>
  );
}

export default Warning;
