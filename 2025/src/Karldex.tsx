import React, { useState } from 'react';
import { ChevronLeft, ArrowLeft, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Pokemon {
  number: string;
  name: string;
  description: string;
  image: string;
  type: string;
}

const Karldex: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample Pokémon data - replace with your actual data
  const pokemonList: Pokemon[] = [
    {
      number: "001",
      name: "Tadeáš",
      description: "A strange seed was planted on its back at birth, growing alongside this creature.",
      image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/201.png",
      type: "Grass/Poison"
    },
    {
      number: "002",
      name: "Ondra Polák",
      description: "The flame that burns at the tip of its tail is an indication of its emotions.",
      image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/146.png",
      type: "Fire"
    },
    {
      number: "003",
      name: "Zuzka",
      description: "When it retracts its long neck into its shell, it squirts out water with vigorous force.",
      image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/402.png",
      type: "Water"
    },
    {
      number: "004",
      name: "Míša Kódy",
      description: "When several of these creatures gather, their electricity creates lightning storms.",
      image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/212.png",
      type: "Electric"
    },
    {
      number: "150",
      name: "Fak",
      description: "Created from genetic experiments, it is a Pokémon that exists solely for battle.",
      image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/583.png",
      type: "Psychic"
    },
    {
      number: "151",
      name: "Klátra",
      description: "Created from genetic experiments, it is a Pokémon that exists solely for battle.",
      image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/569.png",
      type: "Psychic"
    }
  ];

  const filteredPokemon = pokemonList.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pokemon.number.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="mb-4 flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors w-fit">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Main</span>
          </Link>
          
          <div className="bg-gray-900 border-4 border-red-600 rounded-lg p-6 shadow-2xl">
            <h1 
              className="text-4xl md:text-5xl font-bold text-center mb-2"
              style={{
                fontFamily: 'Pokemon Solid, Impact, sans-serif',
                textShadow: '3px 3px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000, 1px 1px 0px #000',
                letterSpacing: '2px',
                color: '#FFD700'
              }}
            >
              KÁRLDEX
            </h1>
            <p className="text-center text-gray-400 text-lg">Database of Captured Creatures</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border-2 border-red-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-400 transition-colors"
            />
          </div>
        </div>

        {/* Pokémon Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPokemon.map((pokemon) => (
            <div
              key={pokemon.number}
              className="bg-white rounded-lg shadow-xl overflow-hidden transform transition-all duration-200 hover:scale-105 hover:shadow-2xl cursor-pointer border-4 border-gray-200 hover:border-red-400"
            >
              {/* Pokémon Number Badge */}
              <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2">
                <span className="font-bold text-lg">#{pokemon.number}</span>
                <span className="float-right text-sm bg-red-800 px-2 py-1 rounded">{pokemon.type}</span>
              </div>

              {/* Pokémon Image */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
                <img
                  src={pokemon.image}
                  alt={pokemon.name}
                  className="w-40 h-40 object-contain drop-shadow-lg"
                />
              </div>

              {/* Pokémon Info */}
              <div className="p-4 bg-white">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{pokemon.name}</h2>
                <p className="text-gray-600 text-sm leading-relaxed">{pokemon.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredPokemon.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-xl">No Pokémon found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Karldex;
