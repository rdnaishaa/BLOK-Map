import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCatalogsDetail } from '../../services/catalogs_api'
import LoadingSpinner from '../../components/LoadingSpinner'

const CatalogDetailPage = () => {
  const { id } = useParams()
  const [catalog, setCatalog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true)
        const response = await getCatalogsDetail(id)
        console.log('Catalog detail data:', response) // For debugging

        if (response.success && response.payload) {
          setCatalog(response.payload)
        } else {
          setError('Failed to load catalog details')
        }
      } catch (err) {
        console.error('Error fetching catalog:', err)
        setError(err.message || 'Failed to load catalog details')
      } finally {
        setLoading(false)
      }
    }

    fetchCatalog()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#3D1E0F]">
        <div className="flex flex-col items-center space-y-4">
          <LoadingSpinner />
          <p className="text-[#CCBA78] font-['Special_Elite'] text-lg animate-pulse">
            Loading catalog details...
          </p>
        </div>
      </div>
    )
  }

  if (error || !catalog) {
    return (
      <div className="min-h-screen bg-[#3D1E0F] text-white">
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
          <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 backdrop-blur-sm border border-red-500/50 rounded-2xl p-8 shadow-2xl max-w-md w-full text-center">
            <div className="mb-6">
              <svg className="mx-auto h-16 w-16 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Item Not Found</h3>
            <p className="text-gray-300 mb-6">{error || 'The catalog item you\'re looking for doesn\'t exist.'}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-full hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 font-semibold"
              >
                Go Back
              </button>
              <Link 
                to="/catalogs"
                className="px-6 py-3 bg-gradient-to-r from-[#CCBA78] to-[#D8C78E] text-[#3D1E0F] rounded-full hover:from-[#D8C78E] hover:to-[#E5D4A1] transition-all duration-300 transform hover:scale-105 font-semibold text-center"
              >
                Browse Catalog
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3D1E0F] via-[#2A1509] to-[#1A0E06]">
      {/* Header with breadcrumb */}
      <div className="bg-gradient-to-r from-black/20 to-black/10 backdrop-blur-sm border-b border-[#CCBA78]/20">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/catalogs" className="text-[#CCBA78] hover:text-[#E5D4A1] transition-colors">
              Catalog
            </Link>
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-300 truncate">{catalog.namakatalog}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Main Content Card */}
        <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-[#CCBA78]/20">
          {/* Mobile-First Responsive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
            
            {/* Image Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="aspect-square lg:aspect-auto lg:h-full relative">
                {!imageLoaded && !imageError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CCBA78]"></div>
                  </div>
                )}
                
                <img 
                  src={catalog.image_url || '/images/catalog-default.png'} 
                  alt={catalog.namakatalog}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => {
                    setImageError(true)
                    setImageLoaded(true)
                  }}
                />
                
                {imageError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 text-gray-500">
                    <svg className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm">Image not available</p>
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-4 right-4">
                  <span className="bg-gradient-to-r from-[#CCBA78] to-[#D8C78E] text-[#3D1E0F] px-4 py-2 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm">
                    {catalog.kategori_nama}
                  </span>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
              <div className="space-y-6">
                {/* Title and Price */}
                <div className="space-y-4">
                  <h1 className="text-3xl sm:text-4xl font-bold text-[#3D1E0F] leading-tight">
                    {catalog.namakatalog}
                  </h1>
                  
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl sm:text-4xl font-bold text-[#3D1E0F]">
                      Rp {catalog.harga?.toLocaleString('id-ID')}
                    </span>
                    <div className="h-8 w-px bg-gray-300"></div>
                    <div className="flex items-center space-x-1 text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-gray-600 text-sm ml-1">(4.8)</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {catalog.deskripsikatalog && (
                  <div className="space-y-3">
                    <h2 className="text-xl font-semibold text-[#3D1E0F] flex items-center">
                      <svg className="h-5 w-5 mr-2 text-[#CCBA78]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Description
                    </h2>
                    <p className="text-gray-700 leading-relaxed">{catalog.deskripsikatalog}</p>
                  </div>
                )}

                {/* Restaurant Info */}
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-[#3D1E0F] flex items-center">
                    <svg className="h-5 w-5 mr-2 text-[#CCBA78]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Restaurant
                  </h2>
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <p className="font-semibold text-[#3D1E0F] text-lg">{catalog.namarestaurant}</p>
                        <div className="flex items-center text-gray-600">
                          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{catalog.lokasi}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-green-500">
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">Open</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-8 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={() => window.history.back()} 
                    className="w-full px-6 py-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-2xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 transform hover:scale-[1.02] font-semibold border border-gray-300 flex items-center justify-center"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                  
                 {catalog.restaurant_id ? (
  <Link 
    to={`/restaurants/${catalog.restaurant_id}`}
    className="w-full px-6 py-4 bg-gradient-to-r from-[#CCBA78] to-[#D8C78E] text-[#3D1E0F] rounded-2xl hover:from-[#D8C78E] hover:to-[#E5D4A1] transition-all duration-300 transform hover:scale-[1.02] font-semibold shadow-lg flex items-center justify-center"
  >
    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
    View Restaurant
  </Link>
) : (
  <button 
    className="w-full px-6 py-4 bg-gradient-to-r from-[#CCBA78] to-[#D8C78E] text-[#3D1E0F] rounded-2xl hover:from-[#D8C78E] hover:to-[#E5D4A1] transition-all duration-300 transform hover:scale-[1.02] font-semibold shadow-lg flex items-center justify-center"
  >
    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
    </svg>
    Add to Cart
  </button>
)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-[#CCBA78]/20">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-green-500/20 rounded-full">
                <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold">Quality Guaranteed</h3>
            </div>
            <p className="text-gray-300 text-sm">Fresh ingredients and authentic taste guaranteed</p>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-[#CCBA78]/20">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-blue-500/20 rounded-full">
                <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold">Fast Delivery</h3>
            </div>
            <p className="text-gray-300 text-sm">Quick preparation and delivery service</p>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-[#CCBA78]/20">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-yellow-500/20 rounded-full">
                <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold">Customer Choice</h3>
            </div>
            <p className="text-gray-300 text-sm">Highly rated by our customers</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CatalogDetailPage