import React from 'react'
import { Link } from 'react-router-dom'
import AC3 from "../../assets/AC3.jpg"

const BrandStory = () => {
  return (
    <section className="py-16 px-4 lg:px-0">
        <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center bg-[#dbb47e] rounded-3xl">
            <div className="lg:w-1/2 p-8 text-center lg:text-left">
            <h2 className="text-lg font-semibold text-white mb-2">
                Notre Histoire
            </h2>
            <h2 className="Artisanat text-4xl lg:text-5xl text-white font-bold mb-6">
            Artisanat Cheffi
            </h2>
            <p className="text-lg text-white mb-6">Un savoir-faire artisanal transmis de génération en génération. </p>
            <Link to="#" className="bg-white text-gray-950 px-6 py-2 rounded-md text-sm">
            Découvrez plus
                </Link>
            </div>
            <div className="lg:w-1/2">
            <img src={AC3} alt="notrehistoire" className="w-full h-full object-cover lg:rounded-tr-3xl lg:rounded-br-3xl"/>
            </div>
        </div>
    </section>
  )
}

export default BrandStory
