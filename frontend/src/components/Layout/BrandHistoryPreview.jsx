import React from 'react';

const BrandHistoryPreview = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-white py-10 px-8 lg:px-24 text-center">
      <div className="max-w-xl">
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
    </div>
  );
}

export default BrandHistoryPreview;
