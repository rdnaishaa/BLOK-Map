import { Link } from 'react-router-dom'

const SpotCard = ({ spot }) => {
  // Tambahkan console.log untuk debugging
  console.log('Spot data:', spot)
  
  // Convert rating to number and handle null/undefined cases
  const rating = spot.rating ? parseFloat(spot.rating) : null

  return (
    <Link to={`/spots/${spot.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="h-48 bg-gray-200">
          <img 
            src={spot.image_url || '/images/spot-default.jpg'}
            alt={spot.namatempat || 'Spot Image'} // Perhatikan perubahan namaTempat ke namatempat
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold text-primary-black mb-1">
            {spot.namatempat || 'Unnamed Spot'} {/* Perhatikan perubahan namaTempat ke namatempat */}
          </h3>
          <p className="text-gray-600 text-sm mb-2">
            {spot.kategori_nama || 'Uncategorized'}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-primary-gold font-medium">
              {rating ? `${rating.toFixed(1)} ★` : 'No rating'}
            </span>
            <span className="text-gray-500 text-sm">
              {spot.lokasi || 'Location not specified'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default SpotCard