import React, { useEffect, useCallback, useState } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import city from './noir.svg';
import discord from './discord.svg';
import discord2 from './discord2.svg';
import damien from './damien_post.svg';
import './App.css';
// @ts-ignore
//import ReactRain from 'react-rain-animation';
// import all the styles
//import "react-rain-animation/lib/style.css";
import MyRain from './MyRain';

const DROPS_PER_PIXEL = 0.0005;

function App() {
  const [nbDrop, setNbDrop] = useState(0);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  // const nbDrop = 858;

  const randRange = (minNum: number, maxNum: number) => {
    return Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
  };

  const calculateDrops = useCallback(() => {
  const area = windowSize.width * windowSize.height;
    return Math.floor(area * DROPS_PER_PIXEL);
  }, [windowSize]);

  const createRain = useCallback(() => {
    const rainSection = document.querySelector('.rain');
    if (!rainSection) return;

    // Clear existing rain drops
    rainSection.innerHTML = '';

    const drops = calculateDrops();
    for (let i = 1; i < drops; i++) {
      const dropLeft = randRange(0, window.innerWidth);
      const dropTop = randRange(-1000, window.innerHeight);
      const drop = document.createElement('div');
      drop.classList.add('drop');
      drop.id = `drop${i}`;
      drop.style.left = `${dropLeft}px`;
      drop.style.top = `${dropTop}px`;
      rainSection.appendChild(drop);
    }
    setNbDrop(drops);
  }, [windowSize, calculateDrops]);

  useEffect(() => {
    //createRain();
    
    // Debounce the resize event
    // let resizeTimer: NodeJS.Timeout;
    // const handleResize = () => {
    //   clearTimeout(resizeTimer);
    //   resizeTimer = setTimeout(() => {
    //     createRain();
    //   }, 250);
    // };
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call to set the correct window size
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    createRain();
  }, [createRain]);

  const discordUrl = "https://discord.gg/34mxUjXMF6";
  const textik = "Karel je na stopě konci roku, který se mu snaží uniknout. Rok se žene do neznáma. Neznámo se žene na Karla.";
  const event_name = "Silvestr s Karlem Sedláčkem 2024";
  const event_place = "Chata v horách";
  const event_date = "27.12.-2.1.";
  const urlPrihlaska = "https://forms.gle/Cr4npvXEFJRfSu3p8";
  const urlCalendar = "https://app.myadvent.net/calendar?id=lc96f7j394yf0mi7q0ozfrom0ff0e9kb";

  return (
    <div className="App">
      <div className="rain"></div>
      <header className="App-header">
        <h1  className="event-name">{event_name}</h1>
        <p className="event-date">{event_date}</p>
        <p className="event-date">{event_place}</p>
        <p className="text">{textik}</p>
        <div className="button-wrapper"style={{ position: 'relative', zIndex: 10 }}>
          <a href={urlPrihlaska} className="App-link" target="_blank" rel="noopener noreferrer">Info v přihlášce</a>
        </div>
        <div className="button-wrapper"style={{ position: 'relative', zIndex: 10 }}>
          <a href={urlCalendar} className="App-link" target="_blank" rel="noopener noreferrer">Adventní 🗓️</a>
        </div>
        <div className="discord-box">
          <a href={discordUrl} target="_blank" rel="noopener noreferrer" className="discord-link">
            <img src={discord} className="Discord" alt="discord" />
            <div className="overlay"></div>
          </a>
        </div>
      </header>
    </div>
  );
}

export default App;
