import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import HeroSlider from '../components/HeroSlider'
import ReviewCard from '../components/ReviewCard'
import ArticleCard from '../components/ArticleCard'
import CatalogCard from '../components/CatalogCard'
import LoadingSpinner from '../components/LoadingSpinner'

import { getReviews } from '../services/review_api'
import { getCatalogs } from '../services/catalogs_api'
import { getArticles } from '../services/articles_api'

const HomePage = () => {
  const [reviews, setReviews] = useState([])
  const [catalogs, setCatalogs] = useState([])
  const [Articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeSection, setActiveSection] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const navigate = useNavigate()

  // Refs untuk scrolling
  const reviewRef = useRef(null)
  const catalogRef = useRef(null)
  const articleRef = useRef(null)
  const autoScrollRef = useRef(null)

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reviewResponse, catalogResponse, spotResponse] = await Promise.all([
          getReviews(),
          getCatalogs(),
          getArticles()
        ])
        
        setReviews((reviewResponse.payload || []).slice(0, 5))
        setCatalogs((catalogResponse.payload || []).slice(0, 5))
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

  // Auto scroll untuk reviews - disabled on mobile for better UX
  useEffect(() => {
    if (reviews.length > 0 && !isMobile) {
      const startAutoScroll = () => {
        autoScrollRef.current = setInterval(() => {
          if (reviewRef.current) {
            const container = reviewRef.current
            const scrollAmount = 2
            
            container.scrollLeft += scrollAmount
            
            if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
              container.scrollLeft = 0
            }
          }
        }, 50)
      }

      startAutoScroll()

      return () => {
        if (autoScrollRef.current) {
          clearInterval(autoScrollRef.current)
        }
      }
    }
  }, [reviews, isMobile])

  // Pause auto scroll saat hover (desktop only)
  const pauseAutoScroll = () => {
    if (autoScrollRef.current && !isMobile) {
      clearInterval(autoScrollRef.current)
    }
  }

  // Resume auto scroll saat mouse leave (desktop only)
  const resumeAutoScroll = () => {
    if (reviews.length > 0 && !isMobile) {
      autoScrollRef.current = setInterval(() => {
        if (reviewRef.current) {
          const container = reviewRef.current
          const scrollAmount = 2
          
          container.scrollLeft += scrollAmount
          
          if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
            container.scrollLeft = 0
          }
        }
      }, 50)
    }
  }

  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -300 : 300
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const goToFoodDrink = () => navigate('/reviews')
  const goToCatalogs = () => navigate('/catalogs')
  const goToArticles = () => navigate('/Articles')

  if (loading) return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#3D1E0F] p-4">
      <div className="flex flex-col items-center max-w-sm w-full">
        <LoadingSpinner />
        <p className="text-[#CCBA78] mt-4 text-center font-medium text-sm sm:text-base">
          Loading amazing content...
        </p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-12 shadow-2xl border border-red-200 max-w-md w-full text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Oops! Something went wrong</h3>
        <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#CCBA78] to-[#D8C78E] text-white font-semibold rounded-xl sm:rounded-2xl hover:from-[#B8A665] hover:to-[#CCBA78] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base w-full sm:w-auto"
        >
          Try Again
        </button>
      </div>
    </div>
  )

  const SectionHeader = ({ title, onClick, icon, description }) => (
    <div 
      className="group cursor-pointer mb-6 sm:mb-8"
      onClick={onClick}
      onMouseEnter={() => setActiveSection(title)}
      onMouseLeave={() => setActiveSection(null)}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
        <div className="text-2xl sm:text-3xl md:text-4xl">{icon}</div>
        <div className="flex-1">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-['Special_Elite'] text-[#CCBA78] group-hover:text-[#D8C78E] transition-all duration-300 flex items-center gap-2 sm:gap-3">
            {title}
            <svg className="w-5 h-5 sm:w-6 sm:h-6 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </h2>
          <p className="text-amber-200 text-base sm:text-lg font-light">{description}</p>
        </div>
      </div>
      <div className={`h-1 bg-gradient-to-r from-[#CCBA78] to-[#D8C78E] rounded-full transition-all duration-500 ${
        activeSection === title ? 'w-full' : 'w-16 sm:w-20'
      }`}></div>
    </div>
  )

  const ScrollButton = ({ direction, onClick, position }) => (
    <button 
      onClick={onClick}
      className={`hidden sm:block absolute ${position} top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#CCBA78] to-[#D8C78E] hover:from-[#D8C78E] hover:to-[#CCBA78] rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-[#CCBA78]/50 backdrop-blur-sm border border-white/20`}
    >
      <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={direction === 'left' ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
      </svg>
    </button>
  )

  const EmptyState = ({ message, icon }) => (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center border border-white/20 mx-4 sm:mx-0">
      <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">{icon}</div>
      <p className="text-amber-200 text-lg sm:text-xl italic font-light">{message}</p>
    </div>
  )

  // Responsive card sizing
  const getCardWidth = () => {
    if (isMobile) return 'w-72'
    return 'w-80'
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#3D1E0F]">
      {/* Hero Section with Enhanced Styling */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#3D1E0F]/80 z-10"></div>
        <HeroSlider />
        
        {/* Floating Welcome Card - Responsive */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20 bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-white/20 text-center max-w-2xl mx-4 w-[calc(100%-2rem)] sm:w-auto">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-['Special_Elite'] text-white mb-2 sm:mb-4">
            Welcome to Your Culinary Journey
          </h1>
          <p className="text-amber-200 text-sm sm:text-lg font-light leading-relaxed">
            Discover amazing places, read authentic reviews, and explore delicious menus
          </p>
        </div>
      </div>
      
      {/* Reviews Section - Responsive Grid/Flex */}
      <section className="py-8 sm:py-16 px-4 sm:px-6 md:px-12 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-bl from-[#CCBA78]/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-tr from-[#D8C78E]/5 to-transparent rounded-full blur-3xl"></div>
        
        <SectionHeader 
          title="Spill the Tea" 
          onClick={goToFoodDrink}
          icon="🍵"
          description="Real experiences from real people"
        />
        
        <div className="relative">
          {/* Mobile: Show grid instead of horizontal scroll */}
          {isMobile ? (
            <div className="grid grid-cols-1 gap-4 px-4">
              {reviews.length > 0 ? (
                reviews.slice(0, 3).map((review, index) => (
                  <div 
                    key={review.id} 
                    className="transform transition-all duration-500 hover:scale-105"
                    style={{
                      animationDelay: `${index * 200}ms`,
                      animation: 'fadeInScale 0.8s ease-out forwards'
                    }}
                  >
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#CCBA78]/20 to-[#D8C78E]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                      <div className="relative">
                        <ReviewCard review={{
                            username: review.username,
                            rating: review.rating,
                            content: review.content,
                            createdAt: review.created_at,
                            locationName: review.spot_name || review.restaurant_name || 'Unknown location'
                          }} 
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState message="No reviews available yet" icon="🤔" />
              )}
              
              {/* Show more button on mobile */}
              {reviews.length > 3 && (
                <div className="text-center mt-4">
                  <button 
                    onClick={goToFoodDrink}
                    className="px-6 py-3 bg-gradient-to-r from-[#CCBA78] to-[#D8C78E] text-white font-semibold rounded-xl hover:from-[#D8C78E] hover:to-[#CCBA78] transition-all duration-300 shadow-lg text-sm"
                  >
                    View All Reviews
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Desktop: Horizontal scroll with auto-scroll */
            <div 
              ref={reviewRef}
              className="flex overflow-x-auto hide-scrollbar scroll-smooth gap-6 pb-4 px-8"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onMouseEnter={pauseAutoScroll}
              onMouseLeave={resumeAutoScroll}
            >
              {reviews.length > 0 ? (
                [...reviews, ...reviews, ...reviews].map((review, index) => (
                  <div 
                    key={`${review.id}-${index}`} 
                    className={`flex-none ${getCardWidth()} transform transition-all duration-500 hover:scale-105`}
                    style={{
                      animationDelay: `${(index % reviews.length) * 200}ms`,
                      animation: 'fadeInScale 0.8s ease-out forwards'
                    }}
                  >
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#CCBA78]/20 to-[#D8C78E]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                      <div className="relative">
                        <ReviewCard review={{
                            username: review.username,
                            rating: review.rating,
                            content: review.content,
                            createdAt: review.created_at,
                            locationName: review.spot_name || review.restaurant_name || 'Unknown location'
                          }} 
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState message="No reviews available yet" icon="🤔" />
              )}
            </div>
          )}
          
          {/* Auto-scroll indicator (desktop only) */}
          {!isMobile && (
            <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm opacity-0 hover:opacity-100 transition-opacity duration-300">
              Hover to pause
            </div>
          )}
        </div>
      </section>

      {/* Catalogs Section - Responsive */}
      <section className="py-8 sm:py-16 px-4 sm:px-6 md:px-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[800px] h-[200px] sm:h-[400px] bg-gradient-radial from-[#CCBA78]/5 to-transparent rounded-full blur-3xl"></div>
        
        <SectionHeader 
          title="Menu Catalogs" 
          onClick={goToCatalogs}
          icon="📋"
          description="Explore delicious menus and offerings"
        />
        
        <div className="relative">
          {/* Mobile: Grid layout */}
          {isMobile ? (
            <div className="grid grid-cols-1 gap-4 px-4">
              {catalogs.length > 0 ? (
                catalogs.slice(0, 3).map((catalog, index) => (
                  <div 
                    key={catalog.id} 
                    className="transform transition-all duration-500 hover:scale-105"
                    style={{
                      animationDelay: `${index * 150}ms`,
                      animation: 'fadeInUp 0.6s ease-out forwards'
                    }}
                  >
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#CCBA78]/20 to-[#D8C78E]/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                      <div className="relative">
                        <CatalogCard catalog={catalog} />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState message="No catalogs available yet" icon="📚" />
              )}
              
              {catalogs.length > 3 && (
                <div className="text-center mt-4">
                  <button 
                    onClick={goToCatalogs}
                    className="px-6 py-3 bg-gradient-to-r from-[#CCBA78] to-[#D8C78E] text-white font-semibold rounded-xl hover:from-[#D8C78E] hover:to-[#CCBA78] transition-all duration-300 shadow-lg text-sm"
                  >
                    View All Catalogs
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Desktop: Horizontal scroll */
            <>
              <ScrollButton direction="left" onClick={() => scroll(catalogRef, 'left')} position="-left-6" />
              <div 
                ref={catalogRef}
                className="flex overflow-x-auto hide-scrollbar scroll-smooth gap-6 pb-4 px-8"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {catalogs.length > 0 ? (
                  catalogs.map((catalog, index) => (
                    <div 
                      key={catalog.id} 
                      className={`flex-none ${getCardWidth()} transform transition-all duration-500 hover:scale-105`}
                      style={{
                        animationDelay: `${index * 150}ms`,
                        animation: 'fadeInUp 0.6s ease-out forwards'
                      }}
                    >
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#CCBA78]/20 to-[#D8C78E]/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                        <div className="relative">
                          <CatalogCard catalog={catalog} />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState message="No catalogs available yet" icon="📚" />
                )}
              </div>
              <ScrollButton direction="right" onClick={() => scroll(catalogRef, 'right')} position="-right-6" />
            </>
          )}
        </div>
      </section>

      {/* Articles Section - Responsive */}
      <section className="py-8 sm:py-16 px-4 sm:px-6 md:px-12 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-tl from-[#D8C78E]/10 to-transparent rounded-full blur-3xl"></div>
        
        <SectionHeader 
          title="Yapping Time" 
          onClick={() => navigate('/spots')}
          icon="💬"
          description="Stories, tips, and interesting reads"
        />
        
        <div className="relative">
          {/* Mobile: Grid layout */}
          {isMobile ? (
            <div className="grid grid-cols-1 gap-4 px-4">
              {Articles.length > 0 ? (
                Articles.slice(0, 3).map((article, index) => (
                  <div 
                    key={article.id} 
                    className="transform transition-all duration-500 hover:scale-105"
                    style={{
                      animationDelay: `${index * 200}ms`,
                      animation: 'fadeInScale 0.8s ease-out forwards'
                    }}
                  >
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#CCBA78]/20 to-[#D8C78E]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                      <div className="relative">
                        <ArticleCard article={article} />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState message="No articles available yet" icon="✍️" />
              )}
              
              {Articles.length > 3 && (
                <div className="text-center mt-4">
                  <button 
                    onClick={goToArticles}
                    className="px-6 py-3 bg-gradient-to-r from-[#CCBA78] to-[#D8C78E] text-white font-semibold rounded-xl hover:from-[#D8C78E] hover:to-[#CCBA78] transition-all duration-300 shadow-lg text-sm"
                  >
                    View All Articles
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Desktop: Horizontal scroll */
            <>
              <ScrollButton direction="left" onClick={() => scroll(articleRef, 'left')} position="-left-6" />
              <div 
                ref={articleRef}
                className="flex overflow-x-auto hide-scrollbar scroll-smooth gap-6 pb-4 px-8"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {Articles.length > 0 ? (
                  Articles.map((article, index) => (
                    <div 
                      key={article.id} 
                      className={`flex-none ${getCardWidth()} transform transition-all duration-500 hover:scale-105`}
                      style={{
                        animationDelay: `${index * 200}ms`,
                        animation: 'fadeInScale 0.8s ease-out forwards'
                      }}
                    >
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#CCBA78]/20 to-[#D8C78E]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                        <div className="relative">
                          <ArticleCard article={article} />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState message="No articles available yet" icon="✍️" />
                )}
              </div>
              <ScrollButton direction="right" onClick={() => scroll(articleRef, 'right')} position="-right-6" />
            </>
          )}
        </div>
      </section>

      {/* Call-to-Action Footer - Responsive */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 md:px-12 relative">
        <div className="bg-gradient-to-r from-[#CCBA78]/20 via-[#D8C78E]/20 to-[#CCBA78]/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-12 border border-white/10 text-center">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-['Special_Elite'] text-white mb-4 sm:mb-6">
            Ready to Explore More?
          </h3>
          <p className="text-amber-200 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join our community of food lovers and discover your next favorite place
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            <button 
              onClick={goToFoodDrink}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#CCBA78] to-[#D8C78E] text-white font-semibold rounded-xl sm:rounded-2xl hover:from-[#D8C78E] hover:to-[#CCBA78] transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 text-sm sm:text-base"
            >
              Browse Reviews
            </button>
            <button 
              onClick={goToCatalogs}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-xl sm:rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20 text-sm sm:text-base"
            >
              View Menus
            </button>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(40px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(ellipse at center, var(--tw-gradient-stops));
        }

        /* Mobile-specific optimizations */
        @media (max-width: 768px) {
          .hide-scrollbar {
            scroll-snap-type: x mandatory;
          }
          
          .hide-scrollbar > div {
            scroll-snap-align: start;
          }
        }
      `}</style>
    </div>
  )
}

export default HomePage