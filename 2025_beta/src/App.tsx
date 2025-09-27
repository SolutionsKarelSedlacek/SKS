import React from 'react';
//import karelImage from './karel.png';

const form_link: string = "https://forms.gle/KtAXmtLjXV3k5EzT8";
const chata_link: string = "https://www.e-chalupy.cz/chalupa-u-alenky-albrechtice-v-jizerskych-horach-pronajem-o16371";

const SilvesterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with skier image placeholder */}
      <div className="relative w-full">
        <div className="flex justify-center">
          <img
            src={process.env.PUBLIC_URL + "/karel.png"}
            alt="Karel Sedláček"
            className="h-32 md:h-40 lg:h-48 object-contain"
          />
        </div>
      </div>

      {/* Main content container */}
      <div className="max-w-4xl mx-auto px-6 py-2">
        
        {/* Main title */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-white">
          Silvester s Karlem Sedláčkem
          <div className="text-red-600">2025</div>
        </h1>
        <h2 className="text-xl md:text-xl font-bold text-center mb-12 text-white">
          27.12.2025 - 3.1.2026
        </h2>

        {/* Two column layout for main content */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          
          {/* Left column - Event info */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
            <ul className="space-y-3 text-lg">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                web bude
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                <span className="line-through text-gray-400">přihláška bude</span>
                <span className="ml-2">
                  <a 
                    href={form_link}
                    className="text-blue-400 hover:text-blue-300 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    už je
                  </a>
                </span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                běžkování bude
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                legenda bude
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                Silvester bude!
              </li>
            </ul>
          </div>

          {/* Right column - Date and details */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-2 text-center">
            </h2>
            
              <div className="bg-gray-800 rounded-xl overflow-hidden border-2 border-gray-600 mb-6 shadow-lg">
    <iframe
      className="w-full h-72"
      src="https://mapy.com/s/jovuhulaza"
      frameBorder="0"
      style={{ border: "none" }}
    ></iframe>
  </div>

            {/* Lorem ipsum */}
            <p className="text-gray-300 text-sm leading-relaxed">
              <a
                href={chata_link}
                className="text-red-600 hover:text-blue-300 underline"
              >Chata Klauzovka</a> se nachází v samotném srdci nádherných Jizerských hor nedaleko Bedřichova, v česku si nelze přát lepší lokaci pro běžkování.
              Chata má saunu a 2 pípy.
              Přijeď.
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Cena bude cca: menší než 500 + jídlo + saunovné / den.
            </p>
          </div>
        </div>

        {/* Footer space */}
        <div className="text-center text-gray-500 text-sm mt-16">
          <p>Více informací brzy...</p>
        </div>
      </div>
    </div>
  );
};

export default SilvesterPage;
