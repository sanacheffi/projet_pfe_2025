import React, { useEffect } from 'react'
import { FiMail, FiPhoneCall } from 'react-icons/fi'
import { IoLogoFacebook, IoLogoInstagram } from 'react-icons/io'
import { Link } from 'react-router-dom'
import { fetchCategories } from '../../redux/slices/categorySlice'
import { useDispatch, useSelector } from 'react-redux'

const Footer = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <footer className="border-t py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4 lg:grid-cols-4">
        <div>
          <h3 className="text-lg text-gray-800 mb-4">Newsletter</h3>
          <p className="text-gray-500 mb-4">
          Soyez les premiers à découvrir les nouveaux produits, les événements exclusifs et les offres en ligne.
          </p>
          <form className="flex">
            <input type="email" 
            placeholder="Entrez votre email." 
            className="p-3 w-full text-sm border-t border-l border-b border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all" required/>
            <button type="submit" className="bg-black text-white px-6 py-3 text-sm rounded-r-md hover:bg-gray-800 transition-all">S'inscrire</button>
          </form>
        </div>

        <div>
          <h3 className="text-lg text-gray-800 mb-4">Shop</h3>
          <ul className="space-y-2 text-gray-600">
          {categories?.map((category) => (
            <li key={category._id}>
              <Link to={`/collections/all?category=${encodeURIComponent(category.name)}`} 
              className="hover:text-gray-500 transition-colors">{category.name}</Link>
            </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg text-gray-800 mb-4">Support</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="contact" className="hover:text-gray-500 transition-colors">Contactez-nous</Link>
            </li>
            <li>
              <Link to="/history" className="hover:text-gray-500 transition-colors">À propos</Link>
            </li>
            <li>
              <Link to="#" className="hover:text-gray-500 transition-colors">FAQ</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg text-gray-800 mb-4">Suivez-Nous</h3>
          <div className="flex items-center space-x-4 mb-6">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-500">
            <IoLogoFacebook className="h-6 w-6"/>
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-500">
            <IoLogoInstagram className="h-6 w-6"/>
            </a>
          </div>
          <h3 className="text-lg text-gray-800 mb-4">Service Client</h3>
          <div className="space-y-2 text-gray-700">
          <p>
            <FiPhoneCall className="inline-block mr-2 mb-2"/>
            +216 93 202 577
          </p>
          <p>
            <FiMail className="inline-block mr-2"/>
            artisanatcheffi@gmail.com
          </p>
          </div> 
        </div>
        
      </div>
      <div className="container mx-auto mt-12 px-4 lg:px-0 border-t border-gray-200 pt-6">
        <p className="text-gray-500 text-sm tracking-tighter text-center">© 2025, Artisanat Cheffi. All Rights Reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
