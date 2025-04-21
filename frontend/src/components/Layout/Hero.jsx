import React from 'react'
import AC2 from "../../assets/AC2.jpg"
import { Link } from 'react-router-dom'
const Hero = () => {
  return (
    <section className="relative">
        <img src={AC2} alt="AC" 
        className="w-full h-[400px] md:h-[600px]  object-cover"/>
        <div className="absolute inset-0 bg-black  bg-opacity-5 flex items-center justify-start">
            <div className="text-start text-white p-6">
                <h1 className="Artisanat text-4xl md:text-6xl font-bold tracking-tighter uppercase mb-4">
                    Artisanat <br/> Cheffi
                </h1>
                <p className="text-sm tracking-tighter md:text-lg mb-6">
                Un savoir-faire artisanal transmis de génération en génération.
                </p>
                <Link to="/collections/all" className="bg-white text-gray-950 px-6 py-2 rounded-md text-sm">
                Je Découvre
                </Link>
            </div>
        </div>
    </section>
    
  )
}

export default Hero
