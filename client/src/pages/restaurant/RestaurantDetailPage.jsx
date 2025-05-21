import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getRestaurantById } from '../../services/restaurant_api'
import { getArticles } from '../../services/articles_api'
import LoadingSpinner from '../../components/LoadingSpinner'
import ArticleCard from '../../components/ArticleCard'

const RestaurantDetailPage = () => {
  const { id } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restaurantRes, articlesRes] = await Promise.all([
          getRestaurantById(id),
          getArticles({ restaurant_id: id })
        ])

        setRestaurant(restaurantRes.payload)
        setArticles(articlesRes.payload)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-[#3D1E0F] text-white p-6">
      {restaurant && (
        <>
          <h1 className="text-4xl font-['Special_Elite'] text-[#CCBA78] mb-6">
            {restaurant.namarestaurant}
          </h1>
          
          <div className="bg-white/10 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img 
                  src={restaurant.image_url || '/images/resto-default.png'}
                  alt={restaurant.namarestaurant}
                  className="w-full h-64 object-cover rounded"
                />
              </div>
              <div>
                <h2 className="text-2xl text-[#CCBA78] mb-4">Details</h2>
                <p className="mb-2">Category: {restaurant.kategori_nama}</p>
                <p className="mb-2">Location: {restaurant.lokasi}</p>
                <p className="mb-2">Price Range: {restaurant.price}</p>
                <p className="mb-4">Rating: {restaurant.rating} ★</p>
                <p>{restaurant.informasirestaurant}</p>
              </div>
            </div>
          </div>

          {articles.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl text-[#CCBA78] mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default RestaurantDetailPage