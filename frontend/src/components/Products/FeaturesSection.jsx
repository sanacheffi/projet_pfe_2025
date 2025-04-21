import React from 'react'
import { FaRegCreditCard, FaShippingFast } from 'react-icons/fa'
import { RiCustomerService2Line } from 'react-icons/ri'

const FeaturesSection = () => {
  return (
    <section className="py-16 px-4 bg-white">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
                <div className="p-4 rounded-full mb-4">
                    <FaShippingFast className="text-2xl" />
                </div>
                <h4 className="tracking-tighter uppercase mb-2">
                Livraison à domicile
                </h4>
                <p className="text-gray-600 text-sm tracking-tighter">
                Livraison sur toute la Tunisie
                </p>
            </div>
            <div className="flex flex-col items-center">
                <div className="p-4 rounded-full mb-4">
                    <FaRegCreditCard className="text-2xl" />
                </div>
                <h4 className="tracking-tighter uppercase mb-2">
                Paiement à la Livraison 
                </h4>
                <p className="text-gray-600 text-sm tracking-tighter">
                
                </p>
            </div>
            <div className="flex flex-col items-center">
                <div className="p-4 rounded-full mb-4">
                    <RiCustomerService2Line className="text-2xl" />
                </div>
                <h4 className="tracking-tighter uppercase mb-2">
                SERVICE CLIENT
                </h4>
                <p className="text-gray-600 text-sm tracking-tighter">
                Contactez-nous sur :<br/>
                (+216) 93 202 577
                </p>
            </div>
        </div>
    </section>
  )
}

export default FeaturesSection
