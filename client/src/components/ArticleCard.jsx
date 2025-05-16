import { Link } from 'react-router-dom'

const ArticleCard = ({ article }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {article.image_url && (
        <div className="h-48 bg-gray-200">
          <img 
            src={article.image_url} 
            alt={article.judulArtikel}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-primary-black mb-2">
          {article.judulArtikel}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {article.kontenArtikel}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-primary-gold text-sm">
            {article.namaRestaurant || article.namaTempat || 'General'}
          </span>
          <Link 
            to={article.restaurant_id ? `/restaurants/${article.restaurant_id}` : `/spots/${article.spot_id}`}
            className="text-primary-purple text-sm hover:underline"
          >
            Read more
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ArticleCard