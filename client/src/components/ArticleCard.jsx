import { Link } from 'react-router-dom'

const ArticleCard = ({ article }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 bg-gray-200">
        <img 
          src={article.image_url || `/images/resto${Math.floor(Math.random() * 3) + 1}.png`} 
          alt={article.judulArtikel}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-primary-black mb-2">
          {article.judulArtikel}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {article.kontenArtikel}
        </p>
        <Link 
          to={article.restaurant_id ? `/restaurants/${article.restaurant_id}` : `/spots/${article.spot_id}`}
          className="text-primary-gold hover:text-primary-brown font-medium"
        >
          Read more →
        </Link>
      </div>
    </div>
  )
}

export default ArticleCard