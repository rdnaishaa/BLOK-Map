import { useEffect, useState } from 'react'
import { getSpotArticles } from '../../services/articles_api'
import LoadingSpinner from '../../components/LoadingSpinner'
import ArticleCard from '../../components/ArticleCard'

const SpotPage = () => {
  const [articles, setArticles] = useState([])
  const [filteredArticles, setFilteredArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [categories, setCategories] = useState([])
  const [locations, setLocations] = useState([])
  const [viewMode, setViewMode] = useState('grid') // grid or list
  const [sortBy, setSortBy] = useState('newest') // newest, oldest, name
  const [showFilters, setShowFilters] = useState(false)

  // Fetch spot articles from API
  useEffect(() => {
    const fetchSpotArticles = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await getSpotArticles()
        console.log('Spot articles response:', response)
        
        // Handle payload structure
        const data = response.payload
        setArticles(data)
        setFilteredArticles(data)

        // Extract unique categories and locations
        const uniqueCategories = [...new Set(data.map(article => article.kategori))]
          .filter(Boolean)
          .map(cat => ({ id: cat, name: cat }))
        
        const uniqueLocations = [...new Set(data.map(article => article.lokasi))]
          .filter(Boolean)

        setCategories(uniqueCategories)
        setLocations(uniqueLocations)
      } catch (err) {
        console.error('Error fetching spot articles:', err)
        setError('Failed to load spot articles. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchSpotArticles()
  }, [])

  // Filter and sort articles
  useEffect(() => {
    let result = articles
    
    // Apply filters
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(article => 
        article.judulArtikel?.toLowerCase().includes(term) ||
        article.kontenArtikel?.toLowerCase().includes(term) ||
        article.spot?.namaSpot?.toLowerCase().includes(term) ||
        article.spot?.lokasi?.toLowerCase().includes(term)
      )
    }

    if (categoryFilter) {
      result = result.filter(article => article.kategori === categoryFilter)
    }

    if (locationFilter) {
      result = result.filter(article => article.lokasi === locationFilter)
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.judulArtikel || '').localeCompare(b.judulArtikel || '')
        case 'oldest':
          return new Date(a.created_at || 0) - new Date(b.created_at || 0)
        case 'newest':
        default:
          return new Date(b.created_at || 0) - new Date(a.created_at || 0)
      }
    })
    
    setFilteredArticles(result)
  }, [searchTerm, categoryFilter, locationFilter, articles, sortBy])

  const clearAllFilters = () => {
    setSearchTerm('')
    setCategoryFilter('')
    setLocationFilter('')
    setSortBy('newest')
  }

  const activeFiltersCount = [searchTerm, categoryFilter, locationFilter].filter(Boolean).length

  if (loading) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center bg-[#3D1E0F]">
        <div className="text-center">
          <LoadingSpinner />
          <div className="mt-8 space-y-4">
            <div className="animate-pulse">
              <div className="h-6 bg-[#CCBA78]/20 rounded w-64 mx-auto mb-3"></div>
              <div className="h-4 bg-[#CCBA78]/10 rounded w-48 mx-auto mb-2"></div>
              <div className="h-4 bg-[#CCBA78]/10 rounded w-32 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-[#2A1509]/50 rounded-lg p-4 animate-pulse">
                  <div className="h-32 bg-[#CCBA78]/10 rounded mb-3"></div>
                  <div className="h-4 bg-[#CCBA78]/20 rounded mb-2"></div>
                  <div className="h-3 bg-[#CCBA78]/10 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-[#3D1E0F] via-[#2A1509] to-[#1A0E06]">
        <div className="container mx-auto p-6">
          <div className="max-w-md mx-auto mt-20 bg-red-900/30 border border-red-500/50 backdrop-blur-sm text-white p-6 rounded-xl shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.084 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-lg font-medium mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-[#3D1E0F] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#CCBA78]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#CCBA78]/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-[#CCBA78]/2 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto p-6 relative z-10">
        {/* Hero Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-['Special_Elite'] text-transparent bg-gradient-to-r from-[#CCBA78] via-[#D8C78E] to-[#CCBA78] bg-clip-text mb-4 leading-tight">
            Discover Amazing Spots
          </h1>
          <p className="text-[#CCBA78]/80 text-lg md:text-xl max-w-2xl mx-auto">
            Explore curated articles about the most incredible places and hidden gems
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#CCBA78] to-transparent mx-auto mt-6"></div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[#2A1509]/80 to-[#1A0E06]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#CCBA78]/20 shadow-xl text-center group hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-[#CCBA78] to-[#D8C78E] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:rotate-12 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#CCBA78] mb-2">{articles.length}</h3>
            <p className="text-[#CCBA78]/70">Total Articles</p>
          </div>
          
          <div className="bg-gradient-to-br from-[#2A1509]/80 to-[#1A0E06]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#CCBA78]/20 shadow-xl text-center group hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-[#CCBA78] to-[#D8C78E] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:rotate-12 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#CCBA78] mb-2">{categories.length}</h3>
            <p className="text-[#CCBA78]/70">Categories</p>
          </div>
          
          <div className="bg-gradient-to-br from-[#2A1509]/80 to-[#1A0E06]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#CCBA78]/20 shadow-xl text-center group hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-[#CCBA78] to-[#D8C78E] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:rotate-12 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#CCBA78] mb-2">{locations.length}</h3>
            <p className="text-[#CCBA78]/70">Locations</p>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-gradient-to-br from-[#2A1509]/80 to-[#1A0E06]/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-[#CCBA78]/20 shadow-xl mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-6 h-6 text-[#CCBA78]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search for amazing places, categories, locations..."
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#3D1E0F]/50 border border-[#CCBA78]/30 text-white placeholder-[#CCBA78]/50 focus:outline-none focus:border-[#CCBA78] focus:ring-2 focus:ring-[#CCBA78]/20 transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#CCBA78]/70 hover:text-[#CCBA78] transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Filter Toggle Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-gradient-to-r from-[#CCBA78]/20 to-[#D8C78E]/20 hover:from-[#CCBA78]/30 hover:to-[#D8C78E]/30 text-[#CCBA78] px-4 py-2 rounded-lg transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-[#CCBA78] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
              <svg className={`w-4 h-4 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* View Mode and Sort Controls */}
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex bg-[#3D1E0F]/50 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-all duration-300 ${viewMode === 'grid' ? 'bg-[#CCBA78] text-white' : 'text-[#CCBA78]/70 hover:text-[#CCBA78]'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-all duration-300 ${viewMode === 'list' ? 'bg-[#CCBA78] text-white' : 'text-[#CCBA78]/70 hover:text-[#CCBA78]'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>

              {/* Sort Dropdown */}
              <select
                className="bg-[#3D1E0F]/50 border border-[#CCBA78]/30 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#CCBA78] transition-colors duration-300"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">A-Z</option>
              </select>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className={`transition-all duration-500 overflow-hidden ${showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#CCBA78]/20">
              <div>
                <label className="block text-[#CCBA78] mb-3 font-medium">Category</label>
                <select
                  className="w-full p-3 rounded-lg bg-[#3D1E0F]/50 border border-[#CCBA78]/30 text-white focus:outline-none focus:border-[#CCBA78] focus:ring-2 focus:ring-[#CCBA78]/20 transition-all duration-300"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#CCBA78] mb-3 font-medium">Location</label>
                <select
                  className="w-full p-3 rounded-lg bg-[#3D1E0F]/50 border border-[#CCBA78]/30 text-white focus:outline-none focus:border-[#CCBA78] focus:ring-2 focus:ring-[#CCBA78]/20 transition-all duration-300"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                >
                  <option value="">All Locations</option>
                  {locations.map((location, index) => (
                    <option key={index} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Clear Filters Button */}
            {activeFiltersCount > 0 && (
              <div className="flex justify-center pt-6">
                <button 
                  onClick={clearAllFilters}
                  className="bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 border border-red-500/50 text-red-300 px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <p className="text-[#CCBA78] text-lg">
              {filteredArticles.length === 0 ? 'No articles found' : 
               filteredArticles.length === 1 ? '1 article found' :
               `${filteredArticles.length} articles found`}
            </p>
            {activeFiltersCount > 0 && (
              <p className="text-[#CCBA78]/70 text-sm mt-1">
                {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} applied
              </p>
            )}
          </div>
        </div>

        {/* Articles Grid/List */}
        {filteredArticles.length === 0 ? (
          <div className="bg-gradient-to-br from-[#2A1509]/80 to-[#1A0E06]/80 backdrop-blur-sm rounded-2xl p-12 text-center border border-[#CCBA78]/20 shadow-xl">
            <div className="w-24 h-24 bg-[#CCBA78]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-[#CCBA78]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#CCBA78] mb-4">No Articles Found</h3>
            <p className="text-[#CCBA78]/70 text-lg mb-6 max-w-md mx-auto">
              We couldn't find any articles matching your criteria. Try adjusting your filters or search terms.
            </p>
            <button 
              onClick={clearAllFilters}
              className="bg-gradient-to-r from-[#CCBA78] to-[#D8C78E] hover:from-[#D8C78E] hover:to-[#CCBA78] text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className={`${viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6' 
            : 'space-y-6'
          } animate-fade-in-up`}>
            {filteredArticles.map((article, index) => (
              <div 
                key={article.id} 
                className={`group animate-fade-in-up ${viewMode === 'list' ? 'flex bg-gradient-to-r from-[#2A1509]/80 to-[#1A0E06]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#CCBA78]/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:border-[#CCBA78]/40' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {viewMode === 'list' ? (
                  <>
                    <div className="flex-shrink-0 w-48 h-32 rounded-xl overflow-hidden mr-6">
                      <img 
                        src={article.image_url || '/images/spot-default.jpg'} 
                        alt={article.judulartikel}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#CCBA78] mb-2 group-hover:text-[#D8C78E] transition-colors duration-300">
                        {article.judulartikel}
                      </h3>
                      <p className="text-[#CCBA78]/70 mb-3 line-clamp-2">
                        {article.kontenartikel?.slice(0, 150)}...
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-[#CCBA78]/60">
                          {article.kategori && (
                            <span className="bg-[#CCBA78]/20 px-2 py-1 rounded">
                              {article.kategori}
                            </span>
                          )}
                          {article.lokasi && (
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              {article.lokasi}
                            </span>
                          )}
                        </div>
                        <button className="text-[#CCBA78] hover:text-[#D8C78E] transition-colors duration-300">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <ArticleCard
                    article={{
                      ...article,
                      image_url: article.image_url,
                      judulartikel: article.judulartikel,
                      kontenartikel: article.kontenartikel,
                      spot_id: article.spot_id,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}

export default SpotPage