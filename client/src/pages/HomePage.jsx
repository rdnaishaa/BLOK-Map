import { useEffect, useState } from 'react'
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

  if (loading) return <LoadingSpinner />

  return (
    <div className="bg-primary-black text-white">
      <HeroSlider />
      
      <section className="py-8 px-4">
        <h2 className="text-orange-300 text-2xl font-covered-by-your-grace mb-6">
          Spill the teaAAAAA
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {catalogs.map(catalog => (
            <CatalogCard key={catalog.id} catalog={catalog} />
          ))}
        </div>
      </section>

      <section className="py-8 px-4">
        <h2 className="text-orange-300 text-2xl font-covered-by-your-grace mb-6">
          Drawing for
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {restaurants.map(restaurant => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </section>

      <section className="py-8 px-4">
        <h2 className="text-orange-300 text-2xl font-covered-by-your-grace mb-6">
          Mapping Time
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {spots.map(spot => (
            <SpotCard key={spot.id} spot={spot} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomePage