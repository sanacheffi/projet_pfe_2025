import React from 'react';
import AC3 from "../../assets/AC3.jpg";

const DevisFormPreview = () => {
  return (
    <div className="bg-white py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">
          {/* Left Text Section */}
          <div className="lg:max-w-xl text-center md:text-left mx-auto lg:mx-0">
            <h2 className="text-4xl text-gray-900 sm:text-5xl">
              Besoin d’un devis ou d’un produit personnalisé ?
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Vous souhaitez commander en gros ou créer un article sur mesure ? 
              Nous sommes à votre écoute pour répondre à vos besoins spécifiques et vous proposer un devis adapté.
            </p>
            <div className="mt-8">
              <a
                href="/devis"
                className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 inline-block"
              >
                Demander un devis
              </a>
            </div>
          </div>

          {/* Right Images Section (hidden on small screens) */}
          <div className="hidden md:grid grid-cols-2 gap-6 lg:gap-8">
            <div className="flex flex-col gap-6">
              <img src={AC3} alt="img1" className="rounded-xl shadow-lg w-60 h-auto object-cover" />
              <img src={AC3} alt="img2" className="rounded-xl shadow-lg w-60 h-auto object-cover" />
              <img src={AC3} alt="img3" className="rounded-xl shadow-lg w-60 h-auto object-cover" />
            </div>
            <div className="flex flex-col gap-6 pt-12">
              <img src={AC3} alt="img4" className="rounded-xl shadow-lg w-60 h-auto object-cover" />
              <img src={AC3} alt="img5" className="rounded-xl shadow-lg w-60 h-auto object-cover" />
              <img src={AC3} alt="img6" className="rounded-xl shadow-lg w-60 h-auto object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevisFormPreview;
