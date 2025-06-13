import React from 'react'
import Hero from '../components/Layout/Hero'
import CollectionSection from '../components/Products/CollectionSection'
import NewArrivals from '../components/Products/NewArrivals'
import FeaturesSection from '../components/Products/FeaturesSection'
import BrandHistoryPreview from '../components/Layout/BrandHistoryPreview'
import DevisFormPreview from '../components/Layout/DevisFormPreview'
import Chaticon from '../chatbot/Chaticon'

const Home = () => {
  return (
    <div>
      <Hero/>
      <CollectionSection/>
      <NewArrivals/>
      <DevisFormPreview/>
      <BrandHistoryPreview/>
      <FeaturesSection/>
      <Chaticon/>
    </div>
  )
}

export default Home
