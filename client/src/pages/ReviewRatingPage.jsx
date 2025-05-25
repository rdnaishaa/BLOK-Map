import { useState, useEffect } from 'react'
import ReviewCard from '../components/ReviewCard'
import { getReviews, deleteReview, updateReview } from '../services/review_api'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../hooks/useAuth'

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

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editReview, setEditReview] = useState(null)
  const [editContent, setEditContent] = useState('')
  const [editRating, setEditRating] = useState(0)
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState('')

  const { user } = useAuth()

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

  // Handler for delete review (admin only)
  const handleDelete = async (id) => {
    if (!user?.isAdmin) return; // Hanya admin
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await deleteReview(id, user.token)
      setReviews(reviews => reviews.filter(r => r.id !== id))
    } catch (err) {
      alert('Failed to delete review!')
    }
  }

  const openEditModal = (review) => {
    if (!user?.isAdmin) return; // Hanya admin
    setEditReview(review)
    setEditContent(review.content)
    setEditRating(Number(review.rating))
    setEditError('')
    setEditModalOpen(true)
  }

  const closeEditModal = () => {
    setEditModalOpen(false)
    setEditReview(null)
    setEditContent('')
    setEditRating(0)
    setEditError('')
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setEditError('')
    if (!editContent.trim()) {
      setEditError('Content cannot be empty')
      return
    }
    if (editRating < 1 || editRating > 5) {
      setEditError('Rating must be between 1 and 5')
      return
    }
    try {
      setEditLoading(true)
      const response = await updateReview(editReview.id, { content: editContent, rating: editRating }, user.token)
      if (response.success) {
        setReviews(reviews => reviews.map(r => r.id === editReview.id ? { ...r, content: editContent, rating: editRating } : r))
        closeEditModal()
      } else {
        setEditError(response.message || 'Failed to update review')
      }
    } catch (err) {
      setEditError('Failed to update review')
    } finally {
      setEditLoading(false)
    }
  }

  // Enhanced Review Card Component
  const EnhancedReviewCard = ({ review, index }) => {
    const isRestaurant = review.resto_id !== null && review.spot_id === null
    const isSpot = review.spot_id !== null && review.resto_id === null
    
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const renderStars = (rating) => {
      const stars = []
      const fullStars = Math.floor(rating)
      const hasHalfStar = rating % 1 !== 0
      
      for (let i = 0; i < fullStars; i++) {
        stars.push(
          <svg key={i} className="w-4 h-4 fill-[#CCBA78] text-[#CCBA78]" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        )
      }
      
      if (hasHalfStar) {
        stars.push(
          <svg key="half" className="w-4 h-4 text-[#CCBA78]" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="half-fill">
                <stop offset="50%" stopColor="currentColor"/>
                <stop offset="50%" stopColor="transparent"/>
              </linearGradient>
            </defs>
            <path fill="url(#half-fill)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        )
      }
      
      return stars
    }

    return (
      <div className="relative bg-white/90 border border-[#CCBA78]/20 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
        {/* Review Type Badge */}
        <div className="absolute top-0 left-0 right-0 z-10">
          <div className={`px-4 py-2 text-xs font-bold text-white flex items-center gap-2 ${
            isRestaurant 
              ? 'bg-gradient-to-r from-[#5D2E1F] to-[#3D1E0F]' 
              : 'bg-gradient-to-r from-[#6B3E2A] to-[#4A2817]'
          }`}>
            {isRestaurant ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 01-1 1H8a1 1 0 01-1-1v-1h4v1zm-4-3a1 1 0 011-1h2a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd"/>
                </svg>
                <span>RESTAURANT REVIEW</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
                <span>SPOT REVIEW</span>
              </>
            )}
          </div>
        </div>

        <div className="p-6 pt-12">
          {/* Place Name */}
          <div className="mb-4">
            <h3 className="text-lg font-bold text-[#3D1E0F] mb-1 line-clamp-1">
              {isRestaurant ? review.restaurant_name : review.spot_name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {isRestaurant ? (
                <svg className="w-4 h-4 text-[#8B5A3C]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 5a1 1 0 100 2v5a1 1 0 001 1h4a1 1 0 100-2V6h1a1 1 0 100-2H8zM6 7a1 1 0 012 0v8a1 1 0 11-2 0V7zM4 9a1 1 0 012 0v6a1 1 0 11-2 0V9z"/>
                </svg>
              ) : (
                <svg className="w-4 h-4 text-[#8B5A3C]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
              )}
              <span className="capitalize">
                {isRestaurant ? 'Restaurant & Cafe' : 'Hangout Spot'}
              </span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {renderStars(review.rating)}
            </div>
            <span className="text-lg font-bold text-[#3D1E0F]">{review.rating}</span>
            <span className="text-gray-500 text-sm">/5</span>
          </div>

          {/* Review Title */}
          {review.title && (
            <h4 className="font-semibold text-[#3D1E0F] mb-2 line-clamp-1">
              {review.title}
            </h4>
          )}

          {/* Review Content */}
          <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
            {review.content}
          </p>

          {/* Review Meta */}
          <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
              </svg>
              <span>{review.username || 'Anonymous'}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
              </svg>
              <span>{review.created_at ? new Date(review.created_at).toLocaleDateString('id-ID') : 'Recent'}</span>
            </div>
          </div>

          {/* Admin CRUD buttons */}
          {user?.isAdmin && (
            <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
              <button
                className="flex-1 px-3 py-2 bg-[#CCBA78] text-[#3D1E0F] rounded-lg font-medium text-xs hover:bg-[#D8C78E] transition-colors duration-200 flex items-center justify-center gap-1"
                onClick={() => openEditModal(review)}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                Edit
              </button>
              <button
                className="flex-1 px-3 py-2 bg-[#8B4B3A] text-white rounded-lg font-medium text-xs hover:bg-[#7A3F2E] transition-colors duration-200 flex items-center justify-center gap-1"
                onClick={() => handleDelete(review.id)}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                Delete
              </button>
            </div>
          )}

          {/* Floating number badge */}
          <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-br from-[#CCBA78]/90 to-[#D8C78E]/90 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg group-hover:scale-110 transition-transform duration-300">
            {index + 1}
          </div>
        </div>
      </div>
    )
  }

  if (loading) return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#3D1E0F]">
      <div className="flex flex-col items-center">
        <LoadingSpinner />
        <p className="text-[#CCBA78] mt-4 text-center font-medium">Loading reviews...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5F4] via-[#F0EDE8] to-[#EBE6DF] flex justify-center items-center p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-[#CCBA78]/30 p-8 max-w-md w-full">
        <div className="text-[#8B4B3A] p-6 rounded-xl bg-[#CCBA78]/10 border-l-4 border-[#8B4B3A] mb-6">
          <div className="flex items-center mb-2">
            <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold text-lg">Something went wrong</span>
          </div>
          <p className="text-[#6B3E2A]">{error}</p>
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
            <p className="text-xl text-[#CCBA78] mb-8 font-light">
              Discover amazing places through authentic reviews from our community
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <svg className="h-6 w-6 text-[#CCBA78]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search reviews, restaurants, or spots..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white/10 backdrop-blur-md border-2 border-[#CCBA78]/30 rounded-2xl text-white placeholder-[#CCBA78] focus:outline-none focus:border-[#CCBA78] focus:ring-4 focus:ring-[#CCBA78]/20 transition-all duration-300 text-lg"
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
                  { key: 'all', label: 'All Reviews', icon: '⭐', count: totalCounts.all },
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
              <div className="bg-[#CCBA78]/10 border border-[#CCBA78]/30 rounded-xl p-4">
                <p className="text-[#3D1E0F] text-sm font-medium">
                  Showing {filteredReviews.length} results for "{searchTerm}"
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-[#8B5A3C] hover:text-[#3D1E0F] text-sm underline mt-1"
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
              <EnhancedReviewCard 
                key={review.id} 
                review={review} 
                index={index}
              />
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

      {/* Edit Review Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
              onClick={closeEditModal}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-[#3D1E0F]">Edit Review</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-[#CCBA78] mb-1">Content</label>
                <textarea
                  className="w-full p-3 rounded-lg bg-[#F5F5F4] border border-[#CCBA78]/30 text-[#3D1E0F] focus:outline-none focus:ring-2 focus:ring-[#CCBA78]"
                  rows={4}
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  required
                  disabled={editLoading}
                />
              </div>
              <div>
                <label className="block text-[#CCBA78] mb-1">Rating</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  step={0.1}
                  className="w-24 p-2 rounded bg-[#F5F5F4] border border-[#CCBA78]/30 text-[#3D1E0F]"
                  value={editRating}
                  onChange={e => setEditRating(Number(e.target.value))}
                  required
                  disabled={editLoading}
                />
              </div>
              {editError && <div className="text-red-600 text-sm">{editError}</div>}
              <button
                type="submit"
                disabled={editLoading}
                className="w-full py-3 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-[#CCBA78] to-[#D8C78E] hover:from-[#D8C78E] hover:to-[#CCBA78] text-[#3D1E0F]"
              >
                {editLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}

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
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}

export default ReviewRatingPage