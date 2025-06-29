import React from 'react';
import logo from './logo.svg';
import './App.css';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, ExternalLink, MapPin, ShoppingCart } from 'lucide-react';

interface Page {
  title: string;
  content: string;
  image?: string;
  isVideo?: boolean;
}

interface ComicPanelProps {
  page: Page;
}

const App : React.FC = () => {
  const handleYouTubeClick = (): void => {
    window.open('https://www.youtube.com/watch?v=6XI1xijqFo8', '_blank');
  };

  const handleFormsClick = (): void => {
    window.open('https://forms.google.com', '_blank');
  };

  const handleChalupaClick = (): void => {
    window.open('https://www.e-chalupy.cz/chalupa-u-alenky-albrechtice-v-jizerskych-horach-pronajem-o16371', '_blank');
  };

  const VideoPanel: React.FC = () => (
    <div className="w-full max-w-4xl mx-auto bg-gray-900 border-4 border-red-600 rounded-lg overflow-hidden shadow-2xl">
      <div className="bg-red-600 text-white p-4 text-center">
        <h1 className="text-2xl font-bold" style={{
          //fontFamily: 'Impact, "Arial Black", Arial, sans-serif',
          fontFamily: 'Pokemon Solid, sans-serif',
          fontSize: '2rem',
          textShadow: '3px 3px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000, 1px 1px 0px #000',
          letterSpacing: '2px',
          color: '#FFD700'
        }}>SILVESTER S KARLEM SEDLÁČKEM 2025</h1>
      </div>
      
      <div className="p-8 text-center">
        <div className="relative mb-6">
          <div className="aspect-video bg-gray-800 border-2 border-red-400 rounded-lg flex items-center justify-center">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/6XI1xijqFo8"
              title="Silvester s Karlem Sedláčkem 2025 - Event Teaser"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-transparent rounded-lg"></div>
        </div>
        
        <div className="space-y-4 text-white">
          <h3 className="text-xl font-bold text-red-400">An Adult Reimagining</h3>
          <p className="text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Experience the Pokemon universe through a mature lens. Explore themes of captivity, 
            corporate control, and rebellion in this immersive evening events.
          </p>

          <div className="pt-6 flex flex-wrap gap-4 justify-center">
            <button 
              onClick={handleFormsClick}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 rounded-lg font-bold transition-all duration-200 flex items-center gap-2 border-2 border-red-400 hover:border-red-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              style={{
                textShadow: '1px 1px 0px #000'
              }}
            >
              <ShoppingCart className="w-5 h-5" />
              Preorder Now
            </button>
            
            <button 
              onClick={handleChalupaClick}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-lg font-bold transition-all duration-200 flex items-center gap-2 border-2 border-green-400 hover:border-green-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              style={{
                textShadow: '1px 1px 0px #000'
              }}
            >
              <MapPin className="w-5 h-5" />
              Explore Karlnto Region
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-gray-400 text-lg">
            A Karel's Take on Pokemon Lore
          </p>
        </div>

        <VideoPanel />

      </div>
    </div>
  );
};

export default App;
