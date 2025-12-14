import React, { useEffect, useState } from 'react';
import { ChevronLeft, ArrowLeft, Search } from 'lucide-react';
import { Link } from 'react-router-dom';


interface Karlmon {
  id: number;
  name: string;
  description: string;
  image: string;
  type: string;
}

const typeColors: Record<string, string> = {
  Normal: "bg-gray-400",
  Fire: "bg-red-600",
  Water: "bg-blue-600",
  Pending: "bg-gray-600",
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
  "Bug/Grass": "bg-gradient-to-r from-lime-600 to-green-600",
  "Ghost/Poison": "bg-gradient-to-r from-indigo-700 to-purple-700",
  "Psychic/Fire": "bg-gradient-to-r from-pink-600 to-red-700",
  "Dark/Fairy": "bg-gradient-to-r from-gray-800 to-pink-500",
  "Fire/Fighting": "bg-gradient-to-r from-red-700 to-orange-700"
};

export function useKarlmons() {
  const [karlmons, setKarlmons] = useState<Karlmon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchKarlmons() {
      try {
        console.log("Starting fetch...");
        // const res = await fetch("http://100.117.27.39:8001/data")
        // const res = await fetch("/SKS/2025/KarldexDb.json");
        const res = await fetch("KarldexDb.json");
        console.log("Response status:", res.status, res.ok);
        console.log(res);
        
        const json = await res.json();
        console.log("JSON structure:", json);
        console.log("Data array:", json.data);
        
        // Your JSON has structure: { "data": [...] }
        const dataArray = json.data || [];
        console.log("Setting karlmons, count:", dataArray.length);
        setKarlmons(dataArray);
      } catch (err) {
        console.error("Failed to load Kárlmons:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchKarlmons();
  }, []);

  return { karlmons, loading };
}

const Karldex: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { karlmons, loading } = useKarlmons();

  const pokemonList: Karlmon[] = karlmons.map((karlmon) => ({
    //number: karlmon.id.toString().padStart(3, '0'), // Format as 001, 002, etc.
    id: karlmon.id,
    name: karlmon.name,
    description: karlmon.description,
    image: karlmon.image,
    type: Array.isArray(karlmon.type)
      ? (karlmon.type.length === 2 ? karlmon.type.join("/") : karlmon.type[0])
      : karlmon.type
  }));
  console.log("pokemonu: ", pokemonList.length);

  const filteredPokemon = pokemonList.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pokemon.id.toString().includes(searchTerm)
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
              key={pokemon.id}
              className="bg-white rounded-lg shadow-xl overflow-hidden transform transition-all duration-200 hover:scale-105 hover:shadow-2xl cursor-pointer border-4 border-gray-200 hover:border-red-400"
            >
              {/* Pokémon Number Badge */}
              <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2">
                <span className="font-bold text-lg">#{pokemon.id}</span>
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
