import React, { useEffect } from 'react'
import ProductCarousel from '../Components/ProductCarousal'
import HomeCategories from '../Components/HomeCategories'
import NewProductsShowcase from '../Components/NewProductShowcase'
import HomeOffers from '../Components/HomeOffersGrid'
import { useDispatch } from 'react-redux'
import { fetchFeaturedProducts, fetchProducts } from '../slices/productSlice'
const Home = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchProducts())
    dispatch(fetchFeaturedProducts())
  }, [])


  return (
    <div className='p-2'>
      <HomeOffers />
      <HomeCategories />
      <ProductCarousel />
      <NewProductsShowcase />
    </div>
  )
}

export default Home
