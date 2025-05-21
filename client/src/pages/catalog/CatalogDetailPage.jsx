import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCatalogsDetail } from '../../services/catalogs_api'
import LoadingSpinner from '../../components/LoadingSpinner'

const CatalogDetailPage = () => {
  const { id } = useParams()
  const [catalog, setCatalog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !catalog) {
    return (
      <div className="min-h-screen bg-[#3D1E0F] text-white p-6">
        <div className="container mx-auto">
          <div className="bg-white/10 rounded-lg p-6 text-center">
            <p className="text-xl mb-4">{error || 'Catalog not found'}</p>
            <button 
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-[#CCBA78] text-white rounded hover:bg-[#D8C78E]"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#3D1E0F]">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Image Section */}
            <div className="md:w-1/2">
              <img 
                src={catalog.image_url || '/images/catalog-default.png'} 
                alt={catalog.namakatalog} 
                className="w-full h-full object-cover"
                style={{ maxHeight: '500px' }}
              />
            </div>

            {/* Content Section */}
            <div className="p-6 md:w-1/2">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-[#3D1E0F]">
                  {catalog.namakatalog}
                </h1>
                <span className="bg-[#CCBA78] text-white px-3 py-1 rounded-full text-sm">
                  {catalog.kategori_nama}
                </span>
              </div>

              <div className="mb-6">
                <p className="text-2xl font-bold text-[#3D1E0F]">
                  Rp {catalog.harga?.toLocaleString()}
                </p>
              </div>

              {catalog.deskripsikatalog && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-[#3D1E0F] mb-2">Description</h2>
                  <p className="text-gray-700">{catalog.deskripsikatalog}</p>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#3D1E0F] mb-2">Restaurant</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-[#3D1E0F]">{catalog.namarestaurant}</p>
                  <p className="text-gray-600">{catalog.lokasi}</p>
                </div>
              </div>

              <div className="flex justify-between">
                <button 
                  onClick={() => window.history.back()} 
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Back
                </button>
                {catalog.restaurant_id && (
                  <Link 
                    to={`/restaurants/${catalog.restaurant_id}`}
                    className="px-4 py-2 bg-[#CCBA78] text-white rounded hover:bg-[#D8C78E]"
                  >
                    View Restaurant
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CatalogDetailPage