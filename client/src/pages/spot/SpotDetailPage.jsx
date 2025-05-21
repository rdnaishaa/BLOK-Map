import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getSpotById } from '../../services/spot_api'
import { getArticles } from '../../services/articles_api'
import LoadingSpinner from '../../components/LoadingSpinner'
import ArticleCard from '../../components/ArticleCard'
import RatingStars from '../../components/RatingStars'
import MapEmbed from '../../components/MapEmbed'

const SpotDetailPage = () => {
  const { id } = useParams()
  const [spot, setSpot] = useState(null)
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch spot details and related articles in parallel
        const [spotResponse, articlesResponse] = await Promise.all([
          getSpotById(id),
          getArticles({ spot_id: id })
        ])

        console.log('Spot response:', spotResponse)
        console.log('Articles response:', articlesResponse)

        if (!spotResponse.success) {
          throw new Error(spotResponse.message || 'Failed to fetch spot details')
        }

        setSpot(spotResponse.payload)
        setArticles(articlesResponse.payload || [])

      } catch (error) {
        console.error('Error fetching spot details:', error)
        setError(error.message || 'Failed to load spot details')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#3D1E0F]">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !spot) {
    return (
      <div className="min-h-screen bg-[#3D1E0F] text-white p-6">
        <div className="container mx-auto">
          <div className="bg-white/10 rounded-lg p-6 text-center">
            <p className="text-xl mb-4">{error || 'Spot not found'}</p>
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

  // Convert rating to number and handle null/undefined cases
  const rating = spot.rating ? parseFloat(spot.rating) : 0

  return (
    <div className="min-h-screen bg-[#3D1E0F]">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="relative h-80 md:h-96">
            <img 
              src={spot.image_url || '/images/spot-default.jpg'}
              alt={spot.namatempat}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <div className="p-6 text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {spot.namatempat}
                </h1>
                <div className="flex items-center mb-2">
                  <RatingStars rating={rating} />
                  <span className="ml-2">
                    {rating.toFixed(1)}
                  </span>
                </div>
                <p className="text-lg">{spot.kategori_nama}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="md:col-span-2">
                {/* About Section */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-[#3D1E0F] mb-4">About</h2>
                  <p className="text-gray-700">{spot.deskripsi || 'No description available.'}</p>
                </section>

                {/* Articles Section */}
                {articles.length > 0 && (
                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-[#3D1E0F] mb-4">Related Articles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {articles.map(article => (
                        <ArticleCard key={article.id} article={article} />
                      ))}
                    </div>
                  </section>
                )}
              </div>

              {/* Sidebar */}
              <div>
                {/* Location */}
                <div className="bg-gray-100 rounded-lg p-4 mb-6">
                  <h3 className="font-bold text-[#3D1E0F] mb-2">Location</h3>
                  <p className="text-gray-700 mb-4">{spot.lokasi}</p>
                  <MapEmbed location={spot.lokasi} />
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(spot.lokasi)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 block w-full p-2 bg-[#CCBA78] text-white text-center rounded hover:bg-[#D8C78E]"
                  >
                    Get Directions
                  </a>
                </div>

                {/* Contact & Hours */}
                {(spot.kontak || spot.jam_operasional) && (
                  <div className="bg-gray-100 rounded-lg p-4">
                    <h3 className="font-bold text-[#3D1E0F] mb-2">Contact & Hours</h3>
                    {spot.kontak && (
                      <div className="mb-3">
                        <p className="text-gray-600 text-sm">Phone:</p>
                        <p className="text-gray-800">{spot.kontak}</p>
                      </div>
                    )}
                    {spot.jam_operasional && (
                      <div>
                        <p className="text-gray-600 text-sm">Hours:</p>
                        <p className="text-gray-800 whitespace-pre-line">
                          {spot.jam_operasional}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpotDetailPage