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

const typeColors: Record<string, string> = {
  Normal: "bg-gray-400",
  Fire: "bg-red-600",
  Water: "bg-blue-600",
  Electric: "bg-yellow-500",
  Grass: "bg-green-600",
  Ice: "bg-cyan-500",
  Fighting: "bg-orange-700",
  Poison: "bg-purple-700",
  Ground: "bg-yellow-800",
  Flying: "bg-sky-500",
  Psychic: "bg-pink-600",
  Bug: "bg-lime-600",
  Rock: "bg-stone-600",
  Ghost: "bg-indigo-700",
  Dragon: "bg-indigo-800",
  Dark: "bg-gray-800",
  Steel: "bg-slate-600",
  Fairy: "bg-pink-400",
  "Grass/Poison": "bg-gradient-to-r from-green-600 to-purple-700",
  "Ghost/Poison": "bg-gradient-to-r from-indigo-700 to-purple-700",
  "Psychic/Fire": "bg-gradient-to-r from-pink-600 to-red-700",
  "Dark/Fairy": "bg-gradient-to-r from-gray-800 to-pink-500"
};

const Karldex: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const pokemonList: Pokemon[] = [
  {
    number: "001",
    name: "Tadeáš",
    description: "A ghost wandering around the world, desperately seeking its nickname, clutching a wrinkled birth certificat bearing only its name. It's the last remnant of its previous lives. Often appears skittish — that’s because echoes of past times still whisper to him.",
    image: "karlmoni/tadeas.png",
    type: "Fairy"
  },
  {
    number: "002",
    name: "Ondra Polák",
    description: "A Pokémon that uses its psychic powers for ultimate cooking. It is highly intelligent and capable of instantly identifying its foe’s weakness — such as gluten or histamine. Its final form of Abra evolves from Alakazam using a Cooking Stone. Depending on the stone used in combination, it can evolve into Italian, French, or Vietnamese form.",
    image: "karlmoni/ondrapolak.png",
    type: "Psychic/Fire"
  },
  {
    number: "003",
    name: "Zuzka",
    description: "Its tongue has well-developed nerves that run to the very tip, so it can be deftly manipulated. Its tongue, twice its body's length, moves around freely to catch prey. Its licks cause a tingling sensation. Nemesis of all food.",
    image: "karlmoni/zuzka.png",
    type: "Bug"
  },
  {
    number: "004",
    name: "Míša Kodad",
    description: "Its tongue has highly developed nerves that extend to the very tip, allowing for precise movement. Twice the length of its body, it can freely twist around to catch prey. Its licks cause a tingling sensation. Nemesis of all food.",
    image: "karlmoni/kodad.png",
    type: "Electric"
  },
  {
    number: "150",
    name: "Fak",
    description: "Probably a ghost created from leftover scraps of calmness itself. Scientists still don’t know how to interact with this entity safely.",
    image: "karlmoni/fakomon.png",
    type: "Dark/Fairy"
  },
  {
    number: "151",
    name: "Klátra",
    description: "Born from genetic experiments, Klátra contains more energy than you can handle. Run.",
    image: "karlmoni/klatra.png",
    type: "Poison"
  }
];
  const pokemonList3: Pokemon[] = [
    {
      number: "001",
      name: "Tadeáš",
      description: "A ghost wondering around the world desperately seeking for its nick name holding wrinkled birth certificate with just name. It is his last ressemlance of his previous lives. Often looks skittysh, thas because echoes of past times are talking to him.",
      image: "karlmoni/tadeas.png",
      type: "Fairy"
    },
    {
      number: "002",
      name: "Ondra Polák",
      description: "A Pokémon that uses his psychic power for ultimate cooking. It is highly intelligent and capable of instantly identifying its foe's weakness, like gluten or histamin. Its final form of Abra evolving from Alakazam by using cooking stone. According to used stone in combination it can be evolved into Italian, French or Vietnamese form.",
      image: "karlmoni/ondrapolak.png",
      type: "Psychic/Fire",
    },
    {
      number: "003",
      name: "Zuzka",
      description: "It signals its emotions with its melodies. Scientists are studying these melodic patterns. Evolving from Kricketune during sunsets while drinking mountain water in Beskydy region.",
      image: "karlmoni/zuzka.png",
      type: "Bug"
    },
    {
      number: "004",
      name: "Míša Kodad",
      description: "Its tongue has well-developed nerves that run to the very tip, so it can be deftly manipulated.  Its tongue, twice its body's length, moves around freely to catch prey. Its licks cause a tingling sensation. Nemesis of all food.",
      image: "karlmoni/kodad.png",
      type: "Electric"
    },
    {
      number: "150",
      name: "Fak",
      description: "Probably ghost created as scrap material of producing calmness. Scientist still don't know how to interact with this thing safely.",
      image: "karlmoni/fakomon.png",
      type: "Dark/Fairy"
    },
    {
      number: "151",
      name: "Klátra",
      description: "Created from genetic experiments, it is a Klátra and have more energy than you can handle. Run.",
      image: "karlmoni/klatra.png",
      type: "Poison"
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
          
          <div className="bg-gray-900 border-4 border-red-600 rounded-lg p-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-center">
              <div className="flex flex-1 flex-col items-center justify-center gap-2">
                <h1
                  className="text-4xl md:text-5xl font-bold flex items-center gap-4"
                  style={{
                    fontFamily: 'Pokemon Solid, Impact, sans-serif',
                    textShadow:
                      '3px 3px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000, 1px 1px 0px #000',
                    letterSpacing: '2px',
                    color: '#FFD700',
                  }}
                >
                  KÁRLDEX
                </h1>
          
                <p className="text-center text-gray-400 text-lg mt-2">
                  Database of Captured Creatures
                </p>
              </div>
              <div className="flex">
              <img
                  src="karlmoni/karel.png"
                  alt="Profesor Karel"
                  className="object-contain drop-shadow-lg h-16 md:h-20 lg:h-24"
                />
              </div>
            </div>
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
          {filteredPokemon.map((pokemon) => {
            const gradient = typeColors[pokemon.type] || "from-gray-500 to-gray-700";
            return (
            <div
              key={pokemon.number}
              className="bg-white rounded-lg shadow-xl overflow-hidden transform transition-all duration-200 hover:scale-105 hover:shadow-2xl cursor-pointer border-4 border-gray-200 hover:border-red-400"
            >
              {/* Pokémon Number Badge */}
              <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2">
                <span className="font-bold text-lg">#{pokemon.number}</span>
                <span
                  className={`float-right px-3 py-1 rounded-full text-white text-sm font-semibold border border-white ${
                    typeColors[pokemon.type] || "bg-gray-500"
                  }`}
                >
                  {pokemon.type}
                </span>
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
          );})}
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
