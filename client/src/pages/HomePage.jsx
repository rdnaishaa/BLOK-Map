import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import HeroSlider from '../components/HeroSlider'
import CatalogCard from '../components/CatalogCard'
import RestaurantCard from '../components/RestaurantCard'
import SpotCard from '../components/SpotCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { getCatalogs, getRestaurants, getSpots } from '../services/api'

const HomePage = () => {
  const [catalogs, setCatalogs] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [spots, setSpots] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catalogData, restaurantData, spotData] = await Promise.all([
          getCatalogs(),
          getRestaurants(),
          getSpots()
        ])
        setCatalogs(catalogData.slice(0, 5))
        setRestaurants(restaurantData.slice(0, 5))
        setSpots(spotData.slice(0, 5))
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const foodDrinkRef = useRef(null)
  const restaurantRef = useRef(null)
  const spotRef = useRef(null)

  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -300 : 300
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  // Section navigation handlers
  const goToFoodDrink = () => navigate('/food-drink')
  const goToRestaurants = () => navigate('/restaurants')
  const goToSpots = () => navigate('/spots')

  if (loading) return <LoadingSpinner />

  return (
    <div className="bg-[#3D1E0F] text-white">
      <HeroSlider />
      
      {/* Food & Drink Section */}
      <section className="py-8 px-4 relative">
        <h2 
          onClick={goToFoodDrink}
          className="text-[#CCBA78] text-2xl font-['Special_Elite'] mb-6 cursor-pointer hover:text-white transition-colors"
        >
          Spill the Tea
        </h2>
        <div className="relative">
          <button 
            onClick={() => scroll(foodDrinkRef, 'left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#3D1E0F]/50 p-2 rounded-full"
          >
            <svg className="w-6 h-6 text-[#CCBA78]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div 
            ref={foodDrinkRef}
            className="flex overflow-x-hidden scroll-smooth gap-4 px-4"
          >
            {catalogs.map(catalog => (
              <div key={catalog.id} className="flex-none w-64">
                <CatalogCard catalog={catalog} />
              </div>
            ))}
          </div>
          <button 
            onClick={() => scroll(foodDrinkRef, 'right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#3D1E0F]/50 p-2 rounded-full"
          >
            <svg className="w-6 h-6 text-[#CCBA78]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {/* Restaurant Section */}
      <section className="py-8 px-4 relative">
        <h2 
          onClick={goToRestaurants}
          className="text-[#CCBA78] text-2xl font-['Special_Elite'] mb-6 cursor-pointer hover:text-white transition-colors"
        >
          Craving For
        </h2>
        <div className="relative">
          <button 
            onClick={() => scroll(restaurantRef, 'left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#3D1E0F]/50 p-2 rounded-full"
          >
            <svg className="w-6 h-6 text-[#CCBA78]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div 
            ref={restaurantRef}
            className="flex overflow-x-hidden scroll-smooth gap-4 px-4"
          >
            {restaurants.map(restaurant => (
              <div key={restaurant.id} className="flex-none w-64">
                <RestaurantCard restaurant={restaurant} />
              </div>
            ))}
          </div>
          <button 
            onClick={() => scroll(restaurantRef, 'right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#3D1E0F]/50 p-2 rounded-full"
          >
            <svg className="w-6 h-6 text-[#CCBA78]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {/* Spots Section */}
      <section className="py-8 px-4 relative">
        <h2 
          onClick={goToSpots}
          className="text-[#CCBA78] text-2xl font-['Special_Elite'] mb-6 cursor-pointer hover:text-white transition-colors"
        >
          Yapping Time
        </h2>
        <div className="relative">
          <button 
            onClick={() => scroll(spotRef, 'left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#3D1E0F]/50 p-2 rounded-full"
          >
            <svg className="w-6 h-6 text-[#CCBA78]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div 
            ref={spotRef}
            className="flex overflow-x-hidden scroll-smooth gap-4 px-4"
          >
            {spots.map(spot => (
              <div key={spot.id} className="flex-none w-64">
                <SpotCard spot={spot} />
              </div>
            ))}
          </div>
          <button 
            onClick={() => scroll(spotRef, 'right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#3D1E0F]/50 p-2 rounded-full"
          >
            <svg className="w-6 h-6 text-[#CCBA78]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>
    </div>
  )
}

export default HomePage