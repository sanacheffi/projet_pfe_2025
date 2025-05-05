import React from 'react';
import HP1 from "../../assets/HP1.jpg";
import HP2 from "../../assets/HP2.jpg";
import HP3 from "../../assets/HP3.jpg";
import HP4 from "../../assets/HP4.jpg";
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="flex flex-col md:flex-row-reverse items-center justify-between px-8 py-8 bg-white">

      {/* Image Grid - Responsive adjustments */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 w-full md:max-w-2xl mb-8 md:mb-0">
        <div className="overflow-hidden shadow-md aspect-[3/2]"> 
          <img src={HP1} className="w-full h-full object-cover" alt="Artisanat Cheffi product" />
        </div>
        <div className="overflow-hidden shadow-md aspect-[3/2]">
          <img src={HP2} className="w-full h-full object-cover" alt="Artisanat Cheffi product" />
        </div>
        <div className="overflow-hidden shadow-md aspect-[3/2]">
          <img src={HP3} className="w-full h-full object-cover" alt="Artisanat Cheffi product" />
        </div>
        <div className="overflow-hidden shadow-md aspect-[3/2]">
          <img src={HP4} className="w-full h-full object-cover" alt="Artisanat Cheffi product" />
        </div>
      </div>

      {/* Text Section */}
      <div className="max-w-xl text-center md:text-left">
        <h1 className="Artisanat text-4xl lg:text-6xl mb-6 md:mb-8">
          Artisanat Cheffi
        </h1>
        <p className="text-gray-500 lg:text-lg leading-8 mt-4 md:mt-6">
          Un savoir-faire artisanal transmis de génération en génération façonné à la main avec passion et précision.
        </p>
        <div className="flex gap-4 mt-6 md:mt-8 justify-center md:justify-start">
          <Link
            to="/collections/all"
            className="border border-black text-black px-6 py-3 rounded hover:bg-gray-100 transition"
          >
            Voir tous les produits
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;