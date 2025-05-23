import { useState, useEffect } from 'react'
import ReviewCard from '../components/ReviewCard'
import { getReviews } from '../services/review_api'
import LoadingSpinner from '../components/LoadingSpinner'

const ReviewRatingPage = () => {
  const [reviews, setReviews] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const [totalCounts, setTotalCounts] = useState({
    all: 0,
    restaurant: 0,
    spot: 0
  })

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Set up parameters based on filter
        const response = await getReviews()
        if (response.payload) {
          const allReviews = response.payload

          setTotalCounts({
            all: allReviews.length,
            restaurant: allReviews.filter(r => r.resto_id !== null && r.spot_id === null).length,
            spot: allReviews.filter(r => r.spot_id !== null && r.resto_id === null).length
          })
          
          // Filter reviews based on selected filter
          let filteredResults = allReviews
          if (filter === 'restaurant') {
            filteredResults = allReviews.filter(review => review.resto_id !== null && review.spot_id === null)
          } else if (filter === 'spot') {
            filteredResults = allReviews.filter(review => review.spot_id !== null && review.resto_id === null)
          }
          
          setReviews(filteredResults)
        }
      } catch (error) {
        console.error('Error fetching reviews:', error)
        setError('Failed to load reviews. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [filter])

  // Filter reviews based on search term
  const filteredReviews = reviews.filter(review =>
    searchTerm === '' ||
    review.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.restaurant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.spot_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#3D1E0F]">
      <div className="flex flex-col items-center">
        <LoadingSpinner />
        <p className="text-[#CCBA78] mt-4 text-center font-medium">Loading reviews...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex justify-center items-center p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-[#CCBA78]/30 p-8 max-w-md w-full">
        <div className="text-red-600 p-6 rounded-xl bg-red-50 border-l-4 border-red-400 mb-6">
          <div className="flex items-center mb-2">
            <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold text-lg">Something went wrong</span>
          </div>
          <p className="text-red-700">{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="w-full px-6 py-3 bg-gradient-to-r from-[#CCBA78] to-[#D8C78E] text-white font-semibold rounded-xl hover:from-[#B8A665] hover:to-[#CCBA78] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          Try Again
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#3D1E0F]">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#3D1E0F] via-[#4A2817] to-[#3D1E0F] text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-['Special_Elite'] mb-4 tracking-wide">
              Review & Rating
            </h1>
            <p className="text-xl text-amber-200 mb-8 font-light">
              Discover amazing places through authentic reviews from our community
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <svg className="h-6 w-6 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search reviews, restaurants, or spots..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white/10 backdrop-blur-md border-2 border-amber-300/30 rounded-2xl text-white placeholder-amber-200 focus:outline-none focus:border-amber-300 focus:ring-4 focus:ring-amber-300/20 transition-all duration-300 text-lg"
              />
            </div>
          </div>
        </div>
        
        {/* Wave separator */}
        <div className="relative">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="rgb(245 245 244)"></path>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 -mt-8 relative z-10">
        {/* Filter Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-[#CCBA78]/20 p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold text-[#3D1E0F] mb-4">Filter Reviews</h3>
              <div className="flex flex-wrap gap-3">
                {[
                  { key: 'all', label: 'All Reviews', icon: '🌟', count: totalCounts.all },
                  { key: 'restaurant', label: 'Restaurant & Cafe', icon: '🍽️', count: totalCounts.restaurant },
                  { key: 'spot', label: 'Spot Hangout', icon: '📍', count: totalCounts.spot }
                ].map(({ key, label, icon, count }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`group relative px-6 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center gap-3 ${
                      filter === key
                        ? 'bg-gradient-to-r from-[#CCBA78] to-[#D8C78E] text-white shadow-lg transform scale-105'
                        : 'bg-white border-2 border-[#CCBA78]/30 text-[#3D1E0F] hover:border-[#CCBA78] hover:shadow-md hover:scale-105'
                    }`}
                  >
                    <span className="text-lg">{icon}</span>
                    <span>{label}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      filter === key ? 'bg-white/20 text-white' : 'bg-[#CCBA78]/10 text-[#3D1E0F]'
                    }`}>
                      {count}
                    </span>
                    {filter === key && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#CCBA78] to-[#D8C78E] opacity-20 animate-pulse"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {searchTerm && (
              <div className="bg-amber-100 border border-amber-300 rounded-xl p-4">
                <p className="text-amber-800 text-sm font-medium">
                  Showing {filteredReviews.length} results for "{searchTerm}"
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-amber-600 hover:text-amber-800 text-sm underline mt-1"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review, index) => (
              <div
                key={review.id}
                className="relative bg-white/90 border border-[#CCBA78]/20 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 group overflow-hidden"
                style={{
                  animationDelay: `${index * 120}ms`,
                  animation: 'fadeInUp 0.7s cubic-bezier(0.23, 1, 0.32, 1) forwards'
                }}
              >
                <ReviewCard review={review} />
                {/* Floating number badge */}
                <div className="absolute top-3 right-3 w-7 h-7 bg-gradient-to-br from-[#CCBA78]/80 to-[#D8C78E]/80 rounded-full flex items-center justify-center text-white font-bold text-xs shadow group-hover:scale-110 transition-transform duration-300 opacity-80">
                  {index + 1}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-[#CCBA78]/20 p-12 text-center">
                <div className="max-w-md mx-auto">
                  {/* Empty state illustration */}
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#CCBA78]/20 to-[#D8C78E]/20 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-[#CCBA78]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.239 0-4.236-.18-5.536-.491C3.225 14.224 2 11.812 2 9.318c0-.98.104-1.923.29-2.829A2.18 2.18 0 014.465 5h15.07c.969 0 1.784.755 1.82 1.723A10.986 10.986 0 0122 12c0 3.061-1.274 5.832-3.32 7.847l-2.548-2.548L14.828 16H9.172z" />
                    </svg>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-[#3D1E0F] mb-3">
                    {searchTerm ? 'No matching reviews found' : 'No reviews found'}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {searchTerm 
                      ? `We couldn't find any reviews matching "${searchTerm}". Try adjusting your search terms.`
                      : 'There are no reviews available for this category at the moment.'
                    }
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {searchTerm && (
                      <button 
                        onClick={() => setSearchTerm('')}
                        className="px-6 py-3 bg-white border-2 border-[#CCBA78] text-[#3D1E0F] font-semibold rounded-xl hover:bg-[#CCBA78] hover:text-white transition-all duration-300"
                      >
                        Clear Search
                      </button>
                    )}
                    {filter !== 'all' && (
                      <button 
                        onClick={() => setFilter('all')}
                        className="px-6 py-3 bg-gradient-to-r from-[#CCBA78] to-[#D8C78E] text-white font-semibold rounded-xl hover:from-[#B8A665] hover:to-[#CCBA78] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      >
                        View All Reviews
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Statistics Section */}
        {filteredReviews.length > 0 && (
          <div className="mt-16 bg-gradient-to-r from-[#3D1E0F] via-[#4A2817] to-[#3D1E0F] rounded-3xl p-8 text-white shadow-2xl">
            <h3 className="text-2xl font-bold text-center mb-8 text-amber-200">Review Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-white">{filteredReviews.length}</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">Total Reviews</h4>
                <p className="text-amber-200 text-sm">Currently showing</p>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-white">{reviews.filter(r => r.resto_id).length}</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">Restaurant Reviews</h4>
                <p className="text-amber-200 text-sm">Dining experiences</p>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-white">{reviews.filter(r => r.spot_id).length}</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">Spot Reviews</h4>
                <p className="text-amber-200 text-sm">Hangout places</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default ReviewRatingPage