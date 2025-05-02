import React from 'react'
import MeublesRotin from "../../assets/Meubles Rotin.jpg"
import LuminairesRotin from "../../assets/Luminaires Rotin.jpg"
import ObjetsdeDécoration from "../../assets/Objets de Décoration.jpg"
import DécorationsMurales from "../../assets/Décorations Murales.jpg"
import { Link } from 'react-router-dom'
const CollectionSection = () => {
  return (
    <section className="py-16 px-4 lg:px-0">
        <div className="container mx-auto text-center mb-10 relative">
            <h2 className="text-2xl font-bold mb-4">
            Explorez Nos Collections
            </h2>
            <p className="text-lg text-gray-600 mb-8">
            Découvrir les créations artisanales récentes d'Artisanat Cheffi, mêlant tradition et modernité.
            </p>
        </div>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4 lg:grid-cols-4">
            <div className="relative flex-1">
                <img src={MeublesRotin} alt="Meubles Rotin" className="w-full h-[300px] object-cover"/>
                <div className="absolute bottom-5 left-5 bg-white bg-opacity-90 p-4">
                    <h2 className="text-lg font-bold text-gray-900 mb-3">
                    Meubles Rotin
                    </h2>
                    <Link to="/collections/all?collection=Meubles Rotin" className="text-gray-900 underline">
                     Shop Now
                    </Link>
                </div>
            </div>
            <div className="relative flex-1">
                <img src={LuminairesRotin} alt="Luminaires Rotin" className="w-full h-[300px] object-cover"/>
                <div className="absolute bottom-5 left-5 bg-white bg-opacity-90 p-4">
                    <h2 className="text-lg font-bold text-gray-900 mb-3">
                    Luminaires Rotin
                    </h2>
                    <Link to="/collections/all?collection=Luminaires Rotin" className="text-gray-900 underline">
                     Shop Now
                    </Link>
                </div>
            </div>
            <div className="relative flex-1">
                <img src={ObjetsdeDécoration} alt="Objets de Décoration" className="w-full h-[300px] object-cover"/>
                <div className="absolute bottom-5 left-5 bg-white bg-opacity-90 p-4">
                    <h2 className="text-lg font-bold text-gray-900 mb-3">
                    Objets de Décoration 
                    </h2>
                    <Link to="/collections/all?collection=Objets de Décoration" className="text-gray-900 underline">
                     Shop Now
                    </Link>
                </div>
            </div>
            <div className="relative flex-1">
                <img src={DécorationsMurales} alt="Décorations Murales" className="w-full h-[300px] object-cover"/>
                <div className="absolute bottom-5 left-5 bg-white bg-opacity-90 p-4">
                    <h2 className="text-lg font-bold text-gray-900 mb-3">
                    Décorations Murales
                    </h2>
                    <Link to="/collections/all?collection=Décorations Murales" className="text-gray-900 underline">
                     Shop Now
                    </Link>
                </div>
            </div>
        </div>
    </section>
  )
}

export default CollectionSection
