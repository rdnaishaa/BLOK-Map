import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import HeroSlider from '../components/HeroSlider'
import ReviewCard from '../components/ReviewCard'
import RestaurantCard from '../components/RestaurantCard'
import ArticleCard from '../components/ArticleCard'
import LoadingSpinner from '../components/LoadingSpinner'

// Import from specific API services instead of generic API
import { getReviews } from '../services/review_api'
import { getRestaurants } from '../services/restaurant_api'
import { getArticles } from '../services/articles_api'

const HomePage = () => {
  const [reviews, setReviews] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [Articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use Promise.all to fetch data in parallel
        const [reviewResponse, restaurantResponse, spotResponse] = await Promise.all([
          getReviews(),
          getRestaurants(),
          getArticles()
        ])
        
        // Extract data from responses and limit to 5 items each
        setReviews((reviewResponse.payload || []).slice(0, 5))
        setRestaurants((restaurantResponse.payload || []).slice(0, 5))
        setArticles((spotResponse.payload || []).slice(0, 5))
      } catch (error) {
        console.error('Error fetching home page data:', error)
        setError('Failed to load content. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const reviewRef = useRef(null)
  const restaurantRef = useRef(null)
  const articleRef = useRef(null)

  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -300 : 300
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  // Section navigation handlers
  const goToFoodDrink = () => navigate('/food-drink')
  const goToRestaurants = () => navigate('/restaurants')
  const goToArticles = () => navigate('/Articles')

  if (loading) return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#3D1E0F]">
      <LoadingSpinner />
    </div>
  )

  if (error) return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#3D1E0F] text-white">
      <p className="text-xl mb-4">{error}</p>
      <button 
        onClick={() => window.location.reload()}
        className="bg-[#CCBA78] text-[#3D1E0F] px-4 py-2 rounded hover:bg-[#D8C78E]"
      >
        Retry
      </button>
    </div>
  )

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#3D1E0F] text-white">
      {/* Hero section takes full width */}
      <div className="w-full">
        <HeroSlider />
      </div>
      
      {/* Food & Drink Section */}
      <section className="py-8 px-6 md:px-12 relative">
        <h2 
          onClick={goToFoodDrink}
          className="text-[#CCBA78] text-2xl font-['Special_Elite'] mb-6 cursor-pointer hover:text-white transition-colors"
        >
          Spill the Tea
        </h2>
        <div className="relative">
          <button 
            onClick={() => scroll(reviewRef, 'left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#3D1E0F]/80 hover:bg-[#3D1E0F]/95 p-3 rounded-full shadow-md"
          >
            <svg className="w-5 h-5 text-[#CCBA78]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div 
            ref={reviewRef}
            className="flex overflow-x-auto hide-scrollbar scroll-smooth gap-5 pb-2 pl-2 pr-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {reviews.length > 0 ? (
              reviews.map(review => (
                <div key={review.id} className="flex-none w-64 transform transition-transform hover:scale-[1.02]">
                  <ReviewCard review={review} />
                </div>
              ))
            ) : (
              <p className="text-gray-400 italic px-4">No items available</p>
            )}
          </div>
          <button 
            onClick={() => scroll(reviewRef, 'right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#3D1E0F]/80 hover:bg-[#3D1E0F]/95 p-3 rounded-full shadow-md"
          >
            <svg className="w-5 h-5 text-[#CCBA78]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {/* Restaurant Section */}
      <section className="py-8 px-6 md:px-12 relative">
        <h2 
          onClick={goToRestaurants}
          className="text-[#CCBA78] text-2xl font-['Special_Elite'] mb-6 cursor-pointer hover:text-white transition-colors"
        >
          Craving For
        </h2>
        <div className="relative">
          <button 
            onClick={() => scroll(restaurantRef, 'left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#3D1E0F]/80 hover:bg-[#3D1E0F]/95 p-3 rounded-full shadow-md"
          >
            <svg className="w-5 h-5 text-[#CCBA78]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div 
            ref={restaurantRef}
            className="flex overflow-x-auto hide-scrollbar scroll-smooth gap-5 pb-2 pl-2 pr-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {restaurants.length > 0 ? (
              restaurants.map(restaurant => (
                <div key={restaurant.id} className="flex-none w-64 transform transition-transform hover:scale-[1.02]">
                  <RestaurantCard restaurant={restaurant} />
                </div>
              ))
            ) : (
              <p className="text-gray-400 italic px-4">No restaurants available</p>
            )}
          </div>
          <button 
            onClick={() => scroll(restaurantRef, 'right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#3D1E0F]/80 hover:bg-[#3D1E0F]/95 p-3 rounded-full shadow-md"
          >
            <svg className="w-5 h-5 text-[#CCBA78]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-8 px-6 md:px-12 relative">
        <h2 
          onClick={goToArticles}
          className="text-[#CCBA78] text-2xl font-['Special_Elite'] mb-6 cursor-pointer hover:text-white transition-colors"
        >
          Yapping Time
        </h2>
        <div className="relative">
          <button 
            onClick={() => scroll(articleRef, 'left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#3D1E0F]/80 hover:bg-[#3D1E0F]/95 p-3 rounded-full shadow-md"
          >
            <svg className="w-5 h-5 text-[#CCBA78]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div 
            ref={articleRef}
            className="flex overflow-x-auto hide-scrollbar scroll-smooth gap-5 pb-2 pl-2 pr-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {Articles.length > 0 ? (
              Articles.map(article => (
                <div key={article.id} className="flex-none w-64 transform transition-transform hover:scale-[1.02]">
                  <ArticleCard article={article} />
                </div>
              ))
            ) : (
              <p className="text-gray-400 italic px-4">No articles available</p>
            )}
          </div>
          <button 
            onClick={() => scroll(articleRef, 'right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#3D1E0F]/80 hover:bg-[#3D1E0F]/95 p-3 rounded-full shadow-md"
          >
            <svg className="w-5 h-5 text-[#CCBA78]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>
    </div>
  )
}

export default HomePage