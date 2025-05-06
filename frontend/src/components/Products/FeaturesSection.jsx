import React from 'react'
import { LiaShippingFastSolid } from 'react-icons/lia'
import { PiCreditCard, PiMoneyWavy } from 'react-icons/pi'
import { SlEarphonesAlt } from 'react-icons/sl'

const FeaturesSection = () => {
  return (
    <section className="py-16 px-4 bg-white">
        <div className="container mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
                <div className="p-4 rounded-full mb-4">
                    <LiaShippingFastSolid className="text-3xl" />
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
                    <PiCreditCard className="text-3xl" />
                </div>
                <h4 className="tracking-tighter uppercase mb-2">
                Paiement en ligne 
                </h4>
                <p className="text-gray-600 text-sm tracking-tighter">
                Paiement sécurisé par carte
                </p>
            </div>
            <div className="flex flex-col items-center">
                <div className="p-4 rounded-full mb-4">
                    <PiMoneyWavy className="text-3xl" />
                </div>
                <h4 className="tracking-tighter uppercase mb-2">
                Paiement à la Livraison 
                </h4>
                <p className="text-gray-600 text-sm tracking-tighter">
                Payez en espèces à la réception
                </p>
            </div>
            <div className="flex flex-col items-center">
                <div className="p-4 rounded-full mb-4">
                    <SlEarphonesAlt className="text-2xl" />
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
