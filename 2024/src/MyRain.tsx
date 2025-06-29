import React, { Component } from 'react';
import PropTypes from 'prop-types';

interface RainProps {
  numDrops: number;
  zIndex: number;
  size: number;
  color: string;
  velocity: number;
}

interface RainState {}

class MyRain extends Component<RainProps, RainState> {
    static defaultProps = {
    zIndex: 1000,
    size: 2,
    color: '#FFFFFF',
    velocity: 15
  };

  private animationFrameId: number | null = null;

  componentDidMount() {
    this.startRain();
    window.addEventListener('resize', this.handleResize);
  }

  componentDidUpdate(prevProps: RainProps) {
    if(this.props.numDrops !== prevProps.numDrops) {
      this.stopRain();
      this.startRain()
    }
  }

  componentWillUnmount() {
    this.stopRain();
    window.removeEventListener('resize', this.handleResize);
  }
  
  handleResize = () => {
    this.stopRain();
    this.startRain();
  }

  startRain = () => {
    const rainSection = document.getElementById('Rain');
    if (!rainSection) return;

    const createDrop = () => {
      const { innerWidth: width, innerHeight: height } = window;
      const dropLeft = this.randRange(0, width);
      const dropTop = -this.props.size * 15; // Start above the screen

      const drop = document.createElement('div');
      drop.setAttribute('class', 'drop');
      drop.style.left = `${dropLeft}px`;
      drop.style.top = `${dropTop}px`;
      drop.style.zIndex = `${this.props.zIndex}`;
      drop.style.width = `${this.props.size}px`;
      drop.style.height = `${this.props.size * 15}px`;
      drop.style.background = `linear-gradient(to bottom, rgba(255,255,255,0) 0%, ${this.props.color} 100%)`;
      drop.style.filter = 'blur(1px)';
      drop.style.position = 'absolute';

      rainSection.appendChild(drop);

      return drop;
    };

    const drops: HTMLElement[] = [];
    for (let i = 0; i < this.props.numDrops; i++) {
      drops.push(createDrop());
    }

    const animateRain = () => {
      const height = window.innerHeight;
      drops.forEach((drop, index) => {
        let top = parseFloat(drop.style.top);
        top += this.props.velocity;
        drop.style.top = `${top}px`;

        if (top > height) {
          rainSection.removeChild(drop);
          drops[index] = createDrop();
        }
      });

      this.animationFrameId = requestAnimationFrame(animateRain);
    };

    this.animationFrameId = requestAnimationFrame(animateRain);
  }

  // startRain() {
  //   const rainSection = document.getElementById('Rain');
  //   if (!rainSection) return;

  //   const { innerWidth: width, innerHeight: height } = window;
  //   console.log("width:", width);
  //   console.log("height:", height);

  //   for (let i = 1; i < this.props.numDrops; i++) {
  //     const dropLeft = this.randRange(0, width);
  //     const dropTop = this.randRange(-height, 0);

  //     const drop = document.createElement('div');
  //     drop.setAttribute('class', 'drop');
  //     drop.setAttribute('id', `drop${i}`);

  //     rainSection.appendChild(drop);

  //     drop.style.left = `${dropLeft}px`;
  //     drop.style.top = `${dropTop}px`;
  //     drop.style.zIndex = `${this.props.zIndex}`;
  //     drop.style.width = `${this.props.size}px`;
  //     drop.style.height = `${this.props.size * 15}px`;
  //     drop.style.background = `linear-gradient(to bottom, rgba(255,255,255,0) 0%, ${this.props.color} 100%)`;
  //     drop.style.filter = 'blur(1px)';
  //     drop.style.position = 'absolute';

  //     this.animate(drop);
  //   }
  // }

  stopRain() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    const rainSection = document.getElementById('Rain');
    if (!rainSection) return;

    while (rainSection.firstChild) {
      rainSection.removeChild(rainSection.firstChild);
    }
  }

  // animate = (drop: HTMLElement) => {
  //   const height = window.innerHeight;
  //   let position = parseInt(drop.style.top, 10);
  //   const moveRain = () => {
  //     if (position >= height) {
  //       position = -parseFloat(drop.style.height);
  //       drop.style.left = `${this.randRange(0, window.innerWidth)}px`;
  //     }
  //     position += this.props.velocity;
  //     drop.style.top = `${position}px`;
  //     requestAnimationFrame(moveRain);
  //   };
  //   requestAnimationFrame(moveRain);
  // }

  randRange(minNum: number, maxNum: number): number {
    return (Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
  }

  render() {
    return (
      <div id="Rain" style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: this.props.zIndex
      }}></div>
    );
  }
}

export default MyRain;
