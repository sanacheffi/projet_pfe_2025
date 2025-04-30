import React from 'react'
import Hero from '../components/Layout/Hero'
import CollectionSection from '../components/Products/CollectionSection'
import NewArrivals from '../components/Products/NewArrivals'
import FeaturesSection from '../components/Products/FeaturesSection'
import BrandHistoryPreview from '../components/Layout/BrandHistoryPreview'

const Home = () => {
  return (
    <div>
      <Hero/>
      <CollectionSection/>
      <NewArrivals/>
      <BrandHistoryPreview/>
      <FeaturesSection/>
    </div>
  )
}

export default Home
