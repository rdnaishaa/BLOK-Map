import { Link } from 'react-router-dom'

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link to={`/restaurants/${restaurant.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="h-48 bg-gray-200">
          <img 
            src={restaurant.image_url || `/images/resto${Math.floor(Math.random() * 3) + 1}.png`}
            alt={restaurant.namarestaurant}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold text-primary-black mb-1">
            {restaurant.namarestaurant}
          </h3>
          <p className="text-gray-600 text-sm mb-2">
            {restaurant.kategori_nama}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-primary-gold font-medium">
              {restaurant.price}
            </span>
            <span className="text-gray-500 text-sm">
              {restaurant.lokasi}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default RestaurantCard