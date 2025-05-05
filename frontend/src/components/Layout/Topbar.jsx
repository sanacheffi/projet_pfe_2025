import React from 'react'
import { IoLogoFacebook, IoLogoInstagram } from "react-icons/io"
const Topbar = () => {
  return (
    <div className="bg-[#cead8e] text-white">
      <div className="container mx-auto flex justify-between items-center py-3 px-4">
      <div className="hidden md:flex items-center space-x-4">
        <a href="#" className="hover:text-gray-300">
            <IoLogoInstagram className="h-5 w-5"/>
        </a>
        <a href="#" className="hover:text-gray-300">
            <IoLogoFacebook className="h-5 w-5"/>
        </a>
      </div>
      <div className="text-sm text-center flex-grow">
        <span>Livraison sur toute la Tunisie</span>
      </div>
      <div className="text-sm hidden md:block">
        <a href="tel:+1234567890" className="hover:text-gray-300">
            +216 93 202 577
        </a>
      </div>
      </div>
    </div>
  )
}

export default Topbar
