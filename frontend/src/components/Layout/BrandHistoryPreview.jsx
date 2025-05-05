import React from 'react'
import ArtisanatCheffi from "../../assets/ArtisanatCheffi.jpg"

const BrandHistoryPreview = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between bg-white py-16 px-8 lg:px-24">
      {/* Left Content */}
      <div className="max-w-xl text-center md:text-left">
        <h1 className="text-4xl Artisanat sm:text-5xl">
          Artisanat Cheffi
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Un savoir-faire artisanal transmis de génération en génération. <br />
          Nos meubles, luminaires et objets en rotin incarnent l’élégance naturelle et la durabilité. <br />
        </p>
        <div className="mt-8">
          <a href="/history" className="text-sm font-semibold text-gray-900 hover:underline">
            En savoir plus <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      {/* Right Image - only visible on large screens */}
      <div className="hidden md:block mt-12 md:mt-0 h-96 w-96">
        <img
          src={ArtisanatCheffi}
          alt="Artisanat Cheffi"
          className="w-full h-full rounded-md object-cover"
        />
      </div>
    </div>
  );
}

export default BrandHistoryPreview;
