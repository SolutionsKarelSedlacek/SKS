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
    name: "Zuzka Sv.",
    description: "It signals its emotions with its melodies. Scientists are studying these melodic patterns. Evolving from Kricketune during sunsets while drinking mountain water in the Beskydy region.",
    image: "karlmoni/zuzka.png",
    type: "Bug"
  },
  {
    number: "004",
    name: "Míša K.",
    description: "Its tongue has highly developed nerves that extend to the very tip, allowing for precise movement. Twice the length of its body, it can freely twist around to catch prey. Its licks cause a tingling sensation. Nemesis of all food.",
    image: "karlmoni/kodad.png",
    type: "Electric"
  },
  {
    number: "005",
    name: "Kuba Ž.",
    description: "For no reason, Magicarp jumps and splashes about, making it easy for predators like PIDGEOTTO to catch it mid-jump. This behavior prompted scientists to skip research into it. Therefore we don't know surely if Slovak form is any different.", 
    image: "karlmoni/jakub.png",
    type: "Water"
  },
  {
    number: "006",
    name: "Manka",
    description: "Mmmmmm, lets get some chocolate and see what can do. People say, that with enought chocolate or gummy bears can spread wing and become butterfly.",
    image: "karlmoni/manka.png",
    type: "Bug/Grass"
  },
  {
    number: "007",
    name: "Jarek Požár",
    description: "Dance form of Blaziken has incredibly strong legs - it can easily clear a 30-story building in one leap. This POKéMON’s blazing punches leave its foes scorched and blackened. Evolving from Blaziken after winning dancing contest while musicaly accompanimented by emmo-music.",
    image: "karlmoni/Jarek.png",
    type: "Fire/Fighting"
  },
  {
    number: "008",
    name: "Dalibor",
    description: "Pendingimage is not kárlmon, its just substitute image before proper image is generated. Karlservers are busy right now. If Kárldex user has hunch how final image should be generated, please contact maintainers of Kárldex.",
    image: "karlmoni/generating.png",
    type: "Pending"
  },
  {
    number: "009",
    name: "Honza P.",
    description: "Pony ta is very weak at birth. It can barely stand up. This Kárlmon becomes stronger by stumbling and falling to keep up with Plzeň.",
    image: "karlmoni/ponic.png",
    type: "Fire"
  },
  {
    number: "010",
    name: "Hans B.",
    description: "At first sight this creature doesn't seem much alive due to his wooden-box visuals and scrunchy movements but could move surprisingly fast.",
    image: "karlmoni/benda.png",
    type: "Pending"
  },
  {
    number: "011",
    name: "Eša",
    description: "Pendingimage is not kárlmon, its just substitute image before proper image is generated. Karlservers are busy right now. If Kárldex user has hunch how final image should be generated, please contact maintainers of Kárldex.",
    image: "karlmoni/generating.png",
    type: "Pending"
  },
  {
    number: "012",
    name: "Bianka",
    description: "For no reason, Magicarp jumps and splashes about, making it easy for predators like PIDGEOTTO to catch it mid-jump. This behavior prompted scientists to skip research into it. Therefore we don't know surely if Slovak form is any different.", 
    image: "karlmoni/slovakmon.png",
    type: "Water"
  },
  {
    number: "013",
    name: "Jarda P.",
    description: "Pendingimage is not kárlmon, its just substitute image before proper image is generated. Karlservers are busy right now. If Kárldex user has hunch how final image should be generated, please contact maintainers of Kárldex.",
    image: "karlmoni/generating.png",
    type: "Pending"
  },
  {
    number: "014",
    name: "Martin Švanda",
    description: "Pendingimage is not kárlmon, its just substitute image before proper image is generated. Karlservers are busy right now. If Kárldex user has hunch how final image should be generated, please contact maintainers of Kárldex.",
    image: "karlmoni/generating.png",
    type: "Pending"
  },
  {
    number: "015",
    name: "Jirka K.",
    description: "Pendingimage is not kárlmon, its just substitute image before proper image is generated. Karlservers are busy right now. If Kárldex user has hunch how final image should be generated, please contact maintainers of Kárldex.",
    image: "karlmoni/generating.png",
    type: "Pending"
  },
  {
    number: "016",
    name: "'Péčko' Z.",
    description: "Pendingimage is not kárlmon, its just substitute image before proper image is generated. Karlservers are busy right now. If Kárldex user has hunch how final image should be generated, please contact maintainers of Kárldex.",
    image: "karlmoni/generating.png",
    type: "Pending"
  },
  {
    number: "017",
    name: "Tom Dvořák",
    description: "This one looks harmless and is harmless, besides obliterating you in chess, making a killer excel sheet and destroying you with memes. Alright, not so harmless afterall.",
    image: "karlmoni/tom2.png",
    type: "Bug"
  },
  {
    number: "018",
    name: "Fofík",
    description: "Pendingimage is not kárlmon, its just substitute image before proper image is generated. Karlservers are busy right now. If Kárldex user has hunch how final image should be generated, please contact maintainers of Kárldex.",
    image: "karlmoni/generating.png",
    type: "Pending"
  },
  {
    number: "019",
    name: "Markét L.",
    description: "Pendingimage is not kárlmon, its just substitute image before proper image is generated. Karlservers are busy right now. If Kárldex user has hunch how final image should be generated, please contact maintainers of Kárldex.",
    image: "karlmoni/generating.png",
    type: "Pending"
  },
  {
    number: "020",
    name: "Evžen",
    description: "What are any of us doing here? Whether get your question right or wrong, free will is an illusion. Are we playing in Evžen movie, or is Evžen movie playing us?",
    image: "karlmoni/evzen.png",
    type: "Not Normal"
  },
  {
    number: "021",
    name: "Bambi",
    description: "Though gentle by nature, it believes that to fight fires, there has to be fire in first place. Don't be fooled by it cuteness. This Kárlmon creates small flames in its fists to protect forests from greater threats.",
    image: "karlmoni/bambi.png",
    type: "Engineer"
  },
  {
    number: "022",
    name: "Barča Ž.",
    description: "Pendingimage is not kárlmon, its just substitute image before proper image is generated. Karlservers are busy right now. If Kárldex user has hunch how final image should be generated, please contact maintainers of Kárldex.",
    image: "karlmoni/generating.png",
    type: "Pending"
  },
  {
    number: "023",
    name: "Puf",
    description: "Great explorer, but can’t resist petting cats, so basically can be observed on same places. For the sake of specialty food able to walk vast distances in search of rare flavors. Its curiosity knows no limits, often leading it on long treks for a single perfect bite instead of having proper rest and occasional mental tuning.",
    image: "karlmoni/pufmime.png",
    type: "Pending"
  },
  {
    number: "024",
    name: "Kuba Šťastný",
    description: "Pendingimage is not kárlmon, its just substitute image before proper image is generated. Karlservers are busy right now. If Kárldex user has hunch how final image should be generated, please contact maintainers of Kárldex.",
    image: "karlmoni/generating.png",
    type: "Pending"
  },
  {
    number: "025",
    name: "Akvožu",
    description: "It's just užovka. It's just spelled backwards. Feeds on ZISK offsprings.",
    image: "karlmoni/uzovka.png",
    type: "Poison"
  },
  {
    number: "026",
    name: "Petr anebo Martin",
    description: "Pendingimage is not kárlmon, its just substitute image before proper image is generated. Karlservers are busy right now. If Kárldex user has hunch how final image should be generated, please contact maintainers of Kárldex.",
    image: "karlmoni/generating.png",
    type: "Pending"
  },
  {
    number: "027",
    name: "Vojta V.",
    description: "Pendingimage is not kárlmon, its just substitute image before proper image is generated. Karlservers are busy right now. If Kárldex user has hunch how final image should be generated, please contact maintainers of Kárldex.",
    image: "karlmoni/generating.png",
    type: "Pending"
  },
  {
    number: "028",
    name: "Verča M.",
    description: "Pendingimage is not kárlmon, its just substitute image before proper image is generated. Karlservers are busy right now. If Kárldex user has hunch how final image should be generated, please contact maintainers of Kárldex.",
    image: "karlmoni/generating.png",
    type: "Pending"
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
